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
    GET(`${url}/v1/charm/top`).then(res => {
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
    browserHistory.push('/charm/show');
  };
  rule = () => {
    browserHistory.push('/charm/rule?type=1');
  };
  goToHeader = (userId) => {
    if (this.props.device === 'Ios') {
      window.location.href = `app://gotoDetail?userid=${userId}`;
    } else {
      window.jsInterface.startPersonalHomePageActivity(userId);
    }
  };
  renderTopThree = (item) =>
    <div styleName={item.index} key={item.userId}>
      <img src={item.headPic} styleName="header_img" alt="" onTouchEnd={() => this.goToHeader(item.userId)} />
      <img src={require(`../../images/charm/${item.index}.png`)} styleName={`rank_${item.index}`} alt="" />
      <div styleName="name"><span>{item.name}</span></div>
    </div>;
  renderList = (item, index) =>
    <li key={index}>
      <div styleName="index">{index + 1}</div>
      <div styleName="head" onTouchEnd={() => this.goToHeader(item.userId)}><img src={item.headPic} alt="" /></div>
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
          <div styleName="title">楼咖大型职场魅力SHOW</div>
          <div styleName="tips">如何获取魅力值：被关注一次+1，被约见一次+3，主动约见成功+5，魅力值越高排名越靠前。</div>
          <div styleName="tips">如何关注/约见：用户可直接在该页面点击排行榜用户头像关注/约见对方，或在“发现”-“人脉”直接搜索用户，进入用户主页关注/约见对方。</div>
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