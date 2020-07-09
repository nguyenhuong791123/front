import React, { Component as C } from 'react';
import { Button } from 'react-bootstrap';
import { FaReply, FaCheck, FaPlus } from 'react-icons/fa';

import { SYSTEM, VARIANT_TYPES } from './Types';
import { isEmpty } from './Utils';
import Msg from '../../msg/Msg';

export default class AlertAction extends C {
  constructor(props) {
    super(props);

    this._onClickBack = this._onClickBack.bind(this);
    this._onClickAdd = this._onClickAdd.bind(this);
    this._onClickSubmit = this._onClickSubmit.bind(this);

    this.state = { isUser: this.props.isUser }
  }

  _onClickBack() {
    this.props.onClickBack();
  }

  _onClickAdd() {
    this.props.onClickAdd();
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

  UNSAFE_componentWillReceiveProps(props) {
    this.state.isUser = props.isUser;
  }

  render() {
    const className = (!isEmpty(window.name) && window.name===SYSTEM.IS_ACTIVE_WINDOWN)?'div-actions-box':'div-not-windown-actions-box';
    // this.state.isUser.actions = { back: false, create: true, save: true };
    // console.log(this.state);
    return (
        <div id="div_button_action" className={ className }>
          {(() => {
            if(isEmpty(this.state.isUser.actions)
              || isEmpty(this.state.isUser.actions.back)
              || (!isEmpty(this.state.isUser.actions.back) &&  this.state.isUser.actions.back)) {
              return (
                <div>
                  <Button onClick={ this._onClickBack.bind(this) } variant={ VARIANT_TYPES.INFO }>
                    {/* <FaReply /> */}
                    { Msg.getMsg(null, this.state.isUser.language, 'bt_return') }
                  </Button>
                  <br />
                </div>  
              );
            }
          })()}
          {(() => {
            if(isEmpty(this.state.isUser.actions)
              || isEmpty(this.state.isUser.actions.create)
              || (!isEmpty(this.state.isUser.actions.create) && this.state.isUser.actions.create)) {
              return (
                <Button onClick={ this._onClickAdd.bind(this) } variant={ VARIANT_TYPES.INFO }>
                  {/* <FaPlus /> */}
                  { Msg.getMsg(null, this.state.isUser.language, 'bt_create') }
                </Button>
              );
            }
          })()}
          {(() => {
            if(isEmpty(this.state.isUser.actions)
              || isEmpty(this.state.isUser.actions.save)
              || (!isEmpty(this.state.isUser.actions.save) && this.state.isUser.actions.save)) {
              return (
                <Button type="submit" onClick={ this._onClickSubmit.bind(this) } variant={ VARIANT_TYPES.WARNING }>
                  {/* <FaCheck /> */}
                  { Msg.getMsg(null, this.state.isUser.language, 'bt_insert') }
                </Button>
              );
            }
          })()}
        </div>
    )
  };
};