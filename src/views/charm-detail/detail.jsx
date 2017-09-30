import React, { Component, PropTypes } from 'react';
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

  componentWillMount() {
    this.upLoadMore(1)
  }

  componentDidMount() {
    this.layout();
    this.currentPage = 1;//第一页
    this.wrapper.addEventListener("scroll", () => {
      const scrollTop = this.wrapper.scrollTop;
      const clientHeight = this.wrapper.clientHeight;
      const scrollHeight = this.wrapper.scrollHeight;
      if (scrollTop === 0) {
        this.currentPage = 1;
        this.upLoadMore(this.currentPage);
      }
      if (scrollTop + clientHeight >= scrollHeight) {
        this.currentPage++;
        this.upLoadMore(this.currentPage);
      }
    }, false);
  }

  layout() {
    let rect;
    if (this.props.parentRef === undefined) {
      const e = document.documentElement;
      rect = { left: 0, top: 0, width: e.clientWidth, height: e.clientHeight };
    } else {
      rect = this.props.parentRef.getBoundingClientRect();
    }
    const height = rect.height - 221;
    const style = `height:${height}px`;
    this.wrapper.setAttribute('style', style);
  }

  upLoadMore = (page) => {
    GET(`${url}/v1/charm/list/by/${this.props.params.userId}?page=${page}&limit=10`).then(res => {
      if (res.code === 200) {
        const data = res.data;
        if (data.rows.length === 0) return;
        let arr = [...this.state.charmDetails];
        if (this.currentPage === 1) {
          arr = [];
        }
        arr.push(...data.rows);
        this.setState({
          currentCharmValue: data.impact,
          charmDetails: arr,
        });
      }
    });
  };
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
      <div styleName="charmvalue" ref={(ref) => { this.charmvalue = ref; }}>
        <div styleName="current-value">
          <span>{this.state.currentCharmValue}</span>
          <div styleName="text">当前魅力值</div>
        </div>
        <div>
          <div styleName="title">魅力值收入</div>
          <div styleName="wrapper" ref={(ref) => { this.wrapper = ref; }}>
            <div styleName="tabs-content">
              {this.state.charmDetails.map((item, index) => this.renderList(item, index))}
            </div>
            {this.state.charmDetails.length === 0 ?
              <img src={require("../../images/charm/empty.png")} styleName="empty"/> : null}
          </div>
        </div>
      </div>
    );
  }
}

