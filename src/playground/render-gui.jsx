import React from 'react';
import ReactDOM from 'react-dom';
import { compose } from 'redux';

import AppStateHOC from '../lib/app-state-hoc.jsx';
import GUI from '../containers/gui.jsx';
import HashParserHOC from '../lib/hash-parser-hoc.jsx';
import log from '../lib/log.js';

const onClickLogo = () => {
    window.location = 'https://scratch.mit.edu';
};

const handleTelemetryModalCancel = () => {
    log('User canceled telemetry modal');
};

const handleTelemetryModalOptIn = () => {
    log('User opted into telemetry');
};

const handleTelemetryModalOptOut = () => {
    log('User opted out of telemetry');
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

    ReactDOM.render(
        <WrappedGui
            canEditTitle
            isScratchDesktop
            canSave={false}
            onClickLogo={onClickLogo}
        />,
        appTarget);
};
