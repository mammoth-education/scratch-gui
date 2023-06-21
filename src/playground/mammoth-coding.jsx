import React from 'react';
import ReactDOM from 'react-dom';
import { compose } from 'redux';

import AppStateHOC from '../lib/app-state-hoc.jsx';
import GUI from '../containers/gui.jsx';
import HashParserHOC from '../lib/hash-parser-hoc.jsx';

const onClickLogo = () => {
    // window.location = 'https://scratch.mit.edu';
};

const fixAndroidNotch = () => {
    console.log("fixAndroidNotch");
    console.log("window.AndroidNotch",window.AndroidNotch);
    if (window.AndroidNotch) {
        const style = document.documentElement.style;
 
        // Apply insets as css variables
        window.AndroidNotch.getInsetTop(px => {
            style.setProperty("--notch-inset-top", px + "px");
        }, (err) => console.error("Failed to get insets top:", err));
        
        window.AndroidNotch.getInsetRight(px => {
            style.setProperty("--notch-inset-right", px + "px");
        }, (err) => console.error("Failed to get insets right:", err));
        
        window.AndroidNotch.getInsetBottom(px => {
            style.setProperty("--notch-inset-bottom", px + "px");
        }, (err) => console.error("Failed to get insets bottom:", err));
        
        window.AndroidNotch.getInsetLeft(px => {
            style.setProperty("--notch-inset-left", px + "px");
        }, (err) => console.error("Failed to get insets left:", err));
    }
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
    window.addEventListener("load",()=>{
        if(window.cordova){
            // setTimeout(()=>{
                
                // document.body.style.margin = 'env(safe-area-inset-top) env(safe-area-inset-right) env(safe-area-inset-bottom) env(safe-area-inset-left)';
                // document.body.style.width = 'calc(100% - env(safe-area-inset-left) )';
                // document.body.style.width = 'calc(100% + env(safe-area-inset-left) )';
                // document.body.style.height = 'calc(100% + env(safe-area-inset-bottom))';
                // document.getElementsByTagName('html')[0].style.backgroundColor = 'hsla(177,100%,32%,1)';
                // 固定全屏方向
                // screen.orientation.lock('portrait');
                screen.orientation.lock('landscape-primary');
            // },100)
        }
    })
    // if(window.cordova && window.cordova.platformId == "android"){
    //     screen.orientation.lock('landscape-primary');
    // }
    document.addEventListener("visibilitychange", ()=>{
        if (document.visibilityState === "hidden") {
            if(window.cordova && window.cordova.platformId == "ios"){
                console.log("应用被切换到后台")
                // 应用被切换到后台，执行相应的操作
                document.body.style.width = 'calc(100% - env(safe-area-inset-left) )';
                document.body.style.height = '100%';
            }
        } else if (document.visibilityState === "visible") {
            // 应用从后台回到前台，执行相应的操作
            console.log("应用被切换到前台")
        }
    }, false);
    fixAndroidNotch()
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
