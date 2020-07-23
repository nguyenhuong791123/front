import React, { Component as C } from 'react';
import { withRouter } from "react-router-dom";
import { connect } from 'react-redux';
import { Alert, Form, Button } from 'react-bootstrap';
import { FaSignInAlt, FaUnlockAlt } from 'react-icons/fa';
import StringUtil from 'util';

import { ACTION, MSG_TYPE } from './utils/Types';
import { isEmpty, inJson } from './utils/Utils';
import Fetch from './utils/Fetch';

import Msg from '../msg/Msg';
import "../css/Index.css";
import '../css/Login.css';

class Login extends C {
  constructor(props){
    super(props);

    this._onLogin = this._onLogin.bind(this);
    this._onChange = this._onChange.bind(this);
    this._onChangeSelect = this._onChangeSelect.bind(this);

    //console.log('LOGIN constructor !!!');
    //console.log(this.props.isUser);
    this.state = {
      company: this.props.company
      ,isUser: this.props.isUser
      ,options: this.props.options
      ,validated: true
      ,uLid: ''
      ,pw: ''
    }
  }

  _onLogin(e){
    const f = e.target;
    e.preventDefault();
    if (f.checkValidity() === false) {
        //console.log(f.checkValidity());
    } else {
      //console.log(this.state.uLid);
      //console.log(this.state.pw);
      if(this.state.uLid.length > 8 || this.state.pw.length > 8) {
        return;
      } else {
        const options = { username: this.state.uLid, password: this.state.pw};
        const f = Fetch.postLogin('http://vmdev:8085/login', options);
        f.then(data => {
          if(!isEmpty(data)) {
              //console.log(data.user);
              //console.log(data.page);
              if(inJson(data, 'user')) {
              this.state.isUser['uLid'] = this.state.uLid;
              this.state.isUser['path'] = ACTION.SLASH + ACTION.LIST;
              this.state.isUser['viewHeader'] = true;
              this.state.isUser['theme'] = data.user.user_theme;
              this.state.isUser['menu'] = data.user.user_view_menu;
              this.state.options['dailer'] = (data.user.user_cti_flag === 1)?true:false;
              this.state.options['customize'] = (data.user.user_manager === 1)?true:false;
              //console.log(this.state.isUser);
              //console.log(this.state.options);
              //console.log(data.page);
              this.props.onLogin(this.state.isUser, this.state.options, data.page);
              this.props.history.push(ACTION.SLASH + ACTION.LIST);
            }
            if(inJson(data, 'error')) {
              const key = Object.keys(data)[0];
              const div = document.getElementById(key);
              div.innerHTML = data[key];
              div.style.display = 'block';
            }
          }
        }).catch(err => {
          //console.log(err);
          return;
        });
      }
    }
  }

  _onChange(e){
    const value = e.target.value;
    const dError = e.target.parentElement.childNodes[1];
    if(!isEmpty(dError)) {
      if(value.length <= 0) {
        dError.style.display = 'block';
        var msg = Msg.getMsg(MSG_TYPE.LOGIN, this.state.isUser.language, 'login_id');
        if(e.target.name === 'pw') msg = Msg.getMsg(MSG_TYPE.LOGIN, this.state.isUser.language, 'password');
        dError.innerText = msg + Msg.getMsg(MSG_TYPE.ERROR, this.state.isUser.language, 'required');
      } else if(e.target.name === 'pw' && value.length > 8) {
        dError.style.display = 'block';
        var msg = Msg.getMsg(MSG_TYPE.LOGIN, this.state.isUser.language, 'password');
        var max = 8;
        msg = StringUtil.format(Msg.getMsg(MSG_TYPE.ERROR, this.state.isUser.language, 'max_length'), msg, max, value.length - max);
        dError.innerText = msg;
      } else if(e.target.name === 'uLid' && value.length > 50) {
        dError.style.display = 'block';
        var msg = Msg.getMsg(MSG_TYPE.LOGIN, this.state.isUser.language, 'login_id');
        var max = 50;
        msg = StringUtil.format(Msg.getMsg(MSG_TYPE.ERROR, this.state.isUser.language, 'max_length'), msg, max, value.length - max);
        dError.innerText = msg;
      } else {
        dError.style.display = 'none';
      }
    }

    this.setState({ [e.target.name]: value });
  }

  _onChangeSelect(e) {
    this.state.isUser.language = e.target.value;
    const auth = { info: this.state.isUser, options: this.state.options };
    this.props.onUpdateStateIsUser(auth);
    // this.forceUpdate();
  }

  componentDidMount() {
    //console.log('LOGIN componentDidMount !!!');
    var div = document.getElementById('div_alert_login');
    if(!isEmpty(div)) {
      window.onresize = function(event) {
        div.style.left = ((window.innerWidth/2) - (div.offsetWidth/2)) + 'px';
        div.style.marginTop = ((window.innerHeight - div.offsetHeight)/3) + 'px';
      };
      window.onresize();  
    }
    this._reLoadBody();
  }

  _reLoadBody() {
    var body = document.getElementById('div_body');
    if(!isEmpty(body) && !isEmpty(body.className)) {
      body.className = body.className.replace("div-margin-right-22", "");
    }
  }

  render() {
    //console.log('Login Render!!!');
    //console.log(this.state);

    return (
      <div>
        <div className="alert alert-success" style={{ fontSize: '180%' }}>
          {(() => {
            if(!isEmpty(this.state.company.logo)) {
              return(<img src={ this.state.company.logo } style={{ width: '1.5em', height: '1.5em', marginRight: '.5em' }}/>);
            }
          })()}
          { this.state.company.name }
        </div>
        <Alert id="div_alert_login" variant="warning" className="div-center">
          <Form.Control.Feedback type="invalid" id={ 'error' }>
          </Form.Control.Feedback>

          {/* <Alert.Heading>{ <FaUnlockAlt /> }System Authorization{ <FaUnlockAlt /> }</Alert.Heading> */}
          <Alert.Heading>
            { Msg.getMsg(MSG_TYPE.LOGIN, this.state.isUser.language, 'system_auth') }
          </Alert.Heading>
          <hr />
          <Form noValidate validated={ this.state.validated } onSubmit={ this._onLogin.bind(this) }>
            <Form.Group>
              <Form.Control
                type="text"
                name="uLid"
                onChange={ this._onChange.bind(this) }
                placeholder={ Msg.getMsg(MSG_TYPE.LOGIN, this.state.isUser.language, 'login_id') }
                required />
              <Form.Control.Feedback type="invalid" id={ 'username' }>
                { Msg.getMsg(MSG_TYPE.LOGIN, this.state.isUser.language, 'login_id') }{ Msg.getMsg(MSG_TYPE.ERROR, this.state.isUser.language, 'required') }
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group>
              <Form.Control
                type="password"
                name="pw"
                onChange={ this._onChange.bind(this) }
                placeholder={ Msg.getMsg(MSG_TYPE.LOGIN, this.state.isUser.language, 'password') }
                required />
              <Form.Control.Feedback type="invalid" id={ 'password' }>
                { Msg.getMsg(MSG_TYPE.LOGIN, this.state.isUser.language, 'password') }{ Msg.getMsg(MSG_TYPE.ERROR, this.state.isUser.language, 'required') }
              </Form.Control.Feedback>
            </Form.Group>
            {(() => {
              if(this.state.company.global_locale === 0) {
                return(
                  <Form.Group>
                    <Form.Control as="select" onChange={ this._onChangeSelect.bind(this) } value={ this.state.isUser.language }>
                      <option value="ja">{ Msg.getMsg(null, this.state.isUser.language, 'ja') }</option>
                      <option value="en">{ Msg.getMsg(null, this.state.isUser.language, 'en') }</option>
                      <option value="vn">{ Msg.getMsg(null, this.state.isUser.language, 'vn') }</option>
                    </Form.Control>
                  </Form.Group>    
                );
              }
            })()}
            <Form.Group>
              <Button type="submit">{ Msg.getMsg(null, this.state.isUser.language, 'bt_login') }{ <FaSignInAlt /> }</Button>              
            </Form.Group>
          </Form>
        </Alert>
      </div>
    )
  };
};

export default connect()(withRouter(Login));