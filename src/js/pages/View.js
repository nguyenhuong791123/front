
import React, { Component as C } from 'react';

export default class View extends C {
  constructor(props) {
    super(props);

    this.state = {};
  };

  render() {
    return (
      <div>View[{ this.props.id }]</div>
    )
  };
};