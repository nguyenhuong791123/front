import React, { Component as C } from 'react';

import '../css/Footer.css';

class Footer extends C {
  constructor(props) {
    super(props);

    this.state = { viewFooter: this.props.viewFooter };
  }

  UNSAFE_componentWillReceiveProps(props) {
    console.log('FOOTER componentWillReceiveProps');
    this.state.viewFooter = props.viewFooter;
    // this.forceUpdate();
  }

  render() {
    if(!this.state.viewFooter) return "";
    // console.log(this.props.viewFooter);
    return (
      <div>
        <span>
          { this.props.copyright }
        </span>
      </div>
    );
  };
}

export default Footer;