import PropTypes from 'prop-types';
import React from 'react';

import VirtualKey from './virtual-key.jsx';

import style from './stage-virtual-keyboard.css';
import upArrowIcon from './icon--arrow-up.svg';
import downArrowIcon from './icon--arrow-down.svg';
import leftArrowIcon from './icon--arrow-left.svg';
import rightArrowIcon from './icon--arrow-right.svg';

const StageVirtualKeyboardComponent = props => {
    return (
        <div className={style.background}>
            <div className={style.keyboard}>
                <div className={style.row}>
                    <VirtualKey keyName="ArrowUp" icon={upArrowIcon} />
                </div>
                <div className={style.row}>
                    <div className={style.left}>
                        <VirtualKey  keyName="ArrowLeft" icon={upArrowIcon} />
                    </div>
                    <div className={style.down}>
                        <VirtualKey  keyName="ArrowDown" icon={upArrowIcon} />
                    </div>
                    <div className={style.right}>
                        <VirtualKey  keyName="ArrowRight" icon={upArrowIcon} />
                    </div>
                    {/* <VirtualKey keyName="ArrowLeft" icon={leftArrowIcon} />
                    <VirtualKey keyName="ArrowDown" icon={downArrowIcon} />
                    <VirtualKey keyName="ArrowRight" icon={rightArrowIcon} /> */}
                </div>
            </div>
        </div>
    )
}

StageVirtualKeyboardComponent.propTypes = {
}

StageVirtualKeyboardComponent.defaultProps = {
};

export default StageVirtualKeyboardComponent;
