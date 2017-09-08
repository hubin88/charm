/**
 * Created by hubin on 2017/8/30.
 */

import React, { Component, PropTypes } from 'react';
import './alert.scss';
import { insertComponent, removeComponentByRef } from '../ultils/helper';

class AlertWrap extends Component {
  static propTypes = {
    content: PropTypes.any,
    parentRef: PropTypes.any,
    onDisappear: PropTypes.func,
  };
  static childContextTypes = {
    close:PropTypes.func
  };

  componentDidMount() {
    this.layout();
  }

  layout() {
    let rect;
    if (this.props.parentRef === undefined) {
      const e = document.documentElement;
      rect = { left: 0, top: 0, width: e.clientWidth, height: e.clientHeight };
    } else {
      rect = this.props.parentRef.getBoundingClientRect();
    }
    const r = this.alert.getBoundingClientRect();
    const left = rect.left + ((rect.width - r.width) / 2);
    const top = rect.top + ((rect.height - r.height) / 2);
    const style = `top: ${top}px; left:${left}px;`;
    this.alert.setAttribute('style', style);
  }

  getChildContext = () => {
    return {
      close: this.close
    }
  };
  close = () => {
    // if (this.props.onDisappear) this.props.onDisappear();
    removeComponentByRef(this.alert);
  };

  render() {
    return (
      <div>
        <div styleName="alert-mask" onTouchEnd={this.close} />
        <div
          ref={(ref) => {
            this.alert = ref;
          }} styleName="alert"
        >
          {this.props.content}
        </div>
      </div>
    );
  }
}

export default class Alert extends AlertWrap {
  static show(param, ref = undefined) {
    if (typeof param === 'object' && param.length !== 0) {
      insertComponent(<AlertWrap {...param} parentRef={ref} />);
    }
  }
}