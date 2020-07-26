import React, {Component} from 'react';
import {WebView} from 'react-native';

export default class extends Component {
  navigationStateChangedHandler = ({url}) => {
    if (url.startsWith('https://www.google.co.uk') && url !== this.props.url) {
      this.WebView.stopLoading();
    }
  };

  render() {
    const {url, ...props} = this.props;
    return <WebView
      {...props}
      source={{uri: url}}
      onNavigationStateChange={this.navigationStateChangedHandler}
      ref={c => {
        this.WebView = c;
      }}
    />
  }
}