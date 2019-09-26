import React, { Component as C } from "react";
import ReactDOM from 'react-dom';
import { convertToRaw } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
// import { Form } from 'react-bootstrap';
import { FaRocketchat } from 'react-icons/fa';
import { slide as Menu } from "react-burger-menu";
import FormBS4 from "react-jsonschema-form-bs4";

import CEditor from "../CEditor";
import Html from '../HtmlUtils';
import { isEmpty } from '../Utils';
import { HTML_TAG } from '../HtmlTypes';
import { SYSTEM } from "../Types";

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

    this.state = {
      isUser: this.props.isUser
      ,title: this.props.title
      ,objs: this.props.objs
      ,chats: [
        { id: 1, uId: 1, uname: 'abc', msg: 'dadfass', date: '2019/10/27 10:30' }
        ,{ id: 2, uId: 2, uname: 'abc', msg: 'daartrgsfsdfass', date: '2019/10/26 20:30' }
        ,{ id: 3, uId: 3, uname: 'def', msg: 'ngjdhdfbzdfgdfhtgfjdgbfgdfh', date: '2019/10/25 09:30' }
      ]
      ,isOpen: false
    }
  }

  _onClick(e) {
    const obj = Html.getSpan(e);
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
    console.log(e.target);
  }

  _onUpdateEditor(editorState) {
    if(isEmpty(editorState)) return;
    this.state.objs = editorState;
    this.props.onUpdateListHeaders(this.state.objs);
  }

  _getTitle() {
    return( <div className="div-box-title">{ this.state.title }</div> );
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
    const chats = [];
    const objs = JSON.stringify(this.state.objs);
    if(!isEmpty(objs) && objs !== '{}') {
      const cDiv = document.createElement(HTML_TAG.DIV);
      cDiv.setAttribute('class', 'div-box-msg');
      const text = (draftToHtml(convertToRaw(this.state.objs)));
      cDiv.innerHTML = text;
      chats.push(
        <div key={ chats.length } className={ "div-box-right" }>
          <table>
            <tbody>
              <tr>
                <td>
                  <span>{ 'obj.date' }</span>
                  <div className="div-box-msg"
                    dangerouslySetInnerHTML={{__html: draftToHtml(convertToRaw(this.state.objs))}}>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      );
    }

    const divChatBox = (<div id={ SYSTEM.IS_DIV_CHAT_BOX } className="div-chat-box">
                          <div>{ chats }</div>
                          <div>
                            <CEditor onUpdateEditor= { this._onUpdateEditor.bind(this) } />
                          </div>
                        </div>);
    ReactDOM.render(divChatBox, div);
  }

  UNSAFE_componentWillReceiveProps(props) {
    console.log('HEADER componentWillReceiveProps');
    this.state.isUser = props.isUser;
    this.state.title = props.title;
    this.state.objs = props.objs;

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
          customBurgerIcon={ <FaRocketchat id="div-right-chat-icon" className="div-right-chat-icon" /> }
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

// export default props => {
//   // console.log(props);
//   return (
//     <div>
//       <Menu styles={ styles } className="div-menu-right" {...props} customBurgerIcon={ <FaRocketchat className="div-right-chat-icon" /> } customCrossIcon={ false } right>
//         <a className="menu-item" href="/">
//           Home
//         </a>
//       </Menu>
//     </div>
//   );
// };