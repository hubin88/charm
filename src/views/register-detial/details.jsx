/**
 * Created by huoban-xia on 2017/5/10.
 */

import React, { Component, PropTypes } from 'react';
import { getAjax } from '../../ultils/server';
import Tips from '../../components/tips';
import './details.scss';

export default class Details extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userImg: '',
      userName: '',
      registerNum: 1,
      informationList: [],
    };
    this.registerId = this.props.params.registerId;
  }

  componentWillMount() {
    const id = this.registerId;
    getAjax(`http://${url}/v1/party/register/detail/${id}`).then((res)=> {
      if (res.code === 200) {
        const data = res.data;
        this.setState({
          informationList: data.fields||[],
          registerNum: data.fields.length,
          userName: data.author.name,
          userImg: data.author.headPic,
        });
      }
    }).catch(err => Tips.show(err.message));;
  }

  renderList = (item, index)=> {
    return (
      <div key={index} styleName="list">
        <div styleName="title">
          <span styleName="index">{`报名${index + 1}`}</span>
          <span styleName="status">{item.participate ? '已参与' : '待参与'}</span>
        </div>
        {item.phoneNum || item.identity ?
          (<div styleName="content">
            <div>
              <span styleName="left">姓&emsp;&emsp;名</span>
              <span styleName="right">{item.name}</span>
            </div>
            {item.phoneNum ?
              (<div>
                <span styleName="left">手&ensp;机&ensp;号</span>
                <span styleName="right">{item.phoneNum}</span>
              </div>) : null
            }
            {item.identity ?
              (<div styleName="no-border">
                <span styleName="left">身份证号</span>
                <span styleName="right">{item.identity}</span>
              </div>) : null
            }
          </div>) : null
        }
      </div>
    )
  };

  render() {
    return (
      <div styleName="details" ref={(ref)=> {this.details = ref;}}>
        <div styleName="header">
          <span styleName="image">
            <img src={this.state.userImg} alt="" />
          </span>
          <span styleName="name">{this.state.userName}</span>
          <span styleName="number">报名人数 {this.state.registerNum}</span>
        </div>
        <div styleName="information" ref={(ref)=> {this.information = ref;}}>
          {this.state.informationList.map((item, index)=>this.renderList(item, index))}
        </div>
      </div>
    );
  }
}

