import { FormattedMessage, injectIntl } from 'react-intl';
import PropTypes, { object } from 'prop-types';
import React from 'react';
import Box from '../box/box.jsx';
import styles from './connection-modal.css';
import classNames from 'classnames';

const ZeusCarCalibration = props => {
  // console.log(props.receiveBuffer);
  return (
    <Box className={styles.body}>
      <Box className={styles.setActivityArea}>
        <Box className={styles.centeredCol}>
          {
            (props.compassCalibrationState === 0 || props.compassCalibrationState === 2) &&
            // 校准完成
            <Box className={styles.calibrateBox}>
              <FormattedMessage
                defaultMessage="校准完成 !"
                description="Calibrate device"
                id="gui.connection.calibrationComplete"
              />
            </Box>

          }
          {
            props.compassCalibrationState === 1 &&
            // 正在校准
            <Box className={styles.calibrateBox}>
              <FormattedMessage
                defaultMessage="正在校准 ..."
                description="Calibrate device"
                id="gui.connection.calibrating"
              />
            </Box>
          }
          {
            props.compassCalibrationState === 3 &&
            // 校准中断
            <Box className={styles.calibrateBox}>
              <FormattedMessage
                defaultMessage="校准中断,请重新校准 !"
                description="Calibrate device"
                id="gui.connection.calibrationInterrupted"
              />
            </Box>
          }
        </Box>
      </Box>
      <Box className={styles.bottomArea}>
        <FormattedMessage
          defaultMessage="Current calibration value:"
          description="Message indicating user to rename their device"
          id={"gui.connection.set-your-device"}
        />

        <div className={classNames(styles.bottomAreaItem, styles.cornerButtons)}>
          <button className={classNames(styles.connectionButton, styles.redButton)}
            onClick={props.onZeusCarCalibrationCancel}>
            <FormattedMessage
              defaultMessage="Cancel"
              description="Button to cancel renaming of device"
              id="gui.modal.back"
            />
          </button>
          <button
            className={styles.connectionButton}
            onClick={props.onZeusCarCalibrationConfirm}
          >
            {
              props.sendCalibrationState == 0 &&
              <FormattedMessage
                defaultMessage="Confirm"
                description="Button to confirm renaming of device"
                id="gui.connection.confirm"
              />
            }
            {
              props.sendCalibrationState == 1 &&
              <FormattedMessage
                defaultMessage="Cancel calibrate device"
                description="Cancel calibrate device"
                id="gui.connection.cancel-calibrate-device"
              />
            }
          </button>
        </div>
      </Box>
    </Box>
  );
}

ZeusCarCalibration.propTypes = {
  deviceName: PropTypes.string.isRequired,
  onRenameChanged: PropTypes.func.isRequired,
  onRenameConfirm: PropTypes.func.isRequired,
  onRenameCancel: PropTypes.func.isRequired
};

export default injectIntl(ZeusCarCalibration);
