/**
 * Created by hubin on 2017/9/14.
 */

import React, { Component, PropTypes } from 'react';
import './reply.scss';

export default class Reply extends Component {
  static contextTypes = {
    close: PropTypes.func,
    replyComment: PropTypes.func,
    comment: PropTypes.object,
    delete: PropTypes.func,
  };

  constructor(props) {
    super(props);
  }

  cancel = (e) => {
    e.preventDefault();
    this.context.close()
  };
  delete = (e) => {
    e.preventDefault();
    this.context.close();
    const { commentId } = this.props.comment;
    this.props.delete(commentId);
  };
  replyComment = (e) => {
    e.preventDefault();
    this.context.close();
    this.props.replyComment(this.props.comment);
  };

  render() {
    const { params, comment: { author } } = this.props;
    return (
      <div styleName="reply">
        <ul>
          <li onTouchEnd={(e) => this.replyComment(e)}>回复</li>
          {params.userid === author.userId.toString() ?
            <li style={{ borderTop: '1px solid #ccc' }} onTouchEnd={(e) => this.delete(e)}>删除</li> : null}
        </ul>
        <div onTouchEnd={(e) => this.cancel(e)}>取消</div>
      </div>
    );
  }
}
