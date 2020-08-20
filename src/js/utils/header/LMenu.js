import React, { Component as C } from "react";
import { Nav } from 'react-bootstrap';
import { FaBars } from 'react-icons/fa';
import { slide as Menu } from "react-burger-menu";

import { LINK, NOT_LINK } from '../Types';
import { HTML_TAG } from '../HtmlTypes';
import { inJson, isEmpty } from '../Utils';

var styles = {
  bmBurgerButton: { position: 'fixed', width: '36px', left: '7px', top: '.5em', height: '30px' },
  bmBurgerBars: { background: '#373a47' },
  bmBurgerBarsHover: { background: '#a90000' },
  bmCrossButton: { height: '24px', width: '24px' },
  // bmCross: { background: '#bdc3c7' },
  bmMenuWrap: { position: 'fixed', height: '100%' },
  // bmMenu: { background: '#373a47', padding: '2.5em 1.5em 0', fontSize: '1.15em' },
  // bmMenu: { background: '#373a47' },
  bmMorphShape: { fill: '#373a47' },
  // bmItemList: { color: '#b8b7ad', padding: '0.8em' },
  // bmItemList: { color: '#b8b7ad' },
  bmItem: { display: 'inline-block' },
  bmOverlay: { background: 'rgba(0, 0, 0, 0.3)' }
}

class LMenu extends C {
  constructor(props) {
    super(props);

    this._onClick = this._onClick.bind(this);
    // this.state = {
    //   menus: props.menus
    // }
  }

  _onClick(e) {
    var obj = e.target;
    const flag = parseInt(obj.getAttribute("flag"));
    if(flag === NOT_LINK) {
      const pObj = e.target.parentElement.parentElement;
      if(isEmpty(pObj)) return;
      const childs = e.target.parentElement.parentElement.childNodes;
      if(isEmpty(childs) || childs.length < 2) return;
      var className = childs[1].className;
      if(className.indexOf('-hide') === -1) {
        className = className.replace('-show', '-hide');
      } else {
        className = className.replace('-hide', '-show');
      }
      childs[1].className = className;
    } else {
      var nav = obj.parentElement;
      if(nav.tagName !== HTML_TAG.NAV) {
        nav = obj.parentElement.parentElement.parentElement;
      }
      if(nav.tagName === HTML_TAG.NAV) {
        this._onRemoveSelected(Array.from(nav.childNodes));
      }
      obj.className = obj.className + ' selected';

      const svg = document.getElementById('btn_menu_left');
      const btn = svg.parentElement.childNodes[1];
      console.log(obj);
      console.log(btn.tagName);
      if(isEmpty(btn) || btn.tagName !== HTML_TAG.BUTTON) return;
      this.props.onClick(e);
      btn.click();
    }
  }

  _onRemoveSelected(menus) {
    if(!Array.isArray(menus)) return;
    menus.map((o) => {
      if(o.tagName === HTML_TAG.A) {
        o.className = o.className.replace(' selected', '');
      }
      if(o.tagName === HTML_TAG.DIV) {
        const a = o.childNodes[1];
        if(isEmpty(a)) return;
        this._onRemoveSelected(Array.from(a.childNodes));
      }
    });
  }

  _getMenu(menus) {
    if(isEmpty(menus) || menus.length === 0 || isEmpty(menus[0])) return "";
    menus.map((o) => {
      if(inJson(o, 'items') && Array.isArray(o['items']) && !isEmpty(o['items'][0])) {
          o['items'].sort((a, b) => ((a.page_order > b.page_order)?1:-1));
      }
    });
    menus.sort((a, b) => ((a.page_order > b.page_order)?1:-1));

    return menus.map((o, index) => {
      if(o.page_flag === LINK) {
        return (
          <Nav.Link
            key={ o.page_id }
            idx={ index }
            mode={ 'menu-left' }
            action={ o.page_id }
            onClick={ this._onClick.bind(this) }
            flag={ o.page_flag }>{ o.page_name }</Nav.Link>);
      } else {
        return (
          <div key={ 'div_0_' + o.page_id }>
            <div key={ 'div_1_' + o.page_id } className="btn-info">
              <Nav.Link
                key={ o.page_id }
                idx={ index }
                onClick={ this._onClick.bind(this) }
                className="dropdown-toggle"
                style={{ color: 'white' }}
                flag={ o.page_flag }>{ o.page_name }</Nav.Link>
            </div>
            <div key={ 'div_2_' + o.page_id } className="div-left-menu-child div-left-menu-child-hide">
              { this._getMenu(o.items) }
            </div>
          </div>
        );  
      }
    });
  }

  render() {
    // console.log(this.props.menus)
    return (
      <div>
        <Menu
          styles={ styles }
          className="div-left-menu alert-light"
          width={ '20%' }
          { ...this.props }
          customBurgerIcon={ <FaBars id='btn_menu_left' /> }
          customCrossIcon={ false }>
          { this._getMenu(this.props.menus) }
        </Menu>
      </div>
    );
  }
}

export default LMenu;