import React, { Component as C } from 'react';
import { Tabs, Tab } from 'react-bootstrap';
import Form from 'react-jsonschema-form-bs4';

import Utils from './Utils';

class CForm extends C {
    constructor(props) {
        super(props);

        this._onError = this._onError.bind(this);
        this._onSelect = this._onSelect.bind(this);
        this.state = { isUser: this.props.isUser, form: this.props.form };
    };

    // _setForm() {
    //     this.state.form = [
    //         {
    //             object_type: 'div'
    //             ,class_name: 'div-box-50'
    //             ,object: {
    //                 schema: {
    //                     type: 'object'
    //                     ,properties: {
    //                         cust_info: {
    //                             type: 'object'
    //                             ,title: '顧客情報'
    //                             ,background: ''
    //                             ,properties: {
    //                                 cust_name_hira: { type: 'string' }
    //                             }
    //                         }
    //                     }
    //                 },
    //                 ui: {
    //                     cust_info: {
    //                         // classNames: 'draggable-top-box div-top-box div-top-box-50',
    //                         cust_name_hira: { 'ui:placeholder': '顧客', classNames: 'div-box div-box-50' }
    //                     }
    //                 },
    //                 data: {}
    //             }
    //         },
    //         {
    //             object_type: 'tab'
    //             ,active: 0
    //             ,class_name: 'div-box-50'
    //             ,object: [
    //                 {
    //                     schema: {
    //                         type: 'object'
    //                         ,tab_name: '顧客情報1'
    //                         ,properties: {
    //                             cust_info: {
    //                                 type: 'object'
    //                                 ,background: ''
    //                                 ,properties: {
    //                                     cust_name_hira: { type: 'string' }
    //                                     ,cust_name_kana: { type: 'string' }
    //                                     ,phone: { type: 'string' }
    //                                 }
    //                             }
    //                         }
    //                     },
    //                     ui: {
    //                         cust_info: {
    //                             // classNames: 'draggable-top-box div-top-box div-top-box-50',
    //                             cust_name_hira: { 'ui:placeholder': '顧客1', classNames: 'div-box div-box-50' }
    //                             ,cust_name_kana: { 'ui:placeholder': '顧客カナ1', classNames: 'div-box div-box-50' }
    //                             ,phone: { 'ui:placeholder': 'Phone', classNames: 'div-box div-box-50' }
    //                 }
    //                     },
    //                     data: {}
    //                 },
    //                 {
    //                     schema: {
    //                         type: 'object'
    //                         ,tab_name: '顧客情報2'
    //                         ,properties: {
    //                             cust_info: {
    //                                 type: 'object'
    //                                 ,background: ''
    //                                 ,properties: {
    //                                     cust_name_hira: { type: 'string' }
    //                                     ,cust_name_kana: { type: 'string' }
    //                                     ,phone: { type: 'string' }
    //                                 }
    //                             }
    //                         }
    //                     },
    //                     ui: {
    //                         cust_info: {
    //                             // classNames: 'draggable-top-box div-top-box div-top-box-50',
    //                             cust_name_hira: { 'ui:placeholder': '顧客1', classNames: 'div-box div-box-50' }
    //                             ,cust_name_kana: { 'ui:placeholder': '顧客カナ1', classNames: 'div-box div-box-50' }
    //                             ,phone: { 'ui:placeholder': 'Phone', classNames: 'div-box div-box-50' }
    //                 }
    //                     },
    //                     data: {}
    //                 }
    //             ]
    //         }
    //     ]
    // }

    _onError(errors) {
        console.log('I have', errors.length, 'errors to fix');
    }

    _onSelect(tabIdx) {
        console.log(tabIdx);
    }

    // _onAlertActions() {
    //     return(
    //       <Alert
    //             show={ this.state.alertActions.show }
    //             variant={ VARIANT_TYPES.LIGHT }
    //             className={ this.state.alertActions.class }
    //             style={ this.state.alertActions.style }>
    //             <Button
    //                 type={ HTML_TAG.BUTTON }
    //                 onMouseOver={ this._onMouseOut.bind(this) }
    //                 onClick={ this._onOpenEdit.bind(this) }
    //                 variant={ VARIANT_TYPES.SECONDARY }>
    //                 <FaEdit />
    //             </Button>
    //             <Button
    //                 type={ HTML_TAG.BUTTON }
    //                 onMouseOver={ this._onMouseOut.bind(this) }
    //                 onClick={ this._onOpenDelete.bind(this) }
    //                 variant={ VARIANT_TYPES.DANGER }>
    //                 <FaTrash />
    //             </Button>
    //         </Alert>
    //     );
    // }

    _getTabs(idx, items, active, className) {
        if(Utils.isEmpty(items) || items.length === 0) return "";
        const tabs = items.map((f, index) => {
            const obj = Object.keys(f.schema.properties);
            if(obj.length > 1 || !Utils.inJson(f.schema, 'tab_name')) return "";
            const fKey = 'form_key_' + index;
            return(
                <Tab key={ index } eventKey={ index } title={  f.schema.tab_name }>
                    <Form
                        key={ fKey }
                        schema={ f.schema }
                        uiSchema={ f.ui }
                        formData={ f.data }
                        onError={ this._onError.bind(this) }>
                        {/* { this._onAlertActions() } */}
                    </Form>
                </Tab>
            );
        });
        return (
            <div key={ idx } className={ className }>
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
            // const id = 'div_form_box_' + index;
            const className = Utils.inJson(o, 'class_name')?o.class_name:"";
            // console.log(o);
            // console.log(o.class_name);
            // console.log(Utils.inJson(o, 'class_name'));
            if(t === 'div') {
                return(
                    <div key={ index } className={ className }>
                        <Form
                            key={ index }
                            schema={ o.object.schema }
                            uiSchema={ o.object.ui }
                            formData={ o.object.data }
                            onError={ this._onError.bind(this) }>
                            {/* { this._onAlertActions() } */}
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

    // componentWillMount() {
    //     this._setForm();
    // }

    render() {
        return (
            <div className='div-customize-box'>
                { this._build() }
            </div>
        );
    };
};

export default CForm;
