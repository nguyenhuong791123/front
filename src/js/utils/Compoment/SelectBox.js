import React, { Component as C } from 'react';

import { CUSTOMIZE, OPTIONS_KEY } from '../HtmlTypes';
import { SYSTEM } from '../Types';
import Utils from '../Utils';
import { THEME } from '../../utils/Theme';
import Msg from '../../../msg/Msg';

export default class SelectBox extends C {
    constructor(props) {
        super(props);
    
        this._onChange = this._onChange.bind(this);
        this.state = { multiple: false }
    };

    _getOptions() {
        // console.log(this.props);
        const def = this.props.schema;
        if(!Utils.inJson(def, OPTIONS_KEY.OPTIONS)) return('Not List!!!');
        const objs = Array.from(def.options);
        return objs.map((obj, idx) => {
            return (
                <option key={ idx } value={ obj['value'] }>{ obj['label'] }</option>
            );    
        });
    }

    _onChange(e) {
        const obj = e.target;
        var value = '';
        if(this.state.multiple) {
            const arr = Array.from(obj.childNodes).map((o) => {
                if(o.selected) return o.value;
            });
            value = arr.filter(v => v);
        } else {
            value = obj.value;
        }

        if(!Utils.isEmpty(this.props.id) && this.props.id.endsWith('_theme')) {
            const link = document.getElementById(SYSTEM.IS_CSS_LINK_ID);
            if(!Utils.isEmpty(link) && !Utils.isEmpty(value)) {
                link.href = Msg.getSystemMsg('sys', 'app_css_host') + THEME.getTheme(value);
            }    
        }

        this.props.onChange(Utils.isNumber(value)?parseInt(value):value);
    }

    render() {
        this.state.multiple = (Utils.inJson(this.props.schema, 'option_checked'))?this.props.schema.option_checked:false;
        return (
            <select
                id={ this.props.id }
                multiple={ this.state.multiple }
                className="form-control"
                value={ this.props.value }
                onChange={ this._onChange.bind(this) }>
                {(() => {
                    if (!this.props.schema[CUSTOMIZE.REQUIRED] && !this.state.multiple) {
                        return(<option value=""> --- </option>);
                    }
                })()}
                { this._getOptions() }
            </select>
        );  
    }
}