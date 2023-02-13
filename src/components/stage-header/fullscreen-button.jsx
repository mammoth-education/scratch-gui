
import React from 'react';
import {defineMessages, injectIntl, intlShape} from 'react-intl';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';

import Button from '../button/button.jsx';

import fullScreenIcon from './icon--fullscreen.svg';
import unFullScreenIcon from './icon--unfullscreen.svg';

import {setFullScreen} from '../../reducers/mode';

import styles from './stage-header.css';

const messages = defineMessages({
    fullStageSizeMessage: {
        defaultMessage: 'Enter full screen mode',
        description: 'Button to change stage size to full screen',
        id: 'gui.stageHeader.stageSizeFull'
    },
    unFullStageSizeMessage: {
        defaultMessage: 'Exit full screen mode',
        description: 'Button to get out of full screen mode',
        id: 'gui.stageHeader.stageSizeUnFull'
    },
    fullscreenControl: {
        defaultMessage: 'Full Screen Control',
        description: 'Button to enter/exit full screen mode',
        id: 'gui.stageHeader.fullscreenControl'
    }
});

class FullscreenButton extends React.Component {
    render() {
        return (
            <div className={styles.stageButtonWrapper}>
                { this.props.isFullScreen ? 
                    <Button
                        className={styles.stageButton}
                        onClick={this.props.onSetStageUnFull}
                    >
                        <img
                            alt={this.props.intl.formatMessage(messages.unFullStageSizeMessage)}
                            className={styles.stageButtonIcon}
                            draggable={false}
                            src={unFullScreenIcon}
                            title={this.props.intl.formatMessage(messages.fullscreenControl)}
                        />
                    </Button> :
                    <Button
                        className={styles.stageButton}
                        onClick={this.props.onSetStageFull}
                    >
                        <img
                            alt={this.props.intl.formatMessage(messages.fullStageSizeMessage)}
                            className={styles.stageButtonIcon}
                            draggable={false}
                            src={fullScreenIcon}
                            title={this.props.intl.formatMessage(messages.fullscreenControl)}
                        />
                    </Button>
                }       
            </div>
        )
    }
}


FullscreenButton.propTypes = {
    intl: intlShape,
    isFullScreen: PropTypes.bool,
    onSetStageFull: PropTypes.func.isRequired,
    onSetStageUnFull: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
    isFullScreen: state.scratchGui.mode.isFullScreen,
});

const mapDispatchToProps = dispatch => ({
    onSetStageFull: () => dispatch(setFullScreen(true)),
    onSetStageUnFull: () => dispatch(setFullScreen(false))
});

export default injectIntl(connect(
    mapStateToProps,
    mapDispatchToProps
)(FullscreenButton));
