import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import React from 'react';

import Box from '../box/box.jsx';

import styles from './connection-modal.css';
import classNames from 'classnames';

const FlasheFirmwareErrorStep = props => (
    <Box className={styles.body}>
        <Box className={styles.activityArea}>
            <Box className={styles.spaceEvenlyColumn}>
                <span className={styles.deviceName}>
                    <FormattedMessage
                        defaultMessage="Flash Firmware Error"
                        description="Flash Firmware Error"
                        id="gui.connection.flash-firmware-error"
                    />
                </span>
                <span className={styles.errorMessage}>
                    {props.flashErrorMessage}
                </span>
            </Box>
        </Box>
        <Box className={styles.bottomArea}>
            <FormattedMessage
                defaultMessage="Make sure to connect the device to the computer and try again!"
                description="Flash Firmware error tips"
                id="gui.connection.flash-firmware-error-tips"
            />
            <div className={classNames(styles.bottomAreaItem, styles.cornerButtons)}>
                <button className={styles.connectionButton} onClick={props.onReconnect}>
                    <FormattedMessage
                        defaultMessage="Back"
                        description="Back"
                        id="gui.modal.back"
                    />
                </button>
                <button
                    className={classNames(styles.bottomAreaItem, styles.connectionButton)}
                    onClick={props.onFlashFirmware}
                >
                    <FormattedMessage
                        defaultMessage="Retry"
                        description="Retry"
                        id="gui.connection.retry"
                    />
                </button>
            </div>
        </Box>
    </Box>
);

FlasheFirmwareErrorStep.propTypes = {
    onScanning: PropTypes.func.isRequired,
    flashErrorMessage: PropTypes.string,
};

export default FlasheFirmwareErrorStep;
