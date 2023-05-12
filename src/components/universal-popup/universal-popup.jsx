import React, { Component } from 'react';
import styles from './universal-popup.css';
import CloseButton from '../close-button/close-button.jsx';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';

export default class UniversalPopup extends Component {
  constructor(props){
    super(props);        
  };


  render() {
    return (
      <div className={styles.box}>
        <div className={styles.boos}>
          <div className={styles.header}>
            <p className={styles.title}>{this.props.title}</p>
            <div className={styles.closeButton} onClick={this.props.cancel}>
              <CloseButton></CloseButton>
            </div>
          </div>
          <div className={styles.middle}>

            <div>{this.props.content}</div>
            {this.props.buttonShow ? <button onClick={this.props.determine}>
              <FormattedMessage
                defaultMessage="确定"
                description="确定"
                id="gui.prompt.ok"
              />
            </button> : null}
            {this.props.buttonShow ? <button onClick={this.props.cancel}>
              <FormattedMessage
                defaultMessage="取消"
                description="取消"
                id="gui.prompt.cancel"
              />
            </button> : null}
            
          </div>

        </div>
      </div>
    )
  }
}
UniversalPopup.propTypes = {
  cancel: PropTypes.func,
  determine: PropTypes.func,
  buttonShow: PropTypes.bool,
};