import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import React from 'react';

import Box from '../box/box.jsx';

import styles from './connection-modal.css';
import classNames from 'classnames';

const FlashingFirmwareStep = props => (
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
                <Box className={styles.progressBarFrame}>
                    <Box className={styles.progressBarValue} style={{width: `${props.flashProgress}%`}}>
                    </Box>
                </Box>
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

FlashingFirmwareStep.propTypes = {
    onFlashFirmwareStart: PropTypes.func.isRequired,
    flashProgress: PropTypes.number,
};

export default FlashingFirmwareStep;
