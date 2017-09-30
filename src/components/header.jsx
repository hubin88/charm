/**
 * Created by huoban-xia on 2017/5/9.
 */

import React, { Component, PropTypes } from 'react';
import './header.scss';

export default class Header extends Component {
  static propTypes = {
    title: PropTypes.any,
    hasLeftBtnIcon: PropTypes.bool,
    hasTop: PropTypes.bool,
    leftBtnTxt: PropTypes.any,
    rightBtnTxt: PropTypes.any,
    leftBtnCallBack: PropTypes.func,
    rightBtnCallBack: PropTypes.func,
  };
  static defaultProps = {
    title: '',
    hasTop:true,
    hasLeftBtnIcon: true,
    leftBtnTxt: '',
    rightBtnTxt: '保存',
  };

  leftBtnClick = () => {
    if (this.props.leftBtnCallBack) this.props.leftBtnCallBack();
  };

  rightBtnClick = () => {
    if (this.props.rightBtnCallBack) this.props.rightBtnCallBack();
  };

  render() {
    const {
      title,leftBtnCallBack, leftBtnTxt, hasLeftBtnIcon, rightBtnCallBack, rightBtnTxt,hasTop
    } = this.props;
    return (
      <div styleName="header">
        {
          hasTop ? <div styleName="top" /> : null
        }
        <div styleName="title-box">
          {
            leftBtnCallBack ?
              <button
                styleName={`left-btn ${hasLeftBtnIcon ? 'left-btn-icon' : ''}`}
                onTouchEnd={this.leftBtnClick}
              >
                {leftBtnTxt}
              </button> : null
          }
          <div styleName="title">{title}</div>
          {
            rightBtnCallBack ?
              <button styleName="right-btn" onTouchEnd={this.rightBtnClick}>
                {rightBtnTxt}
              </button> : null
          }
        </div>
      </div>
    );
  }
}

