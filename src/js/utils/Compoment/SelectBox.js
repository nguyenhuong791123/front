import React, { Component as C } from 'react';
import Utils from '../Utils';
import { CUSTOMIZE, OPTIONS_KEY } from '../HtmlTypes';

export default class SelectBox extends C {
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

    render() {
        return (
            <select
                id={ this.props.id }
                className="form-control"
                value={ this.props.value }
                onChange={() => this.props.onChange(event.target.value)}>
                {(() => {
                    if (!this.props.schema[CUSTOMIZE.REQUIRED]) {
                        return(<option value=""> --- </option>);
                    }
                })()}
                { this._getOptions() }
            </select>
        );  
    }
}