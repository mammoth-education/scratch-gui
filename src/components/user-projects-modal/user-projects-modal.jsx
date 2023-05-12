import bindAll from 'lodash.bindall';
import PropTypes from 'prop-types';
import React from 'react';
import Modal from '../../containers/modal.jsx';
import VM from 'scratch-vm';
import { connect } from 'react-redux';
import { closeUserProjectsModal } from '../../reducers/modals';
import UniversalPopup from '../universal-popup/universal-popup.jsx'
import styles from './user-projects-modal.css';
import { FormattedMessage ,defineMessages,injectIntl, intlShape} from 'react-intl';
import Alerts from '../../containers/alerts.jsx';
import {
    showAlertWithTimeout,
} from '../../reducers/alerts';
let content = <>
    <p>
        <FormattedMessage
            defaultMessage="删除提示"
            description="删除提示"
            id="gui.project.deleteTips"
        />
    </p>
</>
class UserProjectsModal extends React.Component {
    constructor(props) {
        super(props);
        bindAll(this, [
            'createHandleOpenProject',
            'createList',
            'controlPopup',
            'reflashList',
        ]);
        this.state = { popupDisplay: false, deleteName: null ,projectList:[],};
    }
    componentDidMount(){
        // 在这里调用 getProjectList 的原因是 getProjectList 是异步操作的，导致无法第一时间获取文件目录从而渲染是空的
        // this.reflashList();
    }
    reflashList() {
        this.getProjectList().then((res) => {
            let projectList = res;
            this.setState({ projectList:projectList });
        }).catch((error) => {
            console.log(error);
        });
    }
    createDateTime(time) {
        var date = new Date(time);
        var Y = date.getFullYear() + '/';
        var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '/';
        // var D = date.getDate() + ' ';
        var D = date.getDate() < 10 ? "0" + date.getDate() + ' ' : date.getDate() + ' ';
        var h = date.getHours() + ':';
        var m = date.getMinutes() < 10 ? "0" + (date.getMinutes()) : date.getMinutes();
        var s = date.getSeconds();
        // Y+M+D+h+m+s
        return Y + M + D + h + m
    }
    createHandleOpenProject(id, name) {
        return () => {
            name += ".sb3";
            this.props.onOpenProject(id, name);
        }
    }

    controlPopup(id, name) {
        return () => {
            console.log(id, name);
            let popupDisplay = this.state.popupDisplay;
            this.setState({ popupDisplay: !popupDisplay, deleteID: id, deleteName: name })
        }
    }

    delete = () => {
        console.log(this.state.deleteID)
        this.props.onShowDeletedSuccessfullyAlert();
        this.props.onDeleteProject(this.state.deleteID, this.state.deleteName);
        let popupDisplay = this.state.popupDisplay;
        // this.reflashList();
        this.setState({ popupDisplay: !popupDisplay, deleteID: null, deleteName: null })
    }
    cancel = () => {
        console.log("cancel");
        let popupDisplay = this.state.popupDisplay;
        this.setState({ popupDisplay: !popupDisplay })
    }
    // 获取文件目录列表
	getProjectList = () => {
		return new Promise((resolve, reject) => {
            let url = cordova.file.externalDataDirectory;
            if(cordova.platformId == "ios"){
                url = cordova.file.documentsDirectory;
            }
		    window.resolveLocalFileSystemURL(url + "MyProject", (dirEntry) => {
                var dirReader = dirEntry.createReader();
                dirReader.readEntries((files) => {
                var projectList = [];
                for (var i = 0; i < files.length; i++) {
                    projectList.push(files[i].name.replace(".sb3",""));
                    
                }
                Promise.all(projectList.map((filename) => {
                            return this.getLastModifiedDate(url + "MyProject/" + filename + ".sb3");
                    })).then((modificationDates) => {
                        for (let i = 0; i < projectList.length; i++) {
                            projectList[i] = {name: projectList[i], time: modificationDates[i]};
                        }
                        resolve(projectList);
                    }).catch((error) => {
                        reject(error);
                    });
                });
		    }, (error) => {
			reject(error);
		    });
		});
	}
    // 获取文件最后修改时间
    getLastModifiedDate = (filepath) => {
        return new Promise((resolve, reject) => {
            window.resolveLocalFileSystemURL(filepath, (fileEntry) => {
                fileEntry.getMetadata((metadata) => {
                    resolve(this.createDateTime(metadata.modificationTime));
                }, (error) => {
                    reject(error);
                });
            }, (error) => {
                reject(error);
            });
        });
    }
     createList() {
        let projectList = localStorage.getItem('project-list') || "{}";
        projectList = JSON.parse(projectList);
        return Object.keys(projectList).map((id) => (
            <div
                className={styles.item}
                key={id}
                onMouseEnter={this.handleItemMouseEnter}
                onMouseLeave={this.handleItemMouseLeave}
            >
                <div className={styles.itemDescribe}>
                    <div>
                        <div className={styles.itemName}>
                            <span> {projectList[id].name} </span>
                        </div>
                        <div className={styles.itemTime}>
                            <span> {this.createDateTime(projectList[id].updateDate)} </span>
                        </div>
                    </div>
                    <div className={styles.itemAction}>
                        <button className={styles.delete}
                            onClick={this.controlPopup(id, projectList[id].name)}>
                            <FormattedMessage
                                defaultMessage="删除"
                                description="删除"
                                id="gui.soundEditor.delete"
                            />
                        </button>
                        <button
                            className={styles.openButton}
                            onClick={this.createHandleOpenProject(id, projectList[id].name)}
                        >
                            <FormattedMessage
                                defaultMessage="打开"
                                description="打开"
                                id="gui.userProjectModel.openCode"
                            />
                        </button>
                    </div>
                </div>
            </div>
        ));
    }
    render() {
        return (
            <Modal
                fullScreen
                contentLabel={this.props.title}
                id="userProjectsModal"
                onRequestClose={this.props.onClose}
            >
                {this.props.alertsVisible && !this.state.popupDisplay ? (
                    <Alerts className={styles.alertsContainer} />
                ) : null}
                <div className={styles.modalContent}>
                    {this.createList()}
                </div>
                {this.state.popupDisplay && <UniversalPopup determine={this.delete} cancel={this.cancel} content={content}  buttonShow={true}/>}
            </Modal>
        )
    }
}

UserProjectsModal.propTypes = {
    vm: PropTypes.instanceOf(VM).isRequired,
    onClose: PropTypes.func.isRequired,
    title: PropTypes.string,
    onOpenProject: PropTypes.func,
    onDeleteProject: PropTypes.func,
}

const mapStateToProps = state => ({

});

const mapDispatchToProps = dispatch => ({
    onClose: () => { dispatch(closeUserProjectsModal()); },
    onShowDeletedSuccessfullyAlert: () => showAlertWithTimeout(dispatch, 'deletedSuccessfully'),
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(UserProjectsModal);