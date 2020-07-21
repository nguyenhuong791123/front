import React, { Component as C } from "react";
import ReactDOM from 'react-dom';
import { NavDropdown } from 'react-bootstrap';
import { convertToRaw } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
// import { Form } from 'react-bootstrap';
import { FaRocketchat, FaEllipsisV } from 'react-icons/fa';
import { slide as Menu } from "react-burger-menu";
import FormBS4 from "react-jsonschema-form-bs4";

import CEditor from "../CEditor";
import Html from '../HtmlUtils';
import Dates from '../DateUtils';
import { isEmpty } from '../Utils';
import { SYSTEM, OTHERS, VARIANT_TYPES, ACTION } from "../Types";
import { HTML_TAG, TYPE, ATTR } from '../HtmlTypes';

var styles = {
  bmBurgerButton: { position: 'fixed', width: '20px', height: '30px', right: '80px', top: '16px', color: 'white' },
  // bmBurgerBars: { background: '#373a47' },
  // bmBurgerBarsHover: { background: '#a90000' },
  bmCrossButton: { height: '24px', width: '24px' },
  bmCross: { background: '#bdc3c7' },
  bmMenuWrap: { position: 'fixed', height: '100%' },
  // bmMenu: { background: '#373a47', padding: '2.5em 1.5em 0', fontSize: '1.15em' },
  bmMenu: { overflow: 'hidden' },
  // bmMorphShape: { fill: '#373a47' },
  // bmItemList: { color: '#b8b7ad', padding: '0.8em' },
  // bmItemList: { color: '#b8b7ad' },
  // bmItem: { display: 'inline-block' },
  // bmOverlay: { background: 'rgba(0, 0, 0, 0.3)' }
  bmOverlay: { position: 'unset !important' }
}

class RMenu extends C {
  constructor(props) {
    super(props);

    // console.log(props.ua.device);
    // console.log(props.ua.language);
    // socket.emit('join room', 'room', 1);
    // socket.emit('chat message', 'room', 1, 1, 1, 'TEST');
    // socket.on('chat message', function(data){
    //     console.log(data);
    // });

    this._onClick = this._onClick.bind(this);
    this._onOpenClick = this._onOpenClick.bind(this);
    this._onClickSubmit = this._onClickSubmit.bind(this);
    this._onChange = this._onChange.bind(this);
    this._onUpdateEditor = this._onUpdateEditor.bind(this);
    this._onEditChats = this._onEditChats.bind(this);

    this.state = {
      isUser: this.props.isUser
      ,title: this.props.title
      ,objs: this.props.objs
      ,chats: []
      ,chat: undefined
      ,file: undefined
      ,isOpen: false
      ,isOpenEdit: false
    }
  }

  _onClick(e) {
    const obj = Html.getSpan(e);
    if(isEmpty(obj)) return;
    console.log(e.target);
    console.log(e.target.tagName);
    console.log(obj);
  }

  _onOpenClick(e) {
    if(isEmpty(e.isOpen)) return;
    var body = document.getElementById('div_body');
    if(e.isOpen) {
      body.className = "div-margin-right-22";
    } else {
      body.className = "";
    }

    var bts = document.getElementById('div_button_action');
    if(!isEmpty(bts)) {
      var btClass = bts.className;
      if(e.isOpen) {
        bts.className = btClass + " div-margin-right-22";
      } else {
        bts.className = btClass.replace(" div-margin-right-22", "");
      }
    }
    // console.log(body);
  }

  _onClickSubmit() {
    console.log("Data submitted: ", this.state);
  }

  _onChange(e) {
    const obj = e.target;
    if(!isEmpty(obj) && Html.hasAttribute(obj, ATTR.ID) && obj.id === SYSTEM.IS_ADD_CHAT_FILE) {
      const file = document.getElementById(SYSTEM.IS_ADD_CHAT_FILE);
      if(isEmpty(file) || isEmpty(file.value) || isEmpty(file.files[0])) return;
      const array = file.value.split(OTHERS.REGEX_FILE_NAME);
      if(isEmpty(array)) return;
      const blobUrl = window.URL.createObjectURL(file.files[0]);
      this.state.sFile = { name: array[array.length - 1], data: blobUrl };
      const div = document.getElementById(SYSTEM.IS_DIV_CHAT_FILE_BOX);
      const fDiv = (
        <div>
          <span>✖️</span>
          <span>{ this.state.sFile.name }</span>
        </div>
      );
      file.value = '';
      ReactDOM.render(fDiv, div);
      console.log(this.state.sFile);
    }
  }

  _onUpdateEditor(editorState) {
    const div = document.getElementById(SYSTEM.IS_DIV_CHAT_LIST_BOX);
    if(isEmpty(editorState) || isEmpty(div)) return;
    const chat = {
      uLid: this.state.isUser.uLid
      ,uId: this.state.isUser.uId
      ,date: Dates.isMonthDay(Dates.SYMBOL.SLASH,this.state.isUser.language)
      ,file: this.state.sFile
      ,editorState: editorState };
    const msg = this._getObjChat(chat, this.state.chats.length);
    console.log(msg);
    if(isEmpty(msg)) return;
    this.state.chats.push(chat);
    div.appendChild(msg);
    this.state.sFile = undefined;
    document.getElementById(SYSTEM.IS_DIV_CHAT_FILE_BOX).innerHTML = '';

    const divBox = document.getElementById(SYSTEM.IS_DIV_CHAT_BOX);
    if(isEmpty(divBox)) return;
    divBox.scrollTop = divBox.scrollHeight;
  }

  _getTitle() {
    return (
      <div className="div-box-title">
        <input type={ TYPE.FILE } id={ SYSTEM.IS_ADD_CHAT_FILE } onChange={ this._onChange.bind(this) } />
        { this.state.title }
      </div>
    );
  }

  _onPageSetting(div) {
    if(isEmpty(div)) return;
    const divPageSetting = (<FormBS4
                              schema={ this.state.objs.schema }
                              uiSchema={ this.state.objs.uiSchema }
                              onChange={ this._onChange.bind(this) }>
                              <button type="submit" className="btn-submit-form-hidden" />
                            </FormBS4>);
    ReactDOM.render(divPageSetting, div);
  }

  _onChat(div) {
    if(isEmpty(div)) return;
    const divChatBox = (<div id={ SYSTEM.IS_DIV_CHAT_BOX } className="div-chat-box">
                          <div id={ SYSTEM.IS_DIV_CHAT_LIST_BOX }>
                            {(() => {
                              this.state.chats.map((chat) => {
                                return(chat);
                              });
                            })()}
                          </div>
                          <div>
                            <div id={ SYSTEM.IS_DIV_CHAT_FILE_BOX }></div>
                            <CEditor fileId={ SYSTEM.IS_ADD_CHAT_FILE } onUpdateEditor= { this._onUpdateEditor.bind(this) } />
                          </div>
                        </div>);
    ReactDOM.render(divChatBox, div);
  }

  _getObjChat(obj, idx) {
    if(isEmpty(obj) || isEmpty(idx)) return "";
    const html = draftToHtml(convertToRaw(obj.editorState));
    console.log(html);
    const htmlIsEmpty = html.replace('<p></p>', '');
    if(isEmpty(html) || isEmpty(htmlIsEmpty) || htmlIsEmpty.length <= 1) return "";
    const div = document.createElement(HTML_TAG.DIV);
    div.className = "div-box-right";
    const tbl = (
                  <table>
                    <tbody>
                      <tr>
                        <td>
                          <span>{ obj.uLid } { obj.date }</span>
                          {(() => {
                              if(this.state.isUser.uId === obj.uId) {
                                return(<FaEllipsisV />);
                              }
                          })()}
                          {(() => {
                              if(!isEmpty(obj.file)) {
                                return(<img src={ obj.file.data } title={ obj.file.name }></img>);
                              }
                          })()}
                          <div className="div-box-msg"
                            dangerouslySetInnerHTML={{__html: html}}>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                );
    ReactDOM.render(tbl, div);
    return div;
  }

  _onOpenEdit(e) {
    const obj = e.target;
    console.log(obj);
    var idx = 0;
    this.state.chat = this.state.chats[idx];
    return(
      <Alert show={ this.state.isOpenEdit } variant={ VARIANT_TYPES.LIGHT }>
        <Nav.Link id={ ACTION.EDIT } onClick={ this._onEditChats.bind(this) } />
        <Nav.Link id={ ACTION.DELETE } onClick={ this._onEditChats.bind(this) } />
      </Alert>
    );
  }

  _onEditChats(e) {
    const obj = e.target;
    if(isEmpty(obj) || !Html.hasAttribute(obj, ATTR.ID)) return;
    if(obj.id === ACTION.DELETE) {
      const idx = Array.from(this.state.chats).indexOf(this.state.chat);
      delete this.state.chats[idx];  
    }
    if(obj.id === ACTION.EDIT) {
      console.log(obj);
    }
  }

  UNSAFE_componentWillReceiveProps(props) {
    console.log('HEADER componentWillReceiveProps');
    this.state.isUser = props.isUser;
    this.state.title = props.title;
    this.state.objs = props.objs;
    // this.state.objs = (props.isViewChat)?props.chats:props.objs;

    const div = document.getElementById(SYSTEM.IS_DIV_RIGHT_BOX);
    if(props.isViewChat) {
      this._onChat(div);
    } else {
      if(isEmpty(props.objs) || props.objs.toString() === '{}' || isEmpty(props.objs.schema)) return;
      this.state.objs = props.objs;
      this._onPageSetting(div);
    }
  }

  render() {
    return (
      <div>
        <Menu
          styles={ styles }
          width={ '22%' }
          className="div-menu-right alert-light"
          { ...this.props }
          customBurgerIcon={ <FaRocketchat id="div_right_chat_icon" className="div-right-chat-icon" /> }
          // customCrossIcon={ false }
          onStateChange={ this._onOpenClick.bind(this) }
          right>
          { this._getTitle() }
          <div id={ SYSTEM.IS_DIV_RIGHT_BOX } className="div-right-box"></div>
        </Menu>
      </div>
    );
  }
}

export default RMenu;