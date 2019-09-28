import React, { Component as C } from "react";
import ReactDOM from 'react-dom';
import { EditorState } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { FaUpload, FaPaperPlane } from 'react-icons/fa';

import Html from "./HtmlUtils";
import { isEmpty } from './Utils';
import { EDITOR_RESET } from './EditorUtils';
import { SYSTEM } from './Types';
import { HTML_TAG, ATTR } from "./HtmlTypes";
import '../../css/CEditor.css';

class CEditor extends C {
  constructor(props) {
    super(props);

    this._onClick = this._onClick.bind(this);
    this._onEditorStateChange = this._onEditorStateChange.bind(this);

    this.state = {
      editorState: EditorState.createEmpty()
    }
  }

  _onClick(e) {
    const obj = Html.getSpan(e);
    if(isEmpty(obj) || !Html.hasAttribute(obj, ATTR.ID)) return;
    console.log(e.target);
    console.log(obj);
    if(obj.id === 'file') {
      const file = document.getElementById('add_chat_file');
      file.click();
    }
    if(obj.id === 'send') {
      const editorState = this.state.editorState.getCurrentContent();
      this.state.editorState = EditorState.createEmpty();
      this.props.onUpdateEditor(editorState);
      this.forceUpdate();
    }
  }

  _onEditorStateChange(editorState) {
    this.setState({ editorState });
  };

  componentDidMount() {
    const divEditor = document.getElementById(SYSTEM.IS_DIV_EDITOR_BOX);
    if(isEmpty(divEditor)) return;
    const pDivChat = document.getElementById(SYSTEM.IS_DIV_RIGHT_BOX);
    if(isEmpty(pDivChat)) return;
    const divChat = document.getElementById(SYSTEM.IS_DIV_CHAT_BOX);
    if(isEmpty(divChat)) return;
    divChat.style.height = (pDivChat.offsetHeight - (divEditor.offsetHeight + 105)) + 'px';
    const divUp = document.createElement(HTML_TAG.DIV);
    ReactDOM.render((<span id={ 'file' }><FaUpload onClick={ this._onClick.bind(this) } /></span>), divUp);
    divEditor.childNodes[0].childNodes[0].appendChild(divUp);
    const divSend = document.createElement(HTML_TAG.DIV);
    ReactDOM.render((<span id={ 'send' }><FaPaperPlane onClick={ this._onClick.bind(this) } /></span>), divSend);
    divEditor.childNodes[0].childNodes[0].appendChild(divSend);
  }

  render() {
    return (
      <div id={ SYSTEM.IS_DIV_EDITOR_BOX }>
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

export default CEditor;