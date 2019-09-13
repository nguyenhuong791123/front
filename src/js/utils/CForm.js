import React, { Component as C } from 'react';
import { Tabs, Tab } from 'react-bootstrap';
import Form from 'react-jsonschema-form-bs4';

import { ACTION, VARIANT_TYPES, SYSTEM } from '../utils/Types';
import { DRAG, MOUSE, TYPE, ALIGN, HTML_TAG, CUSTOMIZE } from '../utils/HtmlTypes';
import Html from '../utils/HtmlUtils'
import Utils from './Utils';

class CForm extends C {
    constructor(props) {
        super(props);

        this._onError = this._onError.bind(this);
        this._onSelect = this._onSelect.bind(this);

        // this._onMouseDown = this._onMouseDown.bind(this);
        // this._onDragStart = this._onDragStart.bind(this);
        // this._onDragOver = this._onDragOver.bind(this);
        // this._onDragDrop = this._onDragDrop.bind(this);
    
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

    // _onMouseDown(e) {
    //     // console.log(e.target.tagName);
    //     if(e.target.tagName === HTML_TAG.LEGEND) {
    //       this.state.draggable = 1;
    //       this.state.dragobject = e.target.parentElement.parentElement;
    //     } else if(e.target.tagName === HTML_TAG.LABEL) {
    //       this.state.draggable = 2;
    //       this.state.dragobject = e.target.parentElement;
    //     } else {
    //       this.state.draggable = 0;
    //       this.state.dragobject = null;
    //     }
    //   }
    
    //   _onDragStart(e) {
    //     if(this.state.draggable !== 1 && this.state.draggable !== 2) {
    //       e.preventDefault();
    //       e.stopPropagation();
    //     }
    //     console.log('_onDragStart');
    //   }
    
    //   _onDragOver(e) {
    //     e.preventDefault();
    //     // console.log('_onDragOver');
    //     // console.log(e);
    //   }
    
    //   _onDragDrop(e) {
    //     e.preventDefault();
    //     if(Utils.isEmpty(this.state.dragobject)) {
    //       e.stopPropagation();
    //       return;
    //     }
    //     console.log('_onDragDrop');
    //     var nps = [];
    //     var json = {};
    //     if(this.state.draggable === 1 && e.target.tagName === HTML_TAG.LEGEND) {
    //       const div = e.target.parentElement.parentElement;
    //       var keys = Object.keys(this.state.form.schema.properties);
    //       if(Utils.isEmpty(div.parentElement.childNodes) || div.parentElement.childNodes.length <= 0) return;
    //       const dragId = Array.from(div.parentElement.childNodes).indexOf(div);
    //       const dropId = Array.from(div.parentElement.childNodes).indexOf(this.state.dragobject);
    //       if(dragId < dropId) {
    //         div.before(this.state.dragobject);
    //         for(var drag=0; drag<keys.length; drag++) {
    //           if(drag === dropId) continue;
    //           if(drag === dragId) {
    //             json[keys[dropId]] = this.state.form.schema.properties[keys[dropId]];
    //             nps.push(json);
    //             json = {};
    //             json[keys[dragId]] = this.state.form.schema.properties[keys[dragId]];
    //             nps.push(json);
    //           } else {
    //             json = {};
    //             json[keys[drag]] = this.state.form.schema.properties[keys[drag]];
    //             nps.push(json);
    //           }
    //         }
    //       } else {
    //         div.after(this.state.dragobject);
    //         for(var drop=0; drop<keys.length; drop++) {
    //           if(drop === dropId) continue;
    //           if(drop === dragId) {
    //             json[keys[dragId]] = this.state.form.schema.properties[keys[dragId]];
    //             nps.push(json);
    //             json = {};
    //             json[keys[dropId]] = this.state.form.schema.properties[keys[dropId]];
    //             nps.push(json);
    //           } else {
    //             json = {};
    //             json[keys[drop]] = this.state.form.schema.properties[keys[drop]];
    //             nps.push(json);
    //           }
    //         }
    //       }
    //       json = {};
    //       for(var o=0; o<nps.length; o++) {
    //         var oks = Object.keys(nps[o]);
    //         for(var u=0; u<oks.length; u++) {
    //           json[oks[u]] = nps[o][oks[u]];
    //         }
    //       }
    //       this.state.form.schema.properties = json;
    //     }
    
    //     if(this.state.draggable === 2) {
    //       const div = e.target.parentElement;
    //       const tPDiv = div.parentElement;
    //       const dPObj = this.state.dragobject.parentElement;
    //       if(tPDiv.id !== dPObj.id) return;
    //       var dragId = Array.from(tPDiv.childNodes).indexOf(div);
    //       var dropId = Array.from(tPDiv.childNodes).indexOf(this.state.dragobject);
    //       if(!Utils.isEmpty(tPDiv.childNodes[0]) && tPDiv.childNodes[0].tagName === HTML_TAG.LEGEND) {
    //         if(dragId > 0) dragId -= 1;
    //         if(dropId > 0) dropId -= 1;
    //       }
    //       const jKey = tPDiv.id.replace('root_', '');
    //       const isJson = this.state.form.schema.properties[jKey].properties;
    //       keys = Object.keys(isJson);
    //       if(dragId < dropId) {
    //         div.before(this.state.dragobject);
    //         for(var drag=0; drag<keys.length; drag++) {
    //           if(drag === dropId) continue;
    //           if(drag === dragId) {
    //             json[keys[dropId]] =isJson[keys[dropId]];
    //             nps.push(json);
    //             json = {};
    //             json[keys[dragId]] = isJson[keys[dragId]];
    //             nps.push(json);
    //           } else {
    //             json = {};
    //             json[keys[drag]] = isJson[keys[drag]];
    //             nps.push(json);
    //           }
    //         }
    //       } else {
    //         div.after(this.state.dragobject);
    //         for(var drop=0; drop<keys.length; drop++) {
    //           if(drop === dropId) continue;
    //           if(drop === dragId) {
    //             json[keys[dragId]] =isJson[keys[dragId]];
    //             nps.push(json);
    //             json = {};
    //             json[keys[dropId]] = isJson[keys[dropId]];
    //             nps.push(json);
    //           } else {
    //             json = {};
    //             json[keys[drop]] = isJson[keys[drop]];
    //             nps.push(json);
    //           }
    //         }
    //       }
    //       json = {};
    //       for(var i=0; i<nps.length; i++) {
    //         var oks = Object.keys(nps[i]);
    //         for(var l=0; l<oks.length; l++) {
    //           json[oks[l]] = nps[i][oks[l]];
    //         }
    //       }
    //       this.state.form.schema.properties[jKey].properties = json;
    //       console.log(this.state.form.schema.properties[jKey].properties);
    //       console.log(this.state.form.schema.properties);
    //     }
    //   }
    
    //   _onMouseOver(e) {
    //     const obj = e.target;
    //     console.log(obj.tagName);
    //     if(obj.tagName !== HTML_TAG.LEGEND && obj.tagName !== HTML_TAG.LABEL) return;
    //     obj.addEventListener(MOUSE.MOUSEOUT, this._onMouseOut.bind(this), false);
    //     this.state.alertActions.show = true;
    //     this.state.alertActions.style = { top: obj.offsetTop, left: (obj.offsetLeft + obj.offsetWidth) - 70 };
    //     var className = 'div-customize-actions';
    //     if(obj.tagName === HTML_TAG.LABEL) {
    //       className += ' div-customize-actions-child';
    //       this.state.alertActions.style.left = (this.state.alertActions.style.left + 25);
    //     }
    //     this.state.alertActions.class = className;
    //     this.state.dragobject = obj;
    //     this.forceUpdate();
    //   }
    
    //   _onMouseOut(e) {
    //     const obj = this._getButton(e);
    //     console.log(obj.tagName);
    //     if(obj.tagName === HTML_TAG.BUTTON) {
    //       this.state.alertActions.show = true;
    //     } else {
    //       this.state.alertActions.show = false;
    //     }
    //     if(!Utils.isEmpty(this.state.dragobject)) {
    //       this.state.dragobject.removeEventListener(MOUSE.MOUSEOUT, this._onMouseOut.bind(this), false);
    //     }
    //     this.forceUpdate();
    //   }
    
    //   _getButton(e) {
    //     var obj = e.target;
    //     if(obj.tagName === HTML_TAG.BUTTON) return obj;
    //     if(obj.tagName === HTML_TAG.PATH) {
    //       obj = e.target.parentElement.parentElement;
    //     }
    //     if(obj.tagName === HTML_TAG.SVG) {
    //       obj = e.target.parentElement;
    //     }
    //     return obj;
    //   }

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
        console.log(f.schema.properties);
        if(!Utils.inJson(f.schema, 'tab_name')) return "";
          const fKey = 'form_key_' + index;
            return(
                <Tab key={ index } eventKey={ index } title={  f.schema.tab_name }>
                    <Form
                        key={ fKey }
                        schema={ f.schema }
                        uiSchema={ f.ui }
                        formData={ f.data }
                        onError={ this._onError.bind(this) }>
                        <button type="submit" className="btn-submit-form-hidden" />
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

    // componentDidMount() {
    //     var div = document.getElementById(SYSTEM.IS_DIV_CUSTOMIZE_BOX);
    //     if(Utils.isEmpty(div) || div.childNodes.length <= 0) return;
    //     div.addEventListener(MOUSE.MOUSEDOWN, this._onMouseDown.bind(this), true);
    //     div.addEventListener(DRAG.OVER, this._onDragOver.bind(this), false);
    //     div.addEventListener(DRAG.DROP, this._onDragDrop.bind(this), false);
    //     div.addEventListener(MOUSE.MOUSEOVER, this._onMouseOver.bind(this), false);
    //     console.log(div.childNodes);
    //     console.log(div.childNodes.length);
    //     const objs = Array.from(div.childNodes);
    //     for(var i=0; i<objs.length; i++) {
    //       const cDiv = objs[i];
    //       if(Utils.isEmpty(cDiv.childNodes)||  Utils.isEmpty(cDiv.childNodes[0])) continue;
    //       cDiv.setAttribute(DRAG.ABLE, 'true');
    //       cDiv.addEventListener(DRAG.START, this._onDragStart.bind(this), false);
    //       const tag =  cDiv.childNodes[0].tagName;
    //       if(tag === HTML_TAG.FORM) {
    //         div = div.childNodes[i].childNodes[0].childNodes[0];
    //         console.log(tag);
    //         console.log(div);
    //       }
    //       if(tag === HTML_TAG.NAV && cDiv.childNodes.length > 1) {
    //         div = cDiv.childNodes[1].childNodes[0].childNodes[0].childNodes[0];
    //         // cDiv.childNodes[0].setAttribute(DRAG.ABLE, 'true');
    //         // cDiv.childNodes[0].addEventListener(DRAG.START, this._onDragStart.bind(this), false);
    //         console.log(tag);
    //         console.log(div);
    //       }
    //     }

    //     // if(Utils.isEmpty(div)) return;
    //     // if(Utils.isEmpty(div.childNodes[0])) return;
    //     // // if(Utils.isEmpty(div.childNodes[0].childNodes[0])) return;
    //     // div.childNodes[0].addEventListener(MOUSE.MOUSEDOWN, this._onMouseDown.bind(this), true);
    //     // div.childNodes[0].addEventListener(DRAG.OVER, this._onDragOver.bind(this), false);
    //     // div.childNodes[0].addEventListener(DRAG.DROP, this._onDragDrop.bind(this), false);
    //     // div.childNodes[0].addEventListener(MOUSE.MOUSEOVER, this._onMouseOver.bind(this), false);
    //     // const divDrags = div.childNodes[0].childNodes;
    //     // console.log(divDrags);
    //     // for(let y=0; y<divDrags.length; y++) {
    //     //     const drags = divDrags[y];
    //     //     console.log(drags);
    //     //     const dragChilds = drags.childNodes[0].childNodes;
    //     //     if(Utils.isEmpty(dragChilds)) continue;
    //     //     console.log(dragChilds);
    //     //     drags.setAttribute(DRAG.ABLE, 'true');
    //     //     drags.addEventListener(DRAG.START, this._onDragStart.bind(this), false);
    //     //     for(var c=0; c<dragChilds.length; c++) {
    //     //         const dDrag = dragChilds[c];
    //     //         console.log(dDrag);
    //     //         if(c === 0 && dDrag.tagName === HTML_TAG.LEGEND) continue;
    //     //         dDrag.setAttribute(DRAG.ABLE, 'true');
    //     //         dDrag.ondragstart = this._onDragStart.bind(this);
    //     //     }
    //     // }
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
