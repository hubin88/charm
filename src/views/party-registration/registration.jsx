/**
 * Created by huoban-xia on 2017/5/9.
 */

import React, { Component, PropTypes } from 'react';
import Information from './information';
import Tips from '../../components/tips';
import { getDevice } from '../../ultils/tools';
import './registration.scss';
import { postAjax, getAjax } from '../../ultils/server';

export default class Registration extends Component {
  static propTypes = {
    device: PropTypes.string,
  };
  static defaultProps = {
    device: getDevice()
  };

  constructor(props) {
    super(props);
    this.state = {
      registrationNumber: 1,//报名人数
      registrationNumberArr: [{}],
      errorItemIndex: -1,//记录通过验证的序号
      peopleContent: [{}],//报名人的信息
      money: 0,
      isRequired: {
        nameRequired: false,
        phoneRequired: false,
        idRequired: false,
      },
    };
    this.partyId = this.props.params.partyId;
    this.userId = this.props.params.userId;
  }

  componentWillMount() {
    getAjax(`${url}/v1/party/field/${this.partyId}`).then((res) => {
      if (res.code === 200) {
        const data = res.data || {};
        this.setState({
          money: data.cost || 0
        });
        this.maxRegisterNum = data.registerNum;
        const list = data.fieldVOList || [];
        const name = list.filter(item => item.fieldName === "姓名");
        const phone = list.filter(item => item.fieldName === "手机号码");
        const id = list.filter(item => item.fieldName === "身份证号码");
        if (name.length > 0) {
          const hasName = name.pop().required === 1;
          this.setState({
            nameRequired: hasName,
            phoneRequired: this.state.isRequired.phoneRequired,
            idRequired: this.state.isRequired.idRequired,
          });
        }
        if (phone.length > 0) {
          const hasPhone = phone.pop().required === 1;
          this.setState({
            isRequired: {
              nameRequired: true,
              phoneRequired: hasPhone,
              idRequired: this.state.isRequired.idRequired,
            }
          });
        }
        if (id.length > 0) {
          const hasId = id.pop().required === 1;
          this.setState({
            isRequired: {
              nameRequired: true,
              phoneRequired: this.state.isRequired.phoneRequired,
              idRequired: hasId
            }
          });
        }
        this.informationChild.callBack();
      }
    }).catch(err => Tips.show(err.message));
  }

  componentDidMount() {
    setTimeout(this.getSize, 0);
  }

  getSize = () => {
    const registrationBox = this.registrationBox.getBoundingClientRect();
    const registrationMoneyBox = this.registrationMoneyBox.getBoundingClientRect();
    const registrationNumberBox = this.registrationNumberBox.getBoundingClientRect();
    const height = registrationBox.height - registrationMoneyBox.height - registrationNumberBox.height - 20;
    const style = `height:${height}px`;
    this.contentBox.setAttribute('style', style);
  };

  handleChange = (e) => {
    let value = e.target.value.replace(/\D/g, '');
    if (parseInt(value, 10) < 1) {
      value = 1
    }
    if (parseInt(value, 10) > 10) {
      value = 10
    }
    if (parseInt(value, 10) > this.maxRegisterNum) {
      value = this.maxRegisterNum;
    }
    this.fillRegistrationNumberArr(value);
    this.setState({
      registrationNumber: value
    })
  };
  defaultVal = (e) => {
    let value = e.target.value;
    if (!value) {
      this.fillRegistrationNumberArr(1);
      this.setState({
        registrationNumber: 1
      })
    }
  };
  fillRegistrationNumberArr = (len) => {
    const difference = len - this.state.registrationNumber;
    if (difference > 0) {
      this.setState({
        registrationNumberArr: [...this.state.registrationNumberArr, ...new Array(difference).fill(false)]
      });
    } else {
      const arr = this.state.registrationNumberArr;
      arr.length = this.state.registrationNumberArr.length + difference;
      this.setState({
        registrationNumberArr: [...arr]
      });
    }

  };
  renderInformation = (flag) => {
    const arr = this.state.registrationNumberArr;
    const len = this.state.registrationNumberArr.length;
    if (flag === "add") {
      if (len < 10) {
        arr.push(false);
      }
    } else {
      if (len > 1) {
        arr.pop();
      }
    }
    this.setState({
      registrationNumberArr: arr,
    }, () => {
      this.informationChild.callBack();
    });
  };
  addNumber = () => {
    if (this.state.registrationNumber === 10 || this.state.registrationNumber >= this.maxRegisterNum) {
      Tips.show(`已达到最大报名人数！`);
    } else {
      this.setState({
        registrationNumber: ++this.state.registrationNumber,
      }, () => {
        this.renderInformation("add");
      });
    }
  };
  reduceNumber = () => {
    this.setState({
      registrationNumber: --this.state.registrationNumber > 1 ? this.state.registrationNumber : 1,
    }, () => {
      this.renderInformation("reduce");
    });
  };
  checkItemRight = (index, flagObj, obj) => {
    const indexArr = [...this.state.registrationNumberArr];
    const contentArr = [...this.state.peopleContent];
    indexArr[index] = flagObj;
    contentArr[index] = obj;
    this.setState({
      registrationNumberArr: [...indexArr],
      peopleContent: [...contentArr],
    });
  };
  submitHandle = () => {
    this.state.errorItemIndex = -1;
    for (let i = 0; i < this.state.registrationNumber; i++) {
      if (this.state.registrationNumberArr[i].isFullNameRight === false) {
        this.setState({
          errorItemIndex: i,
        }, () => {
          Tips.show(`第${this.state.errorItemIndex + 1}个人的姓名不正确,请重新输入！`);
        });
        break;
      } else if (this.state.registrationNumberArr[i].isTelphoneRight === false) {
        this.setState({
          errorItemIndex: i,
        }, () => {
          Tips.show(`第${this.state.errorItemIndex + 1}个人的手机号不正确,请重新输入！`);
        });
        break;
      } else if (this.state.registrationNumberArr[i].isIdNumberRight === false) {
        this.setState({
          errorItemIndex: i,
        }, () => {
          Tips.show(`第${this.state.errorItemIndex + 1}个人的身份证号不正确,请重新输入！`);
        });
        break;
      }
    }
    if (this.state.errorItemIndex === -1) {
      const arr = this.state.peopleContent;
      arr.length = this.state.registrationNumber;
      const obj = {
        partyId: this.partyId,
        userId: this.userId,
        registerNum: this.state.registrationNumber,
        registerUserList: arr,
      };
      postAjax(`${url}/v1/party/register/new`, obj).then((res) => {
        if (res.code === 201) {
          const obj = res.data;
          if (this.props.device === "android") {
            window.jsInterface.registerSuccess(JSON.stringify(obj));
          } else {
            window.location.href = `app://method?json=${JSON.stringify(obj)}`;
          }
        }
      }).catch(err => Tips.show(err.message));
    }
  };

  render() {
    window.submitHandle = this.submitHandle;
    return (
      <div styleName="registration" ref={(ref) => { this.registrationBox = ref; }}>
        <div styleName="money" ref={(ref) => { this.registrationMoneyBox = ref; }}>
          <span styleName="money_text">合计</span>
          <span styleName="money_detail">￥{this.state.money}
            x {this.state.registrationNumber}</span>
          <span
            styleName="money_total">￥{(this.state.money * this.state.registrationNumber).toFixed(2)}</span>
        </div>
        <div styleName="registration-number" ref={(ref) => { this.registrationNumberBox = ref; }}>
          <span styleName="left">报名人数</span>
          <span styleName="right">
            <button onTouchEnd={this.reduceNumber}>-</button>
            <input type="text" value={this.state.registrationNumber}
                   onChange={e => {this.handleChange(e)}} onBlur={e => {this.defaultVal(e)}} />
            <button onTouchEnd={this.addNumber}>+</button>
          </span>
        </div>
        <div styleName="perfect-information">
          <div styleName="content" ref={(ref) => { this.contentBox = ref; }}>
            {this.state.registrationNumberArr.map((item, index) => <Information key={index}
                                                                                index={index}
                                                                                ref={(ref) => { this.informationChild = ref; }}
                                                                                isRequired={this.state.isRequired}
                                                                                checkRight={this.checkItemRight} />)}
          </div>
        </div>
      </div>
    );
  }
}