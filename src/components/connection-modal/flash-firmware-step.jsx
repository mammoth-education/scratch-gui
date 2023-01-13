import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import React from 'react';

import Box from '../box/box.jsx';

import styles from './connection-modal.css';
import classNames from 'classnames';

const FlashFirmwareStep = props => (
    <Box className={styles.body}>
        <Box className={styles.activityArea}>
            <Box className={styles.spaceEvenlyColumn}>
                <span className={styles.deviceName}>
                    <FormattedMessage
                        defaultMessage="Flash Firmware"
                        description="Flash Firmware"
                        id="gui.connection.flash-firmware"
                    />
                </span>
                { props.currentFirmwareVersion && <div>
                    <FormattedMessage
                        defaultMessage="Current version: "
                        description="Current version"
                        id="gui.connection.curren-version"
                    />
                    <span>{props.currentFirmwareVersion}</span>
                </div> }
                <div>
                    <FormattedMessage
                        defaultMessage="Latest version: "
                        description="Latest version"
                        id="gui.connection.latest-version"
                    />
                    <span>{props.latestFirmwareVersion}</span>
                </div>
                <div>
                    <span>{props.flashMessage}</span>
                    <Box className={styles.progressBarFrame}>
                        <Box className={styles.progressBarValue} style={{width: `${props.flashProgress}%`}}>
                        </Box>
                    </Box>
                </div>
            </Box>
        </Box>
        <Box className={styles.bottomArea}>
            <div className={classNames(styles.bottomAreaItem, styles.cornerButtons)}>
                <button className={styles.connectionButton} onClick={props.onReconnect}>
                    <FormattedMessage
                        defaultMessage="Back"
                        description="Back"
                        id="gui.modal.back"
                    />
                </button>
                <button className={styles.connectionButton} onClick={props.onFlashFirmwareStart}>
                    <FormattedMessage
                        defaultMessage="Flash"
                        description="Flash (firmware)"
                        id="gui.connection.flash"
                    />
                </button>
            </div>
        </Box>
    </Box>
);

FlashFirmwareStep.propTypes = {
    currentFirmwareVersion: PropTypes.string,
    latestFirmwareVersion: PropTypes.string,
    onFlashFirmwareStart: PropTypes.func.isRequired,
    flashMessage: PropTypes.string,
    flashProgress: PropTypes.number,
};

export default FlashFirmwareStep;
