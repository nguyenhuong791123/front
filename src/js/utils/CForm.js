import React, { Component as C } from 'react';
import { Tabs, Tab, Button } from 'react-bootstrap';
import FormBS4 from 'react-jsonschema-form-bs4';
import { FaPlus } from 'react-icons/fa';

import { SYSTEM, VARIANT_TYPES } from '../utils/Types';
import { HTML_TAG } from '../utils/HtmlTypes';

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

    _getTabs(idx, items, fromId, active, className) {
        if(Utils.isEmpty(items) || items.length === 0) return "";
        const tabs = items.map((f, index) => {
        if(!Utils.inJson(f.schema, 'tab_name')) return "";
            const fKey = 'tab_' + index;
            return(
                <Tab key={ index } eventKey={ index } title={ f.schema.tab_name }>
                    <FormBS4
                        idPrefix={ fromId + '_' + index }
                        key={ fKey }
                        schema={ f.schema }
                        uiSchema={ f.ui }
                        formData={ f.data }
                        onChange={ this._onChange.bind(this) }
                        onError={ this._onError.bind(this) }>
                        <button type="submit" id={ 'tab_bt_' + index + '_' + fromId } className="btn-submit-form-hidden" />
                    </FormBS4>
                </Tab>
            );
        });
        return (
            <div key={ idx } id={ 'div_customize_' + idx } fromid={ fromId } idx={ idx } className={ className }>
                <Tabs key={ idx } defaultActiveKey={ active } onSelect={ this._onSelect.bind(this) }>
                    { tabs }
                </Tabs>
            </div>
        );
    }

    _build() {
        if(Utils.isEmpty(this.state.form) || this.state.form.length <= 0) return "";
        var f = this.state.form;
        if(Utils.isEmpty(f) || !Array.isArray(f) || f.length <= 0) return "";
        return f.map((o, index) => {
            const t = o.object_type;
            const className = Utils.inJson(o, 'className')?o.className:"";
            // console.log(o.object.ui);
            if(t === 'div') {
                return(
                    <div key={ index } id={ 'div_customize_' + index } fromid={ o.object_key } idx={ index } className={ className }>
                        <FormBS4
                            idPrefix={ o.object_key }
                            key={ index }
                            schema={ o.object.schema }
                            uiSchema={ o.object.ui }
                            formData={ o.object.data }
                            onChange={ this._onChange.bind(this) }
                            onError={ this._onError.bind(this) }>
                            <button type="submit" id={ 'div_bt_' + index + '_' + o.object_key } className="btn-submit-form-hidden" />
                        </FormBS4>
                    </div>
                );
            } else if(t === 'tab' && o.object.length > 0) {
               return( this._getTabs(index, o.object, o.object_key, o.active, className) );
            } else {
                return "";
            }
        });
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        console.log('Form');
        if (this.state.form !== nextProps.form) {
            console.log(this.state.form);
            this.setState({ form: nextProps.form });
        }
    }

    // UNSAFE_componentWillUnmount() {
    //     this.props.cancel();
    // }

    render() {
        // console.log(this.props.form);
        return (
            <div id={ SYSTEM.IS_DIV_CUSTOMIZE_BOX } className='div-customize-box'>
                { this._build() }
            </div>
        );
    };
};

export default CForm;
