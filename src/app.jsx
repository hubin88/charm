import React, { Component } from 'react';
import './css/main.scss'; // import global css style

export default class App extends Component {
  render() {
    return (
      this.props.children
    )
  }
}
