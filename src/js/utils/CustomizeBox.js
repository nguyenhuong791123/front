import React, { Component as C } from 'react';
import { Button, Form, FormControl } from 'react-bootstrap';
import { FaPlus, FaMinus } from 'react-icons/fa';

import { VARIANT_TYPES, ACTION } from './Types';
import { TYPE, ALIGN, HTML_TAG, CUSTOMIZE, BOX_WIDTH, BOX_HEIGHT, OPTIONS, OPTIONS_KEY } from '../utils/HtmlTypes';
import Html from './HtmlUtils'
import Utils from './Utils';

import Msg from '../../msg/Msg';

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
                if(Utils.inJson(editBox.obj, 'file_data')) delete editBox.obj['file_data'];
            } else {
                this._fileToBase64(files, editBox);
            }
            delete editBox.obj[OPTIONS_KEY.OPTION_CHECKED];
            delete editBox.obj[OPTIONS_KEY.OPTION_TARGET];
            delete editBox.obj[OPTIONS_KEY.OPTIONS];
        } else {
            var val = obj.value;
            if(name === 'obj_lists'
                && (type === TYPE.CHECKBOX || type === TYPE.RADIO || type === TYPE.SELECT)
                && name !== CUSTOMIZE.LANGUAGE ) {
                var idx = obj.id.split('_')[1];
                if(Number.isNaN(Number(idx))) return;
                var lObj = editBox.obj[OPTIONS_KEY.OPTIONS][idx];
                if(obj.id.startsWith('values_')) {
                    lObj['value'] = (!Number.isNaN(Number(obj.value)))?parseInt(obj.value):obj.value;
                } 
                if(obj.id.startsWith('labels_')) {
                    lObj['label'] = obj.value;
                }
                editBox.obj[OPTIONS_KEY.OPTIONS][idx] = lObj;
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
                            editBox.obj[OPTIONS_KEY.OPTIONS].push({ 'value': o['value'], 'label': o['label'] });
                        });
                    }    
                }
            } else {
                if(obj.type === TYPE.CHECKBOX) {
                    val = obj.checked;
                }
                editBox.obj[name] = val;
                const options = [ TYPE.CHECKBOX, TYPE.RADIO, TYPE.SELECT ];
                if(!options.includes(type) && !options.includes(name) && name !== CUSTOMIZE.LANGUAGE) {
                    delete editBox.obj[OPTIONS_KEY.OPTION_CHECKED];
                    delete editBox.obj[OPTIONS_KEY.OPTION_TARGET];
                    delete editBox.obj[OPTIONS_KEY.OPTIONS];
                } else if (name === CUSTOMIZE.LANGUAGE) {
                    const label_language = CUSTOMIZE.LABEL + '_' + val;
                    if (editBox.obj[label_language] === undefined) {
                        editBox.obj[label_language] = '';
                    }
                    const placeholder_language = CUSTOMIZE.PLACEHOLDER + '_' + val;
                    if (editBox.obj[placeholder_language] === undefined) {
                        editBox.obj[placeholder_language] = '';
                    }
                }
            }
    
            if(Utils.inJson(editBox, 'file_data')) delete editBox['file_data'];
        }
    
        if(Utils.isEmpty(editBox.obj[CUSTOMIZE.BOX_WIDTH])) {
          if(editBox.obj[CUSTOMIZE.TYPE] === TYPE.CHILDENS) {
            editBox.obj[CUSTOMIZE.BOX_WIDTH] = 100;
          } else {
            editBox.obj[CUSTOMIZE.BOX_WIDTH] = 25;
          }
        }
        if(Utils.isEmpty(editBox.obj[CUSTOMIZE.BOX_HEIGHT])) {
          editBox.obj[CUSTOMIZE.BOX_HEIGHT] = 89;
        }
        // console.log(editBox);
        this.props.updateEditBox(editBox);
    }


    _fileToBase64(files, editObj) {
        editObj.obj['file_data'] = [];
        Object.keys(files).map(i => {
            var reader = new FileReader();
            reader.onload = function () {
                editObj.obj['file_data'].push(reader.result);
            };
            reader.readAsDataURL(files[i]);
        });
    }    

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

        return (
            <table className='table-overlay-box'>
                <tbody>
                <tr>
                    <td colSpan='4'><h4>{ this.state.editBox.msg }</h4></td>
                </tr>
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
                            name={ CUSTOMIZE.LABEL + '_' + editBox[CUSTOMIZE.LANGUAGE]}
                            // defaultValue={ editBox[CUSTOMIZE.LABEL + '_' + editBox[CUSTOMIZE.LANGUAGE]] }
                            value={ editBox[CUSTOMIZE.LABEL + '_' + editBox[CUSTOMIZE.LANGUAGE]] }
                            onChange={ this._onChange.bind(this) }/>
                    </td>
                    <td className='td-not-break'>{ Msg.getMsg(null, this.state.isUser.language, 'obj_width') }</td>
                    <td>
                    <table>
                        <tbody>
                        <tr>
                            <td>
                                <FormControl
                                    as={ HTML_TAG.SELECT }
                                    name={ CUSTOMIZE.BOX_WIDTH }
                                    defaultValue={ editBox[CUSTOMIZE.BOX_WIDTH] }
                                    onChange={ this._onChange.bind(this) }> { this.state.widths }</FormControl>
                            </td>
                            <td style={ { width: '40px', textAlign: 'right'} }>{ Msg.getMsg(null, this.state.isUser.language, 'obj_height') }</td>
                            <td>
                                <FormControl
                                    as={ HTML_TAG.SELECT }
                                    name={ CUSTOMIZE.BOX_HEIGHT }
                                    defaultValue={ editBox[CUSTOMIZE.BOX_HEIGHT] }
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
                                                    || editBox[CUSTOMIZE.TYPE] === TYPE.DISABLE
                                                    || editBox[CUSTOMIZE.TYPE] === TYPE.HIDDEN) {
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
                                                    value={ editBox[CUSTOMIZE.DEFAULT] }
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
                                    return(
                                        <td>
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
                                                defaultValue={ editBox[CUSTOMIZE.DEFAULT] }
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
                                    && editBox[CUSTOMIZE.TYPE] !== TYPE.CHILDENS) {
                                    return(<td className='td-not-break'>{ Msg.getMsg(null, this.state.isUser.language, 'obj_required') }</td>);
                                }
                            })()}
                            {(() => {
                                if(editBox[CUSTOMIZE.TYPE] !== TYPE.DISABLE
                                    && editBox[CUSTOMIZE.TYPE] !== TYPE.HIDDEN
                                    && editBox[CUSTOMIZE.TYPE] !== TYPE.CHILDENS) {
                                    return(
                                        <td style={ { height: '40px' } }>
                                            <input
                                            type={ HTML_TAG.CHECKBOX }
                                            name={ CUSTOMIZE.REQUIRED }
                                            defaultChecked={ editBox[CUSTOMIZE.REQUIRED] }
                                            onChange={ this._onChange.bind(this) }></input>
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
                                        name={ CUSTOMIZE.PLACEHOLDER + '_' + editBox[CUSTOMIZE.LANGUAGE] }
                                        value={ editBox[CUSTOMIZE.PLACEHOLDER + '_' + editBox[CUSTOMIZE.LANGUAGE]] }
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
                        {(() => {
                            if (editBox[CUSTOMIZE.TYPE] !== TYPE.SELECT) {
                                return(<td className='td-not-break'>{ Msg.getMsg(null, this.state.isUser.language, 'obj_list_type') }</td>);
                            }
                        })()}
                        {(() => {
                            if (editBox[CUSTOMIZE.TYPE] !== TYPE.SELECT) {
                                return(
                                    <td>
                                        <input
                                            type={ HTML_TAG.CHECKBOX }
                                            name={ OPTIONS_KEY.OPTION_CHECKED }
                                            checked={ editBox[OPTIONS_KEY.OPTION_CHECKED] }
                                            onChange={ this._onChange.bind(this) }></input>
                                    </td>    
                                );
                            }
                        })()}
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
                        || editBox[CUSTOMIZE.TYPE] === TYPE.HIDDEN) {
                        const pages = this.state.pages;
                        var listPages = [];
                        if(editBox[CUSTOMIZE.TYPE] === TYPE.DISABLE || editBox[CUSTOMIZE.TYPE] === TYPE.HIDDEN) {
                            listPages.push( <option key={ 'blank' } value={ '' }>{ '---' }</option> );
                        }
                        if(Array.isArray(pages) && pages.length > 0) {
                            for (let i=0; i<pages.length; i++) {
                                listPages.push( <option key={ i } value={ pages[i].id }>{ pages[i].label }</option> );
                            }
                        }
                        if(Utils.isEmpty(editBox[TYPE.CHILDENS])) editBox[TYPE.CHILDENS] = pages[0].id;
                        return(
                            <tr>
                                <td>{ Msg.getMsg(null, this.state.isUser.language, 'page_list') }</td>
                                <td>
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
                </tbody>
          </table>
        );  
    }
}