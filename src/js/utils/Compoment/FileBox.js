import React, { Component as C } from 'react';
import ReactDOM from 'react-dom';
import { Button } from 'react-bootstrap';
import { FaMinus } from 'react-icons/fa';

import { VARIANT_TYPES, MSG_TYPE } from '../Types';
import { TYPE, CUSTOMIZE, OPTIONS_KEY, HTML_TAG } from '../HtmlTypes';
import Utils from '../Utils';
import Html from '../HtmlUtils'
import { fileToBase64, byteToUnit, toBlob } from '../FileUtils';

import Msg from '../../../msg/Msg';

export default class FileBox extends C {
    constructor(props) {
        super(props);
    
        this._onChange = this._onChange.bind(this);
        this._onRemove = this._onRemove.bind(this);

        const language = this.props.schema.language;
        this.state = {
            id: this.props.id,
            language: language,
            multiple: false,
            fileLoaded: null,
            files: { obj: {} },
            title: Msg.getMsg(null, language, 'bt_file') + Msg.getMsg(MSG_TYPE.ERROR, language, 'selected'),
            size: '　',
            total: 0,
        }
    };

    _onChange(e) {
        const obj = e.target;
        if(Utils.isEmpty(obj)) return;
        if(!Utils.isEmpty(obj.files)) {
            this.state.files = { obj: {} };
            fileToBase64(obj.files, this.state.files);
            this.props.onChange(this.state.files.obj[OPTIONS_KEY.OPTIONS_FILE]);
        }
    }

    _onRemove(e) {
        const obj = Html.getButton(e);
        if(Utils.isEmpty(obj) || Utils.isEmpty(obj.getAttribute('idx'))) return;
        const idx = obj.getAttribute('idx');
        if(!Utils.inJson(this.state.files, 'obj')
            || !Array.isArray(this.state.files.obj[OPTIONS_KEY.OPTIONS_FILE])
            || this.state.files.obj[OPTIONS_KEY.OPTIONS_FILE].length < idx) return;
        const trObj = obj.parentElement.parentElement;
        if(!Utils.isEmpty(trObj)) trObj.remove();
        const files = this.state.files.obj[OPTIONS_KEY.OPTIONS_FILE];
        delete files.splice(idx, 1);
        this.state.size = files.length + Msg.getMsg(null, this.state.language, 'bt_file');
        this.props.onChange(files);
        this.forceUpdate();
    }

    _onDownloadFile(e) {
        const obj = e.target;
        if(Utils.isEmpty(obj) || obj.tagName !== HTML_TAG.A || Utils.isEmpty(obj.getAttribute('idx'))) return;
        const idx = obj.getAttribute('idx');
        const files = this.state.files.obj[OPTIONS_KEY.OPTIONS_FILE];
        if(Utils.isEmpty(files)) return;
        const file = files[idx];
        obj.href = file['data'];
        obj.setAttribute('download', file['name']);
        obj.click();
        // obj.removeAttribute('download');
        // obj.href = '#';
    }

    UNSAFE_componentWillReceiveProps() {
        this.state.fileLoaded = setInterval(this._onSetIntervalLoadFiles.bind(this), 1000);
    }

    componentDidMount() {
        if(Utils.isEmpty(this.props.value)) {
            this.state.title = Msg.getMsg(null, this.state.language, 'bt_file') + Msg.getMsg(MSG_TYPE.ERROR, this.state.language, 'selected');
            this.state.size = '　';
        } else {
            this.state.fileLoaded = setInterval(this._onSetIntervalLoadFiles.bind(this), 1000);
        }
    }

    _onStopIntervalLoadFiles() {
        // console.log(this.state.fileLoaded);
        if(Utils.isEmpty(this.state.fileLoaded)) return;
        clearInterval(this.state.fileLoaded);
    }

    _onSetIntervalLoadFiles() {
        // console.log(this.state.fileLoaded);
        const divOld = document.getElementById('div_table_' + this.state.id);
        if(!Utils.isEmpty(divOld)) divOld.remove();
        const files = this.props.value;

        if(Utils.isEmpty(files) || !Array.isArray(files) || files.length <= 0) {
            this.state.title = Msg.getMsg(null, this.state.language, 'bt_file') + Msg.getMsg(MSG_TYPE.ERROR, this.state.language, 'selected');
            this.state.size = '　';
            this.state.files = { obj: {} };
            this._onStopIntervalLoadFiles();
        } else {
            if(this.state.multiple) {
                this.state.files = { obj: {} };
                this.state.files.obj[OPTIONS_KEY.OPTIONS_FILE] = files;
                const trFiles = Array.from(files).map((o, idx) => {
                    this.state.total += o['size'];
                    return(
                        <tr key={ idx }>
                            <td>
                                <a href="#" idx={ idx } onClick={ this._onDownloadFile.bind(this) }>{ o['name'] }</a>
                            </td>
                            <td>{ byteToUnit(o['size']) }</td>
                            <td>
                                <Button
                                    idx={ idx }
                                    type={ TYPE.BUTTON }
                                    onClick={ this._onRemove.bind(this) }
                                    variant={ VARIANT_TYPES.SECONDARY }>
                                    <FaMinus />
                                </Button>
                            </td>
                        </tr>
                    );
                });
                const divTable = document.createElement(HTML_TAG.DIV);
                divTable.id = 'div_table_' + this.state.id;
                document.getElementById('div_' + this.state.id).appendChild(divTable);
                ReactDOM.render(
                    <table className={ 'table-sm table-striped table-bordered table-hover' }>
                        <tbody>
                            { trFiles }
                        </tbody>
                    </table>
                    ,document.getElementById(divTable.id));
                this.state.size = files.length + Msg.getMsg(null, this.state.language, 'bt_file') + '(' + byteToUnit(this.state.total) + ')';
            } else {
                const o = files[0];
                this.state.title = o['name'];
                this.state.size = byteToUnit(o['size']);
            }
            this._onStopIntervalLoadFiles();
        }
        this.forceUpdate();
    }

    render() {
        console.log(this.props);
        this.state.multiple = (Utils.inJson(this.props.schema, CUSTOMIZE.MULTIPLE_FILE))?this.props.schema[CUSTOMIZE.MULTIPLE_FILE]:false;
        const className = (this.state.multiple)?'div-file-multiple-box':'div-file-box';
        return (
            <div id={ 'div_' + this.state.id } className={ className }>
                <font className={ 'btn btn-secondary' }>
                    { this.state.title }<br />{ this.state.size }
                    {/* {(() => {
                        if (!this.state.multiple && !Utils.isEmpty(this.state.size)) {
                            return(this.state.size);
                        }
                    })()} */}
                </font>
                <input
                    multiple={ this.state.multiple }
                    type={ TYPE.FILE }
                    id={ this.state.id }
                    onChange={ this._onChange.bind(this) } />
            </div>
        );  
    }
}