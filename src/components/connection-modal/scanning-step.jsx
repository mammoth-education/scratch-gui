import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import React from 'react';
import classNames from 'classnames';

import Box from '../box/box.jsx';
import PeripheralTile from './peripheral-tile.jsx';
import Dots from './dots.jsx';

import radarIcon from './icons/searching.png';
import refreshIcon from './icons/refresh.svg';
import flashFirmwareIcon from './icons/flash-firmware.svg';

import styles from './connection-modal.css';

const ScanningStep = props => (
    <Box className={styles.body}>
        <Box className={styles.activityArea}>
            {props.scanning ? (
                props.peripheralList.length === 0 ? (
                    <div className={styles.activityAreaInfo}>
                        <div className={styles.centeredRow}>
                            <img
                                className={classNames(styles.radarSmall, styles.radarSpin)}
                                src={radarIcon}
                            />
                            <FormattedMessage
                                defaultMessage="Looking for devices"
                                description="Text shown while scanning for devices"
                                id="gui.connection.scanning.lookingforperipherals"
                            />
                        </div>
                    </div>
                ) : (
                    <div className={styles.peripheralTilePane}>
                        {props.peripheralList.map(peripheral =>
                        (<PeripheralTile
                            connectionSmallIconURL={props.connectionSmallIconURL}
                            key={peripheral.peripheralId}
                            name={peripheral.name}
                            ip={peripheral.ip}
                            peripheralId={peripheral.peripheralId}
                            rssi={peripheral.rssi}
                            onConnecting={props.onConnecting}
                        />)
                        )}
                    </div>
                )
            ) : (
                <Box className={styles.instructions}>
                    <FormattedMessage
                        defaultMessage="No devices found"
                        description="Text shown when no devices could be found"
                        id="gui.connection.scanning.noPeripheralsFound"
                    />
                </Box>
            )}
        </Box>
        <Box className={styles.bottomArea}>
            <Box className={classNames(styles.bottomAreaItem, styles.instructions)}>
                <FormattedMessage
                    defaultMessage="Currently connected WiFi:"
                    description="Prompt for choosing a device to connect to"
                    id="gui.connection.curren-WIFI"
                />
                <span>{props.currentWifiName}</span>
            </Box>
            <Box className={classNames(styles.bottomAreaItem, styles.instructions)}>
                <FormattedMessage
                    defaultMessage="Select your device in the list above."
                    description="Prompt for choosing a device to connect to"
                    id="gui.connection.scanning.instructions"
                />
            </Box>
            <Dots
                className={styles.bottomAreaItem}
                counter={0}
                total={3}
            />
            <div className={classNames(styles.bottomAreaItem, styles.spaceAroundButtons)}>
                {props.firmwareFlashable && !props.isMobile &&
                    <button className={styles.connectionButton} onClick={props.onFlashFirmware}>
                        <FormattedMessage
                            defaultMessage="Flash Firmware"
                            description="Flash Firmware"
                            id="gui.connection.flash-firmware"
                        />
                        <img className={styles.buttonIconRight} src={flashFirmwareIcon} />
                    </button>
                }
                <button className={styles.connectionButton} onClick={props.onRefresh}>
                    <FormattedMessage
                        defaultMessage="Refresh"
                        description="Button in prompt for starting a search"
                        id="gui.connection.search"
                    />
                    <img className={styles.buttonIconRight} src={refreshIcon} />
                </button>
            </div>
        </Box>
    </Box>
);

ScanningStep.propTypes = {
    connectionSmallIconURL: PropTypes.string,
    firmwareFlashable: PropTypes.bool,
    isMobile: PropTypes.bool,
    onConnecting: PropTypes.func,
    onRefresh: PropTypes.func,
    onFlashFirmware: PropTypes.func,
    peripheralList: PropTypes.arrayOf(PropTypes.shape({
        name: PropTypes.string,
        rssi: PropTypes.number,
        peripheralId: PropTypes.string
    })),
    scanning: PropTypes.bool.isRequired
};

ScanningStep.defaultProps = {
    peripheralList: [],
    scanning: true
};

export default ScanningStep;
