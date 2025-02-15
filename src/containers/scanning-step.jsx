import PropTypes from 'prop-types';
import React from 'react';
import bindAll from 'lodash.bindall';
import ScanningStepComponent from '../components/connection-modal/scanning-step.jsx';
import VM from 'scratch-vm';

class ScanningStep extends React.Component {
    constructor(props) {
        super(props);
        bindAll(this, [
            'handlePeripheralListUpdate',
            'handlePeripheralScanTimeout',
            'handleRefresh'
        ]);
        this.state = {
            scanning: true,
            peripheralList: [],
            refreshClick: true,
        };
    }
    componentDidMount() {
        this.props.vm.scanForPeripheral(this.props.extensionId);
        this.props.vm.on(
            'PERIPHERAL_LIST_UPDATE', this.handlePeripheralListUpdate);
        this.props.vm.on(
            'PERIPHERAL_SCAN_TIMEOUT', this.handlePeripheralScanTimeout);
    }
    componentWillUnmount() {
        // @todo: stop the peripheral scan here
        this.props.vm.removeListener(
            'PERIPHERAL_LIST_UPDATE', this.handlePeripheralListUpdate);
        this.props.vm.removeListener(
            'PERIPHERAL_SCAN_TIMEOUT', this.handlePeripheralScanTimeout);
    }
    handlePeripheralScanTimeout() {
        this.setState({
            scanning: false,
            peripheralList: []
        });
    }
    handlePeripheralListUpdate(newList) {
        // TODO: sort peripherals by signal strength? so they don't jump around
        const peripheralArray = Object.keys(newList).map(id =>
            newList[id]
        );
        this.setState({ peripheralList: peripheralArray });
    }
    handleRefresh() {
        console.log(this.state.refreshClick)
        if (!this.state.refreshClick) {
            return;
        }
        let refreshClick = this.state.refreshClick;
        this.setState({ refreshClick: !refreshClick });
        this.props.vm.scanForPeripheral(this.props.extensionId);
        this.setState({
            scanning: true,
            peripheralList: []
        });
        // 设置节流  防止用户连续点击刷新导致闪退
        setTimeout(() => {
            let refreshClick = this.state.refreshClick;
            this.setState({ refreshClick: !refreshClick });
        }, 500)
    }
    render() {
        return (
            <ScanningStepComponent
                connectionSmallIconURL={this.props.connectionSmallIconURL}
                firmwareFlashable={this.props.firmwareFlashable}
                peripheralList={this.state.peripheralList}
                phase={this.state.phase}
                scanning={this.state.scanning}
                title={this.props.extensionId}
                onConnected={this.props.onConnected}
                onConnecting={this.props.onConnecting}
                onFlashFirmware={this.props.onFlashFirmware}
                onRefresh={this.handleRefresh}
                isMobile={this.props.isMobile}
                currentWifiName={this.props.currentWifiName}
            />
        );
    }
}

ScanningStep.propTypes = {
    connectionSmallIconURL: PropTypes.string,
    firmwareFlashable: PropTypes.bool,
    extensionId: PropTypes.string.isRequired,
    isMobile: PropTypes.bool,
    onConnected: PropTypes.func.isRequired,
    onConnecting: PropTypes.func.isRequired,
    onFlashFirmware: PropTypes.func.isRequired,
    vm: PropTypes.instanceOf(VM).isRequired
};

export default ScanningStep;
