import React, { Component as C } from 'react';
import { Router, Route, Switch } from 'react-router-dom';
import LoadingOverlay from 'react-loading-overlay';
import { createBrowserHistory } from 'history';
import { Provider } from 'react-redux';
import { createStore, combineReducers, compose, applyMiddleware } from 'redux';
import { sessionService, sessionReducer } from 'redux-react-session';
import thunkMiddleware from 'redux-thunk';

import { PAGE, PAGE_ACTION, ACTION, SYSTEM } from './js/utils/Types';
import { HTML_TAG } from './js/utils/HtmlTypes';
import { THEME } from './js/utils/Theme';
import { getCookie } from './js/utils/Cookies';
import Fetch from './js/utils/Fetch';
import Utils from './js/utils/Utils';
import Msg from './msg/Msg';

/* global chrome */
import P404 from './js/error/P404';
import Error from './js/error/Error';
import Header from './js/Header';
import Footer from './js/Footer';
import Login from './js/Login';
import List from './js/pages/List';
import Create from './js/pages/Create';
import View from './js/pages/View';
import System from './js/pages/System';
import Customize from './js/pages/Customize';

import AuthSession from './js/auth/AuthSession';
let reducer = combineReducers({ session: sessionReducer });
let store = createStore(reducer, compose(applyMiddleware(thunkMiddleware)));
// const validateSession = (session) => { return true; }
// sessionService.initSessionService(store, { driver: 'COOKIES', validateSession });
sessionService.initSessionService(store, { driver: 'COOKIES' });
const history = createBrowserHistory();

class App extends C {
    constructor(props) {
        super(props);

        // this._setIsUserInit = this._setIsUserInit.bind(this);
        this._setViewHeader = this._setViewHeader.bind(this);
        this._doLogin = this._doLogin.bind(this);
        this._doLogout = this._doLogout.bind(this);
        this._loadAuthCookies = this._loadAuthCookies.bind(this);
        this._onUpdateIsUserCallBack = this._onUpdateIsUserCallBack.bind(this);
        this._onUpdatePromise = this._onUpdatePromise.bind(this);
        // this._updateStateIsUser = this._updateStateIsUser.bind(this);
        this._updateListHeaders = this._updateListHeaders.bind(this);

        this.state = {
            loading: true
            ,company: { }
            ,isUser: AuthSession.isUserInit(null).info
            ,options: AuthSession.isUserInit(null).options
            ,error: null
            ,errorInfo: null
            ,hasError: false
            ,menus: []
        }
    }

    // _setIsUserInit() {
    //     return AuthSession.isUserInit(null).info;
    // }

    _setViewHeader(isUser) {
        this.state.isUser = isUser;
        this._onUpdatePromise(this.state.isUser, this.state.options, this._onUpdateIsUserCallBack.bind(this));
        // this.forceUpdate();
    }

    _doLogin(isUser, options) {
        const auth = { info: isUser, options: options };
        auth.info['wn'] = Utils.getUUID();
        AuthSession.doLogin(auth).then(response => {
            const { token } = response;
            sessionService.saveSession({ token }).then(() => {
                sessionService.saveUser(auth).then(() => {
                    if(Utils.isEmpty(localStorage.getItem(SYSTEM.IS_LOGIN))) {
                        window.name = auth.info['wn'];
                        sessionStorage.setItem(SYSTEM.IS_ACTIVE_WINDOWN, auth.info['wn']);
                        localStorage.setItem(SYSTEM.IS_LOGIN, auth.info.uId);
                    }
                    this._onUpdateIsUserCallBack(auth);
                });
            });
        });
    };

    _doLogout() {
        const auth = { info:  AuthSession.isUserInit(null).info, options: AuthSession.isUserInit(null).options };
        auth.info.language = this.state.isUser.language;
        auth.info.theme = this.state.isUser.theme;
        this.state.isUser = auth.info;
        this.state.options = auth.options;
        const div = document.getElementById(SYSTEM.IS_DAILER_BOX);
        if(!Utils.isEmpty(div)) div.remove();
        this.state.hasError = false;
        this.forceUpdate();
        AuthSession.doLogout().then(() => {
            sessionService.deleteSession();
            sessionService.deleteUser();
            sessionStorage.removeItem(SYSTEM.IS_ACTIVE_WINDOWN);
            localStorage.removeItem(SYSTEM.IS_LOGIN);
        }).catch(err => { throw (err); });
    };

    _loadAuthCookies(auth, callBack) {
        const objAuth = sessionService.loadUser('COOKIES');
        this.state.hasError = false;
        if(objAuth !== undefined) {
            // console.log('_loadAuthCookies');
            objAuth.then(function(data) {
                // console.log(data);
                const isUrl = history.location.pathname;
                if(isUrl.indexOf(ACTION.ERROR) !== -1) this._doLogout();
                data.info['path'] = isUrl;
                data.info['viewHeader'] = (Utils.isEmpty(data.info['path']) || data.info['path'] === ACTION.SLASH)?false:true;

                if(Utils.inJson(auth, 'info')) {
                    data.info['cId'] = auth.info['cId'];
                    data.info['theme'] = auth.info['theme'];
                    data.info['action'] = auth.info['action'];
                    data.options['dailer'] = auth.options['dailer'];    
                }
                if(Utils.isEmpty(data.info['cId']) || Utils.isEmpty(data.info['uId'])) {
                    data.info['path'] = ACTION.SLASH;
                    data.info['viewHeader'] = false;
                }
                if(Utils.isEmpty(localStorage.getItem(SYSTEM.IS_LOGIN))) {
                    data.info['wn'] = Utils.getUUID();
                    window.name = data.info['wn'];
                    sessionStorage.setItem(SYSTEM.IS_ACTIVE_WINDOWN, data.info['wn']);
                    localStorage.setItem(SYSTEM.IS_LOGIN, data.info.uId);
                }
                callBack(data);
            }).catch(function(error) {    
                console.log(error);    
                //console.log(AuthSession.isUserInit(isUser));
                const isUrl = history.location.pathname;
                auth.info['path'] = isUrl;
                auth.info['viewHeader'] = (Utils.isEmpty(auth.info['path']) || auth.info['path'] === ACTION.SLASH)?false:true;
                if(Utils.isEmpty(auth.info['cId']) || Utils.isEmpty(auth.info['uId'])) {
                    auth.info['path'] = ACTION.SLASH;
                    auth.info['viewHeader'] = false;
                }

                console.log(auth);
                callBack(AuthSession.isUserInit(auth));
            });
        } else {
            callBack({ info: AuthSession.isUserInit(null).info, options: AuthSession.isUserInit(null).options });
        }
    }

    // _onUpdateIsUserCallBack(auth) {
    //     this._updateStateIsUser(auth);
    //     // this.forceUpdate();
    // }

    _onUpdatePromise(inIsUser, inOptions, callBack) {
        const auth = { info: inIsUser, options: inOptions };
        // //console.log(auth);
        const isUser = sessionService.loadUser('COOKIES');
        // console.log('COOKIES');
        // console.log(isUser);
        // console.log(history.location.pathname);
        isUser.then(function(data) {
            if(!Utils.isEmpty(inIsUser)) {
                var ukeys = Object.keys(inIsUser);
                if(!Utils.isEmpty(ukeys) && ukeys.length > 0) {
                    for(var i=0; i<ukeys.length; i++) {
                        data.info[ukeys[i]] = inIsUser[ukeys[i]];
                    }
                    auth.info = data.info;
                }
            }
            if(!Utils.isEmpty(inOptions)) {
                var okeys = Object.keys(inOptions);
                if(!Utils.isEmpty(okeys) && okeys.length > 0) {
                    for(var o=0; o<okeys.length; o++) {
                        data.options[okeys[o]] = inOptions[okeys[o]];
                    }
                    auth.options = data.options;
                }
            }
            callBack(auth);
        }).catch(function(error) {
            //console.log('ERROR _onUpdatePromise');
            console.log(error);
            callBack({ info: AuthSession.isUserInit(null).info, options: AuthSession.isUserInit(null).options });
        });
    }

    _onUpdateIsUserCallBack(auth) {
        console.log('_updateStateIsUser');
        console.log(this.state);
        console.log(auth);
        this.state.isUser = auth.info;
        this.state.options = auth.options;
        // if(!sessionService.checkAuth) {
        //     auth.info.path = ACTION.SLASH;
        // }
        if(auth.info.action === PAGE.SYSTEM) {
            history.push(ACTION.SLASH + auth.info.action);
        } else {
            // this.state.isUser.actions = undefined;
            history.push(auth.info.path);
        }

        const obj = document.getElementById(SYSTEM.IS_CSS_LINK_ID);
        if(!Utils.isEmpty(this.state.isUser.theme)
            && !Utils.isEmpty(obj.href)
            && obj.href.indexOf('/' + this.state.isUser.theme + '/') === -1) {
            this._addCssLink();
        }

        if(!Utils.isEmpty(this.state.isUser.cId) && !Utils.isEmpty(this.state.isUser.uId)) {
            this._onGetMenus();
        } else {
            //console.log(history);
            this.forceUpdate();
        }
    }

    _onGetMenus() {
        if(Utils.isEmpty(this.state.isUser.cId) || Utils.isEmpty(this.state.isUser.uId)) return;
        const options = { cId: this.state.isUser.cId, uId: this.state.isUser.uId };
        const host = Msg.getSystemMsg('sys', 'app_api_host');
        const f = Fetch.postLogin(host + 'menus', options);
        f.then(data => {
            if(!Utils.isEmpty(data) && Utils.inJson(data, 'menus')) {
                this.state.menus = data.menus;
                this.forceUpdate();
            }
        }).catch(err => {
          console.log(err);
        });
    }

    _stopLoading() {
        this.state.loading = false;
    }

    _updateListHeaders(headers) {
        this.state['headers'] = headers;
        //console.log(this.state['headers']);
    }

    _addCssLink() {
        const obj = document.getElementById(SYSTEM.IS_CSS_LINK_ID);
        const css_path = Msg.getSystemMsg('sys', 'app_css_host') + THEME.getTheme(this.state.isUser.theme);
        if(!Utils.isEmpty(obj)) {
            obj.href = css_path;
        } else {
            const css = document.createElement(HTML_TAG.LINK);
            css.id = SYSTEM.IS_CSS_LINK_ID;
            css.setAttribute('rel', 'stylesheet');
            css.setAttribute('href', css_path);
            const head = document.getElementsByTagName(HTML_TAG.HEAD)[0];
            head.appendChild(css);    
        }
    }

    UNSAFE_componentWillMount() {
        const options = { uuid: getCookie('uuid')};
        const host = Msg.getSystemMsg('sys', 'app_api_host');
        const f = Fetch.postLogin(host + 'mode', options);
        f.then(data => {
          if(!Utils.isEmpty(data) && Utils.inJson(data, 'company_id')) {
            this.state.isUser['cId'] = data.company_id;
            this.state.isUser['theme'] = data.company_theme;
            this.state.options['dailer'] = (data.company_cti_flag === 1)?true:false;
            this.state.company = {
              logo: data.company_logo
              ,name: data.company_name
              ,copy_right: data.company_copy_right
              ,home_page: data.company_home_page
              ,global_locale: data.company_global_locale
            }
            const auth = { info: this.state.isUser, options: this.state.options };
            console.log(auth);
            this._loadAuthCookies(auth, this._onUpdateIsUserCallBack.bind(this));
          }
        });
    }

    componentDidMount() {
        this._stopLoading();
        window.addEventListener("beforeunload", (ev) => {
            ev.preventDefault();
            sessionStorage.removeItem(SYSTEM.IS_ACTIVE_WINDOWN);
            localStorage.removeItem(SYSTEM.IS_LOGIN);
        });
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        this.state.error = error;
        this.state.errorInfo = errorInfo;
        this.forceUpdate();
    }    

    render() {
        //console.log('APP Render !!!');
        //console.log(chrome.app);
        return (
            <div>
                <LoadingOverlay active={ this.state.loading } spinner text='Loading your content...' />

                <Provider store={ store }>
                {(() => {
                    if(this.state.hasError) {
                        const error = this.state.error;
                        const errorInfo = this.state.errorInfo;
                        return(
                            <Router history={ history }>
                                <Route
                                    exact
                                    render={ ({ props }) => <Error
                                                                error={ error }
                                                                errorInfo={ errorInfo }
                                                                onLogout={ this._doLogout.bind(this) }
                                                                {...this.props} /> } />
                            </Router>
                        );
                    } else {
                        return(
                            <Router history={ history }>
                                <div id='div_header'>
                                    <Header
                                        company={ this.state.company }
                                        isUser={ this.state.isUser }
                                        options={ this.state.options }
                                        menus={ this.state.menus }
                                        headers={ this.state['headers'] }
                                        onUpdateUser={ this._onUpdatePromise.bind(this) }
                                        onUpdateIsUserCallBack={ this._onUpdateIsUserCallBack.bind(this) }
                                        onLogout={ this._doLogout.bind(this) }
                                        {...this.props} />
                                </div>
                                <div id='div_body'>
                                    <Switch>
                                        <Route
                                            exact path={ ACTION.SLASH }
                                            render={ ({ props }) => <Login
                                                                        company={ this.state.company }
                                                                        isUser={ this.state.isUser }
                                                                        options={ this.state.options }
                                                                        onUpdateIsUserCallBack={ this._onUpdateIsUserCallBack.bind(this) }
                                                                        onLogin={ this._doLogin.bind(this) }
                                                                        {...this.props} />} />
                                        <Route
                                            onEnter={ sessionService.checkAuth }
                                            path={ ACTION.SLASH + ACTION.LIST }
                                            render={ ({ props }) => <List
                                                                        company={ this.state.company }
                                                                        isUser={ this.state.isUser }
                                                                        options={ this.state.options }
                                                                        onUpdateIsUserCallBack={ this._onUpdateIsUserCallBack.bind(this) }
                                                                        onUpdateListHeaders={ this._updateListHeaders.bind(this) }
                                                                        {...this.props} />} />
                                        <Route
                                            onEnter={ sessionService.checkAuth }
                                            path={ ACTION.SLASH + ACTION.CREATE }
                                            render={ ({ props }) => <Create
                                                                        company={ this.state.company }
                                                                        isUser={ this.state.isUser }
                                                                        options={ this.state.options }
                                                                        onUpdateUser={ this._onUpdatePromise.bind(this) }
                                                                        onUpdateIsUserCallBack={ this._onUpdateIsUserCallBack.bind(this) }
                                                                        {...this.props} />} />
                                        <Route
                                            onEnter={ sessionService.checkAuth }
                                            path={ ACTION.SLASH + ACTION.EDIT }
                                            render={ ({ props }) => <Create
                                                                        company={ this.state.company }
                                                                        isUser={ this.state.isUser }
                                                                        options={ this.state.options }
                                                                        onUpdateUser={ this._onUpdatePromise.bind(this) }
                                                                        onUpdateIsUserCallBack={ this._onUpdateIsUserCallBack.bind(this) }
                                                                        {...this.props} />} />
                                        <Route
                                            onEnter={ sessionService.checkAuth }
                                            path={ ACTION.SLASH + ACTION.VIEW }
                                            render={ ({ props }) => <View isUser={ this.state.isUser } {...this.props} />} />
                                        <Route
                                            onEnter={ sessionService.checkAuth }
                                            path={ ACTION.SLASH + PAGE.CUSTOMIZE }
                                            render={ ({ props }) => <Customize
                                                                        company={ this.state.company }
                                                                        isUser={ this.state.isUser }
                                                                        options={ this.state.options }
                                                                        onUpdateUser={ this._onUpdatePromise.bind(this) }
                                                                        onUpdateIsUserCallBack={ this._onUpdateIsUserCallBack.bind(this) }
                                                                        {...this.props} />} />
                                        <Route
                                            onEnter={ sessionService.checkAuth }
                                            path={ ACTION.SLASH + PAGE.SYSTEM }
                                            render={ ({ props }) => <System
                                                                        company={ this.state.company }
                                                                        isUser={ this.state.isUser }
                                                                        options={ this.state.options }
                                                                        onUpdateUser={ this._onUpdatePromise.bind(this) }
                                                                        onUpdateIsUserCallBack={ this._onUpdateIsUserCallBack.bind(this) }
                                                                        {...this.props} />} />
                                        <Route
                                            exact
                                            path={ ACTION.SLASH + PAGE.ERROR }
                                            render={ ({ props }) => <Error
                                                                        error={ this.state.error }
                                                                        errorInfo={ this.state.errorInfo }
                                                                        {...this.props} />} />
        
                                        <Route
                                            exact
                                            render={ ({ props }) => <P404 isUser={ this.state.isUser }
                                                                        viewHeader={ this._setViewHeader.bind(this) }
                                                                        onLogout={ this._doLogout.bind(this) }
                                                                        {...this.props} />} />
                                    </Switch>
                                </div>
                            </Router>
                        );
                    }
                })()}
                </Provider>

                <div id='div_footer' className='bg-light div-footer'>
                    <Footer company={ this.state.company } viewFooter={ !this.state.isUser.viewHeader } />
                </div>
            </div>
        );
    };
}

export default App;