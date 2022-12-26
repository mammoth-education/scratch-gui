import bindAll from 'lodash.bindall';
import PropTypes from 'prop-types';
import React from 'react';
import Modal from '../../containers/modal.jsx';
import VM from 'scratch-vm';
import {connect} from 'react-redux';
import {closeUserProjectsModal} from '../../reducers/modals';

import LocalStorage from '../../lib/local-storage/local-storage.js';

import styles from './user-projects-modal.css';

class UserProjectsModal extends React.Component {
    constructor (props) {
        super(props);
        bindAll(this, [
            'createHandleOpenProject',
            'createList',
        ]);
        this.state = {
            projectList: null,
        };
    }
    componentDidMount () {
        this.setState({
            projectList: LocalStorage.ProjectList,
        });
    }

    createHandleOpenProject (id, name) {
        return () => {
            this.props.onOpenProject(id, name);
        }
    }

    createList () {
        let projectList = LocalStorage.ProjectList;
        return Object.keys(projectList).map((id) => (
            <div 
                className={styles.item}
                key={id}
                onMouseEnter={this.handleItemMouseEnter}
                onMouseLeave={this.handleItemMouseLeave}
            >
                <div className={styles.itemName}>
                    {projectList[id].name}
                </div>
                <div className={styles.itemDate}>
                    {projectList[id].updateDate}
                </div>
                <div className={styles.itemAction}>
                    <button
                        className={styles.openButton}
                        onClick={this.createHandleOpenProject(id, projectList[id].name)}
                    >
                        打开
                    </button>
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
            </Modal>
    )}
}

UserProjectsModal.propTypes = {
    vm: PropTypes.instanceOf(VM).isRequired,
    onClose: PropTypes.func.isRequired,
    title: PropTypes.string,
    onOpenProject: PropTypes.func,
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