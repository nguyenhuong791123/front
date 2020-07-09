import React, { Component as C } from 'react';

export default class TimeBox extends C {
    render() {
        return (<input type="time" className="form-control" onChange={() => this.props.onChange(event.target.value)} />);
    }
}