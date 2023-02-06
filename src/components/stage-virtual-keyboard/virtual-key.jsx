import React from "react";
import style from "./stage-virtual-keyboard.css";
import PropTypes from 'prop-types';
import bindAll from "lodash.bindall";
import classNames from "classnames";


class VirtualKey extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      pressed: false,
      timeout: null,
      interval: null,
    };
    bindAll(this, [
      "pressKey",
      "releaseKey",
      "onPressed",
      "onReleased",
    ])
  }

  pressKey(key, repeat=false) {
    let event = new KeyboardEvent("keydown", { key: key, repeat: repeat });
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
        this.pressKey(this.props.keyName, true);
      }, 50);
      this.setState({ interval: interval });
    }, 500);
    this.setState({
      pressed: true,
      timeout: timeout
    });
  }

  onReleased(e) {
    if (this.state.pressed === false) {
      return;
    }
    e.preventDefault();
    this.releaseKey(this.props.keyName);
    clearTimeout(this.state.timeout);
    clearInterval(this.state.interval);
    this.setState({
      pressed: false,
      timeout: null,
      interval: null
    });
  }

  render () {
    return (
      <button className={classNames(
        style.key,
        this.state.pressed ? style.pressed : null
      )}
          onMouseLeave={this.onReleased}
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