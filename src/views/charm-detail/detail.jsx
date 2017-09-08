import React, { Component, PropTypes } from 'react';
import BScroll from 'better-scroll';
import './detail.scss';
import { GET } from '../../ultils/server';

export default class Detail extends Component {
  static propTypes = {
    parentRef: PropTypes.object,
  };
  static defaultProps = {
    parentRef: this.charmvalue,
  };

  constructor(props) {
    super(props);
    this.state = {
      currentCharmValue: 0,
      charmDetails: [],
    };
  }

  componentDidMount() {
    this.layout();
    this.currentPage = 1;//第一页
    const options = {};
    this.upLoadMore(1).then(() => {
      setTimeout(() => {
        this.scroll = new BScroll(this.wrapper, options);
        this.scroll.on('scrollEnd', () => {
          if (this.scroll.y >= 0) {
            this.currentPage=1;
            this.upLoadMore(this.currentPage);
          }
          if (this.scroll.y <= this.scroll.maxScrollY) {
            this.currentPage++;
            this.upLoadMore(this.currentPage);
          }
        });
      }, 0)
    });
  }

  layout() {
    let rect;
    if (this.props.parentRef === undefined) {
      const e = document.documentElement;
      rect = { left: 0, top: 0, width: e.clientWidth, height: e.clientHeight };
    } else {
      rect = this.props.parentRef.getBoundingClientRect();
    }
    const height = rect.height - 135;
    const style = `height:${height}px`;
    this.wrapper.setAttribute('style', style);
  }

  upLoadMore = (page) =>
    GET(`http://${url}/v1/charm/list/by/60420?page=${page}&limit=10`).then(res => {
      if (res.code === 200) {
        const data = res.data;
        let arr = [...this.state.charmDetails];
        if (this.scroll) {
          if (this.scroll.y >= 0) {
            arr = data.rows;
          } else {
            arr.push(...data.rows);
          }
        } else {
          arr.push(...data.rows);
        }
        this.setState({
          currentCharmValue: data.impact,
          charmDetails: arr,
        }, () => {
          this.scroll && this.scroll.refresh();
        });
      }
    });
  renderList = (item, index) =>
    <div styleName="row" key={index}>
      <div styleName="cell">
        <div styleName="type">{item.reason}</div>
        <div styleName="time">{item.time}</div>
      </div>
      <div styleName="cell value">
        <span>+</span>{item.num}
      </div>
    </div>;

  render() {
    return (
      <div styleName="charmvalue" className="ssss" ref={(ref) => { this.charmvalue = ref; }}>
        <div styleName="current-value">
          <div styleName="text">当前魅力值</div>
          <span>{this.state.currentCharmValue}</span>
        </div>
        <div styleName="line"></div>
        <div>
          <div styleName="title">魅力收入</div>
          <div styleName="wrapper" ref={(ref) => { this.wrapper = ref; }}>
            <div styleName="tabs-content">
              {this.state.charmDetails.map((item, index) => this.renderList(item, index))}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

