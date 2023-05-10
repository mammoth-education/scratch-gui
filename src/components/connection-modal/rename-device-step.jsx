import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import React from 'react';

import Box from '../box/box.jsx';

import styles from './connection-modal.css';
import classNames from 'classnames';

const RenameDeviceStep = props => (
    <Box className={styles.body}>
        <Box className={styles.activityArea}>
            <Box className={styles.centeredRow}>
                <input className={styles.deviceNameInput}
                    type="text"
                    placeholder= "请输入英文或数字"
                    value={props.deviceName}
                    maxlength="10"
                    onChange={props.onRenameChanged}
                />
            </Box>
        </Box>
        <Box className={styles.bottomArea}>
            <FormattedMessage
                defaultMessage="Rename your device"
                description="Message indicating user to rename their device"
                id="gui.connection.rename-your-device"
            />
            <div className={classNames(styles.bottomAreaItem, styles.cornerButtons)}>
                <button className={classNames(styles.connectionButton, styles.redButton)}
                    onClick={props.onRenameCancel}>
                    <FormattedMessage
                        defaultMessage="Cancel"
                        description="Button to cancel renaming of device"
                        id="gui.connection.cancel"
                    />
                </button>
                <button
                    className={styles.connectionButton}
                    onClick={props.onRenameConfirm}
                >
                    <FormattedMessage
                        defaultMessage="Confirm"
                        description="Button to confirm renaming of device"
                        id="gui.connection.confirm"
                    />
                </button>
            </div>
        </Box>
    </Box>
);

RenameDeviceStep.propTypes = {
    onCancel: PropTypes.func.isRequired,
    deviceName: PropTypes.string.isRequired,
    onRenameChanged: PropTypes.func.isRequired,
    onRenameConfirm: PropTypes.func.isRequired,
    onRenameCancel: PropTypes.func.isRequired
};

export default RenameDeviceStep;
