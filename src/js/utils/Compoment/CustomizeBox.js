import React, { Component as C } from 'react';
import { Button, Form, FormControl } from 'react-bootstrap';
import { FaPlus, FaMinus } from 'react-icons/fa';

// import InputCalendarBox from './CalendarBox';

import { VARIANT_TYPES, ACTION } from '../Types';
import { TYPE, ALIGN, HTML_TAG, CUSTOMIZE, BOX_WIDTH, BOX_HEIGHT, OPTIONS, OPTIONS_KEY, OPTION_AUTH, REGEXS } from '../HtmlTypes';
import Html from '../HtmlUtils'
import Utils from '../Utils';
import { fileToBase64 } from '../FileUtils';

import Msg from '../../../msg/Msg';

export default class CustomizeBox extends C {
    constructor(props) {
        super(props);

        this._onChange = this._onChange.bind(this);
        this._onAddItem = this._onAddItem.bind(this);
        this._onRemoveItem = this._onRemoveItem.bind(this);

        this.state = {
            isUser: this.props.isUser
            ,pages: this.props.pages
            ,mode: this.props.mode
            ,editBox: this.props.editBox
            ,dragobject: this.props.dragobject
            ,items: []
            ,aligns: []
            ,widths: []
            ,heights: []
            ,languages: []
            ,options: []
            ,optionTargets: {}
            ,defaultType: TYPE.TEXT
        }
    }

    _onAddItem() {
        this.state.editBox.obj[OPTIONS_KEY.OPTIONS].push({'value': '', 'label': ''});
        this.props.updateEditBox(this.state.editBox);
      }

    _onRemoveItem(e) {
        var obj = Html.getButton(e);
        if(Utils.isEmpty(obj)) return;
        var idx = obj.id.split('_')[1];
        if(Number.isNaN(Number(idx))) return;
        this.state.editBox.obj[OPTIONS_KEY.OPTIONS].splice(idx, 1);
        this.props.updateEditBox(this.state.editBox);
    }

    _onloadOptions() {
        var objs = Object.keys(TYPE);
        for (let i=0; i<objs.length; i++) {
            this.state.items.push( <option key={ i } value={ TYPE[objs[i]] }>{ TYPE[objs[i]] }</option> );
        }
        objs = Object.keys(ALIGN);
        for (let i=0; i<objs.length; i++) {
            this.state.aligns.push( <option key={ i } value={ ALIGN[objs[i]] }>{ ALIGN[objs[i]] }</option> );
        }
        objs = Object.keys(BOX_WIDTH);
        for (let i=0; i<objs.length; i++) {
            this.state.widths.push( <option key={ i } value={ objs[i] }>{ BOX_WIDTH[objs[i]] }</option> );
        }
        objs = Object.keys(BOX_HEIGHT);
        for (let i=0; i<objs.length; i++) {
            this.state.heights.push( <option key={ i } value={ objs[i] }>{ BOX_HEIGHT[objs[i]] }</option> );
        }
        objs = Html.getLanguages(); 
        for(let i=0; i<objs.length; i++) {
            this.state.languages.push( <option key={ i } value={ objs[i] }>{ Msg.getMsg(null, this.state.isUser.language, objs[i]) }</option> );
        }
        objs = OPTIONS; 
        this.state.options.push( <option key={ 'blank' } value={ '' }>{ '---' }</option> );
        for(let i=0; i<objs.length; i++) {
            this.state.options.push( <option key={ i } value={ objs[i] }>{ Msg.getMsg(null, this.state.isUser.language, objs[i]) }</option> );
            this.state.optionTargets[objs[i]] = [{ 'value': 1, 'label': 'User1' }];
        }

        if(this.state.mode !== ACTION.EDIT) {
            this.state.dragobject = null;
        }
    }

    _onChange(e) {
        const obj = e.target;
        if(Utils.isEmpty(obj)) return;
        const name = obj.name;
        const editBox = this.state.editBox;
        const type = editBox.obj[CUSTOMIZE.TYPE];

        if(name === CUSTOMIZE.DEFAULT && (type === TYPE.FILE || type === TYPE.IMAGE)) {
            var files = obj.files;
            console.log(files);
            if(Utils.isEmpty(files) || files.length <= 0) {
                if(Utils.inJson(editBox.obj, OPTIONS_KEY.OPTIONS_FILE)) delete editBox.obj[OPTIONS_KEY.OPTIONS_FILE];
            } else {
                fileToBase64(files, editBox);
                console.log(editBox.obj[OPTIONS_KEY.OPTIONS_FILE]);
            }
            delete editBox.obj[OPTIONS_KEY.OPTION_CHECKED];
            delete editBox.obj[OPTIONS_KEY.OPTION_TARGET];
            delete editBox.obj[OPTIONS_KEY.OPTIONS];
        } else {
            var val = (!Utils.isEmpty(obj.value) && !Number.isNaN(Number(obj.value)))?parseInt(obj.value):obj.value;
            if(name === 'obj_lists'
                && (type === TYPE.CHECKBOX || type === TYPE.RADIO || type === TYPE.SELECT)
                && name !== CUSTOMIZE.LANGUAGE ) {
                var idx = obj.id.split('_')[1];
                if(Number.isNaN(Number(idx))) return;
                var lObj = editBox.obj[OPTIONS_KEY.OPTIONS][idx];
                if(obj.id.startsWith('values_')) {
                    lObj['value'] = val;
                    // lObj['value'] = (!Number.isNaN(Number(obj.value)))?parseInt(obj.value):obj.value;
                } 
                if(obj.id.startsWith('labels_')) {
                    lObj['label'] = obj.value;
                }
                editBox.obj[OPTIONS_KEY.OPTIONS][idx] = lObj;
            } else if([ CUSTOMIZE.SEARCH , CUSTOMIZE.VIEW, CUSTOMIZE.CREATE, CUSTOMIZE.EDIT ].includes(name)) {
                editBox.obj[CUSTOMIZE.AUTH][name] = obj.checked;
            } else if(name === OPTIONS_KEY.OPTION_TARGET && (type === TYPE.CHECKBOX || type === TYPE.RADIO || type === TYPE.SELECT)) {
                editBox.obj[OPTIONS_KEY.OPTION_TARGET] = val;
                editBox.obj[CUSTOMIZE.DEFAULT] = '';
                if(Utils.isEmpty(val)) {
                    editBox.obj[OPTIONS_KEY.OPTIONS] = [{ 'value': '', 'label': '' }];
                } else {
                    const options = this.state.optionTargets[val];
                    if(Array.isArray(options) && options.length > 0) {
                        editBox.obj[OPTIONS_KEY.OPTIONS] = [];
                        options.map((o) => {
                            editBox.obj[OPTIONS_KEY.OPTIONS].push({ 'value': (!Number.isNaN(Number(o['value'])))?parseInt(o['value']):o['value'], 'label': o['label'] });
                        });
                    }    
                }
            } else if(name.indexOf(OPTIONS_KEY.OPTIONS_ITEM) !== -1
                    && (type === TYPE.HIDDEN || type === TYPE.DISABLE || type === TYPE.CHILDENS || type === TYPE.QRCODE)) {
                const value = !Number.isNaN(Number(val))?parseInt(val):val;
                if(type === TYPE.QRCODE) {
                    if(!Array.isArray(editBox.obj[OPTIONS_KEY.OPTIONS_ITEM])) {
                        editBox.obj[OPTIONS_KEY.OPTIONS_ITEM] = [];
                    }
                    if(obj.checked) {
                        editBox.obj[OPTIONS_KEY.OPTIONS_ITEM].push(value);
                    }
                    if(!obj.checked && editBox.obj[OPTIONS_KEY.OPTIONS_ITEM].includes(value)) {
                        var idx = editBox.obj[OPTIONS_KEY.OPTIONS_ITEM].indexOf(value);
                        editBox.obj[OPTIONS_KEY.OPTIONS_ITEM].splice(idx, 1);
                    }
                } else {
                    editBox.obj[OPTIONS_KEY.OPTIONS_ITEM] = value;
                }
            } else {
                if(obj.type === TYPE.CHECKBOX) {
                    val = obj.checked;
                }
                if (name === CUSTOMIZE.LABEL || name === CUSTOMIZE.PLACEHOLDER) {
                    editBox.obj[name][editBox.obj[CUSTOMIZE.LANGUAGE]] = val;
                } else {
                    editBox.obj[name] = val;
                    const options = [ TYPE.CHECKBOX, TYPE.RADIO, TYPE.SELECT ];
                    if(!options.includes(type) && !options.includes(name) && name !== CUSTOMIZE.LANGUAGE) {
                        delete editBox.obj[OPTIONS_KEY.OPTION_CHECKED];
                        delete editBox.obj[OPTIONS_KEY.OPTION_TARGET];
                        delete editBox.obj[OPTIONS_KEY.OPTIONS];
                        if (name === TYPE.CHILDENS && !Utils.isEmpty(editBox.obj[OPTIONS_KEY.OPTIONS_ITEM]))
                            delete editBox.obj[OPTIONS_KEY.OPTIONS_ITEM];
                    }                        
                }
            }
    
            if(Utils.inJson(editBox, OPTIONS_KEY.OPTIONS_FILE)) delete editBox[OPTIONS_KEY.OPTIONS_FILE];
        }
    
        if(Utils.isEmpty(editBox.obj[CUSTOMIZE.BOX_WIDTH])) {
          if(editBox.obj[CUSTOMIZE.TYPE] === TYPE.CHILDENS) {
            editBox.obj[CUSTOMIZE.BOX_WIDTH] = 100;
            editBox.obj[CUSTOMIZE.BOX_HEIGHT] = 160;
          } else {
            editBox.obj[CUSTOMIZE.BOX_WIDTH] = 25;
          }
        }
        if(Utils.isEmpty(editBox.obj[CUSTOMIZE.BOX_HEIGHT])) {
          editBox.obj[CUSTOMIZE.BOX_HEIGHT] = 80;
        }
        console.log(editBox);
        this.props.updateEditBox(editBox);
    }


    // _fileToBase64(files, editObj) {
    //     editObj.obj[OPTIONS_KEY.OPTIONS_FILE] = [];
    //     Object.keys(files).map(i => {
    //         var f = {};
    //         var reader = new FileReader();
    //         reader.onload = function () {
    //             f['name'] = files[i].name;
    //             f['data'] = reader.result;
    //             editObj.obj[OPTIONS_KEY.OPTIONS_FILE].push(f);
    //         };
    //         reader.readAsDataURL(files[i]);
    //     });
    // }    

    UNSAFE_componentWillMount() {
        this._onloadOptions();
    }

    render() {
        const obj = this.state.dragobject;
        const editBox = this.state.editBox.obj;
        const dateType = [ TYPE.DATE, TYPE.DATETIME, TYPE.TIME ];
        if(dateType.includes(editBox[CUSTOMIZE.TYPE])) {
            this.state.defaultType = (editBox[CUSTOMIZE.TYPE] === TYPE.DATETIME)?'datetime-local':editBox[CUSTOMIZE.TYPE];
        } else if(editBox[CUSTOMIZE.TYPE] === TYPE.NUMBER) {
            this.state.defaultType = TYPE.NUMBER;
        } else {
            this.state.defaultType = TYPE.TEXT;
        }
        if(Utils.isEmpty(editBox[CUSTOMIZE.DEFAULT]) && editBox[CUSTOMIZE.COLOR] === TYPE.COLOR) editBox[CUSTOMIZE.DEFAULT] = '#';
        if(Utils.isEmpty(editBox[CUSTOMIZE.LABEL_COLOR])) editBox[CUSTOMIZE.LABEL_COLOR] = '#';
        if(Utils.isEmpty(editBox[CUSTOMIZE.LABEL_LAYOUT_COLOR])) editBox[CUSTOMIZE.LABEL_LAYOUT_COLOR] = '#';

        let label = editBox[CUSTOMIZE.LABEL];
        if(Utils.isEmpty(label)) {
            label = {};
            let placeholder = {};
            const objs = Html.getLanguages();
            for(let i=0; i<objs.length; i++) {
                label[objs[i]] = '';
                placeholder[objs[i]] = '';
            }
            editBox[CUSTOMIZE.LABEL] = label;
            editBox[CUSTOMIZE.PLACEHOLDER] = placeholder;
        }
        let auth = editBox[CUSTOMIZE.AUTH];
        if(Utils.isEmpty(auth)) {
            auth = {};
            auth[CUSTOMIZE.SEARCH] = true;
            auth[CUSTOMIZE.VIEW] = true;
            auth[CUSTOMIZE.CREATE] = true;
            auth[CUSTOMIZE.EDIT] = true;
            editBox[CUSTOMIZE.AUTH] = auth;
        }

        return (
            <table className='table-overlay-box'>
                <tbody>
                    <tr>
                        <td colSpan='4'><h4>{ this.state.editBox.msg }</h4></td>
                    </tr>
                    {(() => {
                        if ((obj === null || obj !== null)
                            && editBox[CUSTOMIZE.TYPE] !== TYPE.DIV
                            && editBox[CUSTOMIZE.TYPE] !== TYPE.TAB) {
                            return(
                                <tr>
                                <td className='td-not-break'>{ Msg.getMsg(null, this.state.isUser.language, 'bt_auth') }</td>
                                <td colSpan='3' className='td-auth-block'>
                                    <div>
                                        <span>{ Msg.getMsg(null, this.state.isUser.language, 'bt_search') }</span>
                                        <input
                                            type={ TYPE.CHECKBOX }
                                            checked={ auth[OPTION_AUTH.SEARCH] }
                                            name={ OPTION_AUTH.SEARCH }
                                            // defaultValue={ auth[CUSTOMIZE.SEARCH] }
                                            onChange={ this._onChange.bind(this) }></input>
                                    </div>
                                    <div>
                                        <span>{ Msg.getMsg(null, this.state.isUser.language, 'bt_view') }</span>
                                        <input
                                            type={ TYPE.CHECKBOX }
                                            checked={ auth[OPTION_AUTH.VIEW] }
                                            name={ OPTION_AUTH.VIEW }
                                            // defaultValue={ auth[CUSTOMIZE.SEARCH] }
                                            onChange={ this._onChange.bind(this) }></input>
                                    </div>
                                    <div>
                                        <span>{ Msg.getMsg(null, this.state.isUser.language, 'bt_create') }</span>
                                        <input
                                            type={ TYPE.CHECKBOX }
                                            checked={ auth[OPTION_AUTH.CREATE] }
                                            name={ OPTION_AUTH.CREATE }
                                            // defaultValue={ auth[CUSTOMIZE.SEARCH] }
                                            onChange={ this._onChange.bind(this) }></input>
                                    </div>
                                    <div>
                                        <span>{ Msg.getMsg(null, this.state.isUser.language, 'bt_edit') }</span>
                                        <input
                                            type={ TYPE.CHECKBOX }
                                            checked={ auth[OPTION_AUTH.EDIT] }
                                            name={ OPTION_AUTH.EDIT }
                                            // defaultValue={ auth[CUSTOMIZE.SEARCH] }
                                            onChange={ this._onChange.bind(this) }></input>
                                    </div>
                                </td>
                            </tr>
                            );
                        }
                    })()}

                    <tr>
                        <td className='td-not-break'>{ Msg.getMsg(null, this.state.isUser.language, 'obj_type') }</td>
                        <td>
                        {(() => {
                            if (this.state.mode === ACTION.EDIT) {
                                return(
                                    <FormControl
                                        disabled
                                        as={ HTML_TAG.SELECT }
                                        name={ CUSTOMIZE.TYPE }
                                        value={ editBox[CUSTOMIZE.TYPE] }
                                        onChange={ this._onChange.bind(this) }> { this.state.items }</FormControl>
                            );
                            } else {
                                return(
                                    <FormControl
                                        as={ HTML_TAG.SELECT }
                                        name={ CUSTOMIZE.TYPE }
                                        value={ editBox[CUSTOMIZE.TYPE] }
                                        onChange={ this._onChange.bind(this) }> { this.state.items }</FormControl>
                                );
                            }
                        })()}
                        </td>
                        <td className='td-not-break'>{ Msg.getMsg(null, this.state.isUser.language, 'obj_language') }</td>
                        <td>
                            <FormControl
                                as={ HTML_TAG.SELECT }
                                name={ CUSTOMIZE.LANGUAGE }
                                value={ editBox[CUSTOMIZE.LANGUAGE] }
                                onChange={ this._onChange.bind(this) }>
                                { this.state.languages }
                            </FormControl>
                        </td>
                    </tr>
        
                    <tr>
                        <td className='td-not-break'>
                            { Msg.getMsg(null, this.state.isUser.language, 'obj_label') }
                            <span className={ 'required' }>*</span>
                        </td>
                        <td>
                            <FormControl
                                type={ TYPE.TEXT }
                                name={ CUSTOMIZE.LABEL }
                                // name={ CUSTOMIZE.LABEL + '_' + editBox[CUSTOMIZE.LANGUAGE]}
                                // defaultValue={ editBox[CUSTOMIZE.LABEL + '_' + editBox[CUSTOMIZE.LANGUAGE]] }
                                value={ editBox[CUSTOMIZE.LABEL][editBox[CUSTOMIZE.LANGUAGE]] }
                                onChange={ this._onChange.bind(this) }/>
                        </td>
                        <td className='td-not-break'>{ Msg.getMsg(null, this.state.isUser.language, 'obj_width') }</td>
                        <td>
                        <table style={ { width: '100%' } }>
                            <tbody>
                            <tr>
                                <td>
                                    <FormControl
                                        as={ HTML_TAG.SELECT }
                                        name={ CUSTOMIZE.BOX_WIDTH }
                                        value={ editBox[CUSTOMIZE.BOX_WIDTH] }
                                        onChange={ this._onChange.bind(this) }> { this.state.widths }</FormControl>
                                </td>
                                <td style={ { width: '50px', textAlign: 'right'} }>{ Msg.getMsg(null, this.state.isUser.language, 'obj_height') }</td>
                                <td style={ { width: '40%' } }>
                                    <FormControl
                                        as={ HTML_TAG.SELECT }
                                        name={ CUSTOMIZE.BOX_HEIGHT }
                                        value={ editBox[CUSTOMIZE.BOX_HEIGHT] }
                                        onChange={ this._onChange.bind(this) }> { this.state.heights }</FormControl>
                                </td>
                            </tr>
                            </tbody>
                        </table>
                        </td>
                    </tr>
    
                {(() => {
                    if (obj === null 
                        && editBox[CUSTOMIZE.TYPE] !== TYPE.DIV
                        && editBox[CUSTOMIZE.TYPE] !== TYPE.TAB
                        && editBox[CUSTOMIZE.TYPE] !== TYPE.CHILDENS
                        && editBox[CUSTOMIZE.TYPE] !== TYPE.BUTTON
                        || (obj !== null
                            && obj.tagName !== HTML_TAG.LEGEND
                            && obj.tagName !== HTML_TAG.NAV
                            && editBox[CUSTOMIZE.TYPE] !== TYPE.DIV
                            && editBox[CUSTOMIZE.TYPE] !== TYPE.TAB
                            && editBox[CUSTOMIZE.TYPE] !== TYPE.CHILDENS
                            && editBox[CUSTOMIZE.TYPE] !== TYPE.BUTTON)) {
                        return(
                            <tr>
                            {(() => {
                                if (editBox[CUSTOMIZE.TYPE] !== TYPE.PASSWORD) {
                                    return(
                                        <td className='td-not-break'>
                                            { Msg.getMsg(null, this.state.isUser.language, 'obj_default') }
                                            {(() => {
                                                if (editBox[CUSTOMIZE.TYPE] === TYPE.IMAGE
                                                    || (Utils.isEmpty(editBox[TYPE.CHILDENS]) 
                                                        && (editBox[CUSTOMIZE.TYPE] === TYPE.DISABLE
                                                        || editBox[CUSTOMIZE.TYPE] === TYPE.HIDDEN
                                                        || editBox[CUSTOMIZE.TYPE] === TYPE.QRCODE))) {
                                                    return(<span className={ 'required' }>*</span>);
                                                }
                                            })()}
                                        </td>
                                    );
                                } else {
                                    return(<td className='td-not-break'> </td>);
                                }
                            })()}
                            {(() => {
                                if (editBox[CUSTOMIZE.TYPE] !== TYPE.PASSWORD
                                    && editBox[CUSTOMIZE.TYPE] !== TYPE.FILE
                                    && editBox[CUSTOMIZE.TYPE] !== TYPE.IMAGE
                                    && editBox[CUSTOMIZE.TYPE] !== TYPE.COLOR) {
                                    if(editBox[CUSTOMIZE.TYPE] === TYPE.CHECKBOX
                                        || editBox[CUSTOMIZE.TYPE] === TYPE.RADIO
                                        || editBox[CUSTOMIZE.TYPE] === TYPE.SELECT) {
                                        var defaultOptions = [];
                                        defaultOptions.push( <option key={ 'blank' } value={ '' }>{ '---' }</option> );
                                        if(Utils.inJson(editBox, OPTIONS_KEY.OPTIONS)) {
                                            editBox[OPTIONS_KEY.OPTIONS].map((o, idx) => {
                                            if(!Utils.isEmpty(o['value']) && !Utils.isEmpty(o['label']))
                                                defaultOptions.push( <option key={ idx } value={ o['value'] }>{ o['label'] }</option> );
                                            });
                                        }
                                        return(
                                            <td>
                                                <FormControl
                                                    as={ HTML_TAG.SELECT }
                                                    name={ CUSTOMIZE.DEFAULT }
                                                    defaultValue={ editBox[CUSTOMIZE.DEFAULT] }
                                                    onChange={ this._onChange.bind(this) }> { defaultOptions }</FormControl>
                                            </td>
                                        );
                                    } else {
                                        return(
                                        <td>
                                            <FormControl
                                                type={ this.state.defaultType }
                                                name={ CUSTOMIZE.DEFAULT }
                                                defaultValue={ editBox[CUSTOMIZE.DEFAULT] }
                                                onChange={ this._onChange.bind(this) }/>
                                        </td>
                                        );      
                                    }
                                } else if(editBox[CUSTOMIZE.TYPE] === TYPE.FILE || editBox[CUSTOMIZE.TYPE] === TYPE.IMAGE) {
                                    // var defaultValue = editBox[CUSTOMIZE.DEFAULT];
                                    // if(Utils.inJson(editBox, OPTIONS_KEY.OPTIONS_FILE)) {
                                    //     if(editBox[CUSTOMIZE.TYPE] === TYPE.FILE && editBox[OPTIONS_KEY.OPTIONS_FILE].length > 0) {
                                    //         defaultValue = fileFormatBase64(editBox);
                                            // if(editBox[CUSTOMIZE.MULTIPLE_FILE]) {
                                            //     defaultValue = editBox[OPTIONS_KEY.OPTIONS_FILE].map((o) => {
                                            //         const data = o['data'].split(';base64');
                                            //         return (data[0] + ';name=' + o['name'] + ';base64' + data[1]);
                                            //     });
                                            // } else {
                                            //     const data = editBox[OPTIONS_KEY.OPTIONS_FILE][0]['data'].split(';base64');
                                            //     defaultValue = (data[0] + ';name=' + editBox[OPTIONS_KEY.OPTIONS_FILE][0]['name'] + ';base64' + data[1]);
                                            // }
                                        // }
                                    // }

                                    return(
                                        <td style={ { height: '40px' } }>
                                            {(() => {
                                                if(editBox[CUSTOMIZE.MULTIPLE_FILE]) {
                                                    return(
                                                        <Form.File
                                                            multiple
                                                            type={ TYPE.FILE }
                                                            name={ CUSTOMIZE.DEFAULT }
                                                            defaultValue={ editBox[CUSTOMIZE.DEFAULT] }
                                                            onChange={ this._onChange.bind(this) }/>
                                                    );
                                                } else {
                                                    return(
                                                        <Form.File
                                                            type={ TYPE.FILE }
                                                            name={ CUSTOMIZE.DEFAULT }
                                                            defaultValue={ editBox[CUSTOMIZE.DEFAULT] }
                                                            onChange={ this._onChange.bind(this) }/>
                                                    );
                                                }
                                            })()}
                                        </td>
                                    );
                                } else if(editBox[CUSTOMIZE.TYPE] === TYPE.COLOR) {
                                    return(
                                        <td>
                                            <input
                                                type={ TYPE.COLOR }
                                                name={ CUSTOMIZE.DEFAULT }
                                                value={ editBox[CUSTOMIZE.DEFAULT] }
                                                onChange={ this._onChange.bind(this) } />
                                        </td>
                                    );
                                } else if(editBox[CUSTOMIZE.TYPE] === TYPE.PASSWORD) {
                                    return(<td> </td>);
                                }
                            })()}
                            {(() => {
                                if(editBox[CUSTOMIZE.TYPE] !== TYPE.DISABLE
                                    && editBox[CUSTOMIZE.TYPE] !== TYPE.HIDDEN
                                    && editBox[CUSTOMIZE.TYPE] !== TYPE.CHILDENS
                                    && editBox[CUSTOMIZE.TYPE] !== TYPE.QRCODE
                                    && editBox[CUSTOMIZE.TYPE] !== TYPE.IMAGE) {
                                    return(<td className='td-not-break'>{ Msg.getMsg(null, this.state.isUser.language, 'obj_required') }</td>);
                                } else if(editBox[CUSTOMIZE.TYPE] === TYPE.QRCODE) {
                                    return(<td className='td-not-break'>{ Msg.getMsg(null, this.state.isUser.language, 'obj_qr_app_link') }</td>);
                                }
                            })()}
                            {(() => {
                                if(editBox[CUSTOMIZE.TYPE] !== TYPE.DISABLE
                                    && editBox[CUSTOMIZE.TYPE] !== TYPE.HIDDEN
                                    && editBox[CUSTOMIZE.TYPE] !== TYPE.CHILDENS
                                    && editBox[CUSTOMIZE.TYPE] !== TYPE.QRCODE
                                    && editBox[CUSTOMIZE.TYPE] !== TYPE.IMAGE) {
                                    return(
                                        <td style={ { height: '40px' } }>
                                            <input
                                                type={ HTML_TAG.CHECKBOX }
                                                name={ CUSTOMIZE.REQUIRED }
                                                defaultChecked={ editBox[CUSTOMIZE.REQUIRED] }
                                                onChange={ this._onChange.bind(this) }></input>
                                        </td>
                                    );
                                } else if(editBox[CUSTOMIZE.TYPE] === TYPE.QRCODE) {
                                    var regexs = [];
                                    regexs.push( <option key={ 'blank' } value={ '' }>{ '---' }</option> );
                                    REGEXS.map((o, i) => {
                                        regexs.push(< option key={ i } value={ o }>{ o }</option> );
                                    });
                                    return(
                                        <td style={ { height: '40px' } }>
                                            <table style={ { width: '100%' } }>
                                                <tbody>
                                                    <tr>
                                                        <td>
                                                        <input
                                                            type={ HTML_TAG.CHECKBOX }
                                                            name={ CUSTOMIZE.QRAPPLINK }
                                                            defaultChecked={ editBox[CUSTOMIZE.QRAPPLINK] }
                                                            onChange={ this._onChange.bind(this) }></input>
                                                        </td>
                                                        <td style={ { width: '50px',textAlign: 'right' } }>{ Msg.getMsg(null, this.state.isUser.language, 'obj_regex') }</td>
                                                        <td style={ { width: '40%' } }>
                                                            <FormControl
                                                                as={ HTML_TAG.SELECT }
                                                                name={ OPTIONS_KEY.OPTION_REGEX }
                                                                defaultValue={ editBox[OPTIONS_KEY.OPTION_REGEX] }
                                                                onChange={ this._onChange.bind(this) }>
                                                                { regexs }
                                                            </FormControl>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </td>
                                    );
                                }
                            })()}
                            </tr>
                        );
                    }
                })()}
    
                {(() => {
                    if ((obj === null
                        && editBox[CUSTOMIZE.TYPE] !== TYPE.DIV
                        && editBox[CUSTOMIZE.TYPE] !== TYPE.TAB)
                        || (obj !== null
                            && obj.tagName !== HTML_TAG.LEGEND
                            && obj.tagName !== HTML_TAG.NAV
                            && editBox[CUSTOMIZE.TYPE] !== TYPE.DIV
                            && editBox[CUSTOMIZE.TYPE] !== TYPE.TAB)) {
                    return(
                        <tr>
                        {(() => {
                            if (editBox[CUSTOMIZE.TYPE] === TYPE.TEXT
                            || editBox[CUSTOMIZE.TYPE] === TYPE.TEXTAREA
                            || editBox[CUSTOMIZE.TYPE] === TYPE.NUMBER
                            || editBox[CUSTOMIZE.TYPE] === TYPE.PASSWORD) {
                            return(
                                <td className='td-not-break'>{ Msg.getMsg(null, this.state.isUser.language, 'obj_placeholder') }</td>
                            );
                            } else if(editBox[CUSTOMIZE.TYPE] === TYPE.FILE) {
                            return(<td className='td-not-break'>{ Msg.getMsg(null, this.state.isUser.language, 'obj_multiple') }</td>)
                            }
                        })()}
                        {(() => {
                            if (editBox[CUSTOMIZE.TYPE] === TYPE.TEXT
                            || editBox[CUSTOMIZE.TYPE] === TYPE.TEXTAREA
                            || editBox[CUSTOMIZE.TYPE] === TYPE.NUMBER
                            || editBox[CUSTOMIZE.TYPE] === TYPE.PASSWORD) {
                            return(
                                <td>
                                    <FormControl
                                        type={ TYPE.TEXT }
                                        name={ CUSTOMIZE.PLACEHOLDER }
                                        value={ editBox[CUSTOMIZE.PLACEHOLDER][editBox[CUSTOMIZE.LANGUAGE]] }
                                        onChange={ this._onChange.bind(this) }/>
                                </td>
                            );
                            } else if(editBox[CUSTOMIZE.TYPE] === TYPE.FILE) {
                            return(
                                <td>
                                <input
                                    type={ HTML_TAG.CHECKBOX }
                                    name={ CUSTOMIZE.MULTIPLE_FILE }
                                    defaultChecked={ editBox[CUSTOMIZE.MULTIPLE_FILE] }
                                    onChange={ this._onChange.bind(this) }></input>
                                </td>
                            );
                            }
                        })()}
    
                        {(() => {
                            if (editBox[CUSTOMIZE.TYPE] === TYPE.TEXT
                            || editBox[CUSTOMIZE.TYPE] === TYPE.TEXTAREA
                            || editBox[CUSTOMIZE.TYPE] === TYPE.FILE
                            // || editBox[CUSTOMIZE.TYPE] === TYPE.IMAGE
                            || editBox[CUSTOMIZE.TYPE] === TYPE.NUMBER
                            || editBox[CUSTOMIZE.TYPE] === TYPE.PASSWORD) {
                            return(
                                <td className='td-not-break'>
                                {(() => {
                                    if (editBox[CUSTOMIZE.TYPE] === TYPE.FILE) {
                                        return('MaxSize(MB)');
                                    } else {
                                        return('MaxLength');
                                    }
                                })()}
                                </td>
                            );
                            }
                        })()}
                        {(() => {
                            if (editBox[CUSTOMIZE.TYPE] === TYPE.TEXT
                            || editBox[CUSTOMIZE.TYPE] === TYPE.TEXTAREA
                            || editBox[CUSTOMIZE.TYPE] === TYPE.FILE
                            // || editBox[CUSTOMIZE.TYPE] === TYPE.IMAGE
                            || editBox[CUSTOMIZE.TYPE] === TYPE.NUMBER
                            || editBox[CUSTOMIZE.TYPE] === TYPE.PASSWORD) {
                            return(
                                <td>
                                    <FormControl
                                        type={ TYPE.NUMBER }
                                        name={ CUSTOMIZE.MAX_LENGTH }
                                        defaultValue={ editBox[CUSTOMIZE.MAX_LENGTH] }
                                        onChange={ this._onChange.bind(this) }/>
                                </td>
                            );
                            }
                        })()}
                        </tr>
                    );
                    }
                })()}
    
                <tr>
                    <td className='td-not-break'>{ Msg.getMsg(null, this.state.isUser.language, 'obj_label') }</td>
                    <td>
                    <input
                        type={ TYPE.COLOR }
                        name={ CUSTOMIZE.LABEL_COLOR }
                        defaultValue={ editBox[CUSTOMIZE.LABEL_COLOR] }
                        onChange={ this._onChange.bind(this) }></input>
                    <span style={{ marginLeft: '3em' }}>{ Msg.getMsg(null, this.state.isUser.language, 'obj_background') }</span>
                    <input
                        type={ TYPE.COLOR }
                        name={ CUSTOMIZE.LABEL_LAYOUT_COLOR }
                        defaultValue={ editBox[CUSTOMIZE.LABEL_LAYOUT_COLOR] }
                        onChange={ this._onChange.bind(this) }></input>
                    </td>
                    <td className='td-not-break'>{ Msg.getMsg(null, this.state.isUser.language, 'obj_css_style') }</td>
                    <td>
                        <FormControl
                            type={ TYPE.TEXT }
                            name={ CUSTOMIZE.STYLE }
                            defaultValue={ editBox[CUSTOMIZE.STYLE] }
                            onChange={ this._onChange.bind(this) }/>
                    </td>
                </tr>
    
                {(() => {
                    if(editBox[CUSTOMIZE.TYPE] === TYPE.CHECKBOX
                    || editBox[CUSTOMIZE.TYPE] === TYPE.RADIO
                    || editBox[CUSTOMIZE.TYPE] === TYPE.SELECT) {
                    return(
                        <tr>
                        <td className='td-not-break'>{ Msg.getMsg(null, this.state.isUser.language, 'obj_list_type') }</td>
                        <td>
                            <input
                                type={ HTML_TAG.CHECKBOX }
                                name={ OPTIONS_KEY.OPTION_CHECKED }
                                checked={ editBox[OPTIONS_KEY.OPTION_CHECKED] }
                                onChange={ this._onChange.bind(this) }></input>
                        </td>
                        <td className='td-not-break'>{ Msg.getMsg(null, this.state.isUser.language, 'obj_list_option') }</td>
                        <td>
                            <FormControl
                                as={ HTML_TAG.SELECT }
                                name={ OPTIONS_KEY.OPTION_TARGET }
                                defaultValue={ editBox[OPTIONS_KEY.OPTION_TARGET] }
                                onChange={ this._onChange.bind(this) }>
                                { this.state.options }
                            </FormControl>
                        </td>
                        </tr>
                    );
                    }
                })()}
    
                {(() => {
                    if (editBox[CUSTOMIZE.TYPE] !== TYPE.IMAGE
                    && editBox[CUSTOMIZE.TYPE] !== TYPE.DIV
                    && editBox[CUSTOMIZE.TYPE] !== TYPE.TAB
                    && Utils.isEmpty(editBox[OPTIONS_KEY.OPTION_TARGET])) {
                    return(
                        <tr>
                            <td colSpan='4'>
                                <div className={ 'div-overlay-box-add-items' }>
                                <table className='table-overlay-box'>
                                    <tbody>
                                    {(() => {
                                        if (editBox[CUSTOMIZE.TYPE] === TYPE.CHECKBOX
                                        || editBox[CUSTOMIZE.TYPE] === TYPE.RADIO
                                        || editBox[CUSTOMIZE.TYPE] === TYPE.SELECT) {
                                        if(editBox[OPTIONS_KEY.OPTIONS] === undefined) {
                                            if(editBox[CUSTOMIZE.TYPE] === TYPE.RADIO) {
                                                editBox[OPTIONS_KEY.OPTIONS] = [{ 'value': '', 'label': '' }, { 'value': '', 'label': '' }];
                                            } else {
                                                editBox[OPTIONS_KEY.OPTIONS] = [{ 'value': '', 'label': '' }];
                                            }
                                        }
                                        const objs = Array.from(editBox[OPTIONS_KEY.OPTIONS]);
                                        return objs.map((o, idx) => {
                                            return(
                                                <tr key={ idx }>
                                                    <td className='td-not-break'>{ Msg.getMsg(null, this.state.isUser.language, 'obj_id') }</td>
                                                    <td>
                                                    <FormControl
                                                        type={ TYPE.TEXT }
                                                        id={ 'values_' + idx }
                                                        name={ 'obj_lists' }
                                                        value={ o['value'] }
                                                        onChange={ this._onChange.bind(this) }/>
                                                    </td>
                                                    <td className='td-not-break'>{ Msg.getMsg(null, this.state.isUser.language, 'obj_value') }</td>
                                                    <td>
                                                        <table>
                                                            <tbody>
                                                                <tr>
                                                                    <td>
                                                                        <FormControl
                                                                            type={ TYPE.TEXT }
                                                                            id={ 'labels_' + idx }
                                                                            name={ 'obj_lists' }
                                                                            value={ o['label'] }
                                                                            onChange={ this._onChange.bind(this) }/>
                                                                    </td>
                                                                    <td style={ {'width': 0} }>
                                                                    {(() => {
                                                                        if(idx === 0) {
                                                                        return (
                                                                            <Button
                                                                                type={ TYPE.BUTTON }
                                                                                id={ 'btnitems_' + idx }
                                                                                className={ 'button-overlay-box-add-items' }
                                                                                onClick={ this._onAddItem.bind(this) }
                                                                                variant={ VARIANT_TYPES.PRIMARY }>
                                                                                <FaPlus />
                                                                            </Button>
                                                                        );
                                                                        } else {
                                                                        if(editBox[CUSTOMIZE.TYPE] === TYPE.RADIO && idx === 1) {
                                                                            return('');
                                                                        } else {
                                                                            return (
                                                                            <Button
                                                                                type={ TYPE.BUTTON }
                                                                                id={ 'btnitems_' + idx }
                                                                                className={ 'button-overlay-box-add-items' }
                                                                                onClick={ this._onRemoveItem.bind(this) }
                                                                                variant={ VARIANT_TYPES.SECONDARY }>
                                                                                <FaMinus />
                                                                            </Button>
                                                                            );  
                                                                        }
                                                                        }
                                                                    })()}
                                                                    </td>
                                                                </tr>
                                                            </tbody>
                                                        </table>
                                                    </td>
                                                </tr>
                                            );  
                                        })
                                        }
                                    })()}
                                    </tbody>
                                </table>
                                </div>
                            </td>
                        </tr>
                    );
                    }
                })()}

                {(() => {
                    if (editBox[CUSTOMIZE.TYPE] === TYPE.CHILDENS
                        || editBox[CUSTOMIZE.TYPE] === TYPE.DISABLE
                        || editBox[CUSTOMIZE.TYPE] === TYPE.HIDDEN
                        || editBox[CUSTOMIZE.TYPE] === TYPE.QRCODE) {
                        const pages = this.state.pages;
                        var listPages = [];
                        listPages.push( <option key={ 'blank' } value={ '' }>{ '---' }</option> );
                        if(Array.isArray(pages) && pages.length > 0) {
                            for (let i=0; i<pages.length; i++) {
                                listPages.push( <option key={ i } value={ pages[i].id }>{ pages[i].label }</option> );
                            }
                        }
                        return(
                            <tr>
                                <td className='td-not-break'>{ Msg.getMsg(null, this.state.isUser.language, 'page_list') }</td>
                                <td colSpan='3'>
                                    <FormControl
                                        as={ HTML_TAG.SELECT }
                                        name={ TYPE.CHILDENS }
                                        value={ editBox[TYPE.CHILDENS] }
                                        onChange={ this._onChange.bind(this) }> { listPages }</FormControl>
                                </td>
                            </tr>
                        );
                    }
                })()}
                {(() => {
                    if (editBox[TYPE.CHILDENS]
                        && (editBox[CUSTOMIZE.TYPE] === TYPE.HIDDEN
                            || editBox[CUSTOMIZE.TYPE] === TYPE.DISABLE
                            || editBox[CUSTOMIZE.TYPE] === TYPE.QRCODE)) {
                        var pageItems = [];
                        pageItems.push({ 'value': 1, 'label': 'Item_01' });
                        pageItems.push({ 'value': 2, 'label': 'Item_02' });
                        pageItems.push({ 'value': 3, 'label': 'Item_03' });
                        pageItems.push({ 'value': 4, 'label': 'Item_03' });

                        const checkboxName = (editBox[CUSTOMIZE.TYPE] === TYPE.QRCODE)?OPTIONS_KEY.OPTIONS_ITEM + '[]':OPTIONS_KEY.OPTIONS_ITEM;
                        const inputType = (editBox[CUSTOMIZE.TYPE] === TYPE.QRCODE)?HTML_TAG.CHECKBOX:HTML_TAG.RADIO;
                        const values = editBox[OPTIONS_KEY.OPTIONS_ITEM];
                        const items = pageItems.map((obj, idx) => {
                            var checked = false;
                            if(inputType === HTML_TAG.CHECKBOX) checked = (Array.isArray(values) && values.includes(obj['value']))?true:false;
                            if(inputType === HTML_TAG.RADIO) checked = (!Utils.isEmpty(values) && (values === obj['value']))?true:false;
                            return (
                                <div key={ idx } className={ 'form-check' }>
                                    <input
                                        type={ inputType }
                                        id={ HTML_TAG.CHECKBOX + '_' + idx }
                                        name={ checkboxName }
                                        checked={ checked }
                                        value={ obj['value'] }
                                        onChange={ this._onChange.bind(this) }
                                        className={ 'form-check-input' } />
                                    <label className="form-check-label" htmlFor={ HTML_TAG.CHECKBOX + '_' + idx }>{ obj['label'] }</label>
                                </div>
                            );
                        });
                        return(
                            <tr>
                                <td className='td-not-break'>{ Msg.getMsg(null, this.state.isUser.language, 'item_list') }</td>
                                <td colSpan='3'>
                                    <div className={ 'div-overlay-box-add-items' }>
                                        { items }
                                    </div>
                                </td>
                            </tr>
                        );
                    }
                })()}
                </tbody>
          </table>
        );  
    }
}