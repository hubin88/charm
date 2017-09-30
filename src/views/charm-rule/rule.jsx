/**
 * Created by hubin on 2017/9/5.
 */

import React, { Component, PropTypes } from 'react';
import './rule.scss';
import { browserHistory } from 'react-router';
import Header from '../../components/header';
import { getDevice } from '../../ultils/tools';

export default class Rule extends Component {
  static propTypes = {
    device: PropTypes.string,
  };
  static defaultProps = {
    device: getDevice(),
  };

  constructor(props) {
    super(props);
  }

  componentWillMount() {
    this.type=this.props.location.query.type;
  }
  back=()=>{
    if(this.type){
      browserHistory.push('/charm/top');
    }else{
      if (this.props.device === 'Ios') {
        window.location.href = `app://gotoBack`;
      } else {
        window.jsInterface.finishActivity("");
      }
    }
  };
  render() {
    return (
      <div styleName="charmdetaile" className="">
        <Header title="规则" leftBtnCallBack={this.back} />
        <div styleName="tab-content">
          <table>
            <tbody>
            <tr styleName="th">
              <th>操作</th>
              <th>魅力值</th>
            </tr>
            <tr>
              <td>注册并加入公社</td>
              <td>+5(一次性)</td>
            </tr>
            <tr>
              <td>完成认证</td>
              <td>+5(一次性)</td>
            </tr>
            <tr>
              <td>被关注</td>
              <td>+1</td>
            </tr>
            <tr>
              <td>被约见</td>
              <td>+3</td>
            </tr>
            <tr>
              <td>约见面成功</td>
              <td>+5</td>
            </tr>
            </tbody>
          </table>
          <div styleName="tips">
            <div styleName="title">说明</div>
            <ul>
              <li><span>1、</span><span>魅力值是社交优势的体现，魅力值越高，约见的成功率越高</span></li>
              <li><span>2、</span><span>被同一个用户关注、约见面多次，只增加一次魅力值</span></li>
              <li><span>3、</span><span>向同一个用户约见面成功多次，只增加一次魅力值</span></li>
            </ul>
          </div>
        </div>
      </div>
    );
  }
}
