import classNames from 'classnames';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { defineMessages, FormattedMessage, injectIntl, intlShape } from 'react-intl';
import PropTypes from 'prop-types';
import bindAll from 'lodash.bindall';
import bowser, { version } from 'bowser';
import React from 'react';

import VM from 'scratch-vm';

import Box from '../box/box.jsx';
import Button from '../button/button.jsx';
import CommunityButton from './community-button.jsx';
import ShareButton from './share-button.jsx';
import { ComingSoonTooltip } from '../coming-soon/coming-soon.jsx';
import Divider from '../divider/divider.jsx';
import LanguageSelector from '../../containers/language-selector.jsx';
import SaveStatus from './save-status.jsx';
import ProjectWatcher from '../../containers/project-watcher.jsx';
import MenuBarMenu from './menu-bar-menu.jsx';
import { MenuItem, MenuSection } from '../menu/menu.jsx';
import ProjectTitleInput from './project-title-input.jsx';
import AuthorInfo from './author-info.jsx';
import AccountNav from '../../containers/account-nav.jsx';
import LoginDropdown from './login-dropdown.jsx';
import SB3Downloader from '../../containers/sb3-downloader.jsx';
import DeletionRestorer from '../../containers/deletion-restorer.jsx';
import TurboMode from '../../containers/turbo-mode.jsx';
import MenuBarHOC from '../../containers/menu-bar-hoc.jsx';

import { openTipsLibrary, openUserProjectsModal } from '../../reducers/modals';
import { setPlayer } from '../../reducers/mode';
import {
    showAlertWithTimeout,
    showStandardAlert
} from '../../reducers/alerts';
import {
    autoUpdateProject,
    getIsUpdating,
    getIsShowingProject,
    manualUpdateProject,
    requestNewProject,
    remixProject,
    saveProjectAsCopy
} from '../../reducers/project-state';
import { setProjectTitle } from '../../reducers/project-title';
import {
    openAboutMenu,
    closeAboutMenu,
    aboutMenuOpen,
    openAccountMenu,
    closeAccountMenu,
    accountMenuOpen,
    openFileMenu,
    closeFileMenu,
    fileMenuOpen,
    openEditMenu,
    closeEditMenu,
    editMenuOpen,
    openLanguageMenu,
    closeLanguageMenu,
    languageMenuOpen,
    openLoginMenu,
    closeLoginMenu,
    loginMenuOpen
} from '../../reducers/menus';

import collectMetadata from '../../lib/collect-metadata';

import styles from './menu-bar.css';

import helpIcon from '../../lib/assets/icon--tutorials.svg';
import mystuffIcon from './icon--mystuff.png';
import profileIcon from './icon--profile.png';
import remixIcon from './icon--remix.svg';
import dropdownCaret from './dropdown-caret.svg';
import languageIcon from '../language-selector/language-icon.svg';
import aboutIcon from './icon--about.svg';
import gridIcon from './icon--grid.svg';
import iconSave from './icon--save.svg';

import scratchLogo from './mammoth-logo.png';
import Logo from './logo.png';
import codeIcon from '../gui/icon--code.svg';
import costumesIcon from '../gui/icon--costumes.svg';
import soundsIcon from '../gui/icon--sounds.svg';
import stageIcon from '../gui/icon--stage2.svg';
import UniversalPopup from '../universal-popup/universal-popup.jsx'


import sharedMessages from '../../lib/shared-messages';

const ariaMessages = defineMessages({
    language: {
        id: 'gui.menuBar.LanguageSelector',
        defaultMessage: 'language selector',
        description: 'accessibility text for the language selection menu'
    },
    tutorials: {
        id: 'gui.menuBar.tutorialsLibrary',
        defaultMessage: 'Tutorials',
        description: 'accessibility text for the tutorials button'
    }
});

const MenuBarItemTooltip = ({
    children,
    className,
    enable,
    id,
    place = 'bottom'
}) => {
    if (enable) {
        return (
            <React.Fragment>
                {children}
            </React.Fragment>
        );
    }
    return (
        <ComingSoonTooltip
            className={classNames(styles.comingSoon, className)}
            place={place}
            tooltipClassName={styles.comingSoonTooltip}
            tooltipId={id}
        >
            {children}
        </ComingSoonTooltip>
    );
};


MenuBarItemTooltip.propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
    enable: PropTypes.bool,
    id: PropTypes.string,
    place: PropTypes.oneOf(['top', 'bottom', 'left', 'right']),
    setProjectTitle: PropTypes.func,
};

const MenuItemTooltip = ({ id, isRtl, children, className }) => (
    <ComingSoonTooltip
        className={classNames(styles.comingSoon, className)}
        isRtl={isRtl}
        place={isRtl ? 'left' : 'right'}
        tooltipClassName={styles.comingSoonTooltip}
        tooltipId={id}
    >
        {children}
    </ComingSoonTooltip>
);

MenuItemTooltip.propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
    id: PropTypes.string,
    isRtl: PropTypes.bool
};

const AboutButton = props => (
    <Button
        className={classNames(styles.menuBarItem, styles.hoverable)}
        iconClassName={styles.aboutIcon}
        iconSrc={aboutIcon}
        onClick={props.onClick}
    />
);

AboutButton.propTypes = {
    onClick: PropTypes.func.isRequired
};

class MenuBar extends React.Component {
    constructor(props) {
        super(props);
        bindAll(this, [
            'handleClickNew',
            'handleClickRemix',
            'handleClickSave',
            'handleClickSaveAsCopy',
            'handleClickSeeCommunity',
            'handleClickShare',
            'handleKeyPress',
            'handleLanguageMouseUp',
            'handleRestoreOption',
            'getSaveToComputerHandler',
            'restoreOptionMessage',
            'handleClickCodeTab',
            'handleClickCostumesTab',
            'handleClickSoundsTab',
            'handleClickStageTab',
            'handleClickUserProjects',
            'onClickLogo',
            'cancel',
            'getVersion',
            'check'
        ]);
        this.state = { versionShow: false, checkingContent: "", updateTips: false, loading: false, downloadShow: false, updateShow: false };
    }


    componentDidMount() {
        if (window.cordova && window.cordova.platformId == "android") {
            this.setState({ updateShow: true });
            // ios 端需要时间加载 cordova-plugin-advanced-http 插件
            setTimeout(() => {
                this.check();
            }, 1000);
        }
        document.addEventListener('keydown', this.handleKeyPress);
        // 为了解决iOS端全屏时block页面未填满屏幕
        // this.handleClickCostumesTab()
    }
    componentWillUnmount() {
        document.removeEventListener('keydown', this.handleKeyPress);
    }
    handleClickNew() {
        // if the project is dirty, and user owns the project, we will autosave.
        // but if they are not logged in and can't save, user should consider
        // downloading or logging in first.
        // Note that if user is logged in and editing someone else's project,
        // they'll lose their work.
        sessionStorage.removeItem("currentID");
        const readyToReplaceProject = this.props.confirmReadyToReplaceProject(
            this.props.intl.formatMessage(sharedMessages.replaceProjectWarning)
        );
        this.props.onRequestCloseFile();
        if (readyToReplaceProject) {
            this.props.onClickNew(this.props.canSave && this.props.canCreateNew);
        }
        this.props.onRequestCloseFile();
    }
    handleClickRemix() {
        this.props.onClickRemix();
        this.props.onRequestCloseFile();
    }
    handleClickSave() {
        this.props.onClickSave();
        this.props.onRequestCloseFile();
    }
    handleClickSaveAsCopy() {
        this.props.onClickSaveAsCopy();
        this.props.onRequestCloseFile();
    }
    handleClickSeeCommunity(waitForUpdate) {
        if (this.props.shouldSaveBeforeTransition()) {
            this.props.autoUpdateProject(); // save before transitioning to project page
            waitForUpdate(true); // queue the transition to project page
        } else {
            waitForUpdate(false); // immediately transition to project page
        }
    }
    handleClickShare(waitForUpdate) {
        if (!this.props.isShared) {
            if (this.props.canShare) { // save before transitioning to project page
                this.props.onShare();
            }
            if (this.props.canSave) { // save before transitioning to project page
                this.props.autoUpdateProject();
                waitForUpdate(true); // queue the transition to project page
            } else {
                waitForUpdate(false); // immediately transition to project page
            }
        }
    }
    handleRestoreOption(restoreFun) {
        return () => {
            restoreFun();
            this.props.onRequestCloseEdit();
        };
    }
    handleKeyPress(event) {
        const modifier = bowser.mac ? event.metaKey : event.ctrlKey;
        if (modifier && event.key === 's') {
            this.props.onClickSave();
            event.preventDefault();
        }
    }
    getSaveToComputerHandler(downloadProjectCallback) {
        return () => {
            this.props.onRequestCloseFile();
            downloadProjectCallback().then((res) => {
                // if(!exportNotation){
                //     this.props.onClickSave();
                // }
                // 1 名称重复  2 导出
                console.log("res", res)
                if (res === 1) {
                    this.props.onShowAlert('duplicateNames');
                } else {
                    if (res !== 2) {
                        this.props.onShowSaveSuccessAlert();
                    }
                }
                if (res === 3) {
                    let currentProject = JSON.parse(sessionStorage.getItem('currentID'));
                    let name = currentProject.name.replace(".sb3", "");
                    this.props.setProjectTitle(name);
                }
                if (this.props.onProjectTelemetryEvent) {
                    const metadata = collectMetadata(this.props.vm, this.props.projectTitle, this.props.locale);
                    this.props.onProjectTelemetryEvent('projectDidSave', metadata);
                }
            });
        };
    }
    handleLanguageMouseUp(e) {
        if (!this.props.languageMenuOpen) {
            this.props.onClickLanguage(e);
        }
    }
    restoreOptionMessage(deletedItem) {
        switch (deletedItem) {
            case 'Sprite':
                return (<FormattedMessage
                    defaultMessage="Restore Sprite"
                    description="Menu bar item for restoring the last deleted sprite."
                    id="gui.menuBar.restoreSprite"
                />);
            case 'Sound':
                return (<FormattedMessage
                    defaultMessage="Restore Sound"
                    description="Menu bar item for restoring the last deleted sound."
                    id="gui.menuBar.restoreSound"
                />);
            case 'Costume':
                return (<FormattedMessage
                    defaultMessage="Restore Costume"
                    description="Menu bar item for restoring the last deleted costume."
                    id="gui.menuBar.restoreCostume"
                />);
            default: {
                return (<FormattedMessage
                    defaultMessage="Restore"
                    description="Menu bar item for restoring the last deleted item in its disabled state." /* eslint-disable-line max-len */
                    id="gui.menuBar.restore"
                />);
            }
        }
    }
    buildAboutMenu(onClickAbout) {
        if (!onClickAbout) {
            // hide the button
            return null;
        }
        if (typeof onClickAbout === 'function') {
            // make a button which calls a function
            return <AboutButton onClick={onClickAbout} />;
        }
        // assume it's an array of objects
        // each item must have a 'title' FormattedMessage and a 'handleClick' function
        // generate a menu with items for each object in the array
        return (
            <div
                className={classNames(styles.menuBarItem, styles.hoverable, {
                    [styles.active]: this.props.aboutMenuOpen
                })}
                onMouseUp={this.props.onRequestOpenAbout}
            >
                <img
                    className={styles.aboutIcon}
                    src={aboutIcon}
                />
                <MenuBarMenu
                    className={classNames(styles.menuBarMenu)}
                    open={this.props.aboutMenuOpen}
                    place={this.props.isRtl ? 'right' : 'left'}
                    onRequestClose={this.props.onRequestCloseAbout}
                >
                    {
                        onClickAbout.map(itemProps => (
                            <MenuItem
                                key={itemProps.title}
                                isRtl={this.props.isRtl}
                                onClick={this.wrapAboutMenuCallback(itemProps.onClick)}
                            >
                                {itemProps.title}
                            </MenuItem>
                        ))
                    }
                </MenuBarMenu>
            </div>
        );
    }
    wrapAboutMenuCallback(callback) {
        return () => {
            callback();
            this.props.onRequestCloseAbout();
        };
    }
    handleClickCodeTab() {
        this.props.onClickCodeTab();
        this.props.onTabSelect(0);
    }
    handleClickCostumesTab() {
        this.props.onClickCostumesTab();
        this.props.onTabSelect(1);
    }
    handleClickSoundsTab() {
        this.props.onClickSoundsTab();
        this.props.onTabSelect(2);
    }
    handleClickStageTab() {
        this.props.onClickStageTab();
        this.props.onTabSelect(3);
    }
    handleClickUserProjects() {
        this.props.onClickUserProjects();
    }
    onClickLogo() {
        let versionShow = this.state.versionShow
        this.setState({ versionShow: !versionShow })
    }
    cancel() {
        this.setState({ versionShow: false, loading: false, updateTips: false });
    }
    getVersion() {
        // 获取应用程序的版本号
        if (window.cordova) {
            cordova.getAppVersion.getVersionNumber().then(function (appVersion) {
                let version = appVersion
                console.log("Current version", version)
            }).catch(function (error) {
                console.log('获取应用程序的版本号失败：' + error);
            });
        }
    }
    check() {
        this.setState({ loading: true })
        if (window.cordova) {
            cordova.plugin.http.get("https://ezblock.cc/app_v2/mammoth-coding/version.txt", {}, {}, (response) => {
                var latestVersion = response.data;
                console.log("latestVersion1", latestVersion)
                this.setState({ checkingContent: latestVersion, loading: false, updateTips: true })

                var newFirstNumber = parseInt(latestVersion.substring(0, latestVersion.indexOf(".")));
                var newSecondNumber = parseInt(latestVersion.substring(latestVersion.indexOf(".") + 1, latestVersion.lastIndexOf(".")));
                var newThirdNumber = parseInt(latestVersion.substring(latestVersion.lastIndexOf(".") + 1));

                cordova.getAppVersion.getVersionNumber().then((appVersion) => {
                    var currentVersion = appVersion;
                    console.log("Current version1", currentVersion)

                    var oldFirstNumber = parseInt(currentVersion.substring(0, currentVersion.indexOf(".")));
                    var oldSecondNumber = parseInt(currentVersion.substring(currentVersion.indexOf(".") + 1, currentVersion.lastIndexOf(".")));
                    var oldThirdNumber = parseInt(currentVersion.substring(currentVersion.lastIndexOf(".") + 1));
                    if (newFirstNumber > oldFirstNumber || newSecondNumber > oldSecondNumber || newThirdNumber > oldThirdNumber) {
                        if (!this.state.versionShow) {
                            this.setState({ versionShow: true, downloadShow: true })
                        }
                    }
                }).catch(function (error) {
                    console.log('获取应用程序的版本号失败：' + error);
                });
            }, function (error) {
                console.error(error);
            });
        }
    }
    download() {
        // if(cordova.platformId == "ios"){
        //     window.open("https://apps.apple.com/cn/app/%E9%95%BF%E6%AF%9B%E8%B1%A1%E7%BC%96%E7%A8%8B/id6448233669");
        // }else{
        if (navigator.language == 'en-US') {
            window.open("https://ezblock.com.cn/app_v2/mammoth-coding/index.html?lang=en");
        } else {
            window.open("https://ezblock.com.cn/app_v2/mammoth-coding/index.html");
        }
        // }
    }
    render() {
        const saveNowMessage = (
            <FormattedMessage
                defaultMessage="Save now"
                description="Menu bar item for saving now"
                id="gui.menuBar.saveNow"
            />
        );
        const createCopyMessage = (
            <FormattedMessage
                defaultMessage="Save as a copy"
                description="Menu bar item for saving as a copy"
                id="gui.menuBar.saveAsCopy"
            />
        );
        const remixMessage = (
            <FormattedMessage
                defaultMessage="Remix"
                description="Menu bar item for remixing"
                id="gui.menuBar.remix"
            />
        );
        const newProjectMessage = (
            <FormattedMessage
                defaultMessage="New"
                description="Menu bar item for creating a new project"
                id="gui.menuBar.new"
            />
        );
        const updateTips = (
            <span className={styles.check} onClick={this.check}>
                <FormattedMessage
                    defaultMessage="Check updates"
                    description="Used to display the app name"
                    id="gui.connection.check-for-updates"
                />
            </span>
        )
        const downloadLink = (
            <>
                <span className={styles.download} onClick={this.download}>
                    <FormattedMessage
                        defaultMessage="Download"
                        description="Used to display the app name"
                        id="gui.downloadApp"
                    />
                    <div className={styles.red}></div>
                </span>
            </>
        )
        const latestVersion = (
            <>
                <FormattedMessage
                    defaultMessage="Latest Version"
                    description="Used to display the app name"
                    id="gui.connection.latest-version"
                /> {this.state.checkingContent} {this.state.downloadShow ? downloadLink : null}
            </>
        )
        const loading = (
            <div className={styles.loadingBox}>
                <FormattedMessage
                    defaultMessage="Checking"
                    description="Used to display the app name"
                    id="gui.checking"
                />
                <div className={styles.loading}><div></div><div></div><div></div><div></div></div>
            </div>
        )
        const version = (
            <>
                <div className={styles.topics}>
                    <img src={Logo} alt="" />
                    <div className={styles.text}>
                        <FormattedMessage
                            defaultMessage="Mammoth Coding"
                            description="Used to display the app name"
                            id="gui.about.app"
                        />
                    </div>
                </div>
                <div className={styles.version}>
                    <FormattedMessage
                        defaultMessage="version"
                        description="Used to display the version number"
                        id="gui.about.version"
                    />1.0.7
                    <span>2023-06-25</span>
                </div>
                {this.state.updateShow ? <div className={styles.checkBox} >{this.state.loading ? loading : (this.state.updateTips ? latestVersion : updateTips)}</div> : null}
                <div><span className={styles.copyright}>2024@SunFounder</span></div>
            </>
        );
        const title = (
            <FormattedMessage
                defaultMessage="About Us"
                description="About Us"
                id="gui.about.title"
            />
        )
        const remixButton = (
            <Button
                className={classNames(
                    styles.menuBarButton,
                    styles.remixButton
                )}
                iconClassName={styles.remixButtonIcon}
                iconSrc={remixIcon}
                onClick={this.handleClickRemix}
            >
                {remixMessage}
            </Button>
        );
        // Show the About button only if we have a handler for it (like in the desktop app)
        const aboutButton = this.buildAboutMenu(this.props.onClickAbout);
        let saveStatus = { saveProject: 1, modifyProject: 2, copyProject: 3 }
        return (
            <Box
                className={classNames(
                    this.props.className,
                    styles.menuBar
                )}
            >

                {this.state.versionShow ? <UniversalPopup content={version} title={title} cancel={this.cancel} /> : null}
                <div className={styles.mainMenu}>
                    <div className={styles.fileGroup}>
                        <div className={classNames(styles.menuBarItem)}>
                            <img
                                alt="Scratch"
                                className={classNames(styles.scratchLogo, {
                                    [styles.clickable]: typeof this.props.onClickLogo !== 'undefined'
                                })}
                                draggable={false}
                                src={this.props.logo}
                                onClick={this.onClickLogo}
                            />
                        </div>
                        {(this.props.canChangeLanguage) && (<div
                            className={classNames(styles.menuBarItem, styles.hoverable, styles.languageMenu)}
                        >
                            <div>
                                <img
                                    className={styles.languageIcon}
                                    src={languageIcon}
                                />
                                <img
                                    className={styles.languageCaret}
                                    src={dropdownCaret}
                                />
                            </div>
                            <LanguageSelector label={this.props.intl.formatMessage(ariaMessages.language)} />
                        </div>)}
                        {(this.props.canManageFiles) && (
                            <div
                                className={classNames(styles.menuBarItem, styles.hoverable, {
                                    [styles.active]: this.props.fileMenuOpen
                                })}
                                onMouseUp={this.props.onClickFile}
                            >
                                <FormattedMessage
                                    defaultMessage="File"
                                    description="Text for file dropdown menu"
                                    id="gui.menuBar.file"
                                />
                                <MenuBarMenu
                                    className={classNames(styles.menuBarMenu)}
                                    open={this.props.fileMenuOpen}
                                    place={this.props.isRtl ? 'left' : 'right'}
                                    onRequestClose={this.props.onRequestCloseFile}
                                >
                                    <MenuSection>
                                        <MenuItem
                                            isRtl={this.props.isRtl}
                                            onClick={this.handleClickNew}
                                        >
                                            {newProjectMessage}
                                        </MenuItem>
                                    </MenuSection>
                                    {(this.props.canSave || this.props.canCreateCopy || this.props.canRemix) && (
                                        <MenuSection>
                                            {this.props.canSave && (
                                                <MenuItem onClick={this.handleClickSave}>
                                                    {saveNowMessage}
                                                </MenuItem>
                                            )}
                                            {/* copy项目 */}
                                            {
                                                this.props.canCreateCopy &&
                                                <SB3Downloader saveStatus={saveStatus.copyProject} onOpenProject={this.props.onOpenProject}>
                                                    {(_, downloadProjectCallback) => (
                                                        <MenuItem onClick={this.getSaveToComputerHandler(downloadProjectCallback)}>
                                                            {createCopyMessage}
                                                        </MenuItem>
                                                    )}
                                                </SB3Downloader>
                                            }
                                            {/* {this.props.canCreateCopy && (
                                                <MenuItem onClick={this.handleClickSaveAsCopy}>
                                                    {createCopyMessage}
                                                </MenuItem>
                                            )} */}
                                            {this.props.canRemix && (
                                                <MenuItem onClick={this.handleClickRemix}>
                                                    {remixMessage}
                                                </MenuItem>
                                            )}
                                        </MenuSection>
                                    )}
                                    <MenuSection>
                                        <MenuItem
                                            onClick={this.props.onStartSelectingFileUpload}
                                        >
                                            {this.props.isMobile ?
                                                <FormattedMessage
                                                    defaultMessage="Load from your headers"
                                                    description="Menu bar item for downloading a project to your computer" // eslint-disable-line max-len
                                                    id="gui.sharedMessages.loadFromHeaders"
                                                /> : (this.props.intl.formatMessage(sharedMessages.loadFromComputerTitle))}
                                        </MenuItem>
                                        {/*  导出项目 */}
                                        <SB3Downloader >{(className, downloadProjectCallback) => (
                                            <MenuItem
                                                className={className}
                                                onClick={this.getSaveToComputerHandler(downloadProjectCallback)}
                                            >
                                                {this.props.isMobile ?
                                                    <FormattedMessage
                                                        defaultMessage="Save to your equipment"
                                                        description="Menu bar item for downloading a project to your computer" // eslint-disable-line max-len
                                                        id="gui.menuBar.mobileDownloadToComputer"
                                                    />
                                                    :
                                                    <FormattedMessage
                                                        defaultMessage="Save to your computer"
                                                        description="Menu bar item for downloading a project to your computer" // eslint-disable-line max-len
                                                        id="gui.menuBar.downloadToComputer"
                                                    />
                                                }
                                            </MenuItem>
                                        )}</SB3Downloader>
                                    </MenuSection>
                                </MenuBarMenu>
                            </div>
                        )}
                        {(this.props.editMenuVisible) && (
                            <div
                                className={classNames(styles.menuBarItem, styles.hoverable, {
                                    [styles.active]: this.props.editMenuOpen
                                })}
                                onMouseUp={this.props.onClickEdit}
                            >
                                <div className={classNames(styles.editMenu)}>
                                    <FormattedMessage
                                        defaultMessage="Edit"
                                        description="Text for edit dropdown menu"
                                        id="gui.menuBar.edit"
                                    />
                                </div>
                                <MenuBarMenu
                                    className={classNames(styles.menuBarMenu)}
                                    open={this.props.editMenuOpen}
                                    place={this.props.isRtl ? 'left' : 'right'}
                                    onRequestClose={this.props.onRequestCloseEdit}
                                >
                                    <DeletionRestorer>{(handleRestore, { restorable, deletedItem }) => (
                                        <MenuItem
                                            className={classNames({ [styles.disabled]: !restorable })}
                                            onClick={this.handleRestoreOption(handleRestore)}
                                        >
                                            {this.restoreOptionMessage(deletedItem)}
                                        </MenuItem>
                                    )}</DeletionRestorer>
                                    <MenuSection>
                                        <TurboMode>{(toggleTurboMode, { turboMode }) => (
                                            <MenuItem onClick={toggleTurboMode}>
                                                {turboMode ? (
                                                    <FormattedMessage
                                                        defaultMessage="Turn off Turbo Mode"
                                                        description="Menu bar item for turning off turbo mode"
                                                        id="gui.menuBar.turboModeOff"
                                                    />
                                                ) : (
                                                    <FormattedMessage
                                                        defaultMessage="Turn on Turbo Mode"
                                                        description="Menu bar item for turning on turbo mode"
                                                        id="gui.menuBar.turboModeOn"
                                                    />
                                                )}
                                            </MenuItem>
                                        )}</TurboMode>
                                    </MenuSection>
                                </MenuBarMenu>
                            </div>
                        )}
                    </div>
                    {this.props.tutorialButtonVisible ? (
                        <Divider className={classNames(styles.divider)} />) : null}
                    {this.props.tutorialButtonVisible ? (
                        <div
                            aria-label={this.props.intl.formatMessage(ariaMessages.tutorials)}
                            className={classNames(styles.menuBarItem, styles.hoverable)}
                            onClick={this.props.onOpenTipLibrary}
                        >
                            <img
                                className={styles.helpIcon}
                                src={helpIcon}
                            />
                            <FormattedMessage {...ariaMessages.tutorials} />
                        </div>) : null}
                    <Divider className={classNames(styles.divider)} />
                    {this.props.canEditTitle ? (
                        <div className={classNames(styles.menuBarItem, styles.growable)}>
                            <MenuBarItemTooltip
                                enable
                                id="title-field"
                            >
                                <ProjectTitleInput
                                    className={classNames(styles.titleFieldGrowable)}
                                />
                            </MenuBarItemTooltip>
                            {/* 保存按钮 */}
                            {
                                this.props.isMobile ?
                                    <SB3Downloader saveStatus={saveStatus.saveProject}>
                                        {(_, downloadProjectCallback) => (
                                            <div className={styles.saveButton} onClick={this.getSaveToComputerHandler(downloadProjectCallback)}>
                                                <img draggable={false} src={iconSave} />
                                            </div>
                                        )}
                                    </SB3Downloader> : null
                            }

                            {/* {this.props.isMobile ?  
                                <div className={styles.saveButton} onClick={this.props.onClickSave}>
                                    <img draggable={false} src={iconSave} />
                                </div> : null
                            } */}
                        </div>
                    ) : ((this.props.authorUsername && this.props.authorUsername !== this.props.username) ? (
                        <AuthorInfo
                            className={styles.authorInfo}
                            imageUrl={this.props.authorThumbnailUrl}
                            projectTitle={this.props.projectTitle}
                            userId={this.props.authorId}
                            username={this.props.authorUsername}
                        />
                    ) : null)}
                    <div className={classNames(styles.menuBarItem)}>
                        {this.props.canShare ? (
                            (this.props.isShowingProject || this.props.isUpdating) && (
                                <ProjectWatcher onDoneUpdating={this.props.onSeeCommunity}>
                                    {
                                        waitForUpdate => (
                                            <ShareButton
                                                className={styles.menuBarButton}
                                                isShared={this.props.isShared}
                                                /* eslint-disable react/jsx-no-bind */
                                                onClick={() => {
                                                    this.handleClickShare(waitForUpdate);
                                                }}
                                            /* eslint-enable react/jsx-no-bind */
                                            />
                                        )
                                    }
                                </ProjectWatcher>
                            )
                        ) : (
                            this.props.showComingSoon ? (
                                <MenuBarItemTooltip id="share-button">
                                    <ShareButton className={styles.menuBarButton} />
                                </MenuBarItemTooltip>
                            ) : []
                        )}
                        {this.props.canRemix ? remixButton : []}
                    </div>
                    <div className={classNames(styles.menuBarItem, styles.communityButtonWrapper)}>
                        {this.props.enableCommunity ? (
                            (this.props.isShowingProject || this.props.isUpdating) && (
                                <ProjectWatcher onDoneUpdating={this.props.onSeeCommunity}>
                                    {
                                        waitForUpdate => (
                                            <CommunityButton
                                                className={styles.menuBarButton}
                                                /* eslint-disable react/jsx-no-bind */
                                                onClick={() => {
                                                    this.handleClickSeeCommunity(waitForUpdate);
                                                }}
                                            /* eslint-enable react/jsx-no-bind */
                                            />
                                        )
                                    }
                                </ProjectWatcher>
                            )
                        ) : (this.props.showComingSoon ? (
                            <MenuBarItemTooltip id="community-button">
                                <CommunityButton className={styles.menuBarButton} />
                            </MenuBarItemTooltip>
                        ) : [])}
                    </div>
                    <div className={classNames(styles.menuBarItem)}>
                        {/* {this.props.isSmallDevic ? ( */}
                        <div className={styles.tabList}>
                            <div className={classNames(styles.tab, styles.tabLeft, this.props.selectedTabIndex === 0 ? styles.active : null)}
                                onClick={this.handleClickCodeTab}>
                                <img draggable={false} src={codeIcon} />
                            </div>
                            <div className={classNames(styles.tab, styles.tabMiddle, this.props.selectedTabIndex === 1 ? styles.active : null)}
                                onClick={this.handleClickCostumesTab}>
                                <img draggable={false} src={costumesIcon} />
                            </div>
                            <div className={classNames(styles.tab, styles.tabMiddle, this.props.selectedTabIndex === 2 ? styles.active : null)}
                                onClick={this.handleClickSoundsTab}>
                                <img draggable={false} src={soundsIcon} />
                            </div>
                            <div className={classNames(styles.tab, styles.tabRight, this.props.selectedTabIndex === 3 ? styles.active : null)}
                                onClick={this.handleClickStageTab}>
                                <img draggable={false} src={stageIcon} />
                            </div>
                        </div>
                        {/* ) : null} */}
                    </div>
                </div>
                {/* show the proper UI in the account menu, given whether the user is
                logged in, and whether a session is available to log in with */}
                <div className={styles.accountInfoGroup}>
                    {this.props.canSave && (
                        <div className={classNames(styles.menuBarItem, styles.hoverable)}>
                            <SaveStatus />
                        </div>
                    )}
                    {/* 项目列表按钮 */}
                    {this.props.localProjectsVisible && (
                        <div className={classNames(styles.menuBarItem, styles.hoverable)} onClick={this.handleClickUserProjects}>
                            <div>
                                <img draggable={false} src={gridIcon} />
                            </div>
                        </div>
                    )}
                    {this.props.sessionExists ? (
                        this.props.username ? (
                            // ************ user is logged in ************
                            <React.Fragment>
                                <a href="/mystuff/">
                                    <div
                                        className={classNames(
                                            styles.menuBarItem,
                                            styles.hoverable,
                                            styles.mystuffButton
                                        )}
                                    >
                                        <img
                                            className={styles.mystuffIcon}
                                            src={mystuffIcon}
                                        />
                                    </div>
                                </a>
                                <AccountNav
                                    className={classNames(
                                        styles.menuBarItem,
                                        styles.hoverable,
                                        { [styles.active]: this.props.accountMenuOpen }
                                    )}
                                    isOpen={this.props.accountMenuOpen}
                                    isRtl={this.props.isRtl}
                                    menuBarMenuClassName={classNames(styles.menuBarMenu)}
                                    onClick={this.props.onClickAccount}
                                    onClose={this.props.onRequestCloseAccount}
                                    onLogOut={this.props.onLogOut}
                                />
                            </React.Fragment>
                        ) : (
                            // ********* user not logged in, but a session exists
                            // ********* so they can choose to log in
                            <React.Fragment>
                                <div
                                    className={classNames(
                                        styles.menuBarItem,
                                        styles.hoverable
                                    )}
                                    key="join"
                                    onMouseUp={this.props.onOpenRegistration}
                                >
                                    <FormattedMessage
                                        defaultMessage="Join Scratch"
                                        description="Link for creating a Scratch account"
                                        id="gui.menuBar.joinScratch"
                                    />
                                </div>
                                <div
                                    className={classNames(
                                        styles.menuBarItem,
                                        styles.hoverable
                                    )}
                                    key="login"
                                    onMouseUp={this.props.onClickLogin}
                                >
                                    <FormattedMessage
                                        defaultMessage="Sign in"
                                        description="Link for signing in to your Scratch account"
                                        id="gui.menuBar.signIn"
                                    />
                                    <LoginDropdown
                                        className={classNames(styles.menuBarMenu)}
                                        isOpen={this.props.loginMenuOpen}
                                        isRtl={this.props.isRtl}
                                        renderLogin={this.props.renderLogin}
                                        onClose={this.props.onRequestCloseLogin}
                                    />
                                </div>
                            </React.Fragment>
                        )
                    ) : (
                        // ******** no login session is available, so don't show login stuff
                        <React.Fragment>
                            {this.props.showComingSoon ? (
                                <React.Fragment>
                                    <MenuBarItemTooltip id="mystuff">
                                        <div
                                            className={classNames(
                                                styles.menuBarItem,
                                                styles.hoverable,
                                                styles.mystuffButton
                                            )}
                                        >
                                            <img
                                                className={styles.mystuffIcon}
                                                src={mystuffIcon}
                                            />
                                        </div>
                                    </MenuBarItemTooltip>
                                    <MenuBarItemTooltip
                                        id="account-nav"
                                        place={this.props.isRtl ? 'right' : 'left'}
                                    >
                                        <div
                                            className={classNames(
                                                styles.menuBarItem,
                                                styles.hoverable,
                                                styles.accountNavMenu
                                            )}
                                        >
                                            <img
                                                className={styles.profileIcon}
                                                src={profileIcon}
                                            />
                                            <span>
                                                {'scratch-cat'}
                                            </span>
                                            <img
                                                className={styles.dropdownCaretIcon}
                                                src={dropdownCaret}
                                            />
                                        </div>
                                    </MenuBarItemTooltip>
                                </React.Fragment>
                            ) : []}
                        </React.Fragment>
                    )}
                </div>

                {aboutButton}
            </Box>
        );
    }
}

MenuBar.propTypes = {
    aboutMenuOpen: PropTypes.bool,
    accountMenuOpen: PropTypes.bool,
    authorId: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
    authorThumbnailUrl: PropTypes.string,
    authorUsername: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
    autoUpdateProject: PropTypes.func,
    canChangeLanguage: PropTypes.bool,
    canCreateCopy: PropTypes.bool,
    canCreateNew: PropTypes.bool,
    canEditTitle: PropTypes.bool,
    canManageFiles: PropTypes.bool,
    canRemix: PropTypes.bool,
    canSave: PropTypes.bool,
    canShare: PropTypes.bool,
    tutorialButtonVisible: PropTypes.bool,
    className: PropTypes.string,
    confirmReadyToReplaceProject: PropTypes.func,
    editMenuOpen: PropTypes.bool,
    editMenuVisable: PropTypes.bool,
    enableCommunity: PropTypes.bool,
    fileMenuOpen: PropTypes.bool,
    intl: intlShape,
    isRtl: PropTypes.bool,
    isShared: PropTypes.bool,
    isShowingProject: PropTypes.bool,
    isUpdating: PropTypes.bool,
    languageMenuOpen: PropTypes.bool,
    locale: PropTypes.string.isRequired,
    localProjectsVisible: PropTypes.bool,
    loginMenuOpen: PropTypes.bool,
    logo: PropTypes.string,
    onClickAbout: PropTypes.oneOfType([
        PropTypes.func, // button mode: call this callback when the About button is clicked
        PropTypes.arrayOf( // menu mode: list of items in the About menu
            PropTypes.shape({
                title: PropTypes.string, // text for the menu item
                onClick: PropTypes.func // call this callback when the menu item is clicked
            })
        )
    ]),
    onClickAccount: PropTypes.func,
    onClickEdit: PropTypes.func,
    onClickFile: PropTypes.func,
    onClickLanguage: PropTypes.func,
    onClickLogin: PropTypes.func,
    onClickLogo: PropTypes.func,
    onClickNew: PropTypes.func,
    onClickRemix: PropTypes.func,
    onClickSave: PropTypes.func,
    onClickSaveAsCopy: PropTypes.func,
    onClickCodeTab: PropTypes.func,
    onClickCostumesTab: PropTypes.func,
    onClickSoundsTab: PropTypes.func,
    onTabSelect: PropTypes.func,
    onLogOut: PropTypes.func,
    onOpenRegistration: PropTypes.func,
    onOpenTipLibrary: PropTypes.func,
    onProjectTelemetryEvent: PropTypes.func,
    onRequestOpenAbout: PropTypes.func,
    onRequestCloseAbout: PropTypes.func,
    onRequestCloseAccount: PropTypes.func,
    onRequestCloseEdit: PropTypes.func,
    onRequestCloseFile: PropTypes.func,
    onRequestCloseLanguage: PropTypes.func,
    onRequestCloseLogin: PropTypes.func,
    onSeeCommunity: PropTypes.func,
    onShare: PropTypes.func,
    onStartSelectingFileUpload: PropTypes.func,
    onToggleLoginOpen: PropTypes.func,
    projectTitle: PropTypes.string,
    renderLogin: PropTypes.func,
    sessionExists: PropTypes.bool,
    shouldSaveBeforeTransition: PropTypes.func,
    showComingSoon: PropTypes.bool,
    userOwnsProject: PropTypes.bool,
    username: PropTypes.string,
    selectedTabIndex: PropTypes.number,
    vm: PropTypes.instanceOf(VM).isRequired
};

MenuBar.defaultProps = {
    logo: scratchLogo,
    localProjectsVisible: false,
    onShare: () => { },
    onClickCodeTab: () => { },
    onClickCostumesTab: () => { },
    onClickSoundsTab: () => { },
};

const mapStateToProps = (state, ownProps) => {
    const loadingState = state.scratchGui.projectState.loadingState;
    const user = state.session && state.session.session && state.session.session.user;
    return {
        aboutMenuOpen: aboutMenuOpen(state),
        accountMenuOpen: accountMenuOpen(state),
        fileMenuOpen: fileMenuOpen(state),
        editMenuOpen: editMenuOpen(state),
        isRtl: state.locales.isRtl,
        isUpdating: getIsUpdating(loadingState),
        isShowingProject: getIsShowingProject(loadingState),
        languageMenuOpen: languageMenuOpen(state),
        locale: state.locales.locale,
        loginMenuOpen: loginMenuOpen(state),
        projectTitle: state.scratchGui.projectTitle,
        sessionExists: state.session && typeof state.session.session !== 'undefined',
        username: user ? user.username : null,
        userOwnsProject: ownProps.authorUsername && user &&
            (ownProps.authorUsername === user.username),
        vm: state.scratchGui.vm
    };
};

const mapDispatchToProps = dispatch => ({
    autoUpdateProject: () => dispatch(autoUpdateProject()),
    onOpenTipLibrary: () => dispatch(openTipsLibrary()),
    onClickAccount: () => dispatch(openAccountMenu()),
    onRequestCloseAccount: () => dispatch(closeAccountMenu()),
    onClickFile: () => dispatch(openFileMenu()),
    onRequestCloseFile: () => dispatch(closeFileMenu()),
    onClickEdit: () => dispatch(openEditMenu()),
    onRequestCloseEdit: () => dispatch(closeEditMenu()),
    onClickLanguage: () => dispatch(openLanguageMenu()),
    onRequestCloseLanguage: () => dispatch(closeLanguageMenu()),
    onClickLogin: () => dispatch(openLoginMenu()),
    onRequestCloseLogin: () => dispatch(closeLoginMenu()),
    onRequestOpenAbout: () => dispatch(openAboutMenu()),
    onRequestCloseAbout: () => dispatch(closeAboutMenu()),
    onClickNew: needSave => dispatch(requestNewProject(needSave)),
    onClickRemix: () => dispatch(remixProject()),
    onClickSaveAsCopy: () => dispatch(saveProjectAsCopy()),
    onSeeCommunity: () => dispatch(setPlayer(true)),
    onClickUserProjects: () => dispatch(openUserProjectsModal()),
    onShowSaveSuccessAlert: () => showAlertWithTimeout(dispatch, 'saveSuccess'),
    onShowAlert: alertType => dispatch(showStandardAlert(alertType)),
    setProjectTitle: (title) => { dispatch(setProjectTitle(title)); },
});

export default compose(
    injectIntl,
    MenuBarHOC,
    connect(
        mapStateToProps,
        mapDispatchToProps
    )
)(MenuBar);
