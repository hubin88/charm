import React, { Component, PropTypes } from 'react';
import { browserHistory } from 'react-router';
import './activity.scss';
import { GET } from '../../ultils/server';
import { getDevice } from '../../ultils/tools';

export default class Activity extends Component {
  static propTypes = {
    device: PropTypes.string,
  };
  static defaultProps = {
    device: getDevice()
  };

  constructor(props) {
    super(props);
    this.state = {
      rankTopThree: [],
      rankList: [],
    };
  }

  componentWillMount() {
    GET(`http://${url}/v1/charm/top`).then(res => {
      if (res.code === 200) {
        const data = res.list || [];
        this.setState({
          rankList: data,
        });
        this.setState({
          rankTopThree: [
            { ...data[1], index: 'second' },
            { ...data[0], index: 'first' },
            { ...data[2], index: 'third' },
          ],
        });
      }
    });
  }

  back = () => {
    if (this.props.device === 'Ios') {
      window.location.href = `app://gotoBack`;
    } else {
      window.jsInterface.finishActivity("");
    }
  };
  detail = () => {
    browserHistory.push('/party/charm/show');
  };
  rule = () => {
    if (this.props.device === 'Ios') {
      window.location.href = `app://gotoCharmRule`;
    } else {
      window.jsInterface.startRuleActivity("");
    }
  };
  renderTopThree = (item) =>
    <div styleName={item.index} key={item.userId}>
      <img src={item.headPic} styleName="header_img" alt="" />
      <img src={require(`../../images/charm/${item.index}.png`)} styleName={`rank_${item.index}`} alt="" />
      <div styleName="name"><span>{item.name}</span></div>
    </div>;
  renderList = (item, index) =>
    <li key={item.userId}>
      <div styleName="index">{index + 1}</div>
      <div styleName="head"><img src={item.headPic} alt="" /></div>
      <div styleName="name">{item.name}</div>
      <div styleName="score">{item.charm}</div>
    </li>;

  render() {
    return (
      <div styleName="charmactivity">
        <div styleName="ad">
          <img src={require('../../images/charm/ad.png')} onTouchEnd={this.detail}/>
          <span styleName="back" onTouchEnd={this.back} />
          <span styleName="detail" onTouchEnd={this.detail} />
        </div>
        <div styleName="header">
          <div styleName="title">玖月・遇见——楼咖大型职场魅力SHOW</div>
          <div styleName="time">活动时间：9月11日——9月30日</div>
          <div styleName="tips">来楼咖，SHOW自己，赢百元大奖!</div>
        </div>
        <div styleName="line"></div>
        <div styleName="ranking">
          <div styleName="title">
            职场魅力值排行榜
            <span onTouchEnd={this.rule}>获取规则</span>
          </div>
          <div styleName="top_three">
            {this.state.rankTopThree.map(item => this.renderTopThree(item))}
          </div>
          <ul>
            {this.state.rankList.map((item, index) => this.renderList(item, index))}
          </ul>
        </div>
      </div>
    );
  }
}