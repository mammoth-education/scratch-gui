import bindAll from 'lodash.bindall';
import PropTypes from 'prop-types';
import React from 'react';
import Modal from '../../containers/modal.jsx';
import VM from 'scratch-vm';
import {connect} from 'react-redux';
import {closeUserProjectsModal} from '../../reducers/modals';

class UserProjectsModal extends React.Component {
    constructor (props) {
        super(props);
        bindAll(this, [
            'getUserProjectsFromLocal',
        ]);
        this.state = {
            userProjects: [],
        };
    }
    getUserProjectsFromLocal () {
        const userProjects = JSON.parse(localStorage.getItem('userProjects'));
        if (userProjects) {
            this.setState({userProjects});
        }
    }

    componentDidMount () {
        this.getUserProjectsFromLocal();
    }

    render () {
        return (
            <Modal
                fullScreen
                contentLabel={this.props.title}
                id="userProjectsModal"
                onRequestClose={this.props.onClose}
            >
                <div className="user-projects-modal-content">
                    {this.state.userProjects.map((project, index) => (
                        <div
                            className="user-projects-modal-item"
                            key={index}
                            onMouseEnter={this.handleItemMouseEnter}
                            onMouseLeave={this.handleItemMouseLeave}
                        >
                            <div className="user-projects-modal-item-title">
                                {project.title}
                            </div>
                            <div className="user-projects-modal-item-description">
                                {project.description}
                            </div>
                            <div className="user-projects-modal-item-date">
                                {project.date}
                            </div>
                        </div>
                    ))}
                </div>
            </Modal>
    )}
}

UserProjectsModal.propTypes = {
    vm: PropTypes.instanceOf(VM).isRequired,
    onClose: PropTypes.func.isRequired,
    title: PropTypes.string,
}

const mapStateToProps = state => ({
});

const mapDispatchToProps = dispatch => ({
    onClose: () => {
        dispatch(closeUserProjectsModal());
    },
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(UserProjectsModal);