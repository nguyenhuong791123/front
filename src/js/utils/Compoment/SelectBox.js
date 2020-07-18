import React, { Component as C } from 'react';
import { CUSTOMIZE, OPTIONS_KEY } from '../HtmlTypes';
import Utils from '../Utils';

export default class SelectBox extends C {
    constructor(props) {
        super(props);
    
        this._onChange = this._onChange.bind(this);
        this.state = { multiple: false }
    };

    _getOptions() {
        console.log(this.props);
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
        this.props.onChange(value);
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