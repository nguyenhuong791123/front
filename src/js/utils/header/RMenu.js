import React, { Component as C } from "react";
import ReactDOM from 'react-dom';
import { FaRocketchat } from 'react-icons/fa';
import { slide as Menu } from "react-burger-menu";
import Form from "react-jsonschema-form-bs4";

import Actions from '../Actions';
import { isEmpty } from '../Utils';
import { SYSTEM } from "../Types";

var styles = {
  bmBurgerButton: { position: 'fixed', width: '20px', height: '30px', right: '80px', top: '16px', color: 'white' },
  bmBurgerBars: { background: '#373a47' },
  bmBurgerBarsHover: { background: '#a90000' },
  // bmCrossButton: { height: '24px', width: '24px' },
  bmCross: { background: '#bdc3c7' },
  bmMenuWrap: { position: 'fixed', height: '100%' },
  // bmMenu: { background: '#373a47', padding: '2.5em 1.5em 0', fontSize: '1.15em' },
  bmMenu: { padding: '0.5em' },
  bmMorphShape: { fill: '#373a47' },
  // bmItemList: { color: '#b8b7ad', padding: '0.8em' },
  bmItemList: { color: '#b8b7ad' },
  bmItem: { display: 'inline-block' },
  // bmOverlay: { background: 'rgba(0, 0, 0, 0.3)' }
  bmOverlay: { position: 'unset !important' }
}

class RMenu extends C {
  constructor(props) {
    super(props);

    this._onClick = this._onClick.bind(this);
    this._onClickSubmit = this._onClickSubmit.bind(this);
    this._onChange = this._onChange.bind(this);

    this.state = {
      isUser: this.props.isUser
      ,title: this.props.title
      ,objs: this.props.objs
      ,isOpen: false
    }
  }

  _onClick(e) {
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

  _getTitle() {
    return( <div>{ this.state.title }</div> );
  }

  UNSAFE_componentWillReceiveProps(props) {
    console.log('HEADER componentWillReceiveProps');
    this.state.isUser = props.isUser;
    this.state.title = props.title;

    console.log(props.objs);
    if(isEmpty(props.objs) || props.objs.toString() === '{}' || isEmpty(props.objs.schema)) return;
    this.state.objs = props.objs;
    ReactDOM.render(
      <Form
        schema={ this.state.objs.schema }
        uiSchema={ this.state.objs.uiSchema } 
        // widgets={ this.state.widgets }
        // formData={ this.state.formData }
        onChange={ this._onChange.bind(this) }
        // onSubmit={ this._onClickSubmit.bind(this) }
        // validate={ this._onValidate.bind(this) }
        // onError={ this._onError.bind(this) }
        >
        <button type="submit" className="btn-submit-form-hidden" />
      </Form>
      ,document.getElementById(SYSTEM.IS_DIV_RIGHT_BOX)
    );
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
          onStateChange={ this._onClick.bind(this) }
          right>
          { this._getTitle() }
          <div id={ SYSTEM.IS_DIV_RIGHT_BOX }></div>
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