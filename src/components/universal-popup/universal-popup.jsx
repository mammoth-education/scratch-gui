import React, { Component } from 'react';
import styles from './universal-popup.css';

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
            <button onClick={this.props.determine}>确定</button>
            <button onClick={this.props.cancel}>取消</button>
          </div>

        </div>
      </div>
    )
  }
}
