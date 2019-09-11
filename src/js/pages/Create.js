
import React, { Component as C } from 'react';
import { withRouter } from "react-router-dom";
import { connect } from 'react-redux';
import Form from "react-jsonschema-form-bs4";
// import { Button } from 'react-bootstrap';
// import { FaReply, FaCheck } from 'react-icons/fa';

import Actions from '../utils/Actions';
import { ACTION } from '../utils/Types';

class Create extends C {
  constructor(props) {
    super(props);

    this._onClickReturn = this._onClickReturn.bind(this);
    this._onClickSubmit = this._onClickSubmit.bind(this);
    this._onChange = this._onChange.bind(this);
    this._onError = this._onError.bind(this);
    this._onValidate = this._onValidate.bind(this)

    this.state = {
      isUser: this.props.isUser
      ,schema: {
        // title: "Widgets",
        // type: "object",
        // properties: {
        //   base_info: {
        //     type: "object"
        //     ,title: "基本情報"
        //     // ,required: [ "email", "uri" ]
        //     ,properties: {
        //       email: { type: "string", title: "メール", format: "email", }
        //       ,uri: { type: "string", format: "uri", }
        //     },
        //   },
          // cust_info: {
          //   type: "object"
          //   ,title: "顧客情報"
          //   ,required: [ "cust_name_hira", "cust_name_kana" ]
          //   ,properties: {
          //     cust_name_hira: { type: "string" }
          //     ,cust_name_kana: { type: "string" }
          //   }
          // }
      //   },
      },
      uiSchema: {
      //   base_info: {
      //     classNames: "div-top-box div-top-box-100"
      //     ,email: { "ui:placeholder": "メール", classNames: "div-box div-box-50" }
      //     ,uri: { "ui:placeholder": "URL", classNames: "div-box div-box-50" }
      //   }
        // ,cust_info: {
        //   classNames: "div-top-box"
        //   ,cust_name_hira: { "ui:placeholder": "顧客名", classNames: "div-box div-box-50" }
        //   ,cust_name_kana: { "ui:placeholder": "顧客カナ", classNames: "div-box div-box-50" }
        // }
      }
      ,formData: {}
      // schema: {
      //   title: "基本情報",
      //   type: "object",
      //   required: ["title", "description", "priority", "tags"],
      //   properties: {
      //     title: { type: "string", title: "Title", default: "A new task", minLength: 1, maxLength: 3 }
      //     ,priority: { type: "string", title: "Priority", enum: ["Low", "Medium", "High"] }
      //     ,tags: { type: "array", title: "Related Projects", items: { type: "string", enum: ["ProjA", "ProjB"] }, uniqueItems: true }
      //     ,title2: { type: "string", title: "Title2", default: "A new task", minLength: 1, maxLength: 3 }
      //     ,done: { type: "boolean", title: "Done?", default: false }
      //     ,done2: { type: "boolean", title: "Done2?", default: false }
      //     ,description: { type: "string", title: "Description of task" }
      //   }
      // }
      // ,uiSchema: {
      //   "ui:rootFieldId": "customizeForm",
      //   title: { "ui:placeholder": "Title*", classNames: "div-box div-box-33" }
      //   ,priority: { classNames: "div-box div-box-33" }
      //   ,tags: { "ui:widget": "checkboxes", "ui:options": { inline: true }, classNames: "div-box div-box-33 div-box-display-contents" }
      //   ,title2: { "ui:placeholder": "Title2*", classNames: "div-box div-box-33" }
      //   ,done:{ classNames: "div-box div-box-33 div-box-checkbox" }
      //   ,done2:{ classNames: "div-box div-box-33 div-box-checkbox" }
      //   ,description: { "ui:widget": "textarea", "ui:options": { rows: 4 }, classNames: "div-box div-box-100" }
      // }
      // ,formData: { done: true }
       ,widgets: {}
    }
  };

  componentWillMount(){
    this.state.schema = {
      type: "object",
      properties: {
        base_info: {
          type: "object"
          ,title: "基本情報"
          // ,required: [ "file", "files" ]
          ,properties: {
            password: { "type": "string", "title": "Password", "minLength": 4 }
            ,email: { type: "string", title: "メール", format: "email" }
            ,uri: { type: "string", format: "uri" }
            ,deleted: { type: "boolean", title: "削除", default: false }
            // ,checkboxs: { type: "array", title: "Checkboxs", items: { type: "string", enum: [ "ProjA", "ProjB" ] }, uniqueItems: true }
            ,checkboxs: { type: "array", title: "Checkboxs", items: { type: "string", enum: [ "ProjA", "ProjB" ] }, uniqueItems: true, }
            ,user_flag: { type: "string", title: "ユーザー権限", anyOf: [{ "type": "string", "enum": [ 0 ], "title": "一般ユーザー" },{ "type": "string", "enum": [ 1], "title": "管理者" }]}
            ,file: { "type": "string", "format": "data-url", "title": "Single file" }
            ,files: { "type": "array", "title": "Multiple files", "items": { "type": "string", "format": "data-url" } }
            ,datetime: { "type": "string", "format": "date-time" }
            ,date: { "type": "string", "format": "date" }
            ,disabled: { "type": "string", "default": "disabled string." }
            ,color: { "type": "string", "title": "color picker", "default": "#151ce6" }
            ,radio: { "type": "boolean", "title": "radio buttons" }
            ,widgetOptions: { "title": "Custom widget with options", "type": "string", "default": "I am yellow" }
            ,numberString: { "type": "number", "title": "Number" }
            ,integer: { "title": "Integer", "type": "integer" }
            ,numberEnum: { "type": "number", "title": "Number Select", "enum": [ 1, 2, 3 ] }
            ,numberEnumRadio: { "type": "number", "title": "Number enum", "enum": [ 1, 2, 3 ] }
            ,integerRange: { "title": "Integer range", "type": "integer", "minimum": 42, "maximum": 100 }
            ,integerRangeSteps: { "title": "Integer range (by 10)", "type": "integer", "minimum": 50, "maximum": 100, "multipleOf": 10 }
          },
        }
        // ,cust_info: {
        //   type: "object"
        //   ,title: "顧客情報"
        //   // ,required: [ "cust_name_hira", "cust_name_kana" ]
        //   ,properties: {
        //     cust_name_hira: { type: "string" }
        //     ,cust_name_kana: { type: "string" }
        //   }
        // }
      }
    }
    this.state.uiSchema = {
      base_info: {
        classNames: "div-top-box div-top-box-100 div-box-not-view-label"
        ,password: { "ui:widget": "password", classNames: "div-box div-box-25 div-box-not-view-label" }
        ,email: { "ui:placeholder": "メール", classNames: "div-box div-box-25 div-box-not-view-label" }
        ,uri: { "ui:placeholder": "URL", classNames: "div-box div-box-25 div-box-not-view-label" }
        ,deleted: { classNames: "div-box div-box-25 div-box-not-view-label" }
        ,checkboxs: { "ui:widget": "checkboxes", "ui:options": { inline: true }, "ui:autofocus": true, classNames: "div-box div-box-25 div-box-not-view-label" }
        ,user_flag: { "ui:placeholder": "ユーザー権限", classNames: "div-box div-box-25 div-box-not-view-label" }
        ,file: { "ui:options": { "accept": ".pdf" }, classNames: "div-box div-box-25 div-box-file div-box-not-view-label" }
        ,files: { "ui:options": { "accept": ".pdf" }, classNames: "div-box div-box-25 div-box-file div-box-not-view-label" }
        ,datetime: { classNames: "div-box div-box-25 div-box-not-view-label" }
        ,date: { classNames: "div-box div-box-25 div-box-not-view-label" }
        ,disabled: { "ui:disabled": true, classNames: "div-box div-box-25 div-box-not-view-label" }
        ,color: { "ui:widget": "color", classNames: "div-box div-box-25 div-box-not-view-label" }
        ,radio: { "ui:widget": "radio", "ui:options": { "inline": true }, "ui:help": "Yes No", classNames: "div-box div-box-25 div-box-not-view-label div-box-help-block-01" }
        ,widgetOptions: { "ui:options": { backgroundColor: "yellow !important" }, classNames: "div-box div-box-25 div-box-not-view-label" }
        ,numberString: { classNames: "div-box div-box-25 div-box-not-view-label" }
        ,integer: { "ui:widget": "updown", "ui:placeholder": "Integer", classNames: "div-box div-box-25 div-box-not-view-label" }
        ,numberEnumRadio: { "ui:widget": "radio", "ui:help": "Radio 1 2 3", "ui:options": { "inline": true }, classNames: "div-box div-box-25 div-box-not-view-label div-box-help-block-01" }
        ,numberEnum: { classNames: "div-box div-box-25 div-box-not-view-label" }
        ,integerRange: { "ui:widget": "range", "ui:help": "integerRange", classNames: "div-box div-box-25 div-box-not-view-label div-box-help-block-02" }
        ,integerRangeSteps: { "ui:widget": "range", "ui:help": "integerRangeSteps", classNames: "div-box div-box-25 div-box-not-view-label div-box-help-block-02" }
        // ,password: { "ui:widget": "password", classNames: "div-box div-box-33" }
        // ,email: { "ui:placeholder": "メール", classNames: "div-box div-box-33" }
        // ,uri: { "ui:placeholder": "URL", classNames: "div-box div-box-33" }
        // ,deleted: { classNames: "div-box div-box-33" }
        // ,checkboxs: { "ui:widget": "checkboxes", "ui:options": { inline: true }, "ui:autofocus": true, classNames: "div-box div-box-33" }
        // ,user_flag: { "ui:placeholder": "ユーザー権限", classNames: "div-box div-box-33" }
        // ,file: { "ui:options": { "accept": ".pdf" }, classNames: "div-box div-box-33 div-box-file" }
        // ,files: { "ui:options": { "accept": ".pdf" }, classNames: "div-box div-box-33 div-box-file" }
        // ,datetime: { classNames: "div-box div-box-33" }
        // ,date: { classNames: "div-box div-box-33" }
        // ,disabled: { "ui:disabled": true, classNames: "div-box div-box-33" }
        // ,color: { "ui:widget": "color", classNames: "div-box div-box-33" }
        // ,radio: { "ui:widget": "radio", "ui:options": { "inline": true }, classNames: "div-box div-box-33" }
        // ,widgetOptions: { "ui:options": { backgroundColor: "yellow !important" }, classNames: "div-box div-box-33" }
        // ,numberString: { classNames: "div-box div-box-33" }
        // ,integer: { "ui:widget": "updown", classNames: "div-box div-box-33" }
        // ,numberEnumRadio: { "ui:widget": "radio", "ui:options": { "inline": true }, classNames: "div-box div-box-33" }
        // ,numberEnum: { classNames: "div-box div-box-33" }
        // ,integerRange: { "ui:widget": "range", classNames: "div-box div-box-33" }
        // ,integerRangeSteps: { "ui:widget": "range", classNames: "div-box div-box-33" }
      // }
      // base_info: {
      //   classNames: "div-top-box div-top-box-50"
      //   ,email: { "ui:placeholder": "メール", classNames: "div-box div-box-not-view-label div-box-25" }
      //   ,uri: { "ui:placeholder": "URL", classNames: "div-box div-box-not-view-label div-box-25" }
      //   ,deleted: { classNames: "div-box div-box-not-view-label div-box-25" }
      //   ,checkboxs: { "ui:widget": "checkboxes", "ui:options": { inline: true }, "ui:autofocus": true, classNames: "div-box div-box-not-view-label div-box-25" }
      //   ,user_flag: { "ui:placeholder": "ユーザー権限", classNames: "div-box div-box-not-view-label div-box-25" }
      //   ,file: { "ui:options": { "accept": ".pdf" }, classNames: "div-box div-box-not-view-label div-box-25 div-box-file" }
      //   ,files: { "ui:options": { "accept": ".pdf" }, classNames: "div-box div-box-not-view-label div-box-25 div-box-file" }
      //   ,datetime: { classNames: "div-box div-box-not-view-label div-box-25" }
      //   ,date: { classNames: "div-box div-box-not-view-label div-box-25" }
      // }
      // ,cust_info: {
      //   classNames: "div-top-box div-top-box-100"
      //   ,cust_name_hira: { "ui:placeholder": "顧客名", classNames: "div-box div-box-not-view-label div-box-50" }
      //   ,cust_name_kana: { "ui:placeholder": "顧客カナ", classNames: "div-box div-box-not-view-label div-box-50" }
      // }
      }
    }
    this.state.formData = {
      base_info: {
        // email: "Email"
        // ,uri: "Url"
        integerRange: 42
        ,integerRangeSteps: 80
      }
      ,cust_info: {
        // cust_name_hira: "Hira"
        // ,cust_name_kana: "Kana"
      }
    }
  }

  _onClickReturn() {
    this.props.history.push(ACTION.SLASH + ACTION.LIST);
    this.forceUpdate();
  }

  _onClickSubmit() {
    console.log("Data submitted: ", this.state.formData);
    // browserHistory.push('/list');
    // this.forceUpdate();
  }

  _onChange(type) {
    console.log.bind(console, type);
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
  

  render() {
    return (
      <Form
        schema={ this.state.schema }
        uiSchema={ this.state.uiSchema } 
        widgets={ this.state.widgets }
        formData={ this.state.formData }
        onChange={ this._onChange("changed") }
        onSubmit={ this._onClickSubmit.bind(this) }
        validate={ this._onValidate.bind(this) }
        onError={ this._onError.bind(this) }>

        <Actions
          isUser={ this.state.isUser }
          onClickReturn={ this._onClickReturn.bind(this) }
          onClickSubmit={ this._onClickSubmit.bind(this) } />
      </Form>
    )
  };
};

export default connect()(withRouter(Create));