import { FormattedMessage, injectIntl } from 'react-intl';
import PropTypes from 'prop-types';
import React from 'react';
import Box from '../box/box.jsx';
import styles from './connection-modal.css';
import classNames from 'classnames';
const SettingWiFiSteps = props => {

  const { intl } = props;

  return (
    <Box className={styles.body}>
      <Box className={styles.setActivityArea}>
        <Box className={styles.wifiCenteredRow}>
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
              // placeholder="请输入名称"
              placeholder={props.intl.formatMessage({
                defaultMessage: "Please enter a name",
                id: "gui.connection.ap-new-device-name"
              })}
              defaultValue={props.deviceName}
              // maxlength="10"
              onChange={props.onRenameChanged}
            />
            <Box className={styles.setTips}>
              {props.renameState && <span>*</span>}
            </Box>
          </Box>

          {/* AI */}
          {
            props.extension.ai &&
            <>
              <Box className={styles.setTitle}>
                <FormattedMessage
                  defaultMessage="AI Key"
                  description="AI Key"
                  id="gui.connection.set-ai-key"
                />
              </Box>
              <Box className={styles.inputBox}>
                <textarea className={styles.deviceAiInput}
                  type="text"
                  placeholder={props.intl.formatMessage({
                    defaultMessage: "Please enter AI Key",
                    id: "gui.connection.ai-key"
                  })}
                  defaultValue={props.aiApiKey}
                  onChange={props.onAiKeyChanged}
                />
                <Box className={styles.setTips}>
                  {props.apPasswordState && <span>*</span>}
                </Box>
              </Box>
            </>
          }

          {/* wifi设置 */}
          {
            props.deviceWifiEditable &&
            <>
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
                  // placeholder="请输入新密码"
                  placeholder={props.intl.formatMessage({
                    defaultMessage: "Please enter new password",
                    id: "gui.connection.ap-new-password"
                  })}
                  defaultValue=""
                  // maxlength="10"
                  onChange={props.onDevicePasswordChanged}
                />
                <Box className={styles.setTips}>
                  {props.apPasswordState && <span>*</span>}
                </Box>
              </Box>

              <Box className={styles.setTitle}>
                <FormattedMessage
                  defaultMessage="set WIFI"
                  description="set WIFI"
                  id="gui.connection.set-device-WIFI"
                />
              </Box>
              <Box className={styles.selectBox}>
                {(
                  <select className={styles.networkSelect}
                    onChange={props.onWifiSSIDChanged}
                    onClick={(e) => {
                      // 仅当点击下拉框本身（未展开）时触发扫描，而非点击option时
                      if (e.target.tagName === 'SELECT') {
                        props.onScanWifi?.();
                      }
                    }}
                  // disabled={props.setWifiIsScanning} // 扫描中禁用下拉框，避免重复操作
                  >
                    {props.setWifiIsScanning ? (
                      <option value="" disabled>
                        {intl.formatMessage({
                          id: "gui.connection.scan-wifi",
                          defaultMessage: "Searching..."
                        })}
                      </option>
                    ) : !props.networksList ? (
                      <option value="">
                        {intl.formatMessage({
                          id: "gui.controls.set-wifi-scanning",
                          defaultMessage: "Click to start searching for WiFi"
                        })}
                      </option>
                    ) : null}

                    {props.networksList && props.networksList.length > 0 ? (
                      props.networksList.map((network) => {
                        if (!network.ssid) return null;
                        return (
                          <option
                            key={network.ssid}
                            value={network.ssid}
                          >
                            {network.ssid}
                          </option>
                        );
                      })
                    ) : props.networksList && props.networksList.length === 0 ? (
                      <option value="" disabled>
                        {/* 未搜索到WiFi，请重试 */}
                        {intl.formatMessage({
                          id: "gui.controls.set-wifi-scanning-error",
                          defaultMessage: "No Wi-Fi found. Please try again."
                        })}

                      </option>
                    ) : null}
                  </select>
                )}
                <Box className={styles.setTips}>
                  {props.staSsidState && <span>*</span>}
                </Box>
              </Box>
              <Box className={styles.inputBox}>
                <input className={styles.deviceNameInput}
                  type="text"
                  // placeholder="请输入密码"
                  placeholder={props.intl.formatMessage({
                    defaultMessage: "Please enter password",
                    id: "gui.connection.sta-new-password"
                  })}
                  // value={props.deviceName}
                  // maxlength="10"
                  onChange={props.onWifiPasswordChanged}
                />
                <Box className={styles.setTips}>
                  {props.staPasswordState && <span>*</span>}
                </Box>
              </Box>
            </>
          }
        </Box>
      </Box>
      <Box className={styles.bottomArea}>
        {
          (props.isStaPasswordTooShort || props.isApPasswordTooShort) ?
            <FormattedMessage
              defaultMessage="Password must be at least 8 characters long."
              description="Password must be at least 8 characters long."
              id={"gui.connection.password-length"}
            /> :
            <FormattedMessage
              defaultMessage="Set your device Wifi"
              description="Message indicating user to rename their device"
              id={"gui.connection.set-your-device"}
            />
        }
        <div className={classNames(styles.bottomAreaItem, styles.cornerButtons)}>
          <button className={classNames(styles.connectionButton, styles.redButton)}
            onClick={props.onRenameCancel}>
            <FormattedMessage
              defaultMessage="Cancel"
              description="Button to cancel renaming of device"
              id="gui.modal.back"
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

export default injectIntl(SettingWiFiSteps);
