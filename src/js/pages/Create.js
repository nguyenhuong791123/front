
import React, { Component as C } from 'react';
import { withRouter } from "react-router-dom";
import { connect } from 'react-redux';

import Actions from '../utils/Actions';
import CForm from '../utils/CForm';
import ImageBox from '../utils/Compoment/ImageBox';
import TimeBox from '../utils/Compoment/TimeBox';
import CheckBoxSingle from '../utils/Compoment/CheckBoxSingle';
import CheckBoxInline from '../utils/Compoment/CheckBoxInline';

import Utils from '../utils/Utils';
import { HTML_TAG } from '../utils/HtmlTypes';
import { PAGE_ACTION, ACTION } from '../utils/Types';

class Create extends C {
  constructor(props) {
    super(props);

    this._onClickBack = this._onClickBack.bind(this);
    this._onClickSubmit = this._onClickSubmit.bind(this);
    this._updateFormData = this._updateFormData.bind(this);
    this._onError = this._onError.bind(this);
    this._onValidate = this._onValidate.bind(this)

    this.state = {
      isUser: this.props.isUser
      ,options: this.props.options
      ,form: []
    }
  };

  componentWillMount(){
    console.log("Data submitted: ", this.props.onUpdateStateIsUser);
    this.state.form = [
      {
        "object_type": "div",
        "class_name": "div-box div-box-50",
        "idx": 2,
        "object": {
          "schema": {
            "type": "object",
            "title": "DIV01",
            "block": "DIV",
            "fIdx": 2,
            "idx": 0,
            "properties": {
              "text_mqunjr8l": {
                "type": "string",
                "title": "1st",
                "idx": 1,
                "obj": {
                  "label_ja": "1st",
                  "placeholder_ja": "",
                  "item_type": "text",
                  "language": "ja",
                  "box_width": 25,
                  "item_name": "text_mqunjr8l"
                }
              }
            },
            "definitions": {},
            "obj": {
              "language": "ja",
              "box_width": "50",
              "item_type": "div",
              "label_ja": "DIV01"
            }
          },
          "ui": {
            "text_mqunjr8l": {
              "classNames": "div-box div-box-25"
            }
          },
          "data": {
            "text_mqunjr8l": "",
            "reload": true
          }
        }
      },
      {
        "object_type": "div",
        "class_name": "div-box div-box-50",
        "idx": 1,
        "object": {
          "schema": {
            "type": "object",
            "title": "DIV",
            "block": "DIV",
            "fIdx": 1,
            "idx": 0,
            "properties": {
              "text_5n43s4k9": {
                "type": "string",
                "title": "2nd",
                "idx": 1,
                "obj": {
                  "label_ja": "2nd",
                  "placeholder_ja": "",
                  "item_type": "text",
                  "language": "ja",
                  "box_width": 25,
                  "item_name": "text_5n43s4k9"
                }
              }
            },
            "definitions": {},
            "obj": {
              "language": "ja",
              "box_width": "50",
              "item_type": "div",
              "label_ja": "DIV"
            }
          },
          "ui": {
            "text_5n43s4k9": {
              "classNames": "div-box div-box-25"
            }
          },
          "data": {
            "text_5n43s4k9": "",
            "reload": true
          }
        }
      },
      {
        "object_type": "tab",
        "active": 0,
        "idx": 0,
        "class_name": "div-box-100",
        "object": [
          {
            "schema": {
              "type": "object",
              "tab_name": "TAB",
              "block": "TAB",
              "fIdx": 0,
              "idx": 0,
              "properties": {
                "text_vsajb8qs": {
                  "type": "string",
                  "title": "3rd",
                  "idx": 0,
                  "obj": {
                    "label_ja": "3rd",
                    "placeholder_ja": "",
                    "item_type": "text",
                    "language": "ja",
                    "box_width": 25,
                    "item_name": "text_vsajb8qs"
                  }
                }
              },
              "definitions": {},
              "obj": {
                "language": "ja",
                "box_width": 100,
                "label_ja": "TAB"
              }
            },
            "ui": {
              "text_vsajb8qs": {
                "classNames": "div-box div-box-25"
              }
            },
            "data": {
              "text_vsajb8qs": "",
              "reload": true
            }
          },
          {
            "schema": {
              "type": "object",
              "tab_name": "TAB",
              "block": "TAB",
              "fIdx": 0,
              "idx": 1,
              "properties": {},
              "definitions": {},
              "obj": {
                "language": "ja",
                "box_width": 100,
                "label_ja": "TAB"
              }
            },
            "ui": {},
            "data": {}
          }
        ]
      }
    ]

    this._onSortForms();
  }

  _onSortForms() {
    var forms = this.state.form;
    forms.map((f) => {
      var objs = f.object;
      if(Array.isArray(objs) && objs.length > 0) {
        return objs.map((obj, idx) => {
          var lists = Object.keys(obj.schema.properties).map((o) => { 
            return { key: o, obj: obj.schema.properties[o] };
          });
          lists.sort((a, b) => ((a.obj.idx > b.obj.idx)?1:-1));
          var properties = {};
          for(let i=0; i<lists.length; i++) {
            properties[lists[i].key] = lists[i].obj;
          }
          obj.schema.properties = properties;
          return obj;
        });
      } else {
        var lists = Object.keys(f.object.schema.properties).map((o) => { 
          return { key: o, obj: f.object.schema.properties[o] };
        });
        lists.sort((a, b) => ((a.obj.idx > b.obj.idx)?1:-1));
        var properties = {};
        for(let i=0; i<lists.length; i++) {
          properties[lists[i].key] = lists[i].obj;
        }
        objs.schema.properties = properties;
        return objs;
      }
    });
    forms.sort((a, b) => ((a.idx > b.idx)?1:-1));
  }

  _onClickBack() {
    this.state.isUser.path = ACTION.SLASH + ACTION.LIST;
    const auth = { info: this.state.isUser, options: this.state.options };
    this.props.onUpdateStateIsUser(auth);
    // this.props.history.push(ACTION.SLASH + ACTION.LIST);
    // this.forceUpdate();
  }

  _onClickSubmit() {
    console.log("Data submitted: ", this.state.formData);
    this._onClickBack();
  }

  _updateFormData(e) {
    if(!Utils.inJson(e, 'schema') || !Utils.inJson(e, 'formData')) return;
    console.log(e);
    const fIdx = e.schema.fIdx;
    const idx = e.schema.idx;
    if(e.schema.block === HTML_TAG.DIV) {
      this.state.form[fIdx].object.data = e.formData;
    }
    if(e.schema.block === HTML_TAG.TAB) {
      this.state.form[fIdx].object[idx].data = e.formData;
    }
  }

  _onError(errors) {
    console.log("I have", errors.length, "errors to fix");
  }

  _onValidate(formData, errors) {
    // if (formData.base_info.email === undefined || formData.base_info.email.length <= 0) {
    //   errors.base_info.email.addError("を入力してください。");
    // }
    // if (formData.base_info.checkboxs === undefined || formData.base_info.checkboxs.length <= 0) {
    //   errors.base_info.checkboxs.addError("を選択してください。");
    // }
    // if (formData.base_info.user_flag === undefined || formData.base_info.user_flag.length <= 0) {
    //   errors.base_info.user_flag.addError("を選択してください。");
    // }
    // if (formData.base_info.file === undefined || formData.base_info.file.length <= 0) {
    //   errors.base_info.file.addError("を選択してください。");
    // }
    // if (formData.base_info.files === undefined || formData.base_info.files.length <= 0) {
    //   errors.base_info.files.addError("を選択してください。");
    // }
    return errors;
  }
  
  UNSAFE_componentWillUpdate() {
    console.log(this.state.formData);
  }

  render() {
    this.state.isUser.actions = PAGE_ACTION.CREATE;

    return (
      <div>
        <CForm
          isUser={ this.state.isUser }
          form={ this.state.form }
          updateFormData={ this._updateFormData.bind(this) } />
        <Actions
          isUser={ this.state.isUser }
          onClickBack={ this._onClickBack.bind(this) }
          onClickSubmit={ this._onClickSubmit.bind(this) } />
      </div>
    )

  };
};

export default connect()(withRouter(Create));