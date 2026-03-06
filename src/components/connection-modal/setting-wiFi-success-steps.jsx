import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import React from 'react';

import Box from '../box/box.jsx';

import styles from './connection-modal.css';
import classNames from 'classnames';

const RenameDeviceSuccessStep = props => {
  return (
    <Box className={styles.body}>
      <Box className={styles.activityArea}>
        <Box className={styles.centeredRow}>
          {
            props.staLoading ?
              <FormattedMessage
                defaultMessage="Setting up..."
                description="Setting up..."
                id="gui.connection.set-staLoading"
              />
              :
              <span className={styles.deviceName}>
                {`IP: ${props.staIp ? props.staIp : props.deviceName}`}
              </span>
          }
        </Box>
      </Box>
      <Box className={styles.bottomArea}>
        {
          props.staIp && !props.setWifiError &&
          <FormattedMessage
            defaultMessage="Device set successfully. Please reset to apply changes."
            description="Message indicating rename device success"
            id="gui.connection.set-device-success"
          />
        }
        {
          props.setWifiError &&
          <FormattedMessage
            defaultMessage="Device setup failed. Please verify that the input information is correct."
            description="Message indicating rename device success"
            id="gui.connection.set-device-error"
          />
        }
        <button
          className={classNames(styles.bottomAreaItem, styles.connectionButton)}
          onClick={props.staIp ? props.onReconnect : props.onSetButton}
        >
          {
            props.staIp ?
              <FormattedMessage
                defaultMessage="Reconnect"
                description="Button to reconnect the device"
                id="gui.connection.reconnect"
              /> :
              <FormattedMessage
                defaultMessage="Cancel"
                description="Button to cancel renaming of device"
                id="gui.modal.back"
              />
          }
        </button>
      </Box>
    </Box>
  );
}

RenameDeviceSuccessStep.propTypes = {
  onReconnect: PropTypes.func.isRequired,
  deviceName: PropTypes.string.isRequired,
};

export default RenameDeviceSuccessStep;
