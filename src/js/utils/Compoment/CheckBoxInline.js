import React, { Component as C } from 'react';

export default class CheckBoxInline extends C {
    _onChecked(e) {
        const obj = e.target;
        if(obj === undefined) return;
        var checkeds = [];
        const divs = Array.from(obj.parentElement.parentElement.childNodes);
        if(divs === undefined) return;
        divs.map((o) => {
            const input = o.childNodes[0];
            if(input.tagName === 'INPUT' && input.checked) checkeds.push(input.value);
        });
        this.props.onChange(checkeds);
    }
  
    _getCheckBox() {
        const objs = Array.from(this.props.schema.obj.lists);
        return objs.map((obj, idx) => {
            return (
            <div key={ idx } className={ 'form-check' }>
                <input type={ 'checkbox' }
                id={ this.props.id + '_' + idx }
                value={ obj['value'] }
                onChange={ this._onChecked.bind(this) }
                className={ 'form-check-input' } />
                <label className="form-check-label" htmlFor={ this.props.id + '_' + idx }>{ obj['label'] }</label>
            </div>
            );    
        });
    }

    render() {
        return (
            <div className={ 'checkboxes' }>
            { this._getCheckBox( )}
            </div>
      );  
    }
}