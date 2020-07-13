import React, { Component as C } from 'react';

export default class ImageBox extends C {
    render() {
        return (<img src={ this.props.value } id={ this.props.id }/>);
    }
}