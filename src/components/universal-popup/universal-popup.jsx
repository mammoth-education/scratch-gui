import React, { Component } from 'react';
import styles from './universal-popup.css';
import { FormattedMessage } from 'react-intl';

export default class UniversalPopup extends Component {
  constructor(props){
    super(props);        
  };


  render() {
    return (
      <div className={styles.box}>
        <div className={styles.boos}>
          <div className={styles.header}></div>
          <div className={styles.middle}>
            <p>{this.props.content}</p>
            <button onClick={this.props.determine}>
              <FormattedMessage
                defaultMessage="删除"
                description="删除"
                id="gui.prompt.ok"
              />
            </button>
            <button onClick={this.props.cancel}>
              <FormattedMessage
                defaultMessage="删除"
                description="删除"
                id="gui.prompt.cancel"
              />
            </button>
          </div>

        </div>
      </div>
    )
  }
}
