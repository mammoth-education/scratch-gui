
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
        stageVisible,
        vm,
        ...componentProps
    } = omit(props, 'dispatch');
    return (
        <Box className={classNames(styles.stageAndTargetWrapper, styles[stageSize], isPreview ? styles.stagePreview : null)}>
            <StageWrapper
                isFullScreen={isFullScreen}
                isRendererSupported={isRendererSupported}
                isRtl={isRtl}
                isMobile={isMobile}
                stageSize={stageSize}
                stageVisible={stageVisible}
                vm={vm}
                isSmallDevice={isSmallDevice}
                isPreview={isPreview}
                {...props}
            />
            { !isPreview && <Box className={styles.targetWrapper}>
                <TargetPane
                    stageSize={stageSize}
                    vm={vm}
                    {...props}
                />
            </Box> }
        </Box>
    )
}

StageAndTargetWrapper.propTypes = {
    isPreview: PropTypes.bool,
    stageVisible: PropTypes.bool,
}

StageAndTargetWrapper.defaultProps = {
    isPreview: false,
    stageVisible: true,
}


export default StageAndTargetWrapper;
