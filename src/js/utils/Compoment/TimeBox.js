import React, { Component as C } from 'react';

export default class TimeBox extends C {
    render() {
        console.log(this.props);
        return (<input
            type="time"
            id={ this.props.id }
            className="form-control"
            value={ this.props.value }
            onChange={() => this.props.onChange(event.target.value)} />);
    }
}