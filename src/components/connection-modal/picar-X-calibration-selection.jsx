import { FormattedMessage, injectIntl } from 'react-intl';
import PropTypes, { object } from 'prop-types';
import React from 'react';
import Box from '../box/box.jsx';
import styles from './connection-modal.css';
import classNames from 'classnames';

const PiCarXCalibrationSelection = props => {
  return (
    <Box className={styles.body}>
      <Box className={styles.setActivityArea}>
        <Box className={styles.piCalibrateSelection}>
          <Box className={styles.piCalibrate}>
            <FormattedMessage
              defaultMessage="Steering rudder"
              description="Steering rudder"
              id="gui.piCarDirectionalServo"
            />

            <button onClick={() => props.onPiCarXCalibration(0)} className={styles.connectionButton}>
              <FormattedMessage
                defaultMessage="Calibration"
                description="Calibration"
                id="gui.connection.calibrate-device"
              />
            </button>
          </Box>
          <Box className={styles.piCalibrate}>
            <FormattedMessage
              defaultMessage="Camera Servo"
              description="Camera Servo"
              id="gui.piCarCamera"
            />
            <button onClick={() => props.onPiCarXCalibration(1)} className={styles.connectionButton}>
              <FormattedMessage
                defaultMessage="Calibration"
                description="Calibration"
                id="gui.connection.calibrate-device"
              />
            </button>
          </Box>
          <Box className={styles.piCalibrate}>
            <FormattedMessage
              defaultMessage="Motor"
              description="Motor"
              id="gui.piCarMotor"
            />
            <button onClick={() => props.onPiCarXCalibration(2)} className={styles.connectionButton}>
              <FormattedMessage
                defaultMessage="Calibration"
                description="Calibration"
                id="gui.connection.calibrate-device"
              />
            </button>
          </Box>
          {/* 灰度校准 */}
          <Box className={styles.piCalibrate}>
            <FormattedMessage
              defaultMessage="Grayscale"
              description="Grayscale Calibration"
              id="gui.piCarGrayscale"
            />
            <button onClick={() => props.onPiCarXCalibration(3)} className={styles.connectionButton}>
              <FormattedMessage
                defaultMessage="Calibration"
                description="Calibration"
                id="gui.connection.calibrate-device"
              />
            </button>
          </Box>
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
            // onClick={props.onRenameCancel}>
            onClick={props.onPiCarXCalibrationSelectionCancel}>
            <FormattedMessage
              defaultMessage="Cancel"
              description="Button to cancel renaming of device"
              // id="gui.connection.cancel"
              id="gui.modal.back"
            />
          </button>
          {/* <button
            className={styles.connectionButton}
            onClick={props.onPiCarXCalibrationConfirm}
          >
            <FormattedMessage
              defaultMessage="Confirm"
              description="Button to confirm renaming of device"
              id="gui.connection.confirm"
            />
          </button> */}
        </div>
      </Box>
    </Box>
  );
}

PiCarXCalibrationSelection.propTypes = {
  deviceName: PropTypes.string.isRequired,
  onRenameChanged: PropTypes.func.isRequired,
  onRenameConfirm: PropTypes.func.isRequired,
  onRenameCancel: PropTypes.func.isRequired
};

export default injectIntl(PiCarXCalibrationSelection);
