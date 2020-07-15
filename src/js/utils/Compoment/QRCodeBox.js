import React, { Component as C } from 'react';
import QRCode from "qrcode.react"

import Utils from '../Utils';
import DateUtil from '../DateUtils';
import { CUSTOMIZE } from '../HtmlTypes';

export default class QRCodeBox extends C {
    render() {
        var value = this.props.value;
        if(Utils.isEmpty(value)) return ('');
        var key = Utils.getUUID(5) + '-' + DateUtil.isFullDateTime(null, this.props.schema['language']);
        key += '&' + value;
        if(Utils.inJson(this.props.schema, CUSTOMIZE.QRAPPLINK)) {
            value = Utils.getLocationURL() + '?key=' + btoa(key );
        }
        return(<QRCode value={ value } id={ this.props.id }/>);
    }
}