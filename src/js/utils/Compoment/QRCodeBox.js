import React, { Component as C } from 'react';
import QRCode from "qrcode.react"

import Utils from '../Utils';
import DateUtil from '../DateUtils';
import { CUSTOMIZE } from '../HtmlTypes';

export default class QRCodeBox extends C {
    render() {
        var values = this.props.value.split('&');
        var value = '';
        if(values.length === 1) {
            value = values[0].replace('default=', '');
        } else {
            values.map((o, idx) => {
                if(!Utils.isEmpty(o)) {
                    if(idx === 0 || Utils.isEmpty(value)) {
                        value = o;
                    } else {
                        value += '&' + o;
                    }
                }
            });
        }
        console.log(value);
        if(Utils.isEmpty(value)) return ('');
        var key = Utils.getUUID(5) + '-' + DateUtil.isFullDateTime(null, this.props.schema['language']);
        key += '&' + value;
        if(Utils.inJson(this.props.schema, CUSTOMIZE.QRAPPLINK)) {
            value = Utils.getLocationURL() + '?key=' + btoa(key );
        }
        return(<QRCode value={ value } id={ this.props.id }/>);
    }
}