import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import React from 'react';

import Box from '../box/box.jsx';

import styles from './connection-modal.css';
import classNames from 'classnames';
import help from './icons/help.png';

const HelpPage = props => (
    <Box className={styles.body}>
        <Box className={styles.activityArea}>
            <Box className={styles.centeredRow}>
                <React.Fragment>
                    <img
                        className={styles.helpImg}
                        src={props.helpLinkImage}
                    />
                </React.Fragment>
                {/* 由于APP上架不通过，原因好像是上架时设置为适用于儿童，无法使用跳转链接 */}
                <p className={styles.helpLink}>{props.helpLink.replace("https://", "")}</p>
                <button
                    className={styles.copyButton}
                    onClick={props.onCopy}
                >
                    <FormattedMessage
                        defaultMessage="Copy"
                        description="copyUrl"
                        id="gui.connection.copyUrl"
                    />
                </button>
            </Box>
        </Box>
        <Box className={styles.bottomArea}>
            <FormattedMessage
                defaultMessage="Scan the QR code to view the help page"
                description="Scan the QR code to view the help page"
                id="gui.connection.helpfulTips"
            />
            <button
                className={classNames(styles.bottomAreaItem, styles.connectionButton)}
                onClick={props.onRenameCancel}
            >
                <FormattedMessage
                    defaultMessage="back"
                    description="Button to reconnect the device"
                    id="gui.modal.back"
                />
            </button>
        </Box>
    </Box>



);
HelpPage.propTypes = {
    onReconnect: PropTypes.func.isRequired,
};

export default HelpPage;