/**
 * Created by huoban-xia on 2017/5/22.
 */

import React, { Component, PropTypes } from 'react';
import { setStyle, getStyle } from '../../ultils/tools';
import './partyList.scss';

export default class partyList extends Component {
  static propTypes = {
    item: PropTypes.object,
  };

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    setTimeout(this.getSize, 0);
  }

  getSize = ()=> {
    const titleBox = this.title.getBoundingClientRect();
    const dotBox = this.dot.getBoundingClientRect();
    const arrowBox = this.arrow.getBoundingClientRect();
    const width = titleBox.width - dotBox.width - arrowBox.width;
    const style = `width:${width}px`;
    this.content.setAttribute('style', style);
  };
  showAnswer = (e)=> {
    const target = e.currentTarget.nextSibling;
    const icon = e.currentTarget.lastChild;
    if (getStyle(target, 'display') === "none") {
      setStyle(target, {
        display: 'block',
      });
      setStyle(icon, {
        backgroundImage: `url(${require("../../images/register/arrow-up.png")})`
      });
    } else {
      setStyle(target, {
        display: 'none',
      });
      setStyle(icon, {
        backgroundImage: `url(${require("../../images/register/arrow-down.png")})`
      });
    }
  };

  render() {
    const item = this.props.item;
    return (
      <li styleName="partyList">
        <div styleName="title" ref={(ref) => { this.title = ref; }}
             onTouchEnd={(e)=>this.showAnswer(e)}>
          <span styleName="dot" ref={(ref) => { this.dot = ref; }}></span>
          <span styleName="content"
                ref={(ref) => { this.content = ref; }}>【{item.type}】{item.title}</span>
          <span styleName="arrow" ref={(ref) => { this.arrow = ref; }}></span>
        </div>
        <div styleName="answer">{item.answer}</div>
      </li>
    );
  }
}

