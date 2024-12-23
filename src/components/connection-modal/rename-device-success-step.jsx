import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import React from 'react';

import Box from '../box/box.jsx';

import styles from './connection-modal.css';
import classNames from 'classnames';

const RenameDeviceSuccessStep = props => (
    <Box className={styles.body}>
        <Box className={styles.activityArea}>
            <Box className={styles.centeredRow}>
                <span className={styles.deviceName}>
                    {props.deviceName}
                </span>
            </Box>
        </Box>
        <Box className={styles.bottomArea}>
            <FormattedMessage
                defaultMessage="Rename device success. Please reset to apply changes."
                description="Message indicating rename device success"
                id="gui.connection.rename-device-success"
            />
            <button
                className={classNames(styles.bottomAreaItem, styles.connectionButton)}
                onClick={props.onReconnect}
            >
                <FormattedMessage
                    defaultMessage="Reconnect"
                    description="Button to reconnect the device"
                    id="gui.connection.reconnect"
                />
            </button>
        </Box>
    </Box>
);

RenameDeviceSuccessStep.propTypes = {
    onReconnect: PropTypes.func.isRequired,
    deviceName: PropTypes.string.isRequired,
};

export default RenameDeviceSuccessStep;
