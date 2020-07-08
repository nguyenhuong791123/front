import React, { Component as C } from 'react';
import { Tabs, Tab } from 'react-bootstrap';
import Form from 'react-jsonschema-form-bs4';

import { SYSTEM } from '../utils/Types';
import Utils from './Utils';

class CForm extends C {
    constructor(props) {
        super(props);

        this._onChange = this._onChange.bind(this);
        this._onError = this._onError.bind(this);
        this._onSelect = this._onSelect.bind(this);
    
        this.state = { isUser: this.props.isUser, form: this.props.form };
    };

    _onChange(e) {
        this.props.updateFormData(e);
    }

    _onError(errors) {
        console.log('I have', errors.length, 'errors to fix');
    }

    _onSelect(tabIdx) {
        console.log(tabIdx);
        console.log(this.state.form);
    }

    _getTabs(idx, items, active, className) {
        if(Utils.isEmpty(items) || items.length === 0) return "";
        const tabs = items.map((f, index) => {
        // const obj = Object.keys(f.schema.properties);
        // console.log(f.schema.properties);
        if(!Utils.inJson(f.schema, 'tab_name')) return "";
          const fKey = 'form_key_' + index;
            return(
                <Tab key={ index } eventKey={ index } title={  f.schema.tab_name }>
                    <Form
                        key={ fKey }
                        schema={ f.schema }
                        uiSchema={ f.ui }
                        formData={ f.data }
                        onChange={ this._onChange.bind(this) }
                        onError={ this._onError.bind(this) }>
                        <button type="submit" className="btn-submit-form-hidden" />
                    </Form>
                </Tab>
            );
        });
        return (
            <div key={ idx } id={ 'div_customize_' + idx } className={ className }>
                <Tabs key={ idx } defaultActiveKey={ active } onSelect={ this._onSelect.bind(this) }>
                    { tabs }
                </Tabs>
            </div>
        );
    }

    _build() {
        if(Utils.isEmpty(this.state.form) || this.state.form.length <= 0) return "";
        var f = this.state.form;
        if(Utils.isEmpty(f) || f.length <= 0) return "";
        return f.map((o, index) => {
            const t = o.object_type;
            const className = Utils.inJson(o, 'class_name')?o.class_name:"";
            if(t === 'div') {
                return(
                    <div key={ index } id={ 'div_customize_' + index } className={ className }>
                        <Form
                            key={ index }
                            schema={ o.object.schema }
                            uiSchema={ o.object.ui }
                            formData={ o.object.data }
                            onChange={ this._onChange.bind(this) }
                            onError={ this._onError.bind(this) }>
                            <button type="submit" className="btn-submit-form-hidden" />
                        </Form>
                    </div>
                );
            } else if(t === 'tab' && o.object.length > 0) {
               return( this._getTabs(index, o.object, o.active, className) );
            } else {
                return "";
            }
        });
    }

    // UNSAFE_componentWillUpdate(nextProps, nextState) {
    //     console.log('CREATE FORM componentWillUpdate');
    //     console.log(nextProps);
    //     console.log(nextState);
    //     console.log(this.state.form);
    // }

    render() {
        return (
            <div id={ SYSTEM.IS_DIV_CUSTOMIZE_BOX } className='div-customize-box'>
                { this._build() }
            </div>
        );
    };
};

export default CForm;
