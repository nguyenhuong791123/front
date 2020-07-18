import React, { Component as C } from 'react';

export default class ImageBox extends C {
    render() {
        const value = this.props.value;
        console.log(value);
        return (<img src={ value['data'] } id={ this.props.id }/>);
    }
}