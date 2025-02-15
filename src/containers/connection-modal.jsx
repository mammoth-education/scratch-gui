import PropTypes from 'prop-types';
import React from 'react';
import bindAll from 'lodash.bindall';
import ConnectionModalComponent, { PHASES } from '../components/connection-modal/connection-modal.jsx';
import VM from 'scratch-vm';
import analytics from '../lib/analytics';
import extensionData from '../lib/libraries/extensions/index.jsx';
import { connect } from 'react-redux';
import { closeConnectionModal } from '../reducers/modals';
import UniversalPopup from '../components/universal-popup/universal-popup.jsx';
import { FormattedMessage } from 'react-intl';

let content = <p>
    <FormattedMessage
        defaultMessage="位置信息未打开提示"
        description="位置信息未打开提示"
        id="gui.positioning.alert"
    />
</p>
if (window.cordova && window.cordova.platformId === "ios") {
    content = <p>
        <FormattedMessage
            defaultMessage="位置信息未打开提示"
            description="位置信息未打开提示"
            id="gui.bluetooth.alert"
        />
    </p>
}
class ConnectionModal extends React.Component {
    constructor(props) {
        super(props);
        bindAll(this, [
            'handleScanning',
            'handleCancel',
            'handleConnected',
            'handleConnecting',
            'handleDisconnect',
            'handleError',
            'handleFlashFirmware',
            'handleFlashFirmwareStart',
            'handleFlashFirmwareMessage',
            'handleFlashFirmwareProgress',
            'handleFlashFirmwareError',
            'handleFlashFirmwareDone',
            'handleHelp',
            'handleRenameCancel',
            'handleConfirm',
            'handleRenameConfirm',
            'handleRenameChanged',
            'handleSetApPassword',
            'handleWifiSSIDChanged',
            'handleWifiPasswordChanged',
            'handleDevicePasswordChanged',
            'handleSettingWifiConfirm',
            'handleRename',
            'handleSetButton',
            'handleReconnect',
            'handleCalibration',
            'handleScanWifi',
            'handleOptionClick',
            'handleSSIDInputBlur',
            'handleSSIDInputClick',
            "determine",
            "cancel",
            "handleCopyUrl"
        ]);
        this.state = {
            latestFirmwareVersion: "",
            flashProgress: -1,
            flashMessage: '',
            flashErrorMessage: '',
            currentFirmwareVersion: null,
            deviceName: "",
            extension: extensionData.find(ext => ext.extensionId === props.extensionId),
            phase: props.vm.getPeripheralIsConnected(props.extensionId) ?
                PHASES.connected : PHASES.scanning,
            settingPopup: false,
            apNewPassword: "",
            ssid: '',
            password: '',
            currentWifiName: "",
            currentWifiIP: "",
            newDeviceName: "",
            renameState: false,
            apPasswordState: false,
            staPasswordState: false,
            staSsidState: false,
            networksList: [],
            showDropdown: false,
            compassCalibrationState: 4,
            sendCalibrationState: 0,
            isApPasswordTooShort: false,
            isStaPasswordTooShort: false,
        };
    }
    componentDidMount() {
        this.props.vm.on('PERIPHERAL_CONNECTED', this.handleConnected);
        this.props.vm.on('PERIPHERAL_REQUEST_ERROR', this.handleError);
        console.log("当前点击的拓展", this.props.extensionId, this.state.extension);
        if (this.state.extension && this.state.extension.firmwareFlashable) {
            this.props.vm.getPeripheralFirmwareVersion(this.props.extensionId).then(version => {
                this.setState({
                    currentFirmwareVersion: version
                });
            }, () => { });
            this.setState({
                latestFirmwareVersion: this.props.vm.getLatestFirmwareVersion(this.props.extensionId),
            });

        }
        if (this.props.isMobile && window.cordova) {
            if (device.platform === "Android" && parseInt(device.version) <= 11) {
                cordova.plugins.diagnostic.isLocationEnabled((enabled) => {
                    if (!enabled) {
                        this.setState({ settingPopup: true });
                    }
                }, (error) => {
                    console.error("The following error occurred: " + error);
                });
            }
            if (window.cordova.platformId === "ios") {
                ble.isEnabled(() => { console.log("蓝牙已开启") },
                    () => {
                        this.setState({ settingPopup: true });
                    }
                );
            }
        }
        if (this.state.extension && this.state.extension.deviceNameEditable) {
            if (this.props.vm.getPeripheralIsConnected(this.props.extensionId)) {
                let deviceName = this.props.vm.getPeripheralName(this.props.extensionId);
                let info = this.state.extension.deviceWifiEditable ? this.props.vm.getDeviceInfo(this.props.extensionId) : null;
                this.setState({
                    deviceName: deviceName,
                    currentWifiIP: info ? info.ip : "",
                });
            }
        }
        if (window.WifiWizard2) {
            window.WifiWizard2.getConnectedSSID().then((ssid) => {
                console.log("Wi-Fi名称: " + ssid);
                this.setState({ currentWifiName: ssid });
            }).catch((error) => {
                console.error("无法获取Wi-Fi名称: " + error);
                this.setState({ error: error.message });
            });
        }

    }

    componentWillUnmount() {
        this.props.vm.removeListener('PERIPHERAL_CONNECTED', this.handleConnected);
        this.props.vm.removeListener('PERIPHERAL_REQUEST_ERROR', this.handleError);
        clearInterval(this.intervalId);
        clearInterval(this.setIntervalID);
    }
    // 刷新
    handleScanning() {
        this.setState({
            phase: PHASES.scanning
        });
    }
    handleConnecting(peripheralId) {
        this.props.vm.connectPeripheral(this.props.extensionId, peripheralId);
        this.setState({
            phase: PHASES.connecting
        });
        analytics.event({
            category: 'extensions',
            action: 'connecting',
            label: this.props.extensionId
        });
    }
    handleDisconnect() {
        try {
            this.props.vm.disconnectPeripheral(this.props.extensionId);
        } finally {
            this.props.onCancel();
        }
    }
    handleCancel() {
        try {
            // If we're not connected to a peripheral, close the websocket so we stop scanning.
            if (!this.props.vm.getPeripheralIsConnected(this.props.extensionId)) {
                this.props.vm.disconnectPeripheral(this.props.extensionId);
            }
        } finally {
            // Close the modal.
            this.props.onCancel();
        }
    }
    handleError() {
        // Assume errors that come in during scanning phase are the result of not
        // having scratch-link installed.
        if (this.state.phase === PHASES.scanning || this.state.phase === PHASES.unavailable) {
            this.setState({
                phase: PHASES.unavailable
            });
        } else {
            this.setState({
                phase: PHASES.error
            });
            analytics.event({
                category: 'extensions',
                action: 'connecting error',
                label: this.props.extensionId
            });
        }
    }
    handleConnected() {
        if (this.state.extension && this.state.extension.deviceNameEditable) {
            let name = this.props.vm.getPeripheralName(this.props.extensionId);
            this.setState({
                deviceName: name
            });
        }
        if (this.state.extension && this.state.extension.deviceWifiEditable) {
            let info = this.props.vm.getDeviceInfo(this.props.extensionId);

            this.setState({
                currentWifiIP: info.ip,
            });
        }

        if (this.state.extension && this.state.extension.firmwareFlashable) {
            this.props.vm.getPeripheralFirmwareVersion(this.props.extensionId).then(version => {
                this.setState({
                    currentFirmwareVersion: version
                });
            });
        }
        this.setState({
            phase: PHASES.connected,
        });
        analytics.event({
            category: 'extensions',
            action: 'connected',
            label: this.props.extensionId
        });
    }
    handleHelp() {
        // window.open(this.state.extension.helpLink, '_blank');
        this.setState({
            phase: PHASES.helpPage,
        });
        analytics.event({
            category: 'extensions',
            action: 'help',
            label: this.props.extensionId
        });
    }
    handleRename() {
        this.setState({
            phase: PHASES.renameDevice,
        });
        analytics.event({
            category: 'extensions',
            action: 'renameDevice',
            label: this.props.extensionId
        });
    }
    handleSetButton() {
        this.setState({
            phase: PHASES.settingWiFi,
        });
        analytics.event({
            category: 'extensions',
            action: 'settingWiFi',
            label: this.props.extensionId
        });
    }
    // 限制重命名输入框输入格式
    handleRenameChanged(e) {
        let name = e.target.value;
        // 只能输入 ASCII 和数字
        if (/[^a-zA-Z0-9]/.test(name) && !this.state.extension.wireless) {
            name = name.replace(/[^a-zA-Z0-9]/g, '');
        }
        if (name != "" && name != this.state.deviceName) {
            this.setState({ renameState: true });
        } else {
            this.setState({ renameState: false });
        }
        this.setState({
            // deviceName: name
            newDeviceName: name
        });
    }
    handleWifiSSIDChanged(e) {
        let value = e.target.value;
        if (value != "") {
            this.setState({ staSsidState: true });
        } else {
            this.setState({ staSsidState: false });
        }
        this.setState({
            ssid: value
        });
    }
    handleWifiPasswordChanged(e) {
        let value = e.target.value;
        if (value != "") {
            this.setState({ staPasswordState: true });
        } else {
            this.setState({ staPasswordState: false });
        }
        // 长度限制
        if (value.length < 8) {
            this.setState({ isStaPasswordTooShort: true });
        } else {
            this.setState({ isStaPasswordTooShort: false, password: value });
        }
    }
    handleDevicePasswordChanged(e) {
        let value = e.target.value;
        if (value != "") {
            this.setState({ apPasswordState: true });
        } else {
            this.setState({ apPasswordState: false });
        }
        if (value.length < 8) {
            this.setState({ isApPasswordTooShort: true });
        } else {
            this.setState({ isApPasswordTooShort: false, apNewPassword: value });
        }
    }

    handleSettingWifiConfirm() {
        let setWifiData = { "staSsid": this.state.ssid, "staPassword": this.state.password };
        console.log("setWifiData", setWifiData);
        this.props.vm.settingDeviceWiFi(this.props.extensionId, setWifiData);
        let restart = { "command": "restart-sta" };
        this.props.vm.settingDeviceWiFi(this.props.extensionId, restart);
        this.setState({
            phase: PHASES.renameDeviceSuccess,
            deviceName: this.state.newDeviceName != "" ? this.state.newDeviceName : this.state.deviceName
        });
        analytics.event({
            category: 'extensions',
            action: 'confirmRenameDevice',
            label: this.props.extensionId
        });
        console.log("getDevicesWifiData：", this.props.vm.getDevicesWifiData(this.props.extensionId));
    }
    handleRenameConfirm() {
        let newDeviceName = this.state.newDeviceName;
        if (!this.state.extension.deviceWifiEditable) {
            this.props.vm.renamePeripheral(this.props.extensionId, this.state.newDeviceName);
            this.setState({
                phase: PHASES.renameDeviceSuccess,
                deviceName: newDeviceName
            });
            analytics.event({
                category: 'extensions',
                action: 'confirmRenameDevice',
                label: this.props.extensionId
            });
        } else {
            // 修改AP模式的名称和WiFi名称
            let name = { "name": newDeviceName };
            this.props.vm.settingDeviceWiFi(this.props.extensionId, name);
            let apSsid = { "apSsid": newDeviceName };
            this.props.vm.settingDeviceWiFi(this.props.extensionId, apSsid);
            this.setState({
                phase: PHASES.settingWiFiSuccess,
                deviceName: newDeviceName
            });
            analytics.event({
                category: 'extensions',
                action: 'confirmSettingWifi',
                label: this.props.extensionId
            });
        }
    }
    // 点击取消
    handleRenameCancel() {
        if (!this.props.vm.getPeripheralIsConnected(this.props.extensionId)) {
            this.setState({ phase: PHASES.scanning });
        } else {
            this.setState({ phase: PHASES.connected });
        }
        this.setState({
            renameState: false,
            apPasswordState: false,
            staSsidState: false,
            staPasswordState: false,
        })
        analytics.event({
            category: 'extensions',
            action: 'cancelRenameDevice',
            label: this.props.extensionId
        });
    }

    handleSetApPassword() {
        let data = { "apPassword": this.state.apNewPassword };
        this.props.vm.settingDeviceWiFi(this.props.extensionId, data);
        this.setState({
            phase: PHASES.settingWiFiSuccess,
            deviceName: this.state.newDeviceName != "" ? this.state.newDeviceName : this.state.deviceName
        });
        analytics.event({
            category: 'extensions',
            action: 'confirmSettingWifi',
            label: this.props.extensionId
        });
    }

    // 点击确定
    handleConfirm() {
        console.log("确认了");
        if (this.state.newDeviceName != this.state.deviceName && this.state.newDeviceName != "") {
            this.handleRenameConfirm();
        }
        if (this.state.apNewPassword != "" && this.state.apNewPassword.length >= 8) {
            this.handleSetApPassword();
        }
        if (this.state.password && this.state.password != "" && this.state.password.length >= 8 && this.state.ssid && this.state.ssid != "") {
            this.handleSettingWifiConfirm();
        }
        analytics.event({
            category: 'extensions',
            action: 'confirmRenameDevice',
            label: this.props.extensionId
        });
    }
    handleReconnect() {
        handleDisconnect();
        this.setState({
            phase: PHASES.scanning
            // phase: PHASES.connected
        });
        analytics.event({
            category: 'extensions',
            action: 'reconnect',
            label: this.props.extensionId
        });
    }
    handleFlashFirmware() {
        try {
            // If we're not connected to a peripheral, close the websocket so we stop scanning.
            if (!this.props.vm.getPeripheralIsConnected(this.props.extensionId)) {
                this.props.vm.disconnectPeripheral(this.props.extensionId);
            }
        } finally {
            this.setState({
                phase: PHASES.flashFirmware,
                latestFirmwareVersion: this.props.vm.getLatestFirmwareVersion(this.props.extensionId),
            });
            analytics.event({
                category: 'extensions',
                action: 'flashFirmware',
                label: this.props.extensionId
            });
        }
    }
    handleFlashFirmwareProgress(e) {
        let progress = e.detail;
        this.setState({
            flashProgress: progress
        });
        analytics.event({
            category: 'extensions',
            action: 'flashFirmwareProgress',
            label: this.props.extensionId
        });
    }
    handleFlashFirmwareMessage(e) {
        let message = e.detail;
        this.setState({
            flashMessage: message
        });
        analytics.event({
            category: 'extensions',
            action: 'flashFirmwareMessage',
            label: this.props.extensionId
        });
    }
    handleFlashFirmwareError(e) {
        let error = e.detail;
        this.setState({
            flashErrorMessage: error,
            flashProgress: 0,
            phase: PHASES.flasheFirmwareError
        });
        analytics.event({
            category: 'extensions',
            action: 'flashFirmwareError',
            label: this.props.extensionId
        });
    }
    handleFlashFirmwareDone(e) {
        document.removeEventListener("onFlashFirmwareProgress", this.handleFlashFirmwareProgress);
        document.removeEventListener("onFlashFirmwareMessage", this.handleFlashFirmwareMessage);
        document.removeEventListener("onFlashFirmwareError", this.handleFlashFirmwareError);
        document.removeEventListener("onFlashFirmwareDone", this.handleFlashFirmwareDone);
        this.setState({
            phase: PHASES.flasheFirmwareSuccess,
            flashProgress: 0,
            flashMessage: ""
        });
        analytics.event({
            category: 'extensions',
            action: 'flashFirmwareDone',
            label: this.props.extensionId
        });
    }
    handleFlashFirmwareStart() {
        this.props.vm.flashLatestFirmware(this.props.extensionId);
        document.addEventListener("onFlashFirmwareProgress", this.handleFlashFirmwareProgress);
        document.addEventListener("onFlashFirmwareMessage", this.handleFlashFirmwareMessage);
        document.addEventListener("onFlashFirmwareError", this.handleFlashFirmwareError);
        document.addEventListener("onFlashFirmwareDone", this.handleFlashFirmwareDone);
        this.setState({
            flashProgress: 0,
            flashMessage: "",
            flashErrorMessage: "",
        });
        analytics.event({
            category: 'extensions',
            action: 'flashFirmwareStart',
            label: this.props.extensionId
        });
    }
    handleCopyUrl() {
        const helpLink = this.state.extension.helpLink;
        if (window.cordova) {
            cordova.plugins.clipboard.copy(helpLink);
        } else {
            navigator.clipboard.writeText(helpLink)
                .then(function () {
                    console.log('文本已成功复制到剪贴板');
                })
                .catch(function (error) {
                    console.error('复制文本到剪贴板时出错:', error);
                });
        }
    }
    determine() {
        // Android 11 以下没有打开位置信息则跳转到设置中，需要手动打开
        if (window.cordova.platformId === "android") {
            cordova.plugins.diagnostic.switchToLocationSettings();
        }
        if (window.cordova.platformId === "ios") {
            cordova.plugins.diagnostic.switchToSettings(
                () => {
                    console.log("已打开设置界面");
                },
                (error) => {
                    console.error("打开设置界面失败：" + error);
                }
            );
        }
        this.setState({ settingPopup: false });
    }
    cancel() {
        this.setState({ settingPopup: false });
    }
    // 校准设备
    handleCalibration() {
        let newCalibration = this.state.sendCalibrationState == 0 ? 1 : 0;
        this.setState({ sendCalibrationState: newCalibration });
        this.props.vm.calibration(this.props.extensionId, newCalibration);
        let receiveBuffer;
        this.setState({ compassCalibrationState: newCalibration == 0 ? 4 : 1 });
        this.setIntervalID = setInterval(() => {
            receiveBuffer = this.props.vm.getReceiveBuffer(this.props.extensionId);
            console.log("receiveBuffer", receiveBuffer);
            if (receiveBuffer) {
                if ([0, 1, 2, 3].includes(receiveBuffer.compassCalibration)) {
                    this.setState({ compassCalibrationState: receiveBuffer.compassCalibration });
                    if (receiveBuffer.compassCalibration == 2 || receiveBuffer.compassCalibration == 3) {
                        this.setState({ sendCalibrationState: 0 });
                        clearInterval(this.setIntervalID);
                    }
                }
            } else {
                this.setState({ compassCalibrationState: 4, sendCalibrationState: 0 });
                clearInterval(this.setIntervalID);
            }
        }, 1000);
    }

    handleOptionClick = (option) => {
        this.setState({
            ssid: option,
            showDropdown: false
        });
    };

    handleSSIDInputBlur = () => {
        setTimeout(() => {
            this.setState({ showDropdown: false });
        }, 200);
    }

    handleSSIDInputClick = () => {
        this.setState({
            showDropdown: true
        })
    }

    handleScanWifi() {
        let restart = { "command": "scan-wifi" };
        this.props.vm.settingDeviceWiFi(this.props.extensionId, restart);
        let networks;
        let intervalId = setInterval(() => {
            networks = this.props.vm.getWebSocketData(this.props.extensionId);
            console.log("webSocketData", networks);
            if (networks._networks.length > 0) {
                this.setState({ networksList: networks._networks, });
                //清除定时器
                clearInterval(intervalId);
            }
        }, 2000);
    }

    handleMobileKeyboard() {
        window.addEventListener('native.keyboardshow', (e) => {
            console.log(e.keyboardHeight, "键盘高度");
            if (window.device && window.device.platform !== "Android") {
                return;
            }
            let keyboardHeight = e.keyboardHeight;
            let screenHeight = window.screen.height;

        });
        // 键盘隐藏
        window.addEventListener('native.keyboardhide', (e) => {
        });
    }
    render() {
        localStorage.setItem("deviceName", this.state.deviceName)
        return (
            <>
                {this.state.settingPopup ? <UniversalPopup content={content} determine={this.determine} cancel={this.cancel} buttonShow={true} /> :

                    <ConnectionModalComponent
                        connectingMessage={this.state.extension && this.state.extension.connectingMessage}
                        connectionIconURL={this.state.extension && this.state.extension.connectionIconURL}
                        connectionSmallIconURL={this.state.extension && this.state.extension.connectionSmallIconURL}
                        connectionTipIconURL={this.state.extension && this.state.extension.connectionTipIconURL}
                        deviceNameEditable={this.state.extension && this.state.extension.deviceNameEditable}
                        extensionId={this.props.extensionId}
                        isMobile={this.props.isMobile}
                        currentFirmwareVersion={this.state.currentFirmwareVersion}
                        latestFirmwareVersion={this.state.latestFirmwareVersion}
                        flashErrorMessage={this.state.flashErrorMessage}
                        flashMessage={this.state.flashMessage}
                        flashProgress={this.state.flashProgress}
                        name={this.state.extension && this.state.extension.name}
                        phase={this.state.phase}
                        title={this.props.extensionId}
                        useAutoScan={this.state.extension && this.state.extension.useAutoScan}
                        bluetoothRequired={this.state.extension && this.state.extension.bluetoothRequired}
                        wireless={this.state.extension && this.state.extension.wireless}
                        bluetooth={this.state.extension && this.state.extension.bluetooth}
                        firmwareFlashable={this.state.extension && this.state.extension.firmwareFlashable}
                        deviceWifiEditable={this.state.extension && this.state.extension.deviceWifiEditable}
                        calibrationRequired={this.state.extension && this.state.extension.calibrationRequired}
                        deviceName={this.state.deviceName}
                        currentWifiName={this.state.currentWifiName}
                        currentWifiIP={this.state.currentWifiIP}
                        renameState={this.state.renameState}
                        apPasswordState={this.state.apPasswordState}
                        staSsidState={this.state.staSsidState}
                        staPasswordState={this.state.staPasswordState}
                        networksList={this.state.networksList}
                        showDropdown={this.state.showDropdown}
                        staSsid={this.state.ssid}
                        compassCalibrationState={this.state.compassCalibrationState}
                        sendCalibrationState={this.state.sendCalibrationState}
                        isApPasswordTooShort={this.state.isApPasswordTooShort}
                        isStaPasswordTooShort={this.state.isStaPasswordTooShort}
                        helpLink={this.state.extension && this.state.extension.helpLink}
                        helpLinkImage={this.state.extension && this.state.extension.helpLinkImage}
                        onScanWifi={this.handleScanWifi}
                        onOptionClick={this.handleOptionClick}
                        onSSIDInputBlur={this.handleSSIDInputBlur}
                        onSSIDInputClick={this.handleSSIDInputClick}
                        onRenameDevice={this.handleRename}
                        onSetButton={this.handleSetButton}
                        vm={this.props.vm}
                        onCancel={this.handleCancel}
                        onFlashFirmware={this.handleFlashFirmware}
                        onFlashFirmwareStart={this.handleFlashFirmwareStart}
                        onRenameCancel={this.handleRenameCancel}
                        onRenameChanged={this.handleRenameChanged}
                        onConfirm={this.handleConfirm}
                        onWifiSSIDChanged={this.handleWifiSSIDChanged}
                        onWifiPasswordChanged={this.handleWifiPasswordChanged}
                        onDevicePasswordChanged={this.handleDevicePasswordChanged}
                        onRenameConfirm={this.handleRenameConfirm}
                        onReconnect={this.handleReconnect}
                        onConnected={this.handleConnected}
                        onConnecting={this.handleConnecting}
                        onDisconnect={this.handleDisconnect}
                        onCalibration={this.handleCalibration}
                        onHelp={this.handleHelp}
                        onScanning={this.handleScanning}
                        onCopy={this.handleCopyUrl}
                    />
                }
            </>

        );
    }
}

ConnectionModal.propTypes = {
    isMobile: PropTypes.bool,
    extensionId: PropTypes.string.isRequired,
    onCancel: PropTypes.func.isRequired,
    vm: PropTypes.instanceOf(VM).isRequired
};

const mapStateToProps = state => ({
    extensionId: state.scratchGui.connectionModal.extensionId
});

const mapDispatchToProps = dispatch => ({
    onCancel: () => {
        dispatch(closeConnectionModal());
    },
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ConnectionModal);
