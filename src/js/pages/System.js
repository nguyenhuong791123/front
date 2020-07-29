import React, { Component as C } from 'react';
import { ButtonGroup, Button } from 'react-bootstrap';

import Actions from '../utils/Actions';
import { SYSTEM, ACTION, PAGE_ACTION, VARIANT_TYPES, PAGE } from '../utils/Types';
import { HTML_TAG, ATTR, TYPE, OPTION_AUTH } from '../utils/HtmlTypes';
import Html from '../utils/HtmlUtils';
import Utils from '../utils/Utils';

import Msg from '../../msg/Msg';
import '../../css/TreeList.css';

class System extends C {
    constructor(props) {
        super(props);

        // this._onClick = this._onClick.bind(this);
        this._onClickAdd = this._onClickAdd.bind(this);
        this._onButtonClick = this._onButtonClick.bind(this);
        this._onCheckBoxClick = this._onCheckBoxClick.bind(this);
        this._onClickSubmit = this._onClickSubmit.bind(this);

        this.state = {
            isUser: this.props.isUser
            ,options: this.props.options
            ,pages: { page: [] }
            ,checked: []
            ,expanded: []
            ,menus: this.props.menus
            ,btns: []
        };
    };

    _onClickAdd() {
        this.state.isUser.action = PAGE.CUSTOMIZE;
        this.state.isUser.path = ACTION.SLASH + PAGE.CUSTOMIZE;
        this.state.isUser.actions = undefined;
        this.props.onUpdateUser(this.state.isUser, this.state.options, this.props.onUpdateIsUserCallBack);
    }

    // _onClick(e) {
    //     var obj = e.target;
    //     if(obj.tagName !== HTML_TAG.DIV) return;
    //     var className = (Html.hasAttribute(obj, ATTR.CLASS))?obj.className:'';
    //     const selected = (className.indexOf(ACTION.SELECTED) === -1);
    //     this._addSelected(obj, selected);
    //     this._addChildSelected(obj, selected);
    //     this._addParentSelected(obj, selected);
    // }

    _onButtonClick(e) {
        var obj = e.target;
        if(Utils.isEmpty(obj) || obj.tagName !== HTML_TAG.BUTTON) return;
        const className = obj.className;
        const selected = (className.indexOf(ACTION.SELECTED) === -1);
        this._addButtonSelected(obj, selected);
        const code = Html.hasAttribute(obj, ATTR.CODE)?obj.getAttribute(ATTR.CODE):null;
        if(Utils.isEmpty(code)) return;

        const div = obj.parentElement;
        if(Utils.isEmpty(div) || div.tagName !== HTML_TAG.DIV) return;
        const input = div.getElementsByTagName(HTML_TAG.INPUT)[0];
        if(Utils.isEmpty(input) || input.getAttribute('type') !== TYPE.CHECKBOX) return;
        if(!Html.hasAttribute(div, ATTR.ID) || div.id.indexOf('div_btn_') === -1) {
            const btns = Array.from(div.childNodes);
            const count = this._onCountButtonSelected(btns);
            if(count === (btns.length - 1) && !input.checked) {
                // input.click();
                input.checked = true;
            } else if(count < (btns.length - 1) && input.checked) {
                input.checked = false;
            }
        } else {
            const btns = Array.from(div.childNodes);
            const count = this._onCountButtonSelected(btns);
            if(count === (btns.length - 1) && !input.checked) {
                input.click();
            } else if(count < (btns.length - 1)) {
                if(count === 0) {
                    input.checked = true;
                    input.click();
                } else {
                    input.checked = false;
                    const ul = div.parentElement.childNodes[div.parentElement.childNodes.length-1];
                    if(Utils.isEmpty(ul) | ul.tagName !== HTML_TAG.UL) return;
                    const ulis = Array.from(ul.childNodes);
                    ulis.map((li) => {
                        this._addButtonAutoSelected(li, code, selected);
                    });
                }
            }
        }
    }

    _onCountButtonSelected(btns) {
        if(!Array.isArray(btns)) return 0;
        let count = 0;
        btns.map((o) => {
            if(!Utils.isEmpty(o.className) && o.className.indexOf('selected') !== -1)
                count += 1;
        });
        return count;
    }

    _addButtonAutoSelected(obj, code, selected) {
        if(Utils.isEmpty(obj) || obj.tagName !== HTML_TAG.LI) return;
        const div = obj.childNodes[obj.childNodes.length-1];
        if(div.tagName === HTML_TAG.UL) {
            const ulis = Array.from(div.childNodes);
            ulis.map((li) => {
                this._addButtonAutoSelected(li, code, selected);
            });
        }
        if(div.tagName === HTML_TAG.DIV && div.className.indexOf('div-btn-group') !== -1) {
            const input = div.getElementsByTagName(HTML_TAG.INPUT)[0];
            if(Utils.isEmpty(input) || input.getAttribute('type') !== TYPE.CHECKBOX) return;
            const btns = Array.from(div.childNodes);
            btns.map((btn) => {
                if(Html.hasAttribute(btn, ATTR.CODE) && btn.getAttribute(ATTR.CODE) === code) {
                    this._addButtonSelected(btn, selected);
                }
            });
            const count = this._onCountButtonSelected(btns);
            if(count < (btns.length - 1) && input.checked) input.checked = false;
        }
    }

    _addButtonSelected(obj, selected) {
        if(Utils.isEmpty(obj) || obj.tagName !== HTML_TAG.BUTTON) return;
        const className = obj.className;
        let liP = obj.parentElement.parentElement;
        let pIdx = liP.getAttribute(ATTR.IDX);
        if(!Utils.isNumber(pIdx)) {
            liP = liP.parentElement.parentElement;
            pIdx = liP.getAttribute(ATTR.IDX);
            if(!Utils.isNumber(pIdx)) return;
            const iIdx = Html.hasAttribute(obj, ATTR.IDX)?obj.getAttribute(ATTR.IDX):null;
            const code = Html.hasAttribute(obj, ATTR.CODE)?obj.getAttribute(ATTR.CODE):null;
            if(!Utils.isNumber(iIdx) || Utils.isEmpty(code)) return;
            const auths = this.state.menus[pIdx]['items'][iIdx]['page_auth'];
            auths[code] = selected;

            const div = liP.childNodes[1];
            if(!Utils.isEmpty(div)) {
                const input = div.getElementsByTagName(HTML_TAG.INPUT)[0];
                let btP = null;
                Array.from(div.childNodes).map((b) => {
                    if(Html.hasAttribute(b, ATTR.CODE) && b.getAttribute(ATTR.CODE) === code) {
                        btP = b;
                    }
                });
                if(!Utils.isEmpty(input) && !Utils.isEmpty(btP)) {
                    const vChecked = this._onVerticalChecked(pIdx, code);
                    const pChecked = this._onCountButtonSelected(Array.from(div.childNodes));
                    // console.log(pChecked)
                    // console.log(vChecked)
                    if(vChecked) {
                        if(pChecked === (div.childNodes.length - 2)) input.checked = vChecked;
                        btP.className = 'selected ' + btP.className;
                        // btP.className = 'selected btn btn-' + VARIANT_TYPES.SUCCESS;
                    } else {
                        input.checked = vChecked;
                        // btP.className = btP.className.replace('selected ', '');;
                        btP.className = 'btn btn-outline-' + VARIANT_TYPES.SUCCESS;
                    }
                }
            }
        }
        if(className.indexOf('selected ') === -1 && selected)
            // obj.className = 'selected ' + className;
            obj.className = 'selected ' + className.replace('btn-outline-', 'btn-');
        if(!Utils.isEmpty(className) && className.indexOf('selected ') !== -1 && !selected)
            // obj.className = className.replace('selected ', '');
            obj.className = className.replace('selected ', '').replace('btn-', 'btn-outline-');
    }

    _onCheckBoxClick(e) {
        var obj = e.target;
        if(Utils.isEmpty(obj)
            || !Html.hasAttribute(obj, ATTR.TYPE)
            || obj.type !== TYPE.CHECKBOX) return;
        const div = obj.parentElement;
        if(Utils.isEmpty(div) || div.childNodes.length <=1) return;
        const btns =  Array.from(div.childNodes);
        if(!Utils.isEmpty(this.state[ACTION.SELECTED])) obj.checked = this.state[ACTION.SELECTED];
        const selected = obj.checked;
        btns.map((bt) => {
            if(bt.tagName === HTML_TAG.BUTTON) {
                this._addButtonSelected(bt, selected);
            }
        });

        const ul = div.parentElement.childNodes[div.parentElement.childNodes.length-1];
        if(Utils.isEmpty(ul) || ul.tagName !== HTML_TAG.UL) return;
        this.state[ACTION.SELECTED] = selected;
        const ulis = Array.from(ul.childNodes);
        ulis.map((li) => {
            this._onCheckBoxAutoClick(li);
        });
        this.state[ACTION.SELECTED] = null;
    }

    _onCheckBoxAutoClick(obj) {
        if(Utils.isEmpty(obj) || obj.tagName !== HTML_TAG.LI) return;
        const div = obj.childNodes[obj.childNodes.length-1];
        if(div.tagName === HTML_TAG.UL) {
            const ulis = Array.from(div.childNodes);
            ulis.map((li) => {
                this._onCheckBoxAutoClick(li);
            });
        }
        if(div.tagName === HTML_TAG.DIV && div.className.indexOf('div-btn-group') !== -1) {
            div.childNodes[0].click();
        }
    }

    _onClickSubmit() {
        console.log(this.state.menus);
        this.props.onUpdateMenus(this.state.menus);
    }

    _getSelected(obj) {
        if(Utils.isEmpty(obj)
            || obj.tagName !== HTML_TAG.LI
            || Utils.isEmpty(obj.childNodes[0])) return;
        const div = obj.childNodes[obj.childNodes.length-1];
        if(div.tagName === HTML_TAG.DIV && div.className.indexOf('div-btn-group') !== -1) {
            var add = false;
            var page = { action: obj.id, methods: [] };
            const btns = Array.from(div.childNodes);
            btns.map((btn) => {
                if(btn.type === TYPE.BUTTON
                    && Html.hasAttribute(btn, ATTR.CODE)
                    && btn.className.indexOf(' selected') !== -1) {
                    add = true;
                    page.methods.push(btn.getAttribute(ATTR.CODE));
                }
            });
            if(add) this.state.pages.page.push(page);
        } else {
            const ulis = Array.from(div.childNodes);
            ulis.map((li) => {
                this._getSelected(li);
            });    
        }
    }

    // _addSelected(obj, selected) {
    //     if(!Utils.isEmpty(obj) && obj.tagName === HTML_TAG.LI) obj = obj.childNodes[0];
    //     const className = obj.className;
    //     if(selected) {
    //         if(Utils.isEmpty(className) || className.indexOf(ACTION.SELECTED) === -1) {
    //             obj.className = className + ACTION.SELECTED;
    //         }
    //     } else {
    //         obj.className = className.replace(ACTION.SELECTED, '');
    //     }
    // }

    // _addChildSelected(obj, selected) {
    //     if(!Utils.isEmpty(obj) && obj.tagName === HTML_TAG.LI) obj = obj.childNodes[0];
    //     this._addSelected(obj, selected);
    //     const p = obj.parentElement;
    //     const pUl = p.childNodes[p.childNodes.length-1];
    //     if(Utils.isEmpty(pUl) || pUl.tagName !== HTML_TAG.UL) return;
    //     const ulis = Array.from(pUl.childNodes);
    //     ulis.map((li) => {
    //         this._addChildSelected(li, selected);
    //     });
    // }

    // _addParentSelected(obj, selected) {
    //     if(Utils.isEmpty(obj) || (obj.tagName === HTML_TAG.DIV && obj.id === SYSTEM.IS_DIV_TREE_VIEW_BOX)) return;
    //     const p = obj.parentElement.parentElement;
    //     if(Utils.isEmpty(p) || p.childNodes.length <= 0 || p.tagName !== HTML_TAG.UL) return;
    //     const ulis = Array.from(p.childNodes);
    //     if(!selected) {
    //         ulis.map((li) => {
    //             if(!selected)
    //                 selected = (!Utils.isEmpty(li.childNodes[0])
    //                             && Html.hasAttribute(li.childNodes[0], ATTR.CLASS)
    //                             && li.childNodes[0].className.indexOf(ACTION.SELECTED) !== -1);
    //         });    
    //     }
    //     const pp = p.parentElement;
    //     if(Utils.isEmpty(pp) || (pp.tagName === HTML_TAG.DIV && pp.id === SYSTEM.IS_DIV_TREE_VIEW_BOX)) return;
    //     this._addSelected(pp.childNodes[0], selected);
    //     this._addParentSelected(pp.childNodes[0], selected);
    // }

    _getAllList() {
        if(Utils.isEmpty(this.state.menus) || this.state.menus.length <= 0) return "";
        var childs = [];
        this.state.menus.map((obj, index) => {
            childs.push(this._geList(obj, index));
        });
        return(<ul>{ childs }</ul>);
    }

    _geList(obj, idx) {
        if(!Utils.inJson(obj, 'items') || obj.items.length <= 0) {
            const className = (obj.page_flag === 1)?'btn-info':'';
            // var div = (<div key={ idx } title={ obj.page_name }>{ obj.page_name }</div>);
            var div = (<div key={ 'div_' + idx } className={ className }>{ obj.page_name }</div>);
            // if(this.state.isUser.uLid === SYSTEM.IS_ADMIN)
                // div = (<div key={ 'div_' + idx } className={ className } onClick={ this._onClick.bind(this) }>{ obj.page_name }</div>);
            const auths = [];
            if(Utils.inJson(obj, 'page_auth')) {
                const objs = Object.keys(obj.page_auth);
                objs.map((key, index) => {
                    const btSelected = (obj.page_auth[key])?'selected':'';
                    const variant = (obj.page_auth[key])?'':VARIANT_TYPES.OUTLINE;
                    auths.push(<Button
                                    key={ index }
                                    idx={ idx }
                                    code={ key }
                                    className={ btSelected }
                                    // variant={ VARIANT_TYPES.OUTLINE + VARIANT_TYPES.INFO }
                                    variant={ variant + VARIANT_TYPES.INFO }
                                    onClick={ this._onButtonClick.bind(this) }
                                    title={ Msg.getMsg(null, this.state.isUser.language, 'bt_' + key.substr(3)) }>
                                    { Msg.getMsg(null, this.state.isUser.language, 'bt_' + key.substr(3)) }
                                </Button>);
                });
            }

            return (
                // <li key={ idx } id={ obj.page_id }>
                <li key={ 'li_' + idx }>
                    { div }
                    {(() => {
                        if(!Utils.isEmpty(auths) && auths.length > 0) {
                            return (
                                <ButtonGroup className='div-btn-group'>
                                    <input type={ TYPE.CHECKBOX } idx={ idx } onClick={ this._onCheckBoxClick.bind(this) } />
                                    { auths }
                                </ButtonGroup>
                            );
                        }
                    })()}
                </li>);
        } else {
            var childs = [];
            obj.items.map((o, index) => {
                childs.push(this._geList(o, index));
            });
            // var div = (<div key={ 'div_' + idx } title={ obj.label }>{ obj.label }</div>);
            const className = (obj.page_flag === 1)?'btn-info':'';
            var div = (<div key={ 'div_' + idx } className={ className }>{ obj.page_name }</div>);
            // if(this.state.isUser.uLid === SYSTEM.IS_ADMIN)
            //     div = (<div key={ 'div_' + idx } className={ className } onClick={ this._onClick.bind(this) }>{ obj.page_name }</div>);
            return(
                <li
                    key={ 'li_' + idx }
                    idx={ idx }
                    className='parent'>
                    { div }
                    <ul key={ 'ul_' + idx }>{ childs }</ul>
                </li>
                );
        }
    }

    _getChildButtons(obj, idx) {
        if(Utils.isEmpty(obj) || obj.tagName !== HTML_TAG.LI) return;
        const ul = obj.childNodes[obj.childNodes.length-1];
        if(Utils.isEmpty(ul) || (ul.tagName !== HTML_TAG.DIV && ul.tagName !== HTML_TAG.UL)) return;
        if(ul.tagName === HTML_TAG.DIV
            && !Utils.isEmpty(ul.className)
            && ul.className.indexOf('div-btn-group') !== -1) {
            if(!Array.isArray(this.state.btns[idx])) this.state.btns[idx] = [];
            const btns = Array.from(ul.childNodes);
            btns.map((b) => {
                if(!(this.state.btns[idx].map((o) => { return o.getAttribute(ATTR.CODE) })).includes(b.getAttribute(ATTR.CODE))) {
                    this.state.btns[idx].push(b.cloneNode(true));
                }
            });

            const count = this._onCountButtonSelected(btns);
            const input = ul.getElementsByTagName(HTML_TAG.INPUT)[0];
            if(count === (btns.length - 1) && !input.checked) input.checked = true;
        } else {
            const ulis = Array.from(ul.childNodes);
            ulis.map((li) => {
                this._getChildButtons(li, idx);
            });
        }
    }

    _onUpdateAuthParents() {
        const div = document.getElementById(SYSTEM.IS_DIV_TREE_VIEW_BOX);
        if(Utils.isEmpty(div) || Utils.isEmpty(div.childNodes[0]) || div.childNodes[0].childNodes.length <= 0) return;
        const ulis = Array.from(div.childNodes[0].childNodes);
        ulis.map((li, index) => {
            this._getChildButtons(li, index);
        });

        if(!Utils.isEmpty(this.state.btns) && this.state.btns.length > 0) {
            this.state.btns.map((o, index) => {
                const divOld = document.getElementById('div_btn_' + index);
                if(!Utils.isEmpty(divOld)) divOld.remove();
                const obj = document.createElement(HTML_TAG.DIV);
                obj.className = 'div-btn-group btn-group';
                obj.id = 'div_btn_' + index;
                o.map((b, idx) => {
                    const objs = this.state.menus[index]['items'];
                    const checked = this._onAllChecked(objs);
                    // console.log(checked);
                    if(idx === 0 && b.tagName === HTML_TAG.INPUT) {
                        b.onclick = this._onCheckBoxClick.bind(this);
                        if(Array.isArray(checked) && checked.length > 0) {
                            b.checked = checked[0].checked;
                        } else {
                            b.checked = true;
                        }
                    } else {
                        const code = b.getAttribute(ATTR.CODE);
                        let className = b.className.replace(VARIANT_TYPES.INFO, VARIANT_TYPES.SUCCESS);
                        if(Array.isArray(checked) && checked.length > 0) {
                            for(let i=0; i<checked.length; i++) {
                                if(code !== checked[i].auth) continue
                                if(checked[i].checked) {
                                    className = 'selected btn btn-' + VARIANT_TYPES.SUCCESS;
                                } else {
                                    className = 'btn btn-outline-' + VARIANT_TYPES.SUCCESS;
                                }
                                break
                            }
                        }
                        b.className = className;
                        b.onclick = this._onButtonClick.bind(this);
                    }
                    obj.appendChild(b);
                });

                div.childNodes[0].childNodes[index].childNodes[0].after(obj);
            });
        }
    }

    _onAllChecked(objs) {
        let obj = [];
        objs.map((o, idx) => {
            if(!Utils.isEmpty(o['page_auth'])) {
                Object.keys(o['page_auth']).map((a) => {
                    if(o['page_auth'][a] === false)
                        obj.push({ checked: false, auth: a, idx: idx })
                });
            }
        });
        return obj;
    }

    _onVerticalChecked(idx, code) {
        if(!Utils.isNumber(idx) || Utils.isEmpty(code) || Utils.isEmpty(this.state.menus[idx])) return;
        const objs = this.state.menus[idx]['items'];
        if(!Array.isArray(objs)) return;
        let length = 0;
        objs.map((o) => {
            if(!Utils.isEmpty(o['page_auth'])) {
                Object.keys(o['page_auth']).map((a) => {
                    if(o['page_auth'][a] && a === code)
                        length += 1;
                });
            }
        });
        console.log(length);
        console.log(objs.length);
        return (length === objs.length);
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        this.state.isUser = nextProps.isUser;
        this.state.options = nextProps.options;
        this.state.menus = nextProps.menus;
    }

    componentDidUpdate() {
        this._onUpdateAuthParents();
    }

    render() {
        this.state.isUser.actions = PAGE_ACTION.SYSTEM;

        return (
            <div className={ 'div-list-box' }>
                <Actions
                    isUser={ this.state.isUser }
                    onClickAdd={ this._onClickAdd.bind(this) }
                    onClickSubmit={ this._onClickSubmit.bind(this) } />

                <div className="div-title-box">
                    <h5>{ this.state.isUser.path + '/' + this.state.isUser.action }</h5>
                </div>

                <div id={ SYSTEM.IS_DIV_TREE_VIEW_BOX } className='div-tree-view-box'>
                    { this._getAllList() }
                </div>
            </div>
        )
    };
};

export default System;