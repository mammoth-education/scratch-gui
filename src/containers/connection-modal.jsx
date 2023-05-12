import PropTypes from 'prop-types';
import React from 'react';
import bindAll from 'lodash.bindall';
import ConnectionModalComponent, {PHASES} from '../components/connection-modal/connection-modal.jsx';
import VM from 'scratch-vm';
import analytics from '../lib/analytics';
import extensionData from '../lib/libraries/extensions/index.jsx';
import {connect} from 'react-redux';
import {closeConnectionModal} from '../reducers/modals';
import UniversalPopup from '../components/universal-popup/universal-popup.jsx';
import { FormattedMessage} from 'react-intl';

let content = <p>
    <FormattedMessage
        defaultMessage="位置信息未打开提示"
        description="位置信息未打开提示"
        id="gui.positioning.alert"
    />
</p>
if(window.cordova && window.cordova.platformId === "ios"){
    content =<p>
    <FormattedMessage
        defaultMessage="位置信息未打开提示"
        description="位置信息未打开提示"
        id="gui.bluetooth.alert"
    />

</p>
}
class ConnectionModal extends React.Component {
    constructor (props) {
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
            'handleRenameConfirm',
            'handleRenameChanged',
            'handleRename',
            'handleReconnect',
            "determine",
            "cancel",
        ]);
        this.state = {
            latestFirmwareVersion: props.vm.getLatestFirmwareVersion(props.extensionId),
            flashProgress: -1,
            flashMessage: '',
            flashErrorMessage: '',
            currentFirmwareVersion: null,
            deviceName: props.vm.getPeripheralIsConnected(props.extensionId) ?
                props.vm.getPeripheralName(props.extensionId) : "",
            extension: extensionData.find(ext => ext.extensionId === props.extensionId),
            phase: props.vm.getPeripheralIsConnected(props.extensionId) ?
                PHASES.connected : PHASES.scanning,
            settingPopup:false,
        };
    }
    componentDidMount () {
        this.props.vm.on('PERIPHERAL_CONNECTED', this.handleConnected);
        this.props.vm.on('PERIPHERAL_REQUEST_ERROR', this.handleError);
        this.props.vm.getPeripheralFirmwareVersion(this.props.extensionId).then(version => {
            this.setState({
                currentFirmwareVersion: version
            });
        }, () => {});
        // Android 11 以下都需要手动打开定位
        if(this.props.isMobile && window.cordova){
            if(device.platform === "Android" && parseInt(device.version) <= 11){
                cordova.plugins.diagnostic.isLocationEnabled((enabled) => {
                    if(!enabled){
                        this.setState({ settingPopup: true});
                    }
                }, (error) => {
                    console.error("The following error occurred: "+error);
                });
            }
            if(window.cordova.platformId === "ios"){
                ble.isEnabled(() => { console.log("蓝牙已开启")},
                    () =>{
                        this.setState({ settingPopup: true});
                    }
                  );
            }
        }
    }
    componentWillUnmount () {
        this.props.vm.removeListener('PERIPHERAL_CONNECTED', this.handleConnected);
        this.props.vm.removeListener('PERIPHERAL_REQUEST_ERROR', this.handleError);
    }
    handleScanning () {
        this.setState({
            phase: PHASES.scanning
        });
    }
    handleConnecting (peripheralId) {
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
    handleDisconnect () {
        try {
            this.props.vm.disconnectPeripheral(this.props.extensionId);
        } finally {
            this.props.onCancel();
        }
    }
    handleCancel () {
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
    handleError () {
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
    handleConnected () {
        let name = this.props.vm.getPeripheralName(this.props.extensionId);
        this.props.vm.getPeripheralFirmwareVersion(this.props.extensionId).then(version => {
            this.setState({
                currentFirmwareVersion: version
            });
        });
        this.setState({
            phase: PHASES.connected,
            deviceName: name
        });
        analytics.event({
            category: 'extensions',
            action: 'connected',
            label: this.props.extensionId
        });
    }
    handleHelp () {
        window.open(this.state.extension.helpLink, '_blank');
        analytics.event({
            category: 'extensions',
            action: 'help',
            label: this.props.extensionId
        });
    }
    handleRename () {
        this.setState({
            phase: PHASES.renameDevice,
        });
        analytics.event({
            category: 'extensions',
            action: 'renameDevice',
            label: this.props.extensionId
        });
    }
    handleRenameChanged (e) {
        let name = e.target.value;
        // 只能输入 ASCII 和数字
        if (/[^a-zA-Z0-9]/.test(name)) {
            name = value.replace(/[^a-zA-Z0-9]/g, '');
        }
        this.setState({
            deviceName: name
        });
    }
    handleRenameConfirm () {
        this.props.vm.renamePeripheral(this.props.extensionId, this.state.deviceName);
        this.setState({
            phase: PHASES.renameDeviceSuccess
        });
        analytics.event({
            category: 'extensions',
            action: 'confirmRenameDevice',
            label: this.props.extensionId
        });
    }
    handleRenameCancel () {
        this.setState({
            phase: PHASES.connected
        });
        analytics.event({
            category: 'extensions',
            action: 'cancelRenameDevice',
            label: this.props.extensionId
        });
    }
    handleReconnect () {
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
    handleFlashFirmware () {
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
    handleFlashFirmwareProgress (e) {
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
    handleFlashFirmwareMessage (e) {
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
    handleFlashFirmwareError (e) {
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
    handleFlashFirmwareDone (e) {
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
    handleFlashFirmwareStart () {
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
    determine(){
        // Android 11 以下没有打开位置信息则跳转到设置中，需要手动打开
        if(window.cordova.platformId === "android"){
            cordova.plugins.diagnostic.switchToLocationSettings();
        }
        if(window.cordova.platformId === "ios"){
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
    cancel(){
        this.setState({ settingPopup: false });
    }
    render () {
        console.log("current firmware version: ", this.state.currentFirmwareVersion);
        localStorage.setItem("deviceName",this.state.deviceName)
        return (
            <>
                {this.state.settingPopup ? <UniversalPopup content={content} determine={this.determine} cancel={this.cancel} buttonShow={true}/> :
                
                <ConnectionModalComponent
                    connectingMessage={this.state.extension && this.state.extension.connectingMessage}
                    connectionIconURL={this.state.extension && this.state.extension.connectionIconURL}
                    connectionSmallIconURL={this.state.extension && this.state.extension.connectionSmallIconURL}
                    connectionTipIconURL={this.state.extension && this.state.extension.connectionTipIconURL}
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
                    deviceNameEditable={this.state.extension && this.state.extension.deviceNameEditable}
                    firmwareFlashable={this.state.extension && this.state.extension.firmwareFlashable}
                    deviceName={this.state.deviceName}
                    onRenameDevice={this.handleRename}
                    vm={this.props.vm}
                    onCancel={this.handleCancel}
                    onFlashFirmware={this.handleFlashFirmware}
                    onFlashFirmwareStart={this.handleFlashFirmwareStart}
                    onRenameCancel={this.handleRenameCancel}
                    onRenameChanged={this.handleRenameChanged}
                    onRenameConfirm={this.handleRenameConfirm}
                    onReconnect={this.handleReconnect}
                    onConnected={this.handleConnected}
                    onConnecting={this.handleConnecting}
                    onDisconnect={this.handleDisconnect}
                    onHelp={this.handleHelp}
                    onScanning={this.handleScanning}
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
