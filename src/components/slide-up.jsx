/**
 * Created by hubin on 2017/9/14.
 */

import React, { Component, PropTypes } from 'react';
import './slide-up.scss';
import { insertComponent, removeComponentByRef } from '../ultils/helper';

class Slide extends Component {
  static propTypes = {
    content: PropTypes.any,
    parentRef: PropTypes.any,
  };
  static childContextTypes = {
    close: PropTypes.func
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
    const style = `width: ${rect.width}px;`;
    this.slide.setAttribute('style', style);
  }

  getChildContext = () => {
    return {
      close: this.close
    }
  };
  close = () => {
    removeComponentByRef(this.slide.parentNode);
  };

  render() {
    return (
      <div>
        <div styleName="alert-mask" onTouchEnd={this.close} />
        <div
          styleName="slide-up"
          ref={(ref) => {
            this.slide = ref;
          }}
        >
          {this.props.content}
        </div>
      </div>
    );
  }
}

export default class SlideUp extends Slide {
  static show(param, ref = undefined) {
    if (typeof param === 'object' && param.length !== 0) {
      insertComponent(<Slide {...param} parentRef={ref} />);
    }
  }
}