import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import React from 'react';
import Box from '../box/box.jsx';
import styles from './connection-modal.css';
import classNames from 'classnames';
const SettingWiFiSteps = props => {
  return (
    <Box className={styles.body}>
      <Box className={styles.setActivityArea}>
        <Box className={styles.centeredRow}>
          <Box className={styles.setTitle}>
            <FormattedMessage
              defaultMessage="Rename Device"
              description="Rename device"
              id="gui.connection.rename-device"
            />
          </Box>
          <Box className={styles.inputBox}>
            <input className={styles.deviceNameInput}
              type="text"
              placeholder="请输入名称"
              defaultValue={props.deviceName}
              // maxlength="10"
              onChange={props.onRenameChanged}
            />
            <Box className={styles.setTips}>
              {
                props.renameState ?
                  <FormattedMessage
                    defaultMessage="configured"
                    description="configured"
                    id="gui.connection.input-success"
                  /> :
                  <FormattedMessage
                    defaultMessage="unchanged"
                    description="configured"
                    id="gui.connection.input-no"
                  />
              }
            </Box>

          </Box>
          <Box className={styles.setTitle}>
            <FormattedMessage
              defaultMessage="Device Password"
              description="Device Password"
              id="gui.connection.set-device-password"
            />
          </Box>
          <Box className={styles.inputBox}>
            <input className={styles.deviceNameInput}
              type="text"
              placeholder="请输入新密码"
              defaultValue="123456789"
              // maxlength="10"
              onChange={props.onDevicePasswordChanged}
            />
            <Box className={styles.setTips}>
              {
                props.apPasswordState ?
                  <FormattedMessage
                    defaultMessage="configured"
                    description="configured"
                    id="gui.connection.input-success"
                  /> :
                  <FormattedMessage
                    defaultMessage="unchanged"
                    description="configured"
                    id="gui.connection.input-no"
                  />

              }
            </Box>

          </Box>
          <Box className={styles.setTitle}>
            <FormattedMessage
              defaultMessage="set WIFI"
              description="set WIFI"
              id="gui.connection.set-device-WIFI"
            />
          </Box>
          <Box className={styles.inputBox}>
            <input className={styles.deviceNameInput}
              type="text"
              placeholder="请输入SSID"
              // value={props.deviceName}
              // maxlength="10"
              onChange={props.onWifiSSIDChanged}
            />
            {
              <Box className={styles.setTips}>
                {
                  props.staSsidState ?
                    <FormattedMessage
                      defaultMessage="configured"
                      description="configured"
                      id="gui.connection.input-success"
                    /> :
                    <FormattedMessage
                      defaultMessage="unchanged"
                      description="configured"
                      id="gui.connection.input-no"
                    />

                }
              </Box>
            }
          </Box>
          <Box className={styles.inputBox}>
            <input className={styles.deviceNameInput}
              type="text"
              placeholder="请输入密码"
              // value={props.deviceName}
              // maxlength="10"
              onChange={props.onWifiPasswordChanged}
            />
            <Box className={styles.setTips}>
              {
                props.staPasswordState ?
                  <FormattedMessage
                    defaultMessage="configured"
                    description="configured"
                    id="gui.connection.input-success"
                  /> :
                  <FormattedMessage
                    defaultMessage="unchanged"
                    description="configured"
                    id="gui.connection.input-no"
                  />
              }
            </Box>
          </Box>
        </Box>
      </Box>
      <Box className={styles.bottomArea}>
        <FormattedMessage
          defaultMessage="Set your device Wifi"
          description="Message indicating user to rename their device"
          id={"gui.connection.set-your-device"}
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
            onClick={props.onConfirm}
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
}

SettingWiFiSteps.propTypes = {
  deviceName: PropTypes.string.isRequired,
  onRenameChanged: PropTypes.func.isRequired,
  onRenameConfirm: PropTypes.func.isRequired,
  onRenameCancel: PropTypes.func.isRequired
};

export default SettingWiFiSteps;
