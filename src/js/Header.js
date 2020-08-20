import React, { Component as C } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Navbar, Nav, NavDropdown, Form, FormControl, Image } from 'react-bootstrap';
import { FaUser, FaSearch, FaTty, FaPhone, FaMailBulk, FaUserCog, FaSitemap, FaKey, FaLink, FaRocketchat } from 'react-icons/fa';

import { PAGE_ACTION, ACTION , LINK, NOT_LINK, PAGE, WINDOWN_WIDTH, VARIANT_TYPES, SYSTEM, DISPLAY_TYPE } from './utils/Types';
import { HTML_TAG, ATTR } from './utils/HtmlTypes';
import { THEME } from './utils/Theme';
import Html from './utils/HtmlUtils';
import Utils from './utils/Utils';
import LMenu from './utils/header/LMenu';
import RMenu from './utils/header/RMenu';
import TabMenu from './utils/header/TabMenu';
// import AlertMsg from './utils/Alert';

import '../css/Header.scss';
import '../css/Dailer.scss';
import Msg from '../msg/Msg';
// import socket from './Socket';

class Header extends C {
  constructor(props) {
    super(props);

    this._onClick = this._onClick.bind(this);
    this._onSelect = this._onSelect.bind(this);
    this._onLogout = this._onLogout.bind(this);
    this._onOpenBoxPhone = this._onOpenBoxPhone.bind(this);
    this._newWindow = this._newWindow.bind(this);
    this._onChangeTheme = this._onChangeTheme.bind(this);
    this._onUpdateListHeaders = this._onUpdateListHeaders.bind(this);

    this.state = {
      company: this.props.company
      ,isUser: this.props.isUser
      ,options: this.props.options
      ,isViewChat: false
      ,headers: this.props.headers
      ,listHeaders: {}
      // ,listChats: []
      ,showError: true
      ,variantError: VARIANT_TYPES.WARNING
      ,right: ''
      ,menus: this.props.menus
      ,title: ''
      ,dailer: { register: false, isCall: false, audio: true, sound: true, show: false, top: 50, left: 0 }
      ,chats: { room: {}, data: [] }
    };
  }

  _onClick(e) {
    var obj = Html.getLinkObj(e);
    if(Utils.isEmpty(obj)) return;
    const mode = obj.getAttribute('mode');
    if(mode !== 'menu-left') this._onClickButtonToggle();
    const action = obj.getAttribute('action');
    if(!Utils.isEmpty(action)) {
      if(!Utils.isEmpty(obj.id) && (obj.id === 'a-chat-icon' || obj.id === 'a-page-setting')) {
        const body = document.getElementById('div_body');
        const cl = body.className;
        if(!Utils.isEmpty(cl)
          && cl.indexOf('div-margin-right-22') !== -1
          && this.state.right !== action) {
            this.state.right = action;
            this.state.isUser.action = action;
            // return;
        } else {
          var svg = document.getElementById('div_right_chat_icon');
          if(!Utils.isEmpty(svg)
            && !Utils.isEmpty(svg.parentElement.childNodes)
            && svg.parentElement.childNodes.length > 1) {
            svg.parentElement.childNodes[1].click();
            this.state.right = action;
            this.state.isUser.action = action;
          }  
        }

        if(obj.id === 'a-chat-icon') {
          this.state.title = 'Messenger v0.1.0';
          this.state.isViewChat = true;
        }
        if(obj.id === 'a-page-setting') {
          this.state.title = 'Page Setting';
          this.state.isViewChat = false;
          // this._onSetListHeaders();
        } else {
          this.state.listHeaders = {};
        }
        this.forceUpdate();
      } else {
        this.state.isUser.action = action;
        const url = window.location.protocol + '//' + window.location.host;
        var path = obj.href.replace(url, '').replace('#', '');
        if(action !== PAGE.SYSTEM) {
          path = ACTION.SLASH + ACTION.LIST;
        }
        if(action === PAGE.SYSTEM) {
          const body = document.getElementById('div_body');
          const cl = body.className;
          if(!Utils.isEmpty(cl) && cl.indexOf('div-margin-right-22') !== -1) {
            var svg = document.getElementById('div_right_chat_icon');
            if(!Utils.isEmpty(svg)
              && !Utils.isEmpty(svg.parentElement.childNodes)
              && svg.parentElement.childNodes.length > 1) {
              svg.parentElement.childNodes[1].click();
            }  
          }
          this.state.isUser.actions = PAGE_ACTION.SYSTEM;
          path = ACTION.SLASH + PAGE.SYSTEM;
        }
        if(path === ACTION.SLASH + ACTION.CREATE) this.state.isUser.actions = PAGE_ACTION.CREATE;
        this.state.isUser.path = path;

        // let page = null;
        // if(Utils.isNumber(action)) {
        //   const menus = this.state.menus;
        //   for(let i=0; i<menus.length; i++) {
        //     const items = menus[i]['items'];
        //     if(!Utils.isEmpty(items) && Array.isArray(items) && !Utils.isEmpty(items[0])) {
        //       page = items.filter(function(x){ return x.page_id === parseInt(action) })[0];
        //       if(!Utils.isEmpty(page)) break;
        //     }
        //     if(menus[i]['page_id'] === parseInt(action)) {
        //       page = menus[i];
        //       break;
        //     }
        //   }
        // }
        // if(Utils.isEmpty(page)) return;

        this.props.onUpdateUser(this.state.isUser, this.state.options, this.props.onUpdateIsUserCallBack);
      }
      //console.log('HEADER _onClick complete !!!');
    } else {
      //console.log('HEADER _onClick Not setting action !!!');
    }
  }

  _onLogout(){
    this.props.onLogout();
  }

  _onSelect(e){
    //console.log(e);
  }

  _onOpenBoxPhone(e) {
    const obj = Html.getLinkObj(e);
    if(!this.state.options.dailer && !this.state[SYSTEM.IS_ACTIVE_WINDOWN]) return;
    this._addBoostrapTheme();
    const webRtc = document.getElementById(SYSTEM.IS_DAILER_BOX);
    this.state.dailer.show = (!this.state.dailer.show);
    if(!Utils.isEmpty(obj) && !Utils.isEmpty(webRtc)) {
      webRtc.style.display = (this.state.dailer.show)?DISPLAY_TYPE.BLOCK:DISPLAY_TYPE.NONE;
    }
    this.forceUpdate();
  }

  _onClickButtonToggle() {
    var hBts = document.getElementById('basic-navbar-nav-toggle');
    if(!Utils.isEmpty(hBts) && window.innerWidth < WINDOWN_WIDTH) {
      if(hBts.tagName === 'BUTTON') hBts.click();
      var btn = hBts.parentElement.childNodes[0];
      if(!Utils.isEmpty(btn) && btn.tagName === 'BUTTON') btn.click();
    }
  }

  _newWindow(e) {
    var obj = e.target;
    if(Utils.isEmpty(obj) || Utils.isEmpty(obj.tagName)) return;
    var href = obj.getAttribute('page');
    if(Utils.isEmpty(href) && (obj.tagName === HTML_TAG.IMG || obj.tagName === HTML_TAG.SPAN)) {
      href = obj.parentElement.getAttribute('page');
    }
    if(Utils.isEmpty(href)) return;
    var w = window.open();
    w.opener = null;
    w.location = href;
  }

  _addBoostrapTheme() {
    var div = document.getElementById(SYSTEM.IS_DAILER_BOX);
    if(Utils.isEmpty(div)) {
      var close = document.getElementById('a_dailer_box');

      const btn = document.createElement(HTML_TAG.BUTTON);
      btn.setAttribute(ATTR.CLASS, 'btn btn-warning');
      btn.innerText = '✖';
      btn.onclick = function() {
        if(!Utils.isEmpty(close)) {
          close.click();
        }
      }
      div = document.createElement(HTML_TAG.DIV);
      div.setAttribute(ATTR.ID, SYSTEM.IS_DAILER_BOX);
      div.setAttribute(ATTR.CLASS, 'div-dailer-box');
      const rtc = document.createElement(HTML_TAG.OBJECT);
      rtc.setAttribute(ATTR.TYPE, 'text/html');
      rtc.setAttribute('data', 'dailer.html');
      // rtc.setAttribute(ATTR.DATA, Msg.getSystemMsg('sys', 'app_dailer_host'));
      // rtc.setAttribute(ATTR.DATA
      //   ,Msg.getSystemMsg('sys', 'app_dailer_host') +
      //   '?theme=' + Msg.getSystemMsg('sys', 'app_css_host') + THEME.getTheme(this.state.isUser.theme));
      // rtc.setAttribute(ATTR.CROSSORIRIN, 'anonymous');
      // rtc.setAttribute(ATTR.CROSSORIRIN, 'use-credentials');
      const param = document.createElement(HTML_TAG.PARAM);
      param.setAttribute('id', 'theme_id');
      param.setAttribute('name', 'theme');
      param.setAttribute('value', Msg.getSystemMsg('sys', 'app_css_host') + THEME.getTheme(this.state.isUser.theme));
      rtc.appendChild(param);
      div.appendChild(rtc);
      div.appendChild(btn);

      // Not Use When Run SubDomain
      if(!Utils.isEmpty(close)) {
        var cObj = close.getBoundingClientRect();
        div.style.left = ((cObj.x + cObj.width) - 200) + 'px';
        div.style.top = (cObj.y + cObj.height) + 'px';
      }

      document.body.prepend(div);
    }
    this._setLocalStrageTheme(div);
  }

  _setLocalStrageTheme(isExists) {
    // window.localStorage.setItem('theme', Msg.getSystemMsg('sys', 'app_css_host') + THEME.getTheme(this.state.isUser.theme));
    // const css_path = THEME.getTheme(this.state.isUser.theme);
    if(Utils.isEmpty(isExists)) return;
    const obj = isExists.childNodes[0];
    if(Utils.isEmpty(obj) || Utils.isEmpty(obj.contentWindow)) return;
    const link = obj.contentWindow.document.querySelector('#style_id');
    if(Utils.isEmpty(link)) return;
    link.href = Msg.getSystemMsg('sys', 'app_css_host') + THEME.getTheme(this.state.isUser.theme);
  }

  _onChangeTheme(e) {
    this.state.isUser.theme = e.target.value;
    const div = document.getElementById(SYSTEM.IS_DAILER_BOX);
    this._setLocalStrageTheme(div);
    this.props.onUpdateUser(this.state.isUser, this.state.options, this.props.onUpdateIsUserCallBack);
  }

  _onUpdateAction(action) {
    this.state.isUser.action = action;
    this.props.onUpdateUser(this.state.isUser, this.state.options, this.props.onUpdateIsUserCallBack);
  }

  _getTheme() {
    const o = THEME.getThemes();
    //console.log(o);
    var keys = Object.keys(o);
    var options = [];
    for(var i=0; i<keys.length; i++) {
      options.push(<option key={ i } value={ o[keys[i]] } >{ keys[i] }</option>);
    }
    return(
      <Form.Control
        className='select-theme'
        as={ HTML_TAG.SELECT }
        value={ this.state.isUser.theme }
        onChange={ this._onChangeTheme.bind(this) }>
        { options }
      </Form.Control>
    );
  }

  // _onSetListHeaders() {
  //   if(Utils.isEmpty(this.state.headers) || this.state.headers.length <= 0) return;
  //   var schema = {};
  //   var uiSchema = {};
  //   this.state.headers.map((obj) => {
  //     var label = 'label_' + obj.field;
  //     var item = { 'title': label, 'type': 'integer', 'minimum': 3, 'maximum': 100, per: '%' };
  //     var uiHelp = '%';
  //     if(!Utils.isEmpty(obj.style) && !Utils.isEmpty(obj.style.width) && obj.style.toString().indexOf('%') === -1) {
  //       const w = obj.style.width.toString().replace('%', '').replace('px', '');
  //       item = { 'title': label, 'type': 'integer', 'minimum': 10, 'maximum': 500, per: 'px', 'default': w };
  //       uiHelp = 'px';
  //     } else {
  //       item['default'] = '20';
  //     }
  //     schema[obj.field] = item;
  //     uiSchema[obj.field] = { 'ui:widget': 'range', 'ui:help': label + ' [' + uiHelp + ']', classNames: 'div-box div-box-100 div-box-not-view-label div-box-help-block-02' };
  //   });

  //   if(Utils.isEmpty(schema) || schema.toString() === '{}') return;
  //   this.state.listHeaders['schema'] = { type: 'object', title: '', properties: schema };
  //   this.state.listHeaders['uiSchema'] = uiSchema;
  //   this.state.isViewChat = false;
  // }

  _onUpdateListHeaders(headers) {
    if(Utils.isEmpty(headers)) return;
    this.state.headers = headers;
    this.forceUpdate();
  }

  UNSAFE_componentWillMount() {
    console.log(window.name);
    this.state[SYSTEM.IS_ACTIVE_WINDOWN] = (window.name === this.state.isUser['wn']
      && !Utils.isEmpty(localStorage.getItem(SYSTEM.IS_LOGIN))
      && !Utils.isEmpty(sessionStorage.getItem(SYSTEM.IS_ACTIVE_WINDOWN))
      && sessionStorage.getItem(SYSTEM.IS_ACTIVE_WINDOWN) === this.state.isUser['wn']);
    if(!this.state.options.dailer || !this.state[SYSTEM.IS_ACTIVE_WINDOWN]) return;
    //console.log(this.state.menus);
    // this._addBoostrapTheme();
    // this.state.menus =[
    //   { id: 1, view: LINK, target: 'target_00', label: 'label_00', level: 0, items: [] }
    //   ,{ id: 2, view: NOT_LINK, target: 'target_01', label: 'label_01', level: 0, items: 
    //     [
    //       { id: 3, view: LINK, target: 'target_001', level: 1, label: 'label_001' }
    //       ,{ id: 4, view: NOT_LINK, target: 'target_000', level: 1, label: 'label_000', items: 
    //         [
    //           { id: 5, view: 0, target: 'target_0000', level: 2, label: 'label_0000' }
    //         ]
    //       }
    //     ]
    //   }
    //   ,{ id: 6, view: NOT_LINK, target: 'target_06', label: 'label_06', level: 0, items: 
    //     [
    //       { id: 7, view: LINK, target: 'target_003', level: 1, label: 'label_003' }
    //       ,{ id: 8, view: NOT_LINK, target: 'target_0003', level: 1, label: 'label_0003', items: 
    //         [
    //           { id: 9, view: NOT_LINK, target: 'target_00003', level: 2, label: 'label_00003', items: 
    //             [
    //               { id: 91, view: NOT_LINK, target: 'target_000003', level: 3, label: 'label_000003', items: 
    //                 [
    //                   { id: 911, view: LINK, target: 'target_0000003', level: 4, label: 'label_0000003' }
    //                 ]
    //               }
    //             ]
    //           }
    //           ,{ id: 10, view: LINK, target: 'target_0000031', label: 'target_0000031', level: 2 }
    //         ]
    //       }
    //     ]
    //   }
    //   ,{ id: 10, view: LINK, target: 'target_10', label: 'label_10-label_10', level: 0, items: [] }
    //   ,{ id: 11, view: LINK, target: 'target_11', label: 'label_11', level: 0, items: [] }
    //   ,{ id: 12, view: LINK, target: 'target_12', label: 'label_12', level: 0, items: [] }
    //   ,{ id: 13, view: LINK, target: 'target_13', label: 'label_13', level: 0, items: [] }
    //   ,{ id: 14, view: LINK, target: 'target_14', label: 'label_14-label_14', level: 0, items: [] }
    //   ,{ id: 15, view: LINK, target: 'target_15', label: 'label_15', level: 0, items: [] }
    //   ,{ id: 16, view: LINK, target: 'target_16', label: 'label_16', level: 0, items: [] }
    //   ,{ id: 17, view: LINK, target: 'target_17', label: 'label_17', level: 0, items: [] }
    //   ,{ id: 18, view: LINK, target: 'target_18', label: 'label_18-label_18', level: 0, items: [] }
    //   ,{ id: 19, view: LINK, target: 'target_19', label: 'label_19', level: 0, items: [] }
    //   ,{ id: 20, view: LINK, target: 'target_20', label: 'label_20', level: 0, items: [] }
    //   ,{ id: 21, view: LINK, target: 'target_21', label: 'label_21', level: 0, items: [] }
    //   ,{ id: 22, view: LINK, target: 'target_22', label: 'label_22', level: 0, items: [] }
    //   ,{ id: 23, view: LINK, target: 'target_23', label: 'label_23', level: 0, items: [] }
    //   ,{ id: 24, view: LINK, target: 'target_24', label: 'label_24', level: 0, items: [] }
    //   ,{ id: 25, view: LINK, target: 'target_25', label: 'label_25', level: 0, items: [] }
    // ]
  }

  _onResizeWindown() {
    window.onresize = function(event) {
      var divBody = document.getElementById(SYSTEM.IS_DIV_CUSTOMIZE_BOX);
      if(!Utils.isEmpty(divBody))
        divBody.style.height = (window.innerHeight - 90) + 'px';

      const divListBox = this.document.getElementById(SYSTEM.IS_DIV_LIST_BOX);
      // console.log(divListBox);
      if(!Utils.isEmpty(divListBox)) {
          divBody = divListBox.childNodes[1].lastChild;
          this.console.log();
          if(!Utils.isEmpty(divBody))
            divBody.style.height = (window.innerHeight - 130) + 'px';
      }
    };
    window.onresize();
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    //console.log('HEADER componentWillReceiveProps');
    this.state.isUser = nextProps.isUser;
    //console.log('render')
    //console.log(this.state.isUser)
    this.state.options = nextProps.options;
    this.state.company = nextProps.company;
    this.state.headers = nextProps.headers;
    this.state.menus = nextProps.menus;
    console.log(window.name);
    this.state[SYSTEM.IS_ACTIVE_WINDOWN] = (window.name === this.state.isUser['wn']
      && !Utils.isEmpty(localStorage.getItem(SYSTEM.IS_LOGIN))
      && !Utils.isEmpty(sessionStorage.getItem(SYSTEM.IS_ACTIVE_WINDOWN))
      && sessionStorage.getItem(SYSTEM.IS_ACTIVE_WINDOWN) === this.state.isUser['wn']);
// this._setLocalStrageTheme();
    this._onResizeWindown();
    // this._addBoostrapTheme();
  }

  // componentDidMount() {
    // this._onResizeWindown();
    // this._addBoostrapTheme();
  // }

  render() {
    //console.log('render')
    //console.log(this.state.isUser)
    if(!this.state.isUser.viewHeader) return '';
    var menuType = (this.state.isUser.menu===1)?'tab_menu_1':'tab_menu_0';
    var menuClass = (this.state.isUser.menu===0)?' mr-auto-parent':''
    const isCallClass = (this.state.dailer.isCall && this.state.dailer.register)?'blinking':'';
    const theme = (this.state.isUser.uLid === 'admin')?(this._getTheme()):'';
    const iconStyle = (this.state.isUser.menu === 1)?{ marginLeft: '2.5em' }:null;

    return (
      <div className='div-header'>
        {/* <AlertMsg show={ this.state.showError } variant={ this.state.variantError } errors={ [ 'エラーメッセージ00', 'エラーメッセージ01' ] }/> */}
        {/* {(() => {
            if(this.state[SYSTEM.IS_ACTIVE_WINDOWN]) {
              return ( */}
                <div id='div-header-is-menu'>
                  {/* 縦左メニュー */}
                  {(() => {
                    if(this.state.isUser.menu === 1) {
                      return ( <LMenu
                                isUser={ this.state.isUser }
                                menus={ this.state.menus }
                                onClick={ this._onClick.bind(this) }/> );
                    }
                  })()}
                  {/* 「チャット、頁設定」を使用するときボックス */}
                  <RMenu
                    isUser={ this.state.isUser }
                    isViewChat={ this.state.isViewChat }
                    title={ this.state.title }
                    objs={ this.state.headers }
                    // chats= { this.state.listChats }
                    onUpdateListHeaders={ this._onUpdateListHeaders.bind(this) }
                    />
                </div>      
              {/* );
            }
        })()} */}

        <Navbar expand='lg'>
          {/* アイコン、会社名（ホームページリンク） */}
          <a
            href='#home-page'
            style={ iconStyle }
            page={ this.state.company.home_page }
            onClick={ this._newWindow.bind(this) }
            className={ 'header-image-icon' }>
            {(() => {
              if(!Utils.isEmpty(this.state.company.logo)) {
                return(<Image src={ this.state.company.logo } rounded />);
              }
            })()}
            <span>SmartCRM Ver0.1.0</span>
          </a>

          <div id='div-header-is-navbar'>
            <Navbar.Toggle aria-controls='basic-navbar-nav' id='basic-navbar-nav-toggle'/>
            {/* TOP横メニュー */}
            <Navbar.Collapse id={ menuType } className={ menuClass }>
              {(() => {
                if (this.state.isUser.menu === 0) {
                  return (
                    <Nav className='mr-auto' id={ SYSTEM.IS_TAB_MENU }>
                      <TabMenu isUser={ this.state.isUser } objs={ this.state.menus } onClick={ this._onClick.bind(this) }/>
                    </Nav>
                  );
                }
                if (this.state.isUser.menu !== 0) {
                  return (<div id={ SYSTEM.IS_TAB_MENU }></div>);
                }
              })()}

              <div id={ SYSTEM.IS_DIV_HEADER_FORM } className='div-header-form'>
                {/* ADMIN場合Themeリストを表示 */}
                { theme }
                {/* グローバル検索 */}
                <FormControl type='text' id='input_global_search' placeholder='Search'/>
                <Nav.Link href='#search' className='global-search'><FaSearch /></Nav.Link>
                {/* 電話オプション */}
                {(() => {
                  if(this.state.options.dailer && this.state[SYSTEM.IS_ACTIVE_WINDOWN]) {
                    return(
                      <Nav.Link id='a_dailer_box' onClick={ this._onOpenBoxPhone.bind(this) } className={ isCallClass }>
                        {(() => {
                          if(!this.state.dailer.show) { return ( <FaTty /> ); }
                        })()}
                        {(() => {
                          if(this.state.dailer.show) { return ( <FaPhone /> ); }
                        })()}
                      </Nav.Link>
                    );
                  }
                })()}
                {/* メールオプション */}
                {(() => {
                  if(this.state.options.mail && this.state[SYSTEM.IS_ACTIVE_WINDOWN]) {
                    return(<Nav.Link action={ PAGE.MAIL } onClick={ this._onClick.bind(this) }>{ <FaMailBulk /> }</Nav.Link>);
                  }
                })()}
                {/* チャットオプション */}
                {(() => {
                  if(this.state.options.chat && this.state[SYSTEM.IS_ACTIVE_WINDOWN]) {
                    return(<Nav.Link action={ PAGE.CHAT } onClick={ this._onClick.bind(this) } id='a-chat-icon'>{ <FaRocketchat /> }</Nav.Link>);
                  }
                })()}
                {/* ユーザーDropDown */}
                <NavDropdown title={<FaUser />} id='basic-nav-dropdown-right' alignRight>
                  {/* ユーザー情報 */}
                  <NavDropdown.Item action={ PAGE.USER } onClick={ this._onClick.bind(this) }>
                    { <FaUserCog /> }
                    <span>{ Msg.getMsg(null, this.state.isUser.language, 'bt_profile') }</span>
                  </NavDropdown.Item>
                  {/* 現頁設定 */}
                  {(() => {
                    if(this.state.isUser.path === ACTION.SLASH + ACTION.LIST) {
                      return(
                        <NavDropdown.Item action={ PAGE.SETTING } onClick={ this._onClick.bind(this) } id='a-page-setting'>
                          { <FaSitemap /> }
                          <span>{ Msg.getMsg(null, this.state.isUser.language, 'page_setting') }</span>
                        </NavDropdown.Item>
                      );
                    }
                  })()}
                  {/* システム設定（管理者のみ表示） */}
                  <NavDropdown.Item action={ PAGE.SYSTEM } onClick={ this._onClick.bind(this) }>
                    { <FaLink /> }
                    <span>{ Msg.getMsg(null, this.state.isUser.language, 'system_setting') }</span>
                  </NavDropdown.Item>
                  <NavDropdown.Divider />
                  {/* ログアウト */}
                  <Link to={ ACTION.SLASH } className='dropdown-item' onClick={ this._onLogout.bind(this) }>
                    { <FaKey /> }
                    <span>{ Msg.getMsg(null, this.state.isUser.language, 'bt_logout') }</span>
                  </Link>
                </NavDropdown>
              </div>
            </Navbar.Collapse>
          </div>
        </Navbar>
      </div>
    );
  };
}

export default connect()(Header);