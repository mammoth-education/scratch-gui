import PropTypes from 'prop-types';
import React from 'react';
import keyMirror from 'keymirror';

import Box from '../box/box.jsx';
import Modal from '../../containers/modal.jsx';

import ScanningStep from '../../containers/scanning-step.jsx';
import AutoScanningStep from '../../containers/auto-scanning-step.jsx';
import ConnectingStep from './connecting-step.jsx';
import ConnectedStep from './connected-step.jsx';
import ErrorStep from './error-step.jsx';
import UnavailableStep from './unavailable-step.jsx';
import RenameDeviceStep from './rename-device-step.jsx';
import RenameDeviceSuccessStep from './rename-device-success-step.jsx';
import FlashFirmwareStep from './flash-firmware-step.jsx';
import FlashFirmwareSuccessStep from './flash-firmware-success-step.jsx';
import FlashFirmwareErrorStep from './flash-firmware-error-step.jsx';
import SettingWiFiSteps from './setting-wiFi-steps.jsx';
import SettingWiFiStepsSuccessStep from './setting-wiFi-success-steps.jsx';
import HelpPage from './help-page.jsx';

import styles from './connection-modal.css';

const PHASES = keyMirror({
    scanning: null,
    connecting: null,
    connected: null,
    error: null,
    unavailable: null,
    renameDevice: null,
    renameDeviceSuccess: null,
    flashFirmware: null,
    flasheFirmwareSuccess: null,
    flashFirmwareError: null,
    settingWiFi: null,
    settingWiFiSuccess: null,
    helpPage: null,
});

const ConnectionModalComponent = props => (
    <Modal
        className={styles.modalContent}
        contentLabel={props.name}
        headerClassName={styles.header}
        headerImage={props.connectionSmallIconURL}
        id="connectionModal"
        onHelp={props.onHelp}
        onRequestClose={props.onCancel}
    >
        <Box className={styles.body}>
            {props.phase === PHASES.scanning && !props.useAutoScan && <ScanningStep {...props} />}
            {props.phase === PHASES.scanning && props.useAutoScan && <AutoScanningStep {...props} />}
            {props.phase === PHASES.connecting && <ConnectingStep {...props} />}
            {props.phase === PHASES.connected && <ConnectedStep {...props} />}
            {props.phase === PHASES.error && <ErrorStep {...props} />}
            {props.phase === PHASES.unavailable && <UnavailableStep {...props} />}
            {props.phase === PHASES.renameDevice && <RenameDeviceStep {...props} />}
            {props.phase === PHASES.renameDeviceSuccess && <RenameDeviceSuccessStep {...props} />}
            {props.phase === PHASES.flashFirmware && <FlashFirmwareStep {...props} />}
            {props.phase === PHASES.flasheFirmwareSuccess && <FlashFirmwareSuccessStep {...props} />}
            {props.phase === PHASES.flasheFirmwareError && <FlashFirmwareErrorStep {...props} />}
            {props.phase === PHASES.settingWiFi && <SettingWiFiSteps {...props} />}
            {props.phase === PHASES.settingWiFiSuccess && <SettingWiFiStepsSuccessStep {...props} />}
            {props.phase === PHASES.helpPage && <HelpPage {...props} />}
        </Box>
    </Modal>
);

ConnectionModalComponent.propTypes = {
    connectingMessage: PropTypes.node.isRequired,
    connectionSmallIconURL: PropTypes.string,
    connectionTipIconURL: PropTypes.string,
    firmwareFlashable: PropTypes.bool,
    name: PropTypes.node,
    onCancel: PropTypes.func.isRequired,
    onFlashFirmware: PropTypes.func,
    onHelp: PropTypes.func.isRequired,
    phase: PropTypes.oneOf(Object.keys(PHASES)).isRequired,
    title: PropTypes.string.isRequired,
    useAutoScan: PropTypes.bool.isRequired
};

ConnectionModalComponent.defaultProps = {
    connectingMessage: 'Connecting'
};

export {
    ConnectionModalComponent as default,
    PHASES
};
