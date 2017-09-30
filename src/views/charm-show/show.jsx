/**
 * Created by hubin on 2017/9/8.
 */

import React, { Component, PropTypes } from 'react';
import { browserHistory } from 'react-router';
import './show.scss';

export default class Show extends Component {
  back = () => {
    browserHistory.push('/charm/top');
  };
  render() {
    return (
      <div styleName="show" className="">
        <span styleName="back" onTouchEnd={this.back} />
        <img src={require('../../images/charm/show1.png')} alt="" />
        <img src={require('../../images/charm/show2.png')} alt="" />
        <img src={require('../../images/charm/show3.png')} alt="" />
      </div>
    );
  }
}
