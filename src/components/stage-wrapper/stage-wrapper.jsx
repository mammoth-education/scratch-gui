import PropTypes from 'prop-types';
import React from 'react';
import classNames from 'classnames';
import VM from 'scratch-vm';

import Box from '../box/box.jsx';
import { STAGE_DISPLAY_SIZES } from '../../lib/layout-constants.js';
import StageHeader from '../../containers/stage-header.jsx';
import Stage from '../../containers/stage.jsx';
import Loader from '../loader/loader.jsx';
import StageVirtualKeyboard from '../stage-virtual-keyboard/stage-virtual-keyboard.jsx';

import styles from './stage-wrapper.css';

const StageWrapperComponent = function (props) {
    const {
        isFullScreen,
        isRtl,
        isRendererSupported,
        loading,
        isMobile,
        stageSize,
        vm,
        isSmallDevice,
        isSmallStageSize,
        phoneTag
    } = props;
    
    return (
        <Box
            className={classNames(
                styles.stageWrapper,
                { [styles.fullScreen]: isFullScreen }
            )}
            dir={isRtl ? 'rtl' : 'ltr'}
        >
            <Box className={styles.stageMenuWrapper}>
                {/* 舞台编辑 */}
                {isSmallDevice ? null : <StageHeader
                    stageSize={stageSize}
                    vm={vm}
                />}
            </Box>
            <Box className={styles.stageCanvasWrapper} style={{"margin-left":" 0.5rem"}}>
                {isRendererSupported ?
                    <Stage
                        stageSize={ stageSize}
                        isMobile={isMobile}
                        vm={vm}
                        isSmallDevice={isSmallDevice}
                        isSmallStageSize={isSmallStageSize}
                        phoneTag={phoneTag}
                    />
                    : null}
            </Box>
            {isFullScreen ? <StageVirtualKeyboard /> : null}
            {loading ? (
                <Loader isFullScreen={isFullScreen} />
            ) : null}
        </Box>
    );
};

StageWrapperComponent.propTypes = {
    isFullScreen: PropTypes.bool,
    isRendererSupported: PropTypes.bool.isRequired,
    isRtl: PropTypes.bool.isRequired,
    loading: PropTypes.bool,
    isMobile: PropTypes.bool,
    stageSize: PropTypes.oneOf(Object.keys(STAGE_DISPLAY_SIZES)).isRequired,
    vm: PropTypes.instanceOf(VM).isRequired
};

export default StageWrapperComponent;
