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

    console.log("process.env.NODE_ENV: ", process.env.NODE_ENV);
    if (process.env.NODE_ENV === 'production' && typeof window === 'object') {
        // Warn before navigating away
        window.onbeforeunload = () => true;
    }
    // 获取语言
    // 目前无法设置Scratch语言，所以先不获取
    let locale = null;
    // locale = window.localStorage.getItem('locale');
    if (!locale) {
        locale = navigator.language;
        window.localStorage.setItem('locale', locale);
    }
    if (locale.indexOf("-") > 0) {
        locale = locale.split("-")[0];
    } else if (locale.indexOf("_") > 0) {
        locale = locale.split("_")[0];
    }
    if (locale !== 'zh') {
        locale = 'en';
    }
    if (window.electron) {
        window.electron.setLocale(locale);
    }
    ReactDOM.render(
        <WrappedGui
            canEditTitle
            canCreateCopy
            locale={locale}
            tutorialButtonVisible={false}
            canModifyCloudData={false}
            onClickLogo={onClickLogo}
        />,
        appTarget);
};
