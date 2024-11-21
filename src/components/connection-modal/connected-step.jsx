import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import React from 'react';

import Box from '../box/box.jsx';
import Dots from './dots.jsx';
import bluetoothIcon from './icons/bluetooth-white.svg';
import styles from './connection-modal.css';
import classNames from 'classnames';

const ConnectedStep = props => {
    return (
        <Box className={styles.body}>
            <Box className={styles.activityArea}>
                <Box className={styles.centeredCol}>
                    <Box>
                        <span>{props.deviceName + " "}</span>
                        <FormattedMessage
                            defaultMessage="Connected"
                            description="Message indicating that a device was connected"
                            id="gui.connection.connected"
                        />
                    </Box>
                    {
                        props.currentFirmwareVersion &&
                        <Box>
                            <FormattedMessage
                                defaultMessage="Current version: "
                                description="Current version"
                                id="gui.connection.curren-version"
                            />
                            <span>{props.currentFirmwareVersion}</span>
                        </Box>
                    }
                    {
                        props.deviceWifiEditable &&
                        <>
                            <Box>
                                <FormattedMessage
                                    defaultMessage="Current device IP: "
                                    description="Current device IP"
                                    id="gui.connection.curren-IP"
                                />
                                <span>{props.currentWifiIP}</span>
                            </Box>
                        </>
                    }
                    {
                        (props.compassCalibrationState === 0 || props.compassCalibrationState === 2) &&
                        // 校准完成
                        <Box className={styles.calibrateBox}>
                            <FormattedMessage
                                defaultMessage="校准完成 !"
                                description="Calibrate device"
                                id="gui.connection.calibrationComplete"
                            />
                        </Box>

                    }
                    {
                        props.compassCalibrationState === 1 &&
                        // 正在校准
                        <Box className={styles.calibrateBox}>
                            <FormattedMessage
                                defaultMessage="正在校准 ..."
                                description="Calibrate device"
                                id="gui.connection.calibrating"
                            />
                        </Box>
                    }
                    {
                        props.compassCalibrationState === 3 &&
                        // 校准中断
                        <Box className={styles.calibrateBox}>
                            <FormattedMessage
                                defaultMessage="校准中断,请重新校准 !"
                                description="Calibrate device"
                                id="gui.connection.calibrationInterrupted"
                            />
                        </Box>
                    }
                </Box>
            </Box>
            <Box className={styles.bottomArea}>
                <Dots
                    success
                    className={styles.bottomAreaItem}
                    total={3}
                />
                <div className={classNames(styles.bottomAreaItem, styles.cornerButtons)}>
                    <button
                        className={classNames(styles.redButton, styles.connectionButton)}
                        onClick={props.onDisconnect}
                    >
                        <FormattedMessage
                            defaultMessage="Disconnect"
                            description="Button to disconnect the device"
                            id="gui.connection.disconnect"
                        />
                    </button>
                    {props.deviceNameEditable && props.bluetoothRequired && <button
                        className={styles.connectionButton}
                        onClick={props.onRenameDevice}
                    >
                        <FormattedMessage
                            defaultMessage="Rename Device"
                            description="Rename device"
                            id="gui.connection.rename-device"
                        />
                    </button>}

                    {/* 校准 */}
                    {props.deviceWifiEditable && props.wireless && props.calibrationRequired &&
                        <button
                            className={styles.connectionButton}
                            onClick={props.onCalibration}
                        >
                            {/* {
                                (props.compassCalibrationState === 0 || props.compassCalibrationState === 2) &&
                                // 校准完成
                                <FormattedMessage
                                    defaultMessage="校准完成"
                                    description="Calibrate device"
                                    id="gui.connection.calibrate-a"
                                />
                            } */}
                            {/* {
                                props.compassCalibrationState === 1 && props.calibration !== 0 &&
                                // 正在校准
                                <FormattedMessage
                                    defaultMessage="正在校准"
                                    description="Calibrate device"
                                    id="gui.connection.calibrate-s"
                                />
                            } */}
                            {
                                props.sendCalibrationState == 0 &&
                                <FormattedMessage
                                    defaultMessage="Calibrate device"
                                    description="Calibrate device"
                                    id="gui.connection.calibrate-device"
                                />
                            }
                            {
                                (props.sendCalibrationState == 1) &&
                                <FormattedMessage
                                    defaultMessage="Cancel calibrate device"
                                    description="Cancel calibrate device"
                                    id="gui.connection.cancel-calibrate-device"
                                />
                            }
                        </button>}
                    {/* 设置wifi */}
                    {props.deviceWifiEditable && props.wireless &&
                        <button
                            className={styles.connectionButton}
                            onClick={props.onSetButton}
                        >
                            <FormattedMessage
                                defaultMessage="Setup WiFi"
                                description="Setup WiFi"
                                id="gui.connection.configure-WiFi"
                            />
                        </button>}

                    {props.firmwareFlashable && !props.isMobile &&
                        <button
                            className={styles.connectionButton}
                            onClick={props.onFlashFirmware}
                        >
                            <FormattedMessage
                                defaultMessage="Check for Updates"
                                description="check for update"
                                id="gui.connection.check-for-updates"
                            />
                        </button>
                    }
                </div>
            </Box>
        </Box>
    );
}


ConnectedStep.propTypes = {
    connectionIconURL: PropTypes.string.isRequired,
    currentFirmwareVersion: PropTypes.string,
    onCancel: PropTypes.func,
    onDisconnect: PropTypes.func,
    onRenameDevice: PropTypes.func.isRequired,
    deviceNameEditable: PropTypes.bool,
    deviceName: PropTypes.string.isRequired
};

export default ConnectedStep;
