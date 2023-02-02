import React from 'react';
import ReactDOM from 'react-dom';
import { compose } from 'redux';

import AppStateHOC from '../lib/app-state-hoc.jsx';
import GUI from '../containers/gui.jsx';
import HashParserHOC from '../lib/hash-parser-hoc.jsx';

const onClickLogo = () => {
    // window.location = 'https://scratch.mit.edu';
};

export default appTarget => {
    GUI.setAppElement(appTarget);

    const WrappedGui = compose(
        AppStateHOC,
        HashParserHOC
    )(GUI);

    if (process.env.NODE_ENV === 'production' && typeof window === 'object') {
        // Warn before navigating away
        window.onbeforeunload = () => true;
    }
    // 默认语言
    ReactDOM.render(
        <WrappedGui
            canEditTitle
            canCreateCopy
            locale="zh-cn"
            tutorialButtonVisible={false}
            canModifyCloudData={false}
            onClickLogo={onClickLogo}
        />,
        appTarget);
};
