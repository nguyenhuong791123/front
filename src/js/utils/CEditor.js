import React, { Component as C } from "react";
import { EditorState } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

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
    console.log(editorState);
    this.setState({ editorState });
  };

  render() {
    return (
      <div>
        <Editor
          editorState={ this.state.editorState }
          wrapperClassName="wrapper-class"
          editorClassName="editor-class"
          toolbarClassName="toolbar-class"
          toolbar={{
            inline: { inDropdown: true },
            list: { inDropdown: true },
            textAlign: { inDropdown: true },
            link: { inDropdown: true },
            // history: { inDropdown: true },
            colorPicker: {
              colors: [
                'rgb(97,189,109)'
                ,'rgb(26,188,156)'
                ,'rgb(84,172,210)'
                ,'rgb(44,130,201)'
                ,'rgb(147,101,184)'
                ,'rgb(71,85,119)'
                ,'rgb(204,204,204)'
                ,'rgb(65,168,95)'
                ,'rgb(0,168,133)'
                ,'rgb(61,142,185)'
                ,'rgb(41,105,176)'
                ,'rgb(85,57,130)'
                ,'rgb(40,50,78)'
                ,'rgb(0,0,0)'
                ,'rgb(247,218,100)'
                ,'rgb(251,160,38)'
                ,'rgb(235,107,86)'
                ,'rgb(226,80,65)'
                ,'rgb(163,143,132)'
                ,'rgb(239,239,239)'
                ,'rgb(255,255,255)'
                ,'rgb(250,197,28)'
                ,'rgb(243,121,52)'
                ,'rgb(209,72,65)'
                ,'rgb(184,49,47)'
                ,'rgb(124,112,107)'
                ,'rgb(209,213,216)'
              ]
            }
          }}
          onEditorStateChange={ this._onEditorStateChange.bind(this) } />
      </div>
    );
  }
}

export default CEditor;