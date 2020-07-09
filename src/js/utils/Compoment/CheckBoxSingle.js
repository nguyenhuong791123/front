import React, { Component as C } from 'react';

export default class CheckBoxSingle extends C {
    render() {
        const obj = this.props.schema.obj.lists[0];
        // const def = this.props.schema.default;
        console.log(this.props.schema);
        return (
            <div className={ 'form-check-inline' }>
                <input
                    type={ 'checkbox' }
                    id={ this.props.id + '_' + obj['value'] }
                    value={ obj['value'] }
                    onChange={() => this.props.onChange(event.target.checked?event.target.value:'')}
                    className={ 'form-check-input' } />    
                <label className="form-check-label" htmlFor={ this.props.id + '_' + obj['value'] }>{ obj['label'] }</label>
            </div>
        );  
    }
}
