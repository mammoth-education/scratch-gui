
import PropTypes from 'prop-types';
import React from 'react';
import classNames from 'classnames';
import omit from 'lodash.omit';

import StageWrapper from '../../containers/stage-wrapper.jsx';
import TargetPane from '../../containers/target-pane.jsx';
import Box from '../box/box.jsx';

import styles from "./stage-and-target-wrapper.css";

const StageAndTargetWrapper = props => {
    const {
        isFullScreen,
        isMobile,
        isPreview,
        isRendererSupported,
        isRtl,
        isSmallDevice,
        stageSize,
        stagePreviewVisible,
        selectedTabIndex,
        vm,
        ...componentProps
    } = omit(props, 'dispatch');
    return (
        <Box className={classNames(styles.stageAndTargetWrapper, styles[stageSize], isPreview && stagePreviewVisible ? styles.preview : null)}>
            <StageWrapper
                isFullScreen={isFullScreen}
                isRendererSupported={isRendererSupported}
                isRtl={isRtl}
                isMobile={isMobile}
                isSmallDevice={isSmallDevice}
                stageSize={stageSize}
                stagePreviewVisible={stagePreviewVisible}
                vm={vm}
                isPreview={isPreview}
                selectedTabIndex={selectedTabIndex}
                {...props}
            />
            {<Box className={classNames(styles.targetWrapper, isPreview ? styles.preview : null)}>
                <TargetPane
                    stageSize={stageSize}
                    vm={vm}
                    isMobile={isMobile}
                    selectedTabIndex={selectedTabIndex}
                    isSmallDevice={isSmallDevice}
                    {...componentProps}
                />
            </Box>}
        </Box>
    )
}

StageAndTargetWrapper.propTypes = {
    isPreview: PropTypes.bool,
    stagePreviewVisible: PropTypes.bool,
}

StageAndTargetWrapper.defaultProps = {
    isPreview: false,
    stagePreviewVisible: true,
}


export default StageAndTargetWrapper;
