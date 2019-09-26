import React, { Component as C } from "react";
import ReactDOM from 'react-dom';
import { EditorState } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { FaUpload, FaPaperPlane } from 'react-icons/fa';

import { isEmpty } from './Utils';
import { EDITOR_RESET } from './EditorUtil';
import { SYSTEM } from './Types';
import '../../css/CEditor.css';
import { HTML_TAG } from "./HtmlTypes";

class CEditor extends C {
  constructor(props) {
    super(props);

    this._onEditorStateChange = this._onEditorStateChange.bind(this);

    this.state = {
      editorState: EditorState.createEmpty()
    }
  }

  _onEditorStateChange(editorState) {
    this.setState({ editorState });
    this.props.onUpdateEditor(editorState.getCurrentContent());
  };

  componentDidMount() {
    const divEditor = document.getElementById(SYSTEM.IS_DIV_EDITOR_BOX);
    if(isEmpty(divEditor)) return;
    const pDivChat = document.getElementById(SYSTEM.IS_DIV_RIGHT_BOX);
    if(isEmpty(pDivChat)) return;
    const divChat = document.getElementById(SYSTEM.IS_DIV_CHAT_BOX);
    if(isEmpty(divChat)) return;
    divChat.style.height = (pDivChat.offsetHeight - (divEditor.offsetHeight + 105)) + 'px';
    console.log(divEditor.childNodes[0]);
    console.log(divEditor.childNodes[0].childNodes[0]);
    const divUp = document.createElement(HTML_TAG.DIV);
    ReactDOM.render((<span><FaUpload /></span>), divUp);
    divEditor.childNodes[0].childNodes[0].appendChild(divUp);
    const divSend = document.createElement(HTML_TAG.DIV);
    ReactDOM.render((<span><FaPaperPlane /></span>), divSend);
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