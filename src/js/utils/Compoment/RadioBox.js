import React, { Component as C } from 'react';
import Utils from '../Utils';

export default class RadioBox extends C {
    _getRadioBox() {
        console.log(this.props);
        const def = this.props.schema;
        if(!Utils.inJson(def, 'oneOf')) return('Not List!!!');
        const objs = Array.from(def.oneOf);
        const className = (this.props.schema.obj['list_checked'])?'form-check':'form-check-inline'
        return objs.map((obj, idx) => {
            const checked = (!Utils.isEmpty(this.props.value) && this.props.value === obj['const'])?true:false;
            return (
                <div key={ idx } className={ className }>
                    <input type={ 'radio' }
                        id={ this.props.id + '_' + idx }
                        value={ obj['const'] }
                        checked={ checked }
                        name={ this.props.id }
                        onChange={() => this.props.onChange(event.target.value)}
                        className={ 'form-check-input' } />
                    <label className="form-check-label" htmlFor={ this.props.id + '_' + idx }>{ obj['title'] }</label>
                </div>
            );    
        });
    }

    render() {
        return (
            <div className={ 'field-radio-group' }>
                { this._getRadioBox() }
            </div>
        );  
    }
}