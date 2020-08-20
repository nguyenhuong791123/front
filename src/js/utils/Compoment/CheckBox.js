import React, { Component as C } from 'react';
import Utils from '../Utils';
import { OPTIONS_KEY } from '../HtmlTypes';

export default class CheckBox extends C {
    _onChecked(e) {
        const obj = e.target;
        if(obj === undefined) return;
        var checkeds = [];
        const divs = Array.from(obj.parentElement.parentElement.childNodes);
        if(divs === undefined) return;
        divs.map((o) => {
            const input = o.childNodes[0];
            var value = (!Utils.isEmpty(input.value) && !Number.isNaN(Number(input.value)))?parseInt(input.value):input.value;
            if(input.tagName === 'INPUT' && input.checked) checkeds.push(value);
        });
        this.props.onChange(checkeds);
    }
  
    _getCheckBox() {
        console.log(this.props);
        const def = this.props.schema;
        if(!Utils.inJson(def, OPTIONS_KEY.OPTIONS)) return('Not List!!!');
        // const patitions = [ 'sex', 'sys_auth', 'sys_api', 'deleted', 'flag', 'on_off', 'age', 'user_manager' ];
        const objs = Array.from(def.options);
        if(objs.length > 1) {
            var values = [];
            if(!Utils.isEmpty(this.props.value) && Array.isArray(this.props.value)) {
                values = this.props.value.map((o) => {
                    return (!Utils.isEmpty(o) && !Number.isNaN(Number(o)))?parseInt(o):o;
                });    
            }
            return objs.map((obj, idx) => {
                const checked = (!Utils.isEmpty(values) && values.includes(obj['value']))?true:false;
                // const oVal = (Utils.inJson(def, OPTIONS_KEY.OPTION_TARGET) && patitions.includes(def[OPTIONS_KEY.OPTION_TARGET]))?obj['id']:obj['value'];
                return (
                    <div key={ idx } className={ 'form-check' }>
                        <input type={ 'checkbox' }
                            id={ this.props.id + '_' + idx }
                            value={ obj['value'] }
                            checked={ checked }
                            onChange={ this._onChecked.bind(this) }
                            className={ 'form-check-input' } />
                        <label className="form-check-label" htmlFor={ this.props.id + '_' + idx }>{ obj['label'] }</label>
                    </div>
                );    
            });    
        } else {
            var obj = objs[0];
            var value = (Utils.isNumber(this.props.value))?parseInt(this.props.value):this.props.value;
            const checked = (value === obj['value'])?true:false;
            return (
                <div className={ 'form-check' }>
                    <input
                        type={ 'checkbox' }
                        id={ this.props.id + '_' + obj['value'] }
                        value={ obj['value'] }
                        checked={ checked }
                        onChange={() => this.props.onChange(event.target.checked?event.target.value:'')}
                        className={ 'form-check-input' } />    
                    <label className="form-check-label" htmlFor={ this.props.id + '_' + obj['value'] }>{ obj['label'] }</label>
                </div>
            );
        }
    }

    // UNSAFE_componentWillReceiveProps(props) {
    //     console.log("CheckBox componentWillReceiveProps");
    //     console.log(props);
    // }

    render() {
        return (
            <div className={ 'checkboxes' } id={ this.props.id }>
                { this._getCheckBox() }
            </div>
        );  
    }
}