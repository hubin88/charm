/**
 * Created by huoban-xia on 2017/7/5.
 */

import React, { Component, PropTypes } from 'react';
import './details.scss';
import { dateFormat, timeDifference, getDevice } from '../../ultils/tools';
import { POST, GET, DELETE } from '../../ultils/server';
import Alert from '../../components/alert';
import SlideUp from '../../components/slide-up';
import SureRegister from '../sure-register/sure-register';
import Reply from '../reply/reply';
import Tips from '../../components/tips';

export default class Details extends Component {
  static propTypes = {
    partyState: PropTypes.object,
    payType: PropTypes.object,
    device: PropTypes.string,
  };
  static defaultProps = {
    device: getDevice(),
    payType: {
      0: '免费',
      1: '发起人请客',
      2: 'AA',
    },
    partyState: {
      1: '召集中',
      2: '关闭',
      3: '报名截止',
      4: '已结束',
    },
  };

  constructor(props) {
    super(props);
    this.state = {
      data: {},
      showComment: true,
      myComment: '',
      commentList: [],
      registerList: [],
      slogansList: [],
      canRegister: false,
      isSelf: false,
      commentPlaceholder: '随便说点什么',
      isReply: false,//是否是回复的评论
      comment: {},//被评论的评论
    };
  }

  componentWillMount() {
    setTimeout(this.layout, 0);
  }

  componentDidMount() {
    const { params } = this.props;
    if (!params.partyid) return;
    if (!params.userid) {
      if (this.props.device === 'Ios') {
        params.userid = 1;
      } else {
        params.userid = this.getUserId();
      }
    }
    this.getJsonDetails(params.partyid, params.userid);
    this.getJsonRegisterUser(params.partyid);
    this.getJsonComment(params.partyid, params.userid);
  }

  onChange = (key, value) => {
    this.setState({
      [key]: value,
    });
  };
  getJsonDetails = (partyId, userId) => {
    this.getDetails(partyId, userId).then((res) => {
      this.getJsonSlogans(res.author.userId);
    });
  };
  getDetails = (partyId, userId) => {
    const detailsUrl = `${url}/v1/party/detail/${partyId}/user/${userId}`;
    return GET(detailsUrl).then((res) => {
      if (res.code === 200) {
        const data = res.data || {};
        this.setState({
          data,
          canRegister: data.registerState === 0,
          isSelf: data.author.userId === parseInt(this.props.params.userid),
        });
        return data
      }
      return {};
    });
  };
  getJsonRegisterUser = (partyId) => {
    const registerUrl = `${url}/v1/party/register/list/${partyId}`;
    GET(registerUrl).then((res) => {
      if (res.code === 200) {
        const data = res.list || {};
        this.setState({
          registerList: data,
        });
      }
    });
  };
  getJsonComment = (partyId, userId) => {
    const commentUrl = `${url}/v1/comment/list/with/party/${partyId}/user/${userId}`;
    GET(commentUrl).then((res) => {
      if (res.code === 200) {
        const data = res.list || {};
        this.setState({
          commentList: data,
        });
      }
    });
  };
  getJsonSlogans = (userId) => {
    const slogansUrl = `${url}/v1/party/slogan/list/with/user/${userId}`;
    GET(slogansUrl).then((res) => {
      if (res.code === 200) {
        const data = res.list || {};
        this.setState({
          slogansList: data,
        });
      }
    });
  };

  layout = () => {
    const details = this.details.getBoundingClientRect();
    const height = details.height - 42;
    this.detailsContent.setAttribute('style', `height:${height}px`);
  };
  changeShowComment = (flag) => {
    this.setState({
      showComment: flag,
    });
  };

  goToRegister = () => {
    if (!this.state.canRegister) return;
    const { data } = this.state;
    const { params } = this.props;
    if (params.userid === 1) params.userid = this.getUserId();
    if (data.cost === 3) {
      const obj = {
        partyId: params.partyid,
        userId: params.userid,
      };
      if (this.props.device === 'Ios') {
        window.location.href = `app://gotoRegister?json=${JSON.stringify(obj)}`;
      } else {
        window.jsInterface.startPartyRegisterActivity(JSON.stringify(obj));
      }
    } else {
      Alert.show({
        content: <SureRegister {...this.props} noRegister={this.changeCanRegister}
                               callback={() => this.getDetails(params.partyid, params.userid)} />
      });
    }
  };
  changeCanRegister = () => {
    this.setState({
      canRegister: false,
    });
  };
  allImpression = (userId) => {
    if (this.props.device === 'Ios') {
      window.location.href = `app://gotoImpression?userid=${userId}`;
    } else {
      window.jsInterface.startPartyAllImpressionActivity(userId);
    }
  };
  goToHeader = (userId) => {
    if (this.props.device === 'Ios') {
      window.location.href = `app://gotoDetail?userid=${userId}`;
    } else {
      window.jsInterface.startPersonalHomePageActivity(userId);
    }
  };
  // back = () => {
  //   if (this.props.device === 'Ios') {
  //     window.location.href = `app://gotoBack`;
  //   } else {
  //     window.jsInterface.finishActivity("");
  //   }
  // };
  // more = (userId) => {
  //   if (this.props.device === 'Ios') {
  //     window.location.href = `app://gotoShare?userid=${userId}`;
  //   } else {
  //     window.jsInterface.startShareActivity("");
  //   }
  // };
  getAuthorId = () => {
    const { data } = this.state;
    const { author = {} } = data;
    if (this.props.device === 'Ios') {
      window.location.href = `app://gotoShare?userid=${author.userId}`;
    } else {
      window.jsInterface.startShareActivity("");
    }
  };
  reply = (comment) => {
    SlideUp.show({
      content: <Reply {...this.props} comment={comment} replyComment={this.replyComment}
                      delete={this.deleteSelfComment} />
    })
  };
  replyComment = (comment) => {
    this.commentText.focus();
    this.setState({
      commentPlaceholder: `回复 ${comment.author.name}:`,
      isReply: true,
      comment,
    });
  };
  getUserId = () => {
    if (this.props.device === 'Ios') {
      const data = window.getUserInfo();
      return data.userId;
    } else {
      const data = window.jsInterface.getUserInfo();
      return JSON.parse(data).userId;
    }
  };
  sendComment = () => {
    const { params } = this.props;
    if (params.userid === 1) params.userid = this.getUserId();
    const obj = {
      content: this.state.myComment.replace(/</g, '&lt;').replace(/>/, '&gt;'),
      objectId: parseInt(params.partyid),
      userId: parseInt(params.userid),
    };
    let commentUrl = `${url}/v1/comment/party`;
    if (this.state.isReply) {
      commentUrl = `${url}/v1/comment/party/reply`;
      const { commentId, replyId, author, sessionId } = this.state.comment;
      Object.assign(obj, {
        commentId,
        replyId: replyId ? replyId : commentId,
        replyUserId: author.userId,
        sessionId: sessionId ? sessionId : commentId,
      });
    }
    POST(commentUrl, obj).then((res) => {
      if (res.code === 201) {
        this.setState({
          myComment: '',
          isReply: false,
          commentPlaceholder: '随便说点什么',
        });
        this.getDetails(params.partyid, params.userid);
        this.getJsonComment(params.partyid, params.userid);
      } else {
        Tips.show(res.message);
      }
    });
  };
  deleteSelfComment = (commentId) => {
    const { params } = this.props;
    if (params.userid === 1) params.userid = this.getUserId();
    DELETE(`${url}/v1/comment/${commentId}`).then(res => {
      if (res.code === 200) {
        this.getDetails(params.partyid, params.userid);
        this.getJsonComment(params.partyid, params.userid);
      } else {
        Tips.show(res.message);
      }
    });
  };
  touchStart = (e) => {
    this.pageY = e.touches[0].pageY;
    this.movePageY = e.touches[0].pageY;
  };
  touchMove = (e) => {
    this.movePageY = e.touches[0].pageY;
  };
  touchEnd = (item) => {
    if (Math.abs(this.movePageY - this.pageY) > 10) {
      return false;
    }
    this.reply(item);
  };
  renderCommentList = (item, index) =>
    <li styleName="comment-list" key={index}>
      <div styleName="userImg" onTouchEnd={() => this.goToHeader(item.author.userId)}>
        <img src={item.author.headPic} alt="" />
      </div>
      <div
        onTouchStart={(e) => {
          this.touchStart(e)
        }}
        onTouchMove={(e) => {
          this.touchMove(e)
        }}
        onTouchEnd={() => {
          this.touchEnd(item)
        }}
      >
        <div styleName="user">
          <span styleName="user-nick">
            <span>{item.author.name}</span>
            {item.replyUser ? ' 回复 ' : null}
            {item.replyUser ? <span>{item.replyUser.name}</span> : null}
          </span>
          <span styleName="comment-time">{timeDifference(item.latestTime)}</span>
        </div>
        <div>{item.content.replace(/&lt;/g, '<').replace(/&gt;/g, '>')}</div>
      </div>
    </li>;
  renderRegisterList = (item, index) =>
    <li styleName="comment-list" key={index}>
      <div styleName="userImg" onTouchEnd={() => this.goToHeader(item.author.userId)}>
        <img src={item.author.headPic} alt="" />
      </div>
      <div>
        <div styleName="user">
          <span styleName="user-nick">{item.author.name}</span>
          <span styleName="comment-time">{item.registerNum}人</span>
        </div>
        <div>{dateFormat(item.createTime, 'MM-dd HH:mm')}</div>
      </div>
    </li>;

  render() {
    const { data } = this.state;
    const { author = {} } = data;
    const { photo } = data;
    window.authorId = this.getAuthorId;
    document.title = '活动详情';
    return (
      <div styleName="details" ref={(ref) => { this.details = ref; }}>
        <div styleName="details-content" ref={(ref) => { this.detailsContent = ref; }}>
          {photo ? <img src={photo[0]} style={{ width: '100%', height: 'auto', display: 'block' }} /> : null}
          <div styleName="content">
            <div styleName="title">
              <div styleName="logo" onTouchEnd={() => this.goToHeader(author.userId)}>
                <img src={author.headPic} />
                {author.authentication ? <span styleName="authentication" /> : null}
              </div>
              <div styleName="name">
                <div>{author.name}</div>
                <div>{timeDifference(data.createTime)}</div>
              </div>
              <div styleName="money">
                {
                  data.cost === 3 ? <div><span styleName="protect" />{data.prepayment}元/人</div> :
                    <div>{this.props.payType[data.cost]}</div>
                }
              </div>
            </div>
            <div styleName="theme">
              <span styleName="theme-title">{data.partyTopic}</span>
              <span styleName="party-state">{this.props.partyState[data.state]}</span>
            </div>
            <div styleName="party-content">
              <div styleName="address">{data.address || '地点待定'}</div>
              <div styleName="time">
                <span>{data.partyTime}</span>
                {data.endTime ?
                  <span>&nbsp;报名截止时间:{dateFormat(data.endTime, 'MM-dd HH:mm')}</span> : null
                }
              </div>
              <div styleName="text">{data.keyword}</div>
            </div>
          </div>
          {data.content ? <div styleName="descripte"
                               dangerouslySetInnerHTML={{ __html: data.content }} /> : null}
          <div styleName="impression">
            <span>发起人印象</span>
            <span styleName="score">{data.avg}分</span>
            {data.phoneNum ?
              <span styleName="phone">
                <a href={`tel:${data.phoneNum}`}>联系TA</a>
              </span> : null
            }
          </div>
          {this.state.slogansList.length > 0 ?
            <div styleName="impression-label">
              {this.state.slogansList.map((item, index) => <span key={index}>{item}</span>)}
              <div styleName="all-impression">
                <span onTouchEnd={() => this.allImpression(author.userId)}>查看全部印象>></span>
              </div>
            </div> : null}
          <div styleName="comment-box">
            <div styleName="pane">
              <span
                onTouchEnd={() => { this.changeShowComment(true); }}
                styleName={this.state.showComment ? 'comment-active' : 'comment'}
              >评论 {data.commentNumber || 0}</span>
              <span styleName="dividing-line">|</span>
              <span
                onTouchEnd={() => { this.changeShowComment(false); }}
                styleName={this.state.showComment ? 'register' : 'register-active'}
              >报名 {data.registerNumber || 0}</span>
              {data.limitationNUm ?
                <div styleName="register-num">限{data.limitationNUm}人报名</div> : null
              }
            </div>
            <div>
              <ul styleName="comment-content">
                {this.state.showComment ?
                  this.state.commentList.map((item, index) => this.renderCommentList(item, index)) :
                  this.state.registerList.map((item, index) => this.renderRegisterList(item, index))
                }
              </ul>
            </div>
          </div>
        </div>
        {
          !this.state.isSelf && data.state === 1 ?
            <button styleName={`register-btn${this.state.canRegister ? ' active' : ''}`}
                    onTouchEnd={this.goToRegister}>{this.state.canRegister ? '' : '已'}报名</button> : null
        }
        {this.state.showComment ?
          <div styleName="my-comment">
            <input
              type="text"
              styleName="my-comment-text"
              placeholder={this.state.commentPlaceholder}
              value={this.state.myComment}
              onChange={e => this.onChange('myComment', e.target.value)}
              ref={(ref) => { this.commentText = ref; }}
            />
            <button styleName={this.state.myComment ? 'button btn-active' : 'button'} onTouchEnd={this.sendComment}>发送
            </button>
          </div> : null}
      </div>
    );
  }
}
