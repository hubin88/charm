/**
 * Created by hubin on 2017/8/30.
 */

import React, { Component, PropTypes } from 'react';
import './sure-register.scss';
import { POST } from '../../ultils/server';
import Tips from '../../components/tips'

export default class SureRegister extends Component {
  static contextTypes = {
    close: PropTypes.func,
    noRegister: PropTypes.func,
    callback: PropTypes.func,
  };

  constructor(props) {
    super(props);
  }

  sure = () => {
    const suerUrl = `${url}/v1/party/register`;
    const { params } = this.props;
    POST(suerUrl, {
      partyId: params.partyid,
      registerNum: 1,
      userId: params.userid,
      versionName: 'sring'
    }).then((res) => {
      if (res.code === 200) {
        Tips.show('报名成功');
        this.context.close();
        this.props.noRegister();
        this.props.callback();
      } else {
        Tips.show(res.message);
      }
    });
  };

  render() {
    return (
      <div styleName="sure-register">
        <div styleName="title">报名</div>
        <p styleName="content">是否确定参加该聚会</p>
        <div styleName="btns">
          <span styleName="cancel" onTouchEnd={this.context.close}>取消</span>
          <span styleName="sure" onTouchEnd={this.sure}>确定</span>
        </div>
      </div>
    );
  }
}
