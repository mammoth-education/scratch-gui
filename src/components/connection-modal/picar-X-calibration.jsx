import { FormattedMessage, injectIntl } from 'react-intl';
import PropTypes, { object } from 'prop-types';
import React from 'react';
import Box from '../box/box.jsx';
import styles from './connection-modal.css';
import picarXgear from './icons/picarXgear.svg';
import camera from './icons/camera.svg';
// import upArrowIcon from './icons./icon--arrow-up.svg';
import upArrowIcon from './icons/icon--arrow-up.svg';
import classNames from 'classnames';

const PiCarXCalibration = props => {
  return (
    <Box className={styles.body}>
      <Box className={styles.setActivityArea}>
        <Box>
          {
            props.piCarXCalibration != 1 ?
              <img className={styles.picarXgear} src={picarXgear} /> :
              <img className={styles.camera} src={camera} />
          }
          {
            props.piCarXCalibration === 0 &&
            <>
              {/* <button className={styles.leftFront} onClick={() => props.onPiCarXCalibrationSend("servoCalibration", { type: 2, data: -1 })}>
                <img src={upArrowIcon} />
              </button>
              <button className={styles.rightFront} onClick={() => props.onPiCarXCalibrationSend("servoCalibration", { type: 2, data: 1 })}>
                <img src={upArrowIcon} />
              </button> */}
              <button className={styles.leftFront} onClick={() => props.onPiCarXServoCalibration("left")}>
                <img src={upArrowIcon} />
              </button>
              <button className={styles.rightFront} onClick={() => props.onPiCarXServoCalibration("right")}>
                <img src={upArrowIcon} />
              </button>
            </>
          }
          {
            props.piCarXCalibration === 1 &&
            <>
              {/* <button className={styles.cameraLeft} onClick={() => props.onPiCarXCalibrationSend("servoCalibration", { type: 0, data: -1 })}>
                <img src={upArrowIcon} />
              </button>
              <button className={styles.cameraRight} onClick={() => props.onPiCarXCalibrationSend("servoCalibration", { type: 0, data: 1 })}>
                <img src={upArrowIcon} />
              </button>
              <button className={styles.cameraUp} onClick={() => props.onPiCarXCalibrationSend("servoCalibration", { type: 1, data: -1 })}>
                <img src={upArrowIcon} />
              </button >
              <button className={styles.cameraDown} onClick={() => props.onPiCarXCalibrationSend("servoCalibration", { type: 1, data: 1 })}>
                <img src={upArrowIcon} />
              </button> */}
              <button className={styles.cameraLeft} onClick={() => props.onPiCarXCamerCalibration("decreaseX")}>
                <img src={upArrowIcon} />
              </button>
              <button className={styles.cameraRight} onClick={() => props.onPiCarXCamerCalibration("addX")}>
                <img src={upArrowIcon} />
              </button>
              <button className={styles.cameraUp} onClick={() => props.onPiCarXCamerCalibration("addY")}>
                <img src={upArrowIcon} />
              </button >
              <button className={styles.cameraDown} onClick={() => props.onPiCarXCamerCalibration("decreaseY")}>
                <img src={upArrowIcon} />
              </button>
            </>
          }
          {
            props.piCarXCalibration === 2 &&
            <>
              <button className={styles.leftBack} onClick={() => props.onPiCarXMotorCalibration("left")}>
                L
              </button >
              <button className={styles.rightBack} onClick={() => props.onPiCarXMotorCalibration("right")}>
                <span className={styles.rightBackSpan}>R</span>
              </button>
            </>
          }
        </Box>
      </Box>
      <Box className={styles.bottomArea}>
        <FormattedMessage
          defaultMessage="Current calibration value:"
          description="Message indicating user to rename their device"
          // id={"gui.connection.set-your-device"}
          id="gui.connection.piCarX-calinateValue"
        />
        {/* {
          props.piCarXCalibration === 0 && Object.keys(props.receiveBuffer).length > 0 &&
          props.receiveBuffer.servoCalibration.steeringServo
        }
        {
          props.piCarXCalibration === 1 && Object.keys(props.receiveBuffer).length > 0 &&
          "X " + props.receiveBuffer.servoCalibration.cameraX + " " + "Y " + props.receiveBuffer.servoCalibration.cameraY
        }

        {
          props.piCarXCalibration === 2 && Object.keys(props.receiveBuffer).length > 0 &&
          "L " + props.receiveBuffer.motorCalibration.leftMotor + " " + "R " + props.receiveBuffer.motorCalibration.rightMotor
        } */}
        {
          props.piCarXCalibration === 0 && props.receiveBuffer.steeringCalibration &&
          props.receiveBuffer.steeringCalibration
        }
        {
          props.piCarXCalibration === 1 && props.receiveBuffer.cameraCalibrationX &&
          "X: " + props.receiveBuffer.cameraCalibrationX + " " + "Y: " + props.receiveBuffer.cameraCalibrationY
        }

        {
          props.piCarXCalibration === 2 && props.receiveBuffer.motorCalibration &&
          "L: " + props.receiveBuffer.motorCalibration[0] + " " + "R: " + props.receiveBuffer.motorCalibration[1]
        }

        <div className={classNames(styles.bottomAreaItem, styles.cornerButtons)}>
          <button className={classNames(styles.connectionButton, styles.redButton)}
            onClick={props.onPiCarXCalibrationCancel}>
            <FormattedMessage
              defaultMessage="Cancel"
              description="Button to cancel renaming of device"
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

PiCarXCalibration.propTypes = {
  deviceName: PropTypes.string.isRequired,
  onRenameChanged: PropTypes.func.isRequired,
  onRenameConfirm: PropTypes.func.isRequired,
  onRenameCancel: PropTypes.func.isRequired
};

export default injectIntl(PiCarXCalibration);
