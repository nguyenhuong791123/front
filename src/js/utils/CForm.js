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

    _getTabs(idx, items, active, className) {
        if(Utils.isEmpty(items) || items.length === 0) return "";
        const tabs = items.map((f, index) => {
        if(!Utils.inJson(f.schema, 'tab_name')) return "";
            const fKey = 'tab_' + index;
            return(
                <Tab key={ index } eventKey={ index } title={  f.schema.tab_name }>
                    <FormBS4
                        // idPrefix={ index + "-tab" }
                        key={ fKey }
                        schema={ f.schema }
                        uiSchema={ f.ui }
                        formData={ f.data }
                        onChange={ this._onChange.bind(this) }
                        onError={ this._onError.bind(this) }>
                        <button type="submit" id={ 'tab_bt_' + index } className="btn-submit-form-hidden" />
                    </FormBS4>
                </Tab>
            );
        });
        return (
            <div key={ idx } id={ 'div_customize_' + idx } idx={ idx } className={ className }>
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
                    <div key={ index } id={ 'div_customize_' + index } idx={ index } className={ className }>
                        <FormBS4
                            // idPrefix={ index + "-div" }
                            key={ index }
                            schema={ o.object.schema }
                            uiSchema={ o.object.ui }
                            formData={ o.object.data }
                            onChange={ this._onChange.bind(this) }
                            onError={ this._onError.bind(this) }>
                            <button type="submit" id={ 'div_bt_' + index } className="btn-submit-form-hidden" />
                        </FormBS4>
                    </div>
                );
            } else if(t === 'tab' && o.object.length > 0) {
               return( this._getTabs(index, o.object, o.active, className) );
            } else {
                return "";
            }
        });
    }

    // UNSAFE_componentWillReceiveProps(nextProps) {
    //     if (this.props.form !== nextProps.form) {
    //         this.setState({
    //             form: nextProps.form > this.props.form,
    //         });
    //     }
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
