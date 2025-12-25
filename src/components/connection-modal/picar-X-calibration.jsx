import { FormattedMessage, injectIntl } from 'react-intl';
import PropTypes, { object } from 'prop-types';
import React from 'react';
import Box from '../box/box.jsx';
import styles from './connection-modal.css';
import picarXgear from './icons/picarXgear.svg';
import servo from './icons/servo.png';
import camera from './icons/camera.png';
import motor from './icons/motor.png';
import cliff from './icons/cliff.png';
import dark from './icons/dark.png';
import light from './icons/light.png';
import upArrowIcon from './icons/icon--arrow-up.svg';
import classNames from 'classnames';

const PiCarXCalibration = props => {
  // console.log("props.receiveBuffer", props.receiveBuffer)
  return (
    <Box className={styles.body}>
      <Box className={styles.setActivityArea}>
        {
          props.piCarXCalibration !== 3 &&
          <Box className={styles.piCalibrateBox}>
            {/* {
              props.piCarXCalibration != 1 && props.piCarXCalibration != 3 ?
                <img className={styles.picarXgear} src={picarXgear} /> :
                props.piCarXCalibration != 3 &&
                <>
                  <Box style={{ height: "294px", display: "flex", justifyContent: "center", alignItems: "center" }}>
                    <Box style={{ width: "70%" }}>
                      <img className={styles.camera} src={camera} style={{ width: "100%" }} />
                    </Box>
                  </Box>
                </>
            }
            {

            } */}


            {
              props.piCarXCalibration === 0 &&
              <>
                <Box style={{ height: "294px", display: "flex", justifyContent: "center", alignItems: "center" }}>
                  <Box style={{ width: "48%" }}>
                    <img className={styles.servo} src={servo} style={{ width: "100%" }} />
                  </Box>
                </Box>
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
                <Box style={{ height: "294px", display: "flex", justifyContent: "center", alignItems: "center" }}>
                  <Box style={{ width: "70%" }}>
                    <img className={styles.camera} src={camera} style={{ width: "100%" }} />
                  </Box>
                </Box>
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
                <Box style={{ height: "294px", display: "flex", justifyContent: "center", alignItems: "center" }}>
                  <Box style={{ width: "48%" }}>
                    <img className={styles.motor} src={motor} style={{ width: "100%" }} />
                  </Box>
                </Box>
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
            <Box style={{ width: "100%", display: "flex", justifyContent: "space-around" }}>
              <Box style={{ display: "flex", alignItems: "center", heigth: '24px', lineHeight: '24px' }}>
                <FormattedMessage
                  defaultMessage="Post Cal: "
                  description="Grayscale Post Cal"
                  id="gui.connection.grayscale-PostCal"
                />
                <span style={{ paddingLeft: "10px" }}>{props.receiveBuffer && props.receiveBuffer.grayscale3ChannelData[0] + ", " || ""}</span>
                <span>{props.receiveBuffer && props.receiveBuffer.grayscale3ChannelData[1] + ", " || ""}</span>
                <span>{props.receiveBuffer && props.receiveBuffer.grayscale3ChannelData[2] || ""}</span>
              </Box>
              <Box style={{ display: "flex", alignItems: "center", heigth: '24px', lineHeight: '24px' }}>
                <FormattedMessage
                  defaultMessage="Cliff Threshold: "
                  description="Cliff Threshold"
                  id="gui.connection.cliff-threshold"
                />
                <span style={{ paddingLeft: "10px" }}>{props.receiveBuffer && props.receiveBuffer.grayscale3ChannelThreshold}</span>
              </Box>
            </Box>
            <Box style={{ display: "flex", justifyContent: "center" }}>
              <Box style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <img style={{ width: "70%" }} src={light} alt="" />
                <div style={{ display: "flex", minHeight: "18px", minWidth: "120px", margin: "6px 0", }}>
                  <span>{props.receiveBuffer && props.grayscaleMedian[0] ? props.grayscaleMedian[0][0] + ", " : ""}</span>
                  <span>{props.receiveBuffer && props.grayscaleMedian[0] ? props.grayscaleMedian[0][1] + ", " : ""}</span>
                  <span>{props.receiveBuffer && props.grayscaleMedian[0] ? props.grayscaleMedian[0][2] : ""}</span>
                </div>
                <button onClick={props.onPiCarxLightGrayscale}>
                  <FormattedMessage
                    defaultMessage="Light"
                    description="Light"
                    id="gui.connection.calibrate-light"
                  />
                </button>
              </Box>
              <Box style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <img style={{ width: "70%" }} src={dark} alt="" />
                <div style={{ display: "flex", minHeight: "18px", minWidth: "120px", margin: "6px 0", }}>
                  <span>{props.receiveBuffer && props.grayscaleMedian[1] ? props.grayscaleMedian[1][0] + ", " : ""}</span>
                  <span>{props.receiveBuffer && props.grayscaleMedian[1] ? props.grayscaleMedian[1][1] + ", " : ""}</span>
                  <span>{props.receiveBuffer && props.grayscaleMedian[1] ? props.grayscaleMedian[1][2] : ""}</span>
                </div>
                <button onClick={props.onPiCarxDarkGrayscale}>
                  <FormattedMessage
                    defaultMessage="Dark"
                    description="Dark"
                    id="gui.connection.calibrate-dark"
                  />
                </button>
              </Box>
              <Box style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <img style={{ width: "70%" }} src={cliff} alt="" />
                <span style={{ margin: "6px 0", minHeight: "18px", minWidth: "120px", textAlign: "center" }}>{props.piCarXCliff}</span>
                <button onClick={props.onPiCarxCliffGrayscale}>
                  <FormattedMessage
                    defaultMessage="Cliff"
                    description="cliff"
                    id="gui.connection.grayscale-cliff-but"
                  />
                </button>
              </Box>
            </Box>
            {/* <Box>
              <span>当前灰度状态: Cliff detected!</span>
            </Box>
            <Box>
              <span>校准后: 2000,20000,2000</span>
            </Box> */}
          </Box>
        }




      </Box>
      <Box className={styles.bottomArea}>
        {
          props.piCarXCalibration != 3 &&
          <FormattedMessage
            defaultMessage="Current calibration value:"
            description="Message indicating user to rename their device"
            id="gui.connection.piCarX-calinateValue"
          />
        }
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
            <>
              {
                props.grayscaleCalibrationSuccessTip &&
                <Box>
                  <FormattedMessage
                    defaultMessage="Cancel"
                    description="Button to cancel renaming of device"
                    id="gui.connection.calibrationComplete"
                  />
                </Box>
              }
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
            </>
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
