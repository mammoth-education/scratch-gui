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
        {
          props.piCarXCalibration !== 3 &&
          <Box className={styles.piCalibrateBox}>
            {
              props.piCarXCalibration != 1 && props.piCarXCalibration != 3 ?
                <img className={styles.picarXgear} src={picarXgear} /> :
                props.piCarXCalibration != 3 &&
                <img className={styles.camera} src={camera} />
            }

            {
              props.piCarXCalibration === 0 &&
              <>
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
        }
        {
          props.piCarXCalibration === 3 &&
          <Box className={styles.wifiCenteredRow}>
            <Box className={styles.setTitle}>
              <FormattedMessage
                defaultMessage="grayscale"
                description="grayscale"
                id="gui.connection.grayscale-value"
              />
            </Box>
            <Box className={styles.grayscaleValueBox}>
              <Box style={{ width: "4rem" }}>
                <FormattedMessage
                  defaultMessage="Pre-Cal: "
                  description="Pre-Cal"
                  id="gui.connection.grayscale-PreCal"
                />
              </Box>
              <Box style={{ margin: "0 10px" }}>
                <button className={styles.grayscaleValue}>{props.receiveBuffer.grayscale3Channel[0] || ""}</button>
                <button className={styles.grayscaleValue}>{props.receiveBuffer.grayscale3Channel[1] || ""}</button>
                <button className={styles.grayscaleValue}>{props.receiveBuffer.grayscale3Channel[2] || ""}</button>
              </Box>
            </Box>
            <Box className={styles.grayscaleValueBox}>
              <Box style={{ width: "4rem" }}>
                <FormattedMessage
                  defaultMessage="Post-Cal: "
                  description="Post-Cal"
                  id="gui.connection.grayscale-PostCal"
                />
              </Box>
              <Box style={{ margin: "10px 10px" }}>
                <button className={styles.grayscaleValue} style={{ backgroundColor: props.grayscaleCalibrationSuccess ? "red" : "white" }}>{props.receiveBuffer.grayscale3ChannelData[0] || ""}</button>
                <button className={styles.grayscaleValue} style={{ backgroundColor: props.grayscaleCalibrationSuccess ? "red" : "white" }}>{props.receiveBuffer.grayscale3ChannelData[1] || ""}</button>
                <button className={styles.grayscaleValue} style={{ backgroundColor: props.grayscaleCalibrationSuccess ? "red" : "white" }}>{props.receiveBuffer.grayscale3ChannelData[2] || ""}</button>
              </Box>
            </Box>
            <Box className={styles.setTitle}>
              <FormattedMessage
                defaultMessage="Calibration"
                description="Calibration"
                id="gui.connection.grayscale-calibration"
              />
            </Box>
            <Box className={styles.grayscaleValueBox}>
              <Box style={{ width: "4rem" }}>
                <FormattedMessage
                  defaultMessage="Light: "
                  description="Light"
                  id="gui.connection.grayscale-light"
                />
              </Box>
              <Box style={{ margin: "10px 10px" }}>
                <button className={styles.grayscaleValue}>{props.grayscaleMedian[0] ? props.grayscaleMedian[0][0] : ""}</button>
                <button className={styles.grayscaleValue}>{props.grayscaleMedian[0] ? props.grayscaleMedian[0][1] : ""}</button>
                <button className={styles.grayscaleValue}>{props.grayscaleMedian[0] ? props.grayscaleMedian[0][2] : ""}</button>
              </Box>
              <button
                className={styles.connectionButton}
                style={{ marginLeft: "10px", position: "absolute", right: "-26px" }}
                onClick={props.onPiCarxLightGrayscale}
              >
                <FormattedMessage
                  defaultMessage="Retrieve"
                  description="Retrieve"
                  id="gui.connection.calibrate-retrieve"
                />
              </button>
            </Box>
            <Box className={styles.grayscaleValueBox}>
              <Box style={{ width: "4rem" }}>
                <FormattedMessage
                  defaultMessage="Dark: "
                  description="Dark"
                  id="gui.connection.grayscale-dark"
                />
              </Box>
              <Box style={{ margin: "10px 10px" }}>
                <button className={styles.grayscaleValue}>{props.grayscaleMedian[1] ? props.grayscaleMedian[1][0] : ""}</button>
                <button className={styles.grayscaleValue}>{props.grayscaleMedian[1] ? props.grayscaleMedian[1][1] : ""}</button>
                <button className={styles.grayscaleValue}>{props.grayscaleMedian[1] ? props.grayscaleMedian[1][2] : ""}</button>
              </Box>
              <button
                className={styles.connectionButton}
                style={{ marginLeft: "10px", position: "absolute", right: "-26px" }}
                onClick={props.onPiCarxDarkGrayscale}
              >
                <FormattedMessage
                  defaultMessage="Retrieve"
                  description="Retrieve"
                  id="gui.connection.calibrate-retrieve"
                />
              </button>
            </Box>
          </Box>
        }




      </Box>
      <Box className={styles.bottomArea}>
        <FormattedMessage
          defaultMessage="Current calibration value:"
          description="Message indicating user to rename their device"
          id="gui.connection.piCarX-calinateValue"
        />
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
          {
            props.piCarXCalibration === 3 &&
            <button
              className={styles.connectionButton}
              onClick={props.onPiCarXCalibrationConfirm}
            >
              <FormattedMessage
                defaultMessage="Calibration"
                description="Calibration"
                id="gui.connection.calibrate-device"
              />
            </button>
          }
        </div>
      </Box>
    </Box >
  );
}

PiCarXCalibration.propTypes = {
  deviceName: PropTypes.string.isRequired,
  onRenameChanged: PropTypes.func.isRequired,
  onRenameConfirm: PropTypes.func.isRequired,
  onRenameCancel: PropTypes.func.isRequired
};

export default injectIntl(PiCarXCalibration);
