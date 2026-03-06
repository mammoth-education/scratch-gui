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
            "handleCopyUrl",
            "handleZeusCarCalibrationConfirm",
            "handleZeusCarCalibrationCancel",
            "handlePiCarXCalibration",
            "handlepiCarXCalibration",
            "handlepiCarXMotorCalibration",
            "handlePiCarXCalibrationConfirm",
            "handlePiCarXCalibrationCancel",
            "handlePiCarXCalibrationSelectionCancel",
            "handlePiCarxLightGrayscale",
            "handlePiCarxDarkGrayscale",
            "handlePiCarxCliffGrayscale",
            "handlePiCarXTest",
            "getPiCarXGrayscale",
            "calculateMedian",
            "handleAIKeyChanged",
            "handleAIAssistantIDChanged",
            "handleAIKeyConfirm",
            "handleAIAssistantIDConfirm",
            "handlePiCarXServoCalibration",
            "handlePiCarXCamerCalibration"
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
            networksList: null,
            showDropdown: false,
            compassCalibrationState: 4,
            sendCalibrationState: 0,
            isApPasswordTooShort: false,
            isStaPasswordTooShort: false,
            piCarXCalibration: 0,
            AIKey: "",
            AIAssistantID: "",
            receiveBuffer: null,
            steeringCalibration: 0, //转向校准
            cameraCalibrationX: 0, //摄像头校准
            cameraCalibrationY: 0, //摄像头校准
            motorCalibration: [true, true], //电机校准
            aiApiKey: sessionStorage.getItem("AIKey") || "",
            grayscaleMedian: [], //灰度值的中位数
            piCarXCliff: "", //悬崖
            grayscaleCalibrationSuccess: false, // 灰度校准成功
            grayscaleCalibrationSuccessTip: false, // 灰度校准成功提示
            setWifiIsScanning: false,
            staIp: null,
            setWifiError: null,
            staLoading: true,
            setAPState: false,
        };
    }
    componentDidMount() {
        this.props.vm.on('PERIPHERAL_CONNECTED', this.handleConnected);
        this.props.vm.on('PERIPHERAL_REQUEST_ERROR', this.handleError);
        console.log("当前点击的拓展", this.props.extensionId, this.state.extension);
        // if (this.props.extensionId != "kaka") {
        //     this.props.vm.setSendDataState(this.props.extensionId, true);
        // }
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
                // let info = this.state.extension.deviceWifiEditable ? this.props.vm.getDeviceInfo(this.props.extensionId) : null;
                let info = this.props.vm.getDeviceInfo(this.props.extensionId);
                this.setState({
                    deviceName: deviceName,
                    currentWifiIP: info ? info.ip : "",
                    aiApiKey: info ? info.ai_api_key : ""
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
        // 获取设备发来的数据
        this.getReceiveBufferIntervalID = setInterval(() => {
            const receiveBuffer = this.props.vm.getReceiveBuffer(this.props.extensionId);
            if (receiveBuffer !== this.state.receiveBuffer) {
                if (receiveBuffer.grayscale3ChannelData) {
                    let data = receiveBuffer.grayscale3ChannelData;
                    Math.max(...data) - Math.min(...data) > 50 ? this.setState({ grayscaleCalibrationSuccess: true }) : this.setState({ grayscaleCalibrationSuccess: false });
                }
                this.setState({
                    receiveBuffer,
                    steeringCalibration: receiveBuffer.steeringCalibration,
                    motorCalibration: receiveBuffer.motorCalibration,
                    cameraCalibrationX: receiveBuffer.cameraCalibrationX,
                    cameraCalibrationY: receiveBuffer.cameraCalibrationY
                });
            }
        }, 100)
    }

    componentWillUnmount() {
        this.props.vm.removeListener('PERIPHERAL_CONNECTED', this.handleConnected);
        this.props.vm.removeListener('PERIPHERAL_REQUEST_ERROR', this.handleError);
        // if (this.props.extensionId != "kaka") {
        //     this.props.vm.setSendDataState(this.props.extensionId, false);
        // }
        clearInterval(this.intervalId);
        clearInterval(this.setIntervalID);
        clearInterval(this.getReceiveBufferIntervalID);
        clearInterval(this.scanWifiIntervalId);
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
        console.log("handleConnected")
        if (this.state.extension && this.state.extension.deviceNameEditable) {
            let name = this.props.vm.getPeripheralName(this.props.extensionId);
            let info = this.props.vm.getDeviceInfo(this.props.extensionId);
            this.setState({
                deviceName: name,
                aiApiKey: info ? info.ai_api_key : ""
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
        let setWifiData = { "staSsid": this.state.ssid, "staPassword": this.state.password, "command": "restart-sta" };
        console.log("setWifiData", setWifiData);
        this.props.vm.settingDeviceWiFi(this.props.extensionId, setWifiData);
        this.setState({
            phase: PHASES.settingWiFiSuccess,
            deviceName: this.state.newDeviceName != "" ? this.state.newDeviceName : this.state.deviceName,
            staIp: null,
            setWifiError: null,
            staLoading: true
        });
        analytics.event({
            category: 'extensions',
            action: 'confirmSettingWifi',
            label: this.props.extensionId
        });
        let setWifiState;
        this.intervalId = setInterval(() => {
            setWifiState = this.props.vm.getWebSocketData(this.props.extensionId);
            console.log("webSocketData", setWifiState);
            if (setWifiState) {
                if (setWifiState._staIp) {
                    this.setState({ staIp: setWifiState._staIp.StaIp, staLoading: false });
                    clearInterval(this.intervalId);
                } else if (setWifiState._setWifiState) {
                    console.log("没有扫描到wifi", setWifiState._setWifiState);
                    this.setState({ setWifiError: setWifiState._setWifiState, staLoading: false });
                    clearInterval(this.intervalId);
                }
            }
        }, 1000);

        console.log("getDevicesWifiData：", this.props.vm.getDevicesWifiData(this.props.extensionId));
    }
    handleRenameConfirm() {
        let newDeviceName = this.state.newDeviceName;
        if (!this.state.extension.deviceWifiEditable) {
            this.props.vm.renamePeripheral(this.props.extensionId, this.state.newDeviceName);
            this.setState({
                phase: PHASES.renameDeviceSuccess,
                deviceName: newDeviceName,
                staLoading: false,
                setAPState: true
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
                deviceName: newDeviceName,
                staLoading: false,
                setAPState: true
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
    // PiCarX页面校准返回
    handlePiCarXCalibrationCancel() {
        this.setState({
            phase: PHASES.piCarXCalibrationSelection,
        });
        analytics.event({
            category: 'extensions',
            action: 'piCarXCalibrationSelection',
            label: this.props.extensionId
        });
    }
    // PiCarX校准选择返回
    handlePiCarXCalibrationSelectionCancel() {
        this.setState({
            phase: PHASES.connected,
        });
        analytics.event({
            category: 'extensions',
            action: 'connected',
            label: this.props.extensionId
        });
    }

    // PiCarX校准测试
    handlePiCarXTest() {
        this.setState({
            phase: PHASES.piCarXTest,
        });
        analytics.event({
            category: 'extensions',
            action: 'piCarXTest',
            label: this.props.extensionId
        });
    }

    handleSetApPassword() {
        let data = { "apPassword": this.state.apNewPassword };
        this.props.vm.settingDeviceWiFi(this.props.extensionId, data);
        this.setState({
            phase: PHASES.settingWiFiSuccess,
            deviceName: this.state.newDeviceName != "" ? this.state.newDeviceName : this.state.deviceName,
            staLoading: false
        });
        analytics.event({
            category: 'extensions',
            action: 'confirmSettingWifi',
            label: this.props.extensionId
        });
    }

    // wifi设置点击确定
    handleConfirm() {
        console.log("确认了");
        this.setState({ setAPState: false });
        if (this.state.newDeviceName != this.state.deviceName && this.state.newDeviceName != "") {
            this.handleRenameConfirm();
        }
        if (this.state.apNewPassword != "" && this.state.apNewPassword.length >= 8) {
            this.handleSetApPassword();
        }
        if (this.state.password && this.state.password != "" && this.state.password.length >= 8 && this.state.ssid && this.state.ssid != "") {
            this.handleSettingWifiConfirm();
        }
        if (this.state.AIKey && this.state.AIKey != "") {
            this.handleAIKeyConfirm();
        }
    }
    handleReconnect() {
        this.handleDisconnect();
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
    // 校准按钮
    handleCalibration() {
        console.log("校准", this.props);
        if (this.props.extensionId == "zeusCar") {
            this.setState({
                phase: PHASES.zeusCarCalibration,
            });
            analytics.event({
                category: 'extensions',
                action: 'zeusCarCalibration',
                label: this.props.extensionId
            });
        };
        if (this.props.extensionId == "piCarX") {
            this.setState({
                phase: PHASES.piCarXCalibrationSelection,
            });
            analytics.event({
                category: 'extensions',
                action: 'piCarXCalibrationSelection',
                label: this.props.extensionId
            });
        };
    }
    // ZeusCar校准设备
    handleZeusCarCalibrationConfirm() {
        console.log("校准设备");
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
    // ZeusCar校准返回
    handleZeusCarCalibrationCancel() {
        this.setState({
            phase: PHASES.connected,
        });
        analytics.event({
            category: 'extensions',
            action: 'connected',
            label: this.props.extensionId
        });
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
        this.setState({ setWifiIsScanning: true });
        this.props.vm.settingDeviceWiFi(this.props.extensionId, restart);
        let networks;
        this.scanWifiIntervalId = setInterval(() => {
            networks = this.props.vm.getWebSocketData(this.props.extensionId);
            console.log("webSocketData", networks);
            if (networks && networks._networks && networks._networks.length > 0) {
                this.setState({ networksList: networks._networks, setWifiIsScanning: false });
                clearInterval(this.scanWifiIntervalId);
            } else if (networks && networks._networks && networks._networks.length == 0) {
                console.log("没有扫描到wifi");
                this.setState({ networksList: [], setWifiIsScanning: false });
                clearInterval(this.scanWifiIntervalId);
            }
        }, 2000);
    };

    handlePiCarXCalibration(value) {
        console.log(value);
        // 复位方向舵机和摄像头
        if (value == 0) {
            this.props.vm.setSendData(this.props.extensionId, "steering", 0);
        } else if (value == 1) {
            this.props.vm.setSendData(this.props.extensionId, "camera_pan", 0);
            this.props.vm.setSendData(this.props.extensionId, "camera_tilt", 0);
        }
        this.setState({
            phase: PHASES.piCarXCalibration,
            piCarXCalibration: value
        });
        analytics.event({
            category: 'extensions',
            action: 'piCarXCalibration',
            label: this.props.extensionId
        });
    };

    handlepiCarXCalibration(type, data) {
        this.props.vm.setSendData(this.props.extensionId, type, data);
    }

    // 转向舵机
    handlePiCarXServoCalibration(type) {
        // if (this.state.receiveBuffer.steeringCalibration) {
        let servoCalibration = Number(this.state.steeringCalibration);
        if (type === "left") {
            servoCalibration -= 0.1;
            if (servoCalibration < -20) {
                servoCalibration = -20;
            };
        } else {
            servoCalibration += 0.1;
            if (servoCalibration > 20) {
                servoCalibration = 20;
            };
        };
        this.props.vm.setSendData(this.props.extensionId, "steering_offset", servoCalibration);
        // }
    };

    // 摄像头校准
    handlePiCarXCamerCalibration(type) {
        // if (this.state.receiveBuffer.cameraCalibration) {
        if (type === "addX") {
            let cameraCalibrationX = Number(this.state.cameraCalibrationX);
            cameraCalibrationX += 1;
            if (cameraCalibrationX > 20) {
                cameraCalibrationX = 20;
            };
            this.props.vm.setSendData(this.props.extensionId, "camera_pan_offset", cameraCalibrationX);
        } else if (type === "decreaseX") {
            let cameraCalibrationX = Number(this.state.cameraCalibrationX);
            cameraCalibrationX -= 1;
            if (cameraCalibrationX < -20) {
                cameraCalibrationX = -20;
            };
            this.props.vm.setSendData(this.props.extensionId, "camera_pan_offset", cameraCalibrationX);
        } else if (type === "addY") {
            let cameraCalibrationY = Number(this.state.cameraCalibrationY);
            cameraCalibrationY += 1;
            if (cameraCalibrationY > 20) {
                cameraCalibrationY = 20;
            };
            this.props.vm.setSendData(this.props.extensionId, "camera_tilt_offset", cameraCalibrationY);
        } else if (type === "decreaseY") {
            let cameraCalibrationY = Number(this.state.cameraCalibrationY);
            cameraCalibrationY -= 1;
            if (cameraCalibrationY < -20) {
                cameraCalibrationY = -20;
            };
            this.props.vm.setSendData(this.props.extensionId, "camera_tilt_offset", cameraCalibrationY);
        }
        // }

    }

    handlepiCarXMotorCalibration(type) {
        let data = this.state.motorCalibration;
        if (type === "left") {
            data[0] = this.state.motorCalibration[0] ? false : true;
        } else {
            data[1] = this.state.motorCalibration[1] ? false : true;
        };
        this.setState({ motorCalibration: data });
        this.props.vm.setSendData(this.props.extensionId, "motor_reverse", data);
    }

    // PiCarX校准确认
    handlePiCarXCalibrationConfirm() {
        if (this.state.grayscaleMedian.length === 2 && this.state.grayscaleMedian[0]) {
            let lightValue = this.state.grayscaleMedian[0];
            let darkValue = this.state.grayscaleMedian[1];
            lightValue = lightValue[0] + lightValue[1] + lightValue[2];
            darkValue = darkValue[0] + darkValue[1] + darkValue[2];
            if (darkValue < lightValue) {
                this.props.vm.setSendData(this.props.extensionId, "grayscale_calibration", this.state.grayscaleMedian);
            }
            // this.setState({ grayscaleMedian: [] });
            this.setState({ grayscaleCalibrationSuccessTip: true });
        }
        if (this.state.piCarXCliff != "") {
            setTimeout(() => {
                this.props.vm.setSendData(this.props.extensionId, "grayscale_cliff_threshld", this.state.piCarXCliff);
                // this.setState({ piCarXCliff: "" });
            }, 10)
            this.setState({ grayscaleCalibrationSuccessTip: true });
        }
        setTimeout(() => {
            this.setState({ grayscaleCalibrationSuccessTip: false });
        }, 3000)
    }
    // 计算中位数
    calculateMedian(arr) {
        if (!arr.length) return null;
        const sorted = [...arr].sort((a, b) => a - b);
        const mid = Math.floor(sorted.length / 2);
        const median = sorted.length % 2 === 0
            ? (sorted[mid - 1] + sorted[mid]) / 2
            : sorted[mid];
        return Number(median.toFixed(1));
    }

    // 获取10个灰度值取中间值
    getPiCarXGrayscale(type) {
        console.log("getPiCarXGrayscale");
        console.log("更新前", this.state.grayscaleMedian);
        if (this.piCarXGrayscaleDataId) {
            clearInterval(this.piCarXGrayscaleDataId);
        }
        let grayscaleHistory = [];
        this.piCarXGrayscaleDataId = setInterval(() => {
            let data = this.state.receiveBuffer.grayscale3Channel;
            if (this.state.receiveBuffer) {
                grayscaleHistory.push([...data]);
                if (grayscaleHistory.length === 10) {
                    // 清除piCarXGrayscaleDataId
                    clearInterval(this.piCarXGrayscaleDataId);
                    const channelA = grayscaleHistory.map(item => item[0]);
                    const channelB = grayscaleHistory.map(item => item[1]);
                    const channelC = grayscaleHistory.map(item => item[2]);

                    const aMedian = this.calculateMedian(channelA);
                    const bMedian = this.calculateMedian(channelB);
                    const cMedian = this.calculateMedian(channelC);
                    const median = [aMedian, bMedian, cMedian];
                    if (type === "light") {
                        let data = this.state.grayscaleMedian;
                        data[0] = median;
                        // data.unshift(median);
                        console.log("更新前后", data);
                        this.setState({ grayscaleMedian: data });
                    } else if (type === "dark") {
                        let data = this.state.grayscaleMedian;
                        data[1] = median;
                        // data.push(median);
                        console.log("更新前后", data);
                        this.setState({ grayscaleMedian: data });
                    } else if (type === "cliff") {
                        const flatArray = grayscaleHistory.flat();
                        const maxValue = Math.max(...flatArray) * 1.5;
                        this.setState({ piCarXCliff: maxValue });
                    }

                }
            } else {
                clearInterval(this.piCarXGrayscaleDataId);
            }

        }, 10);
    }
    // PiCarX灰度校准
    handlePiCarxLightGrayscale() {
        this.getPiCarXGrayscale("light");
        console.log("LightGrayscale", this.state.grayscaleMedian);

    }

    handlePiCarxDarkGrayscale() {
        this.getPiCarXGrayscale("dark");
        console.log("DarkGrayscale", this.state.grayscaleMedian);
    }
    // PiCarX悬崖校准
    handlePiCarxCliffGrayscale() {
        this.getPiCarXGrayscale("cliff");
        console.log("CliffGrayscale", this.state.grayscaleMedian);
    }

    handleAIKeyChanged(e) {
        this.setState({ AIKey: e.target.value });
        sessionStorage.setItem("AIKey", e.target.value);
    }

    handleAIAssistantIDChanged(e) {
        this.setState({ AIAssistantID: e.target.value });
    }

    handleAIKeyConfirm() {
        // this.props.vm.setSendData(this.props.extensionId, "AIKey", this.state.AIKey);
        let data = { "ai_api_key": this.state.AIKey };
        this.setState({
            phase: PHASES.settingPiCarXSuccess,
            deviceName: this.state.newDeviceName != "" ? this.state.newDeviceName : this.state.deviceName
        });
        this.props.vm.settingDeviceWiFi(this.props.extensionId, data);
    }

    handleAIAssistantIDConfirm() {
        // this.props.vm.setSendData(this.props.extensionId, "AIAssistantID", this.state.AIAssistantID);
        let data = { "ai_assistant_id": this.state.AIAssistantID };
        this.props.vm.settingDeviceWiFi(this.props.extensionId, data);
    }

    render() {
        localStorage.setItem("deviceName", this.state.deviceName);
        return (
            <>
                {this.state.settingPopup ? <UniversalPopup content={content} determine={this.determine} cancel={this.cancel} buttonShow={true} /> :

                    <ConnectionModalComponent
                        connectingMessage={this.state.extension && this.state.extension.connectingMessage}
                        connectionIconURL={this.state.extension && this.state.extension.connectionIconURL}
                        connectionSmallIconURL={this.state.extension && this.state.extension.connectionSmallIconURL}
                        connectionTipIconURL={this.state.extension && this.state.extension.connectionTipIconURL}
                        deviceNameEditable={this.state.extension && this.state.extension.deviceNameEditable}
                        extension={this.state.extension && this.state.extension}
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
                        internetConnectionRequired={this.state.extension && this.state.extension.internetConnectionRequired}
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
                        piCarXCalibration={this.state.piCarXCalibration}
                        receiveBuffer={this.state.receiveBuffer}
                        aiApiKey={this.state.aiApiKey}
                        grayscaleMedian={this.state.grayscaleMedian}
                        piCarXCliff={this.state.piCarXCliff}
                        grayscaleCalibrationSuccess={this.state.grayscaleCalibrationSuccess}
                        grayscaleCalibrationSuccessTip={this.state.grayscaleCalibrationSuccessTip}
                        setWifiIsScanning={this.state.setWifiIsScanning}
                        setWifiError={this.state.setWifiError}
                        staIp={this.state.staIp}
                        staLoading={this.state.staLoading}
                        setAPState={this.state.setAPState}
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
                        onPiCarXCalibration={this.handlePiCarXCalibration}
                        onPiCarXCalibrationSend={this.handlepiCarXCalibration}
                        onPiCarXMotorCalibration={this.handlepiCarXMotorCalibration}
                        onPiCarXCalibrationConfirm={this.handlePiCarXCalibrationConfirm}
                        onPiCarxLightGrayscale={this.handlePiCarxLightGrayscale}
                        onPiCarxDarkGrayscale={this.handlePiCarxDarkGrayscale}
                        onPiCarxCliffGrayscale={this.handlePiCarxCliffGrayscale}
                        onZeusCarCalibrationCancel={this.handleZeusCarCalibrationCancel}
                        onZeusCarCalibrationConfirm={this.handleZeusCarCalibrationConfirm}
                        onPiCarXCalibrationCancel={this.handlePiCarXCalibrationCancel}
                        onPiCarXCalibrationSelectionCancel={this.handlePiCarXCalibrationSelectionCancel}
                        onPiCarXTest={this.handlePiCarXTest}
                        onAiKeyChanged={this.handleAIKeyChanged}
                        onAIAssistantIDChanged={this.handleAIAssistantIDChanged}
                        onAIKeyConfirm={this.handleAIKeyConfirm}
                        onAIAssistantIDConfirm={this.handleAIAssistantIDConfirm}
                        onPiCarXServoCalibration={this.handlePiCarXServoCalibration}
                        onPiCarXCamerCalibration={this.handlePiCarXCamerCalibration}
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
