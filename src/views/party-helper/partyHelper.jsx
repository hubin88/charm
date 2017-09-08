/**
 * Created by huoban-xia on 2017/5/19.
 */

import React, { Component, PropTypes } from 'react';
import PartyList from './partyList';
import './partyHelper.scss';
import '../../css/main.scss';

export default class partyHelper extends Component {
  static propTypes = {
    content: PropTypes.array
  };
  static defaultProps = {
    content: HELP_CONTENT
  }

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div styleName="partyHelper">
        <ul>
          {this.props.content.map((item, index)=><PartyList key={index} item={item} />)}
        </ul>
      </div>
    );
  }
}

