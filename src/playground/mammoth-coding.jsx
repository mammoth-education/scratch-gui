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
    console.log("window.AndroidNotch", window.AndroidNotch);
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
    // HUAWEI 设备能用 env ，所有防止重复设置 body 的 width 和 padding 
    // 添加 setTimeout 的原因是IOS加载需要时间,无法马上使用device
    if (window.cordova) {
        if (!window.device) return;
        if (device.manufacturer == "HUAWEI") {
            document.body.style.width = 'calc(100% - env(safe-area-inset-left) )';
            document.body.style.padding = '0';
        }
    }

    setTimeout(() => {
        if (!window.device) return;
        if (window.cordova && device && device.manufacturer == "HUAWEI") {
            document.body.style.width = 'calc(100% - env(safe-area-inset-left) )';
            document.body.style.padding = '0';
        }
    }, 500);

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
    window.addEventListener("load", () => {
        if (window.cordova) {
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
    // 获取对应元素高度
    // let currentInputTop = 0;
    // let currentInputHeight = 0;
    // let currentInputBottom = 0;
    // let currentInputParentTop = 0;
    // let currentInputParentBottom = 0;
    // let parent = null;
    // document.addEventListener('focusin', (event) => {
    //     if (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA') {
    //         const target = event.target;
    //         const rect = target.parentElement.getBoundingClientRect();
    //         //console.log('当前元素信息:', rect);

    //         // 距离视口顶部的距离
    //         currentInputHeight = rect.height;
    //         currentInputTop = rect.top;
    //         currentInputBottom = rect.bottom;
    //         console.log(`当前 INPUT 距离视口顶部: ${currentInputTop}px`);

    //         let currentElement = event.target;
    //         let level = 0; // 当前层级计数

    //         // 向上找到第八层父元素
    //         while (currentElement && level < 7) {
    //             currentElement = currentElement.parentElement;
    //             level++;
    //         }

    //         if (currentElement) {
    //             //console.log('第七层父元素:', currentElement);
    //             parent = currentElement;
    //             // 获取第七层父元素距离视口顶部的距离
    //             currentInputParentTop = currentElement.getBoundingClientRect().top;
    //             currentInputParentBottom = currentElement.getBoundingClientRect().bottom
    //             console.log(`父元素距离视口顶部: ${currentInputParentTop.top}px`);
    //             console.log(`父元素距离视口顶部: ${currentInputParentTop.bottom}px`);


    //         } else {
    //             console.log('没有第七层父元素，已到顶层');
    //         }
    //     }
    // });


    // 键盘弹出
    // window.addEventListener('native.keyboardshow', (e) => {
    //     console.log(e);
    //     console.log(e.keyboardHeight, "键盘高度");
    //     if (window.device && window.device.platform !== "Android") {
    //         return;
    //     }
    //     // const moveDistance = window.innerHeight - e.keyboardHeight - currentInputTop;
    //     const moveDistance = currentInputParentTop - (currentInputTop - (window.innerHeight - e.keyboardHeight));
    //     if (currentInputTop > window.innerHeight - e.keyboardHeight) {
    //     }
    //     parent.style.top = `${moveDistance}px`;
    //     console.log(`需要移动的距离: ${moveDistance}px`);
    // });
    // // 键盘隐藏
    // window.addEventListener('native.keyboardhide', (e) => {
    //     parent.style.top = "50%";
    // });
    // if(window.cordova && window.cordova.platformId == "android"){
    //     screen.orientation.lock('landscape-primary');
    // }
    document.addEventListener("visibilitychange", () => {
        if (document.visibilityState === "hidden") {
            if (window.cordova && window.cordova.platformId == "ios") {
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
