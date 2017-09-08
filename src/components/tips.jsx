/**
 * Created by admin on 2016/11/2.
 */
import React, { Component, PropTypes } from 'react';
import './tips.scss';
import { insertComponent, removeComponentByRef } from '../ultils/helper';

class TipsWrap extends Component {
  static propTypes = {
    content: PropTypes.string,
    parentRef: PropTypes.any,
    time: PropTypes.number,
    onDisappear: PropTypes.func,
  };

  componentDidMount() {
    this.layout();
    this.timer = setTimeout(() => {
      this.close();
    }, this.props.time || 1500);
  }

  componentWillUnmount() {
    clearTimeout(this.timer);
    this.timer = null;
  }

  layout() {
    let rect;
    if (this.props.parentRef === undefined) {
      const e = document.documentElement;
      rect = { left: 0, top: 0, width: e.clientWidth, height: e.clientHeight };
    } else {
      rect = this.props.parentRef.getBoundingClientRect();
    }
    const r = this.tips.getBoundingClientRect();
    const left = rect.left + ((rect.width - r.width) / 2);
    const top = rect.top + ((rect.height - r.height) / 2);
    const style = `top: ${top}px; left:${left}px;`;
    this.tips.setAttribute('style', style);
  }

  close() {
    if (this.props.onDisappear) this.props.onDisappear();
    removeComponentByRef(this.tips);
  }

  render() {
    return (
      <div
        ref={(ref) => {
          this.tips = ref;
        }} styleName="tips"
      >
        {this.props.content}
      </div>
    );
  }
}

export default class Tips extends TipsWrap {
  static show(param, ref = undefined) {
    if (typeof param === 'object' && param.length !== 0) {
      insertComponent(<TipsWrap {...param} parentRef={ref} />);
    } else if (typeof param === 'string') {
      insertComponent(<TipsWrap content={param} parentRef={ref} />);
    }
  }
}

