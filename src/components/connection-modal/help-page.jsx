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
                        src={help}
                    />
                </React.Fragment>
                <p className={styles.helpLink}>kaka-kit.rtfd.io</p>
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
                onClick={props.onReconnect}
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