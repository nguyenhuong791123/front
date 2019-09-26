import React, { Component as C } from "react";
import { EditorState } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

import { EDITOR_RESET } from './EditorUtil';
import '../../css/CEditor.css';

class CEditor extends C {
  constructor(props) {
    super(props);

    this._onEditorStateChange = this._onEditorStateChange.bind(this);

    this.state = {
      editorState: EditorState.createEmpty()
    }
  }

  _onEditorStateChange(editorState) {
    // console.log(editorState);
    this.setState({ editorState });
    this.props.onUpdateEditor(editorState.getCurrentContent());
  };

  render() {
    return (
      <div>
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