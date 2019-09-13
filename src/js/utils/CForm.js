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

    _setForm() {
        this.state.form = [
            {
                object_type: 'div'
                ,object: {
                    schema: {
                        type: 'object'
                        ,properties: {
                            cust_info: {
                                type: 'object'
                                ,title: '顧客情報'
                                ,background: ''
                                ,properties: {
                                    cust_name_hira: { type: 'string' }
                                }
                            }
                        }
                    },
                    ui: {
                        cust_info: {
                            classNames: 'draggable-top-box div-top-box div-top-box-50'
                            ,cust_name_hira: { 'ui:placeholder': '顧客', classNames: 'div-box div-box-50' }
                        }
                    },
                    data: {}
                }
            },
            {
                object_type: 'tab'
                ,active: 1
                ,object: [
                    {
                        schema: {
                            type: 'object'
                            ,properties: {
                                cust_info: {
                                    type: 'object'
                                    ,title: '顧客情報1'
                                    ,background: ''
                                    ,properties: {
                                        cust_name_hira: { type: 'string' }
                                    }
                                }
                            }
                        },
                        ui: {
                            cust_info: {
                                classNames: 'draggable-top-box div-top-box div-top-box-50'
                                ,cust_name_hira: { 'ui:placeholder': '顧客1', classNames: 'div-box div-box-50' }
                            }
                        },
                        data: {}
                    }
                ]
            }
        ]
    }

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

    _getTabs(items, active) {
        if(Utils.isEmpty(items) || items.length === 0) return "";
        const tabs = items.map((f, index) => {
            const obj = Object.keys(f.schema.properties);
            if(obj.length > 1 || Utils.isEmpty(f.schema.properties[obj[0]].title)) return "";
            const fKey = 'form_key_' + index;
            console.log(f.schema.properties[obj[0]]);
            console.log(f.schema.properties[obj[0]].title);
            return(
                <Tab key={ index } eventKey={ index } title={ f.schema.properties[obj[0]].title }>
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
        return items.map((o, index) => {
            return (
                <div>
                    <Tabs key={ index } defaultActiveKey={ active } onSelect={ this._onSelect.bind(this) }>
                        { tabs }
                    </Tabs>
                </div>
            );
        });
    }

    _build() {
        if(Utils.isEmpty(this.state.form) || this.state.form.length <= 0) return "";
        var f = this.state.form;
        if(Utils.isEmpty(f) || f.length <= 0) return "";
        return f.map((obj, index) => {
            const t = obj.object_type;
            // const id = 'div_form_box_' + index;
            if(t === 'div') {
                return(
                    <Form
                        key={ index }
                        schema={ obj.object.schema }
                        uiSchema={ obj.object.ui }
                        formData={ obj.object.data }
                        onError={ this._onError.bind(this) }>
                        {/* { this._onAlertActions() } */}
                    </Form>
                );
            } else if(t === 'tab' && obj.object.length > 0) {
               return( this._getTabs(obj.object, obj.active) );
            } else {
                return "";
            }
        });
    }

    componentWillMount() {
        this._setForm();
    }

    render() {
        return ( this._build() );
    };
};

export default CForm;
