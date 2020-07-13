import React, { Component as C } from 'react';
import Utils from '../Utils';
import { OPTIONS_KEY } from '../HtmlTypes';

export default class RadioBox extends C {
    _getRadioBox() {
        console.log(this.props);
        const def = this.props.schema;
        if(!Utils.inJson(def, OPTIONS_KEY.OPTIONS)) return('Not List!!!');
        const objs = Array.from(def.options);
        const className = (this.props.schema.obj[OPTIONS_KEY.OPTION_CHECKED])?'form-check':'form-check-inline'
        return objs.map((obj, idx) => {
            var value = (!Utils.isEmpty(this.props.value) && !Number.isNaN(Number(this.props.value)))?parseInt(this.props.value):this.props.value;
            const checked = (value === obj['value'])?true:false;
            return (
                <div key={ idx } className={ className }>
                    <input type={ 'radio' }
                        id={ this.props.id + '_' + idx }
                        value={ obj['value'] }
                        checked={ checked }
                        name={ this.props.id }
                        onChange={() => this.props.onChange(event.target.value)}
                        className={ 'form-check-input' } />
                    <label className="form-check-label" htmlFor={ this.props.id + '_' + idx }>{ obj['label'] }</label>
                </div>
            );    
        });
    }

    render() {
        return (
            <div className={ 'field-radio-group' } id={ this.props.id }>
                { this._getRadioBox() }
            </div>
        );  
    }
}