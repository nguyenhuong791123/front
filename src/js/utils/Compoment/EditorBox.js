import React, { Component as C } from 'react';
import ReactDOM from 'react-dom';
import { FaUpload } from 'react-icons/fa';

import { EditorState, ContentState } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import { convertToRaw } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';

import { EDITOR_RESET } from '../EditorUtil';
import { HTML_TAG } from "../HtmlTypes";
import { isEmpty } from "../Utils";

export default class EditorBox extends C {
    constructor(props) {
        super(props);

        const language = this.props.schema.language;
        this.state = {
            id: this.props.id,
            language: language,
            editorState: EditorState.createEmpty(),
            editorHtml: '',
        }
    };

    _onEditorStateChange(editorState) {
        if(isEmpty(editorState)) return;
        this.setState({ editorState });
        const contentEditorState = editorState.getCurrentContent();
        this.state.editorHtml = draftToHtml(convertToRaw(contentEditorState));
        this.props.onChange(this.state.editorHtml);
    }

    _onSetEditorState(editorHtml) {
        if(isEmpty(editorHtml)) return;
        const blocksFromHtml = htmlToDraft(editorHtml);
        const { contentBlocks, entityMap } = blocksFromHtml;
        const contentState = ContentState.createFromBlockArray(contentBlocks, entityMap);
        this.state.editorState = EditorState.createWithContent(contentState);
    }

    _onSpanClick(e) {
        const obj = Html.getSpan(e);
        if(isEmpty(obj) || !Html.hasAttribute(obj, ATTR.ID)) return;
        const file = document.getElementById(obj.id);
        if(!isEmpty(file)) file.click();
    }    

    // UNSAFE_componentWillReceiveProps(nextProps) {
    //     console.log('UNSAFE_componentWillReceiveProps');
    //     console.log(nextProps);
    //     this._onSetEditorState(nextProps.value);
    // }

    componentWillMount() {
        console.log('UNSAFE_componentWillMount');
        this._onSetEditorState(this.props.value);
    }

    render() {
        // this._onSetEditorState(this.props.value);
        return (
            <div id={ 'editor_' + this.state.id } className={ 'div-editor-box' }>
                <Editor
                    editorState={ this.state.editorState }
                    wrapperClassName="wrapper-class"
                    editorClassName="editor-class"
                    toolbarClassName="toolbar-class"
                    toolbar={ EDITOR_RESET }
                    onEditorStateChange={ this._onEditorStateChange.bind(this) } />
            </div>
        );
    }
}