/**
 * Created by huoban-xia on 2017/5/9.
 */

import React, { Component, PropTypes } from 'react';
import { trim } from '../../ultils/tools';
import './information.scss';

export default class Information extends Component {
  static propTypes = {
    index: PropTypes.number,
    checkRight: PropTypes.func,
    isRequired: PropTypes.object,
  };

  constructor(props) {
    super(props);
    this.state = {
      fullName: "",
      telphone: "",
      idNumber: "",
      isFullNameRight: false,
      isTelphoneRight: false,
      isIdNumberRight: false,
      style: {
        width: 'auto'
      }
    };
  }

  componentDidMount() {
    setTimeout(this.getSize, 0);
  }

  getSize = () => {
    const e = document.documentElement;
    const rect = { width: e.clientWidth };
    this.setState({
      style: {
        width: rect.width - 102 + 'px'
      }
    });
  };
  handleChange = (e) => {
    const name = e.target.name;
    const maxLen = parseInt(e.target.getAttribute("maxLength"), 10);
    let value;
    switch (name) {
      case "fullName":
        value = trim(e.target.value);
        const regName = /^[A-Za-z\u4e00-\u9fa5]{2,5}$/g;
        if (regName.test(value)) {
          this.setState({
            isFullNameRight: true,
          }, () => {
            this.callBack()
          });
        } else {
          this.setState({
            isFullNameRight: false,
          }, () => {
            this.callBack()
          });
        }
        break;
      case "telphone":
        value = e.target.value.replace(/\D/g, '');
        if (value.length > maxLen) {
          value = value.substr(0, maxLen);
        }
        const regTel = /^1[34578]{1}[0-9]{9}$/;
        if (regTel.test(value)) {
          this.setState({
            isTelphoneRight: true,
          }, () => {
            this.callBack()
          });
        } else {
          this.setState({
            isTelphoneRight: false,
          }, () => {
            this.callBack()
          });
        }
        break;
      case "idNumber":
        value = e.target.value.replace(/[^0-9X]/ig, '');
        if (value.length > maxLen) {
          value = value.substr(0, maxLen);
        }
        const regId = /(^\d{15}$)|(^\d{17}([0-9]|X)$)/i;
        if (regId.test(value)) {
          this.setState({
            isIdNumberRight: true,
          }, () => {
            this.callBack()
          });
        } else {
          this.setState({
            isIdNumberRight: false,
          }, () => {
            this.callBack()
          });
        }
        break;
    }
    this.setState({
      [name]: value,
    });

  };
  callBack = () => {
    const { isFullNameRight, isTelphoneRight, isIdNumberRight, fullName, telphone, idNumber } = this.state;
    const {isRequired:{nameRequired,phoneRequired,idRequired}}=this.props;
    let flagObj = {};
    let obj = {};
    if (nameRequired) {
      Object.assign(flagObj, { isFullNameRight });
      Object.assign(obj, { name: fullName, });
    }
    if (phoneRequired) {
      Object.assign(flagObj, { isTelphoneRight });
      Object.assign(obj, { phoneNum: telphone });
    }
    if (idRequired) {
      Object.assign(flagObj, { isIdNumberRight });
      Object.assign(obj, { identity: idNumber });
    }
    this.props.checkRight(this.props.index, flagObj, obj);
  };

  render() {
    const { fullName, telphone, idNumber } = this.state;
    return (
      <div styleName="information">
        {this.props.isRequired.nameRequired ? (
          <span styleName="title">{`报名${this.props.index + 1}`}</span>) : null}
        {this.props.isRequired.nameRequired ?
          (<div>
            <span styleName="left">姓&emsp;&emsp;名</span>
            <span styleName="right" style={this.state.style}>
            <input
              type="text"
              name="fullName"
              placeholder="请输入姓名,2-5个字"
              value={fullName}
              ref={(ref) => {this.fullName = ref;}}
              onChange={this.handleChange}
            />
          </span>
          </div>) : null}
        {this.props.isRequired.phoneRequired ?
          (<div>
            <span styleName="left">手&ensp;机&ensp;号</span>
            <span styleName="right" style={this.state.style}>
            <input
              type="number"
              name="telphone"
              placeholder="请输入手机号"
              value={telphone}
              ref={(ref) => {this.telphone = ref;}}
              maxLength="11"
              onChange={this.handleChange}
            />
          </span>
          </div>) : null}
        {this.props.isRequired.idRequired ?
          (<div>
            <span styleName="left">身份证号</span>
            <span styleName="right" style={this.state.style}>
            <input
              type="text"
              name="idNumber"
              placeholder="请输入身份证号码"
              value={idNumber}
              ref={(ref) => {this.idNumber = ref;}}
              maxLength="18"
              onChange={this.handleChange}
            />
          </span>
          </div>) : null}
      </div>
    );
  }
}

