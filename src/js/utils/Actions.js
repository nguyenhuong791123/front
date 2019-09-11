import React, { Component as C } from 'react';
import { Button } from 'react-bootstrap';
import { FaReply, FaCheck } from 'react-icons/fa';

import { SYSTEM } from './Types';
import { isEmpty } from './Utils';
import GetMsg from '../../msg/Msg';

export default class AlertAction extends C {
  constructor(props) {
    super(props);

    this._onClickReturn = this._onClickReturn.bind(this);
    this._onClickSubmit = this._onClickSubmit.bind(this);

    this.state = { isUser: this.props.isUser }
  }

  _onClickReturn() {
    this.props.onClickReturn();
  }

  _onClickSubmit() {
    this.props.onClickSubmit();
  }

  _setLayoutActions(){
    this.state[SYSTEM.IS_ACTIVE_WINDOWN] = (!isEmpty(window.name) && window.name===SYSTEM.IS_ACTIVE_WINDOWN);
    var body = document.getElementById('div_body');
    // console.log(body);
    var bts = document.getElementById('div_button_action');
    // console.log(bts);
    if(!isEmpty(bts) && !isEmpty(body.className)) {
      var btClass = bts.className;
      if(body.className.indexOf("div-margin-right-22") !== -1) {
        bts.className = btClass + " " + body.className;
      } else {
        bts.className = btClass.replace(" div-margin-right-22", "");
      }
    }
  }

  componentDidMount() {
    this._setLayoutActions();
  }

  componentWillReceiveProps(props) {
    // console.log('ACTION componentWillReceiveProps');
    this.state.isUser = props.isUser;
    // console.log(this.state.isUser);
  }

  render() {
    const className = (!isEmpty(window.name) && window.name===SYSTEM.IS_ACTIVE_WINDOWN)?'div-actions-box':'div-not-windown-actions-box';
    return (
        <div id="div_button_action" className={ className }>
            <Button onClick={ this._onClickReturn.bind(this) } variant="info">
              <FaReply />
              { GetMsg(null, this.state.isUser.language, 'bt_return') }
            </Button>
            <br />
            <Button type="submit" onClick={ this._onClickSubmit.bind(this) } variant="warning">
              <FaCheck />
              { GetMsg(null, this.state.isUser.language, 'bt_insert') }
            </Button>
        </div>
    )
  };
};