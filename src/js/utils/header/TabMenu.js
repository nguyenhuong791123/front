import React, { Component as C } from 'react';
import ReactDOM from 'react-dom';
import onClickOutside from 'react-onclickoutside';
import { Nav, Tabs, Tab } from 'react-bootstrap';

import { LINK, NOT_LINK, WINDOWN_WIDTH, SYSTEM, TAB_MENU_TYPE, DISPLAY_TYPE } from '../Types';
import Utils from '../Utils';
import "../../../css/TabMenu.css";

class TabMenu extends C {
    constructor(props) {
        super(props);
  
        this._onSelect = this._onSelect.bind(this);
        this._onClickNextPrev = this._onClickNextPrev.bind(this);
        this._onClick = this._onClick.bind(this);
        // this._onShow = this._onShow.bind(this);
        this._onMouseOver = this._onMouseOver.bind(this);
  
        this.state = {
            isUser: this.props.isUser
            ,isActive: 1
            ,isSliderTab: 0
            ,isMargin: 0
            ,level: 0
            ,id: null
            ,objs: this.props.objs
        }
    }
  
    _onClick(e) {
        console.log('TAMENU _onClick');
        var obj = this.getLinkObj(e);
        const view = parseInt(obj.getAttribute("view"));
        if(view === NOT_LINK) {
            e.preventDefault();
            e.stopPropagation();
            return;
        }
        const level = parseInt(obj.getAttribute("level"));
        var div = document.getElementById(this.state.id + '_level_' + level);
        if(!Utils.isEmpty(div)) {
            const className = div.className;
            if(className.indexOf('show ') === -1) {
                this._hideAllChildMenu(0);
            } else {
                this._hideAllChildMenu(level);
            }
        } else {
            this._removeAllDropdown();
        }
        this.props.onClick(e);
    }

    _removeAllDropdown() {
        var divs = document.getElementsByClassName('dropdown-menu');
        if(!Utils.isEmpty(divs) && divs.length > 1) {
            for(var i=0; i<divs.length; i++) {
                var id = divs[i].id;
                if(Utils.isEmpty(id) || id.indexOf('_level_') === -1) continue
                divs[i].remove();
            }
        }
    }
  
    _onWriteDropDownMenu(idx, obj, json) {
        console.log('TAMENU _onWriteDropDownMenu');
        const view = json["view"];
        const level = json["level"];
        const divId = 'div_' + idx + '_level_' + (level+1);
        if(view !== NOT_LINK) return
        this._removeAllDropdown();
        var isExistObj = document.createElement('div');
        isExistObj.id = divId;
        isExistObj.className = 'dropdown-menu show';
        var items = json.items;
        if(!Utils.isEmpty(items) && items.length > 0) {
            this._getMenuLinkBoxHTML(isExistObj, idx, items);
            if(window.innerWidth < WINDOWN_WIDTH) {
                isExistObj.style.top = (obj.offsetTop + (obj.offsetHeight + 5)) + 'px';
                isExistObj.style.left = 'auto';
                isExistObj.style.right = '280px';
            } else {
                isExistObj.style.top = (obj.offsetTop + obj.offsetHeight) + 'px';
                isExistObj.style.left = (obj.offsetLeft) + 'px';    
            }
        
            var header = document.getElementById('div_header');
            console.log(isExistObj);
            header.appendChild(isExistObj);
            this.setState({ level: (level+1) });  
        }

        this._hideAllChildMenu((level+1));
        this.setState({ show: true, id: 'div_' + idx });
        this.forceUpdate();
    }
  
    _getMenuLinkBoxHTML(pDiv, idx, items) {
      if(Utils.isEmpty(items) || items.length === 0) return "";
      return items.map((o, index) => {
        index = idx + '-' + index;
        if(o.view === LINK) {
          pDiv.appendChild(this._getMenuLink(o, index));
        } else {
          const nDiv = document.createElement('div');
          nDiv.className = "dropright"
          nDiv.appendChild(this._getMenuLink(o, index));
          pDiv.appendChild(nDiv);
        }
        return o;
      });
    }
  
    _getMenuLink(item, index) {
        console.log(item);
        const nObj = document.createElement('a');
        if(item.view === LINK) {
            nObj.className = "dropdown-item";
        } else {
            nObj.className = "dropdown-item dropdown-toggle";
        }
        nObj.innerHTML = item.label;
        nObj.setAttribute('idx', index);
        nObj.setAttribute('action', item.target);
        nObj.setAttribute('href', '#');
        nObj.setAttribute('level', item.level);
        nObj.setAttribute('view', item.view);
        nObj.onclick = this._onClick.bind(this);
        nObj.onmouseover = this._onMouseOver.bind(this);
        return nObj;
    }

    _onMouseOver(e) {
        console.log('TAMENU _onMouseOver');
        var obj = this.getLinkObj(e);
        const view = parseInt(obj.getAttribute("view"));
        const level = parseInt(obj.getAttribute("level"));
        const divId = this.state.id + '_level_' + (level+1);
        if(view === NOT_LINK) {
            e.preventDefault();
            e.stopPropagation();
            var isExistObj = document.getElementById(divId);
            if(!Utils.isEmpty(isExistObj)) isExistObj.remove();
            const pObj = obj.parentElement.parentElement;
            isExistObj = pObj.cloneNode(true);
            isExistObj.id = divId;
            isExistObj.innerHTML = "";
            const idx = obj.getAttribute("idx");
            var items = [];
            // var json = {};
            var idxs = idx.split('-');
            // for(var i=0; i<idxs.length; i++) {
            //     json = this.state.objs[idxs[i]];
            //     console.log(json);
            //     if(Utils.isEmpty(json[idxs[i]].items)) break;
            //     items = json[idxs[i]].items;
            // }
            if(!Utils.isEmpty(idxs) && idxs.length === 1) {
                items = this.state.objs[idxs[0]].items;
            }
            if(!Utils.isEmpty(idxs) && idxs.length === 2) {
                items = this.state.objs[idxs[0]].items[idxs[1]].items;
            }
            if(!Utils.isEmpty(idxs) && idxs.length === 3) {
                items = this.state.objs[idxs[0]].items[idxs[1]].items[idxs[2]].items;
            }
            if(!Utils.isEmpty(idxs) && idxs.length === 4) {
                items = this.state.objs[idxs[0]].items[idxs[1]].items[idxs[2]].items[idxs[3]].items;
            }
        
            if(!Utils.isEmpty(items) && items.length > 0) {
                this._getMenuLinkBoxHTML(isExistObj, idx, items);
                const objPos = ReactDOM.findDOMNode(obj).getBoundingClientRect();
                isExistObj.style.right = 'auto';
                if(window.innerWidth < WINDOWN_WIDTH) {
                    isExistObj.style.top = (objPos.top) + 'px';
                    // console.log(objPos.x);
                    // console.log(objPos.width);
                    isExistObj.style.left = (objPos.x - (objPos.width + 3)) + 'px';
                } else {
                    isExistObj.style.top = (objPos.top) + 'px';
                    isExistObj.style.left = (objPos.x + objPos.width) + 'px';    
                }
        
                var header = document.getElementById('div_header');
                header.appendChild(isExistObj);
                this.setState({ level: (level+1) });
                // console.log(this.state.level);
            }
        
            this._hideAllChildMenu((level+1));
            this.setState({ show: true });
            this.forceUpdate();
        } else {
            var div = document.getElementById(this.state.id + '_level_' + level);
            if(Utils.isEmpty(div)) return;
            const className = div.className;
            if(className.indexOf(' show') === -1) {
                this._hideAllChildMenu(0);
            } else {
                this._hideAllChildMenu(level);
            }
        }
    }
  
    getLinkObj(e) {
      var obj = e.target;
      if(obj.tagName !== 'A') {
        if(obj.tagName === 'path') {
          obj = e.target.parentElement.parentElement;
        } else {
          obj = e.target.parentElement;
        }
        if(Utils.isEmpty(obj) || obj.tagName !== 'A') return;
      }
      return obj;
    }

    _hideAllChildMenu(level) {
        for(var idx = 0; idx <= this.state.level; idx++) {
            if(idx < (level+1)) continue;
            var isExistObj = document.getElementById(this.state.id + '_level_' + idx);
            if(!Utils.isEmpty(isExistObj)) {
                isExistObj.remove();
            }
        }  
    }    

    _onSelect(tabIdx) {
        console.log(tabIdx);
        if(Utils.isEmpty(tabIdx)) return;
        const obj = this.state.objs[tabIdx];
        if(Utils.isEmpty(obj)) return;
        this.state.isActive = parseInt(tabIdx);
        const div = document.getElementById(SYSTEM.IS_TAB_MENU);
        const nav = div.childNodes[0].childNodes[1];
        if(Utils.isEmpty(nav)) return;
        const navChilds = nav.childNodes;
        console.log(navChilds);
        if(Utils.isEmpty(navChilds) || Utils.isEmpty(navChilds[this.state.isActive])) return;
        this._onWriteDropDownMenu(tabIdx, navChilds[this.state.isActive], obj);
        // this._onShow();
        // console.log(obj);
    }

    // _onShow(e) {
    //     this.setState({ show: !this.state.show });
    // }    

    _onClickNextPrev(e) {
        const action = e.target.getAttribute("action");
        if(Utils.isEmpty(action) || (action !== '-' && action !== '+')) return;
        this._nextPrevTab(action, e.target);
    }

    _nextPrevTab(action, nextObj) {
        var div = document.getElementById(SYSTEM.IS_TAB_MENU);
        const nav = div.childNodes[0].childNodes[1];
        if(Utils.isEmpty(nav)) return;
        const navChilds = nav.childNodes;
        if(Utils.isEmpty(navChilds) || navChilds.length <= 0) return;
        this.state.isSliderTab = (action === '-')?(this.state.isSliderTab+1):(this.state.isSliderTab-1);
        if(this.state.isSliderTab <= 0) this.state.isSliderTab = 0;
        const last1st = navChilds[navChilds.length-1];
        var isMargin = 0;
        if(last1st.offsetLeft <= nextObj.offsetLeft && action === '-') {
            this.state.isSliderTab = (this.state.isSliderTab-1);
            return;
        }
        if(this.state.isSliderTab !== 0) {
            const isTab = navChilds[this.state.isSliderTab];
            if(Utils.isEmpty(isTab)) return;
            isMargin = this.state.isMargin + parseInt(action + isTab.offsetWidth);
        }
        if(isMargin > 0) {
            return;
        }

        this.state.isMargin = isMargin;
        navChilds[0].style.marginLeft = isMargin + 'px';
    }
  
    _getTabs(items) {
        if(Utils.isEmpty(items) || items.length === 0) return "";
        return items.map((o, index) => {
            return (
                <Tab key={ index } eventKey={ index } title={ o.label }></Tab>
            );
        });
    }

    handleClickOutside(e) {
        var obj = this.getLinkObj(e);
        if(!Utils.isEmpty(obj)) {
            const view = obj.getAttribute("view");
            if(view === NOT_LINK) return;
        }
        var level = 0;
        if(!Utils.isEmpty(obj)) level = obj.getAttribute("level");
        this._hideAllChildMenu(level);
    }

    componentDidMount() {
        console.log('TABMENU componentDidMount');
        var div = document.getElementById(SYSTEM.IS_TAB_MENU);
        this._onResizeWindown(div);
        const nav = div.childNodes[0].childNodes[1];
        if(!Utils.isEmpty(nav)) {
            const a = nav.childNodes;
            for(var i=0; i<a.length; i++) {
                var item = this.state.objs[i];
                if(Utils.isEmpty(a[i]) || Utils.isEmpty(item)) continue;
                var nObj = a[i];
                nObj.setAttribute('idx', i);
                nObj.setAttribute('action', item.target);
                nObj.setAttribute('href', '#');
                nObj.setAttribute('level', item.level);
                nObj.setAttribute('view', item.view);
                if(item.view === LINK) nObj.onclick = this._onClick.bind(this);
            }
        }
        this.forceUpdate();
    }

    componentWillReceiveProps() {
        this._onResizeWindown(document.getElementById(SYSTEM.IS_TAB_MENU));
    }

    _onResizeWindown(div) {
        if(Utils.isEmpty(div)) return;
        const aWidth = (this.state.isUser.uLid === SYSTEM.IS_ADMIN)?140:0;
        window.onresize = function(event) {
            if(Utils.isEmpty(div)) return;
            const divContent = div.childNodes[0].childNodes[2];
            if(!Utils.isEmpty(divContent)
                && !Utils.isEmpty(divContent.className)
                && divContent.className === 'tab-content') divContent.remove();
            const nav = div.childNodes[0].childNodes[1];
            if(!Utils.isEmpty(nav)) {
                const divP = div.parentElement;
                const navParent = nav.parentElement.childNodes;
                const prev = navParent[0];
                const next = navParent[navParent.length-1];
                if(Utils.isEmpty(prev) || Utils.isEmpty(next)) return;
                if(window.innerWidth < WINDOWN_WIDTH) {
                    nav.style.width = '100%';
                    nav.childNodes[0].style.marginLeft = 0;
                    if(nav.className.indexOf(' nav-tabs-vertical') === -1) {
                        nav.className = nav.className + ' nav-tabs-vertical';
                        prev.style.display = DISPLAY_TYPE.NONE;
                        next.style.display = DISPLAY_TYPE.NONE;
                    }
                    if(divP.className.indexOf(' mr-auto-parent') === -1) {
                        divP.className = divP.className + ' mr-auto-parent';
                    }
                } else {
                    nav.style.width = (window.innerWidth - (750 + aWidth)) + 'px';
                    if(nav.className.indexOf(' nav-tabs-vertical') !== -1) {
                        nav.className = nav.className.replace(' nav-tabs-vertical', '');
                        prev.style.display = DISPLAY_TYPE.BLOCK;
                        next.style.display = DISPLAY_TYPE.BLOCK;
                    }
                    if(divP.className.indexOf(' mr-auto-parent') !== -1) {
                        divP.className = divP.className.replace(' mr-auto-parent', '');
                    }
                }

                var cWidth = 0;
                for(var i=0; i<nav.childNodes.length; i++) {
                    cWidth += nav.childNodes[i].offsetWidth;
                }
                if(cWidth > nav.offsetWidth) {
                    prev.style.display = DISPLAY_TYPE.BLOCK;
                    next.style.display = DISPLAY_TYPE.BLOCK;
                } else {
                    prev.style.display = DISPLAY_TYPE.NONE;
                    next.style.display = DISPLAY_TYPE.NONE;
                }
            } else {
                console.log(div);
                const divParent = div.parentElement;
                if(divParent.id !== 'tab_menu_1') return;
                if(window.innerWidth < WINDOWN_WIDTH) {
                    if(divParent.className.indexOf(' tab-menu-1') === -1) {
                        divParent.className = divParent.className + ' tab-menu-1';
                    }
                } else {
                    if(divParent.indexOf(' tab-menu-1') !== -1) {
                        divParent.className = divParent.className.replace(' tab-menu-1', '');
                    }
                }
            }
        };
        window.onresize();
    }

    render() {
      return (
            <div>
                <Nav.Link action={ TAB_MENU_TYPE.PLUS } onClick={ this._onClickNextPrev.bind(this) }>
                    { TAB_MENU_TYPE.PRIVIOUS }
                </Nav.Link>
                <Tabs defaultActiveKey={ this.state.isActive } onSelect={ this._onSelect.bind(this) }>
                    { this._getTabs(this.state.objs) }
                </Tabs>
                <Nav.Link action={ TAB_MENU_TYPE.MINUS } onClick={ this._onClickNextPrev.bind(this) }>
                    { TAB_MENU_TYPE.NEXT }
                </Nav.Link>
            </div>
        );
    }
}
  
export default onClickOutside(TabMenu);