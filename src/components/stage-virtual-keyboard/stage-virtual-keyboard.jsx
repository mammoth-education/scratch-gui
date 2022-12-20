import PropTypes from 'prop-types';
import React from 'react';

import VirtualKey from './virtual-key.jsx';

import style from './stage-virtual-keyboard.css';
import { STAGE_VITUAL_KEYBOARD_WIDTH } from '../../lib/layout-constants';
import classNames from 'classnames';
import upArrowIcon from './icon--arrow-up.svg';
import downArrowIcon from './icon--arrow-down.svg';
import leftArrowIcon from './icon--arrow-left.svg';
import rightArrowIcon from './icon--arrow-right.svg';

const StageVirtualKeyboardComponent = props => {
    return (
        <div className={style.background} style={{ width: STAGE_VITUAL_KEYBOARD_WIDTH }}>
            <div className={style.keyboard}>
                <div className={style.row}>
                    <VirtualKey keyName="ArrowUp" icon={upArrowIcon} />
                </div>
                <div className={style.row}>
                    <VirtualKey keyName="ArrowLeft" icon={leftArrowIcon} />
                    <VirtualKey keyName="ArrowDown" icon={downArrowIcon} />
                    <VirtualKey keyName="ArrowRight" icon={rightArrowIcon} />
                </div>
            </div>
        </div>
    )
}

StageVirtualKeyboardComponent.propTypes = {
    onUpPressed: PropTypes.func,
    onUpReleased: PropTypes.func,
    onLeftPressed: PropTypes.func,
    onLeftReleased: PropTypes.func,
    onDownPressed: PropTypes.func,
    onDownReleased: PropTypes.func,
    onRightPressed: PropTypes.func,
    onRightReleased: PropTypes.func
}

StageVirtualKeyboardComponent.defaultProps = {
};

export default StageVirtualKeyboardComponent;
