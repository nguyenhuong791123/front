import React, { Component as C } from 'react';
import QRCode from "qrcode.react"

export default class QRCodeBox extends C {
    render() {
        return(<QRCode value={ this.props.value } id={ this.props.id }/>);
    }
}