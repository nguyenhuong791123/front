import React, { Component as C } from 'react';
import { CUSTOMIZE, OPTIONS_KEY } from '../HtmlTypes';
import Utils from '../Utils';

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
        // const def = this.props.schema;
        // if(!Utils.inJson(def, OPTIONS_KEY.OPTIONS)) return('Not List!!!');
        // const value = this.props.value;

        return (
            <select
                id={ this.props.id }
                multiple={ false }
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