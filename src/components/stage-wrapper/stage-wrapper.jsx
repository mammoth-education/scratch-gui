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
        isPreview,
        isSmallDevice,
        stageSize,
        stagePreviewVisible,
        vm,
        isSmallStageSize,
    } = props;
    
    return (
        <Box
            className={classNames(
                styles.stageWrapper,
                { [styles.fullScreen]: isFullScreen }
            )}
            dir={isRtl ? 'rtl' : 'ltr'}
        >
            {/* 预览窗口不显示，小设备全屏也不显示 */}
            <Box className={classNames(
                styles.stageMenuWrapper,
                { [styles.fullScreen]: isFullScreen },
                isPreview ? styles.preview : null,
            )}>
                <StageHeader
                    isSmallDevice={isSmallDevice}
                    stageSize={stageSize}
                    vm={vm}
                />
            </Box>
            <Box className={classNames(isFullScreen ? styles.stageCanvasWrapperFullScreen : styles.stageCanvasWrapper, 
                !stagePreviewVisible && !isFullScreen && isPreview ? styles.hide : styles.show)}>
                {isRendererSupported ?
                    <Stage
                        stageSize={ stageSize}
                        isMobile={isMobile}
                        isPreview={isPreview}
                        vm={vm}
                        isSmallStageSize={isSmallStageSize}
                    />
                    : null}
            </Box>
            {isFullScreen && isMobile && <StageVirtualKeyboard />}
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
    isPreview: PropTypes.bool,
    stageSize: PropTypes.oneOf(Object.keys(STAGE_DISPLAY_SIZES)).isRequired,
    stagePreviewVisible: PropTypes.bool,
    vm: PropTypes.instanceOf(VM).isRequired
};

StageWrapperComponent.defaultProps = {
    stagePreviewVisible: true,
}

export default StageWrapperComponent;
