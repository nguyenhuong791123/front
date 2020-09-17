import React, { Component as C } from 'react';
import { TYPE, OPTIONS_KEY } from '../HtmlTypes';
import Utils from '../Utils';
import { fileToBase64 } from '../FileUtils';

export default class ImageBox extends C {
    constructor(props) {
        super(props);
    
        this._onChange = this._onChange.bind(this);
        this._onClick = this._onClick.bind(this);

        this.state = {
            id: this.props.id,
            file: this.props.value,
            files: { obj: {} },
            fileLoading: null
        }
    };

    _onChange(e) {
        const obj = e.target;
        if(Utils.isEmpty(obj)) return;
        if(!Utils.isEmpty(obj.files)) {
            let files = { obj: {} };
            fileToBase64(obj.files, files);
            this.setState({ files: files });
            if(Utils.isEmpty(files.obj[OPTIONS_KEY.OPTIONS_FILE]) || Utils.isEmpty(files.obj[OPTIONS_KEY.OPTIONS_FILE][0])) {
                this.state.fileLoading = setInterval(this._onSetIntervalLoadFiles.bind(this), 1000);
            } else {
                this.props.onChange(files.obj[OPTIONS_KEY.OPTIONS_FILE][0]);    
            }
            this.forceUpdate();
        }
    }

    _onClick() {
        const i = document.getElementById('input_' + this.state.id);
        if(Utils.isEmpty(i)) return;
        i.click();
    }

    _onSetIntervalLoadFiles() {
        const files = this.state.files.obj[OPTIONS_KEY.OPTIONS_FILE];
        // console.log(files[0])
        if(Utils.isEmpty(files) || Utils.isEmpty(files[0])) return;
        this._onStopIntervalLoadFiles();
        this.props.onChange(files[0]);
    }

    _onStopIntervalLoadFiles() {
        if(!Utils.isEmpty(this.state.fileLoading)) {
            clearInterval(this.state.fileLoading);
        }
        this.forceUpdate();
    }

    _onCheckFiles(file) {
        if(this.state.fileLoading) {
            this._onStopIntervalLoadFiles();
        }
        this.state.file = file;
        this.state.fileLoading = setInterval(this._onSetIntervalLoadFiles.bind(this), 1000);
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        this.setState({ file: nextProps.value });
    }

    render() {
        if(!Utils.inJson(this.state, 'file') || Utils.isEmpty(this.state['file'])|| !Utils.inJson(this.state['file'], 'data')) return '';
        const changed = (Utils.inJson(this.props.schema, 'changed'))?this.props.schema['changed']:false;
        if(!changed) {
            return(<div className={ 'div-image-file-box' } id={ 'div_' + this.state.id }>
                        <img src={ this.state.file['data'] } id={ this.state.id }/>
                    </div>
                );
        } else {
            return (
                <div className={ 'div-image-file-box' }id={ 'div_' + this.state.id }>
                    <input type={ TYPE.FILE } id={ 'input_' + this.state.id } onChange={ this._onChange.bind(this) } />
                    {(() => {
                        if(Utils.inJson(this.state.file, 'data') && !Utils.isEmpty(this.state.file['data'])) {
                            return(<img src={ this.state.file['data'] } onClick={ this._onClick.bind(this) } id={ this.state.id }/>);
                        }
                    })()}
                </div>
            );    
        }
    }
}