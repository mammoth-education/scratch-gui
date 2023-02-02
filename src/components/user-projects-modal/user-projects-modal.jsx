import bindAll from 'lodash.bindall';
import PropTypes from 'prop-types';
import React from 'react';
import Modal from '../../containers/modal.jsx';
import VM from 'scratch-vm';
import {connect} from 'react-redux';
import {closeUserProjectsModal} from '../../reducers/modals';
import UniversalPopup from '../universal-popup/universal-popup.jsx'
import styles from './user-projects-modal.css';
import { FormattedMessage } from 'react-intl';
// 我的项目列表
class UserProjectsModal extends React.Component {
    constructor (props) {
        super(props);
        bindAll(this, [
            'createHandleOpenProject',
            'createList',
            'controlPopup'
        ]);
        this.state = {flag:false,popupDisplay:false,content:"你确定删除所选数据？",deleteID:null,deleteName:null};
    }
    createDateTime (tiem){
      var date = new Date(tiem);
      var Y = date.getFullYear() + '/';
      var M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '/';
      // var D = date.getDate() + ' ';
      var D = date.getDate() < 10 ? "0" + date.getDate() + ' ' : date.getDate() + ' ';
      var h = date.getHours() + ':';
      var m = date.getMinutes() < 10 ? "0" + (date.getMinutes()) : date.getMinutes();
      var s = date.getSeconds(); 
      // Y+M+D+h+m+s
      return Y+M+D+h+m
    }
    createHandleOpenProject (id, name) {
        return () => {
            this.props.onOpenProject(id, name);
        }
    }

    controlPopup (id,name) {
      return ()=>{
        console.log(id,name);
        let popupDisplay = this.state.popupDisplay;
        this.setState({popupDisplay:!popupDisplay,deleteID:id,deleteName:name})
      }
    }

    determine = ()=> {
      this.props.onDeleProject(this.state.deleteID,this.state.deleteName);
      let popupDisplay = this.state.popupDisplay;
      this.setState({popupDisplay:!popupDisplay,deleteID:null,deleteName:null})
    }
    cancel = () =>{
      console.log("cancel");
      let popupDisplay = this.state.popupDisplay;
      this.setState({popupDisplay:!popupDisplay})
    }
    createList () {
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
                    <span className={styles.itemName}>
                        {projectList[id].name}
                    </span>
                    <div className={styles.itemTime}>
                      {this.createDateTime(projectList[id].updateDate)}
                    </div>

                  </div>
                  <div className={styles.itemAction}>
                      <button
                          className={styles.openButton}
                          onClick={this.createHandleOpenProject(id, projectList[id].name)}
                      >
                        <FormattedMessage
                            defaultMessage="打开"
                            description="打开"
                            id="gui.gui.codeTab"
                        />
                      </button>
                      <button 
                        onClick={this.controlPopup(id,projectList[id].name)}>
                        <FormattedMessage
                              defaultMessage="删除"
                              description="删除"
                              id="gui.gui.lostPeripheralConnection"
                          />
                      </button>
                  </div>
                </div>
            </div>
        ));
    }

    render () {
        return (
            <Modal
                fullScreen
                contentLabel={this.props.title}
                id="userProjectsModal"
                onRequestClose={this.props.onClose}
            >
                <div className={styles.modalContent}>
                    {this.createList()}
                </div>
                {this.state.popupDisplay ? <UniversalPopup determine={this.determine} cancel={this.cancel} content={this.state.content}/> : null}
            </Modal>
            
    )}
}

UserProjectsModal.propTypes = {
    vm: PropTypes.instanceOf(VM).isRequired,
    onClose: PropTypes.func.isRequired,
    title: PropTypes.string,
    onOpenProject: PropTypes.func,
    onDeleProject: PropTypes.func,
}

const mapStateToProps = state => ({
    
});

const mapDispatchToProps = dispatch => ({
    onClose: () => { dispatch(closeUserProjectsModal()); },
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(UserProjectsModal);