import React, { Component as C } from 'react';
import ReactDOM from 'react-dom';
import LoadingOverlay from 'react-loading-overlay';
import { Button } from 'react-bootstrap';
import { FaMinus, FaDownload } from 'react-icons/fa';

import { VARIANT_TYPES, MSG_TYPE } from '../Types';
import { TYPE, CUSTOMIZE, OPTIONS_KEY, HTML_TAG } from '../HtmlTypes';
import Utils from '../Utils';
import Html from '../HtmlUtils'
import { fileToBase64, byteToUnit } from '../FileUtils';

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
            loading: false,
            fileLoading: null,
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
            var files = { obj: {} };
            fileToBase64(obj.files, files);
            this.setState(files);
            this.props.onChange(files.obj[OPTIONS_KEY.OPTIONS_FILE]);
        } else {
            this.state.files.obj[OPTIONS_KEY.OPTIONS_FILE] = '';
            this.props.onChange('');
        }
        this.forceUpdate();
        // this._onCheckFiles(this.state.files.obj[OPTIONS_KEY.OPTIONS_FILE]);
    }

    _onRemove(e) {
        const obj = Html.getButton(e);
        if(Utils.isEmpty(obj) || Utils.isEmpty(obj.getAttribute('idx'))) return;
        const idx = obj.getAttribute('idx');
        if(!Utils.inJson(this.state.files, 'obj')
            || !Array.isArray(this.state.files.obj[OPTIONS_KEY.OPTIONS_FILE])) return;
        const trObj = obj.parentElement.parentElement;
        if(!Utils.isEmpty(trObj)) trObj.remove();
        const files = this.state.files.obj[OPTIONS_KEY.OPTIONS_FILE];
        if(Utils.isEmpty(files)) return;
        const fileIndex = files.findIndex(o => o.idx === idx);
        delete files.splice(fileIndex, 1);
        this._onGetSizeSetTitle(files);
        if(files.length > 0) {
            this.props.onChange(files);
        } else {
            this.props.onChange('');
        }
        this.forceUpdate();
    }

    _onDownloadFile(e) {
        const obj = Html.getButton(e);
        if(Utils.isEmpty(obj) || Utils.isEmpty(obj.getAttribute('idx'))) return;
        const idx = obj.getAttribute('idx');
        const files = this.state.files.obj[OPTIONS_KEY.OPTIONS_FILE];
        if(Utils.isEmpty(files)) return;
        const fileIndex = files.findIndex(o => o.idx === idx);
        const file = files[fileIndex];
        if(Utils.isEmpty(file)) return;
        let a = document.createElement(HTML_TAG.A);
        a.href = file['data'];
        a.style.display = 'none';
        a.setAttribute('download', file['name']);
        obj.appendChild(a);
        a.click();
        obj.removeChild(a);
    }

    _onStopIntervalLoadFiles() {
        // console.log(this.state.fileLoading);
        if(!Utils.isEmpty(this.state.fileLoading)) {
            clearInterval(this.state.fileLoading);
        }
        this._onStopLoading();
        this.forceUpdate();
    }

    _onSetIntervalLoadFiles() {
        console.log(this.state.fileLoading);
        const divOld = document.getElementById('div_table_' + this.state.id);
        if(!Utils.isEmpty(divOld)) divOld.remove();
        const files = this.state.files.obj[OPTIONS_KEY.OPTIONS_FILE];

        if(Utils.isEmpty(files) || !Array.isArray(files) || files.length <= 0) {
            this._onResetState();
            this._onStopIntervalLoadFiles();
        } else {
            const divTable = document.createElement(HTML_TAG.DIV);
            divTable.id = 'div_table_' + this.state.id;
            document.getElementById('div_' + this.state.id).appendChild(divTable);
            if(this.state.multiple) {
                this.state.files = { obj: {} };
                this.state.files.obj[OPTIONS_KEY.OPTIONS_FILE] = files;
                const trFiles = Array.from(files).map((o, idx) => {
                    this.state.total += o['size'];
                    return(
                        <tr key={ idx } title={ o['name'] }>
                            <td>
                                <Button
                                    idx={ o['idx'] }
                                    type={ TYPE.BUTTON }
                                    onClick={ this._onDownloadFile.bind(this) }
                                    variant={ VARIANT_TYPES.SECONDARY }>
                                    <FaDownload />
                                </Button>
                            </td>
                            <td>{ o['name'] }</td>
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
                ReactDOM.render(
                    <table className={ 'table-sm table-striped table-bordered table-hover' }>
                        <tbody>
                            { trFiles }
                        </tbody>
                    </table>
                    ,document.getElementById(divTable.id));

                this.state.title = files.length + Msg.getMsg(null, this.state.language, 'bt_file');
                this.state.size = byteToUnit(this.state.total);
            } else {
                const o = files[0];
                this.state.title = o['name'];
                this.state.size = byteToUnit(o['size']);
                divTable.className = 'div-btn-download';
                ReactDOM.render(
                    <Button
                        idx={ 0 }
                        type={ TYPE.BUTTON }
                        onClick={ this._onDownloadFile.bind(this) }
                        variant={ VARIANT_TYPES.SECONDARY }>
                        <FaDownload />
                    </Button>
                    ,document.getElementById(divTable.id));
            }
            this._onStopIntervalLoadFiles();
        }
        this.forceUpdate();
    }

    _onCheckFiles(files) {
        if(this.state.fileLoading) {
            this._onStopIntervalLoadFiles();
        }
        this.state.files.obj[OPTIONS_KEY.OPTIONS_FILE] = files;
        this._onStartLoading(files);
        this.state.fileLoading = setInterval(this._onSetIntervalLoadFiles.bind(this), 1000);
    }

    _onResetState() {
        this._onGetSizeSetTitle(null);
        this.state.files = { obj: {} };
    }

    _onGetSizeSetTitle(files) {
        this.state.total = (Utils.isEmpty(files))?0:files.reduce((a, b) => a + b.size, 0);
        if(this.state.total <= 0) {
            this.state.title =  Msg.getMsg(null, this.state.language, 'bt_file') + Msg.getMsg(MSG_TYPE.ERROR, this.state.language, 'selected')
            this.state.size = ' ';
        } else {
            this.state.title = files.length + Msg.getMsg(null, this.state.language, 'bt_file');
            this.state.size = byteToUnit(this.state.total);
        }
    }

    _onStartLoading(files) {
        if(Utils.isEmpty(files)) return;
        this.state.loading = true;
        this.forceUpdate();
    }

    _onStopLoading() {
        this.state.loading = false;
        this.forceUpdate();
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        console.log('UNSAFE_componentWillReceiveProps');
        console.log(nextProps);
        this._onCheckFiles(nextProps.value);
    }

    componentDidMount() {
        console.log('componentDidMount');
        this._onCheckFiles(this.props.value);
    }

    UNSAFE_componentWillMount() {
        console.log('UNSAFE_componentWillMount');
        this._onStartLoading(this.props.value);
    }

    render() {
        console.log(this.props);
        this.state.files.obj[OPTIONS_KEY.OPTIONS_FILE] = (Utils.isEmpty(this.props.value))?'':this.props.value;
        this.state.multiple = (Utils.inJson(this.props.schema, CUSTOMIZE.MULTIPLE_FILE))?this.props.schema[CUSTOMIZE.MULTIPLE_FILE]:false;
        const className = (this.state.multiple)?'div-file-multiple-box':'div-file-box';

        return (
            <div>
                <LoadingOverlay active={ this.state.loading } spinner text='Loading your content...' />
                <div id={ 'div_' + this.state.id } className={ className }>
                    <input
                        multiple={ this.state.multiple }
                        type={ TYPE.FILE }
                        id={ this.state.id }
                        onChange={ this._onChange.bind(this) } />
                    <font className={ 'btn btn-info' }>
                        { this.state.title }<br />{ this.state.size }
                    </font>
                </div>
            </div>
        );  
    }
}