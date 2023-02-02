import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import React from 'react';

import Box from '../box/box.jsx';

import styles from './connection-modal.css';
import classNames from 'classnames';

const FlashFirmwareSuccessStep = props => (
    <Box className={styles.body}>
        <Box className={styles.activityArea}>
            <Box className={styles.spaceEvenlyColumn}>
                <span className={styles.deviceName}>
                    <FormattedMessage
                        defaultMessage="Flash Firmware Success"
                        description="Flash Firmware Success"
                        id="gui.connection.flash-firmware-success"
                    />
                </span>
                <FormattedMessage
                    defaultMessage="Flash Firmware Successfully! Scan for the device now!"
                    description="Flash Firmware Successfully tips"
                    id="gui.connection.flash-firmware-success-tips"
                />
            </Box>
        </Box>
        <Box className={styles.bottomArea}>
            <button
                className={classNames(styles.bottomAreaItem, styles.connectionButton)}
                onClick={props.onScanning}
            >
                <FormattedMessage
                    defaultMessage="Scan for it"
                    description="Scan for it"
                    id="gui.connection.scan-for-it"
                />
            </button>
        </Box>
    </Box>
);

FlashFirmwareSuccessStep.propTypes = {
    onScanning: PropTypes.func.isRequired,
};

export default FlashFirmwareSuccessStep;
