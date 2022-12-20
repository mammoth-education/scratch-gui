import React from "react";
import style from "./stage-virtual-keyboard.css";
import PropTypes from 'prop-types';


class VirtualKey extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      timeout: null,
      interval: null,
    };
    this.pressKey = this.pressKey.bind(this);
    this.releaseKey = this.releaseKey.bind(this);
    this.onPressed = this.onPressed.bind(this);
    this.onReleased = this.onReleased.bind(this);
    this.onMove = this.onMove.bind(this);
  }

  pressKey(key) {
    let event = new KeyboardEvent("keydown", { key: key });
    document.dispatchEvent(event);
  }

  releaseKey(key) {
    let event = new KeyboardEvent("keyup", { key: key });
    document.dispatchEvent(event);
  }

  onPressed(e) {
    e.preventDefault();
    this.pressKey(this.props.keyName);
    let timeout = setTimeout(() => {
      let interval = setInterval(() => {
        this.pressKey(this.props.keyName);
      }, 50);
      this.setState({ interval: interval });
    }, 500);
    this.setState({ timeout: timeout });
  }

  onReleased() {
    this.releaseKey(this.props.keyName);
    clearTimeout(this.state.timeout);
    clearInterval(this.state.interval);
  }

  onMove(e) {
    if (e.buttons === 1) {
      this.onPressed(e);
    }
  }

  render () {
    return (
      <button className={style.key}
          onMouseDown={this.onPressed}
          onMouseUp={this.onReleased}
          onTouchStart={this.onPressed}
          onTouchEnd={this.onReleased}
      >
        <img className={style.keyIcon} src={this.props.icon} />
      </button>
    )
  }
}

VirtualKey.propTypes = {
  keyName: PropTypes.string.isRequired,
  icon: PropTypes.string.isRequired,
}

export default VirtualKey;