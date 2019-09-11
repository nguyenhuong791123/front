import React, { Component as C } from 'react';
import { Router, Route, Switch } from 'react-router-dom';
import LoadingOverlay from 'react-loading-overlay';
import { createBrowserHistory } from 'history';
import { Provider } from 'react-redux';
import { createStore, combineReducers, compose, applyMiddleware } from 'redux';
import { sessionService, sessionReducer } from 'redux-react-session';
import thunkMiddleware from 'redux-thunk';

import { ACTION, HTML_TAG, SYSTEM } from './js/utils/Types';
import { THEME } from './js/utils/Theme';
import Utils from './js/utils/Utils';

/* global chrome */
import P404 from './js/error/P404';
import Header from './js/Header';
import Footer from './js/Footer';
import Login from './js/Login';
import List from './js/pages/List';
import Create from './js/pages/Create';
import View from './js/pages/View';
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
        this._updateStateIsUser = this._updateStateIsUser.bind(this);

        this.state = {
            loading: true
            ,copyright: 'Copyright ©2018 VNEXT All Rights Reserved.'
            ,isUser: AuthSession.isUserInit(null).info
            // ,isUser: { device: this.props.ua.device, language: this.props.ua.language, viewHeader: false }
            ,options: AuthSession.isUserInit(null).options
        }
    }

    // _setIsUserInit() {
    //     return AuthSession.isUserInit(null).info;
    // }

    _setViewHeader(isView) {
        this.state.isUser.viewHeader = isView;
        this.forceUpdate();
    }

    _doLogin(isUser, options) {
        // isUser[SYSTEM.IS_ACTIVE_WINDOWN] = (!Utils.isEmpty(window.name) && window.name===SYSTEM.IS_ACTIVE_WINDOWN);
        const auth = { info: isUser, options: options };
        // this._updateStateIsUser(auth);
        console.log(auth);
        // this.forceUpdate();
        AuthSession.doLogin(auth).then(response => {
            const { token } = response;
            sessionService.saveSession({ token }).then(() => {
                sessionService.saveUser(auth).then(() => {
                    sessionStorage.setItem('session', window.name);
                    console.log(this);
                    window.name = SYSTEM.IS_ACTIVE_WINDOWN;
                    this._updateStateIsUser(auth);
                    // callback(auth);
                    console.log('_doLogin complete !!!');
                    console.log(sessionService.loadUser('COOKIES'));
                });
            });
        });
    };

    _doLogout() {
        const auth = { info:  AuthSession.isUserInit(null).info, options:  AuthSession.isUserInit(null).options };
        auth.info.language = this.state.isUser.language;
        auth.info.theme = this.state.isUser.theme;
        this.state.isUser = auth.info;
        this.state.options = auth.options;
        console.log(this.state);
        const div = document.getElementById(SYSTEM.IS_DAILER_BOX);
        if(!Utils.isEmpty(div)) div.remove();
        this.forceUpdate();
        AuthSession.doLogout().then(() => {
            sessionService.deleteSession();
            sessionService.deleteUser();
            sessionStorage.removeItem('session');
            console.log('_doLogout complete !!!');
        }).catch(err => { throw (err); });
    };

    _loadAuthCookies(isUser, callBack) {
        const objAuth = sessionService.loadUser('COOKIES');
        if(objAuth !== undefined) {
            objAuth.then(function(data) {
                const isUrl = history.location.pathname;
                if(isUrl === ACTION.SLASH || data.info['path'] === ACTION.SLASH) {
                    data.info['path'] = ACTION.SLASH;
                    data.info['viewHeader'] = false;
                }
                const paths = isUrl.split('/');
                var path = null;
                // console.log(isUrl);
                // console.log(paths);
                if(!Utils.isEmpty(paths) && paths.length > 0) {
                    path = paths[paths.length - 1];
                }
                // console.log(path);
                if(!Utils.isEmpty(path)) {
                    data.info['path'] = ACTION.SLASH + path;
                }
                console.log('_loadAuthCookies');
                console.log(data);
                callBack(data);
            }).catch(function(error) {
                console.log(error);
                console.log(AuthSession.isUserInit(isUser));
                callBack(AuthSession.isUserInit(isUser));
            });
        } else {
            callBack({ info: AuthSession.isUserInit(null).info, options: AuthSession.isUserInit(null).options });
        }
    }

    _onUpdateIsUserCallBack(auth) {
        this._updateStateIsUser(auth);
        // this.forceUpdate();
    }

    _onUpdatePromise(inIsUser, inOptions, callBack) {
        const auth = { info: inIsUser, options: inOptions };
        // console.log(auth);
        const isUser = sessionService.loadUser('COOKIES');
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
            console.log('ERROR _onUpdatePromise');
            console.log(error);
        });
    }

    _updateStateIsUser(isUser) {
        // console.log('_updateStateIsUser');
        console.log(isUser);
        this.state.isUser = isUser.info;
        this.state.options = isUser.options;
        this._addCssLink();
        history.push(isUser.info.path);
        this.forceUpdate();
    }

    _addCssLink() {
        const obj = document.getElementById(SYSTEM.IS_CSS_LINK_ID);
        const css_path = THEME.getTheme(this.state.isUser.theme);
        if(!Utils.isEmpty(obj)) {
            obj.href = css_path;
        } else {
            const css = document.createElement(HTML_TAG.CSS_LINK);
            css.id = SYSTEM.IS_CSS_LINK_ID;
            css.setAttribute('rel', 'stylesheet');
            css.setAttribute('href', css_path);
            const head = document.getElementsByTagName(HTML_TAG.HEAD)[0];
            head.appendChild(css);    
        }
    }

    UNSAFE_componentWillMount() {
        this._loadAuthCookies(this.state.isUser, this._updateStateIsUser);
        this._addCssLink();
    }

    componentDidMount() {
        this._stopLoading();
    }

    _stopLoading() {
        this.state.loading = false;
    }

    render() {
        console.log('APP Render !!!');
        console.log(chrome.app);
        return (
            <div>
                <LoadingOverlay active={ this.state.loading } spinner text='Loading your content...' />

                <Provider store={ store }>
                    <Router history={ history }>
                        <div id='div_header'>
                            <Header
                                isUser={ this.state.isUser }
                                options={ this.state.options }
                                onUpdateUser={ this._onUpdatePromise.bind(this) }
                                onUpdateIsUserCallBack={ this._onUpdateIsUserCallBack.bind(this) }
                                onLogout={ this._doLogout.bind(this) } />
                        </div>
                        <div id='div_body'>
                            <Switch>
                                <Route
                                    exact path={ ACTION.SLASH }
                                    render={ ({ props }) => <Login
                                                                isUser={ this.state.isUser }
                                                                options={ this.state.options }
                                                                onUpdateStateIsUser={ this._updateStateIsUser.bind(this) }
                                                                onLogin={ this._doLogin.bind(this) }
                                                                {...this.props} />} />
                                <Route
                                    path={ ACTION.SLASH + ACTION.LIST }
                                    render={ ({ props }) => <List isUser={ this.state.isUser } {...this.props} />} />
                                <Route
                                    path={ ACTION.SLASH + ACTION.CREATE }
                                    render={ ({ props }) => <Create isUser={ this.state.isUser } {...this.props} />} />
                                <Route
                                    path={ ACTION.SLASH + ACTION.EDIT }
                                    render={ ({ props }) => <Create isUser={ this.state.isUser } {...this.props} />} />
                                <Route
                                    path={ ACTION.SLASH + ACTION.CUSTOMIZE }
                                    render={ ({ props }) => <Customize isUser={ this.state.isUser } {...this.props} />} />
                                <Route
                                    path={ ACTION.SLASH + ACTION.VIEW }
                                    render={ ({ props }) => <View isUser={ this.state.isUser } {...this.props} />} />
                                <Route
                                    exact
                                    render={ ({ props }) => <P404 isUser={ this.state.isUser }
                                                                viewHeader={ this._setViewHeader.bind(this) }
                                                                onLogout={ this._doLogout.bind(this) }
                                                                {...this.props} />} />
                            </Switch>
                        </div>
                    </Router>
                </Provider>

                <div id='div_footer' className='bg-light div-footer'>
                    <Footer copyright={ this.state.copyright } viewFooter={ !this.state.isUser.viewHeader } />
                </div>
            </div>
        );
    };
}

export default App;