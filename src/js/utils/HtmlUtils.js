const object = {
    maxLength: (obj, max, error1, error2) => {
        const dError = obj.target.parentElement.childNodes[1];
        if(dError !== undefined) {
          const value = obj.target.value;
          if(value.length <= 0) {
            dError.innerText = error1;
          } else if(value.length > max) {
            dError.style.display = 'block';
            var msg = error2;//'//StringUtil.format(error2, max, value.length - max);
            dError.innerText = msg;
          } else {
            dError.style.display = 'none';
          }
        }
    
    }
    ,hasAttribute: (obj, attr) => {
      if(obj === undefined || attr === undefined || attr === null) return false;
      return obj.hasAttribute(attr);
    }
    ,getLinkObj(e) {
      var obj = e.target;
      if(obj.tagName !== 'A') {
        if(obj.tagName === 'path') {
          obj = e.target.parentElement.parentElement;
        } else {
          obj = e.target.parentElement;
        }
        if(obj === undefined || obj === null || obj.tagName !== 'A') return e.target;
      }
      return obj;
    }
    ,getButton(e) {
      var obj = e.target;
      if(obj.tagName === 'BUTTON') return obj;
      if(obj.tagName === 'path') {
        obj = e.target.parentElement.parentElement;
      }
      if(obj.tagName === 'svg') {
        obj = e.target.parentElement;
      }
      return obj;
    }
    ,getSpan(e) {
      var obj = e.target;
      if(obj.tagName === 'SPAN') return obj;
      if(obj.tagName === 'path') {
        obj = e.target.parentElement.parentElement;
      }
      if(obj.tagName === 'svg') {
        obj = e.target.parentElement;
      }
      return obj;
    }
    ,getIdxTabSelected:(obj) => {
      var arr = null;
      if(obj.tagName === 'LABEL') {
        obj = obj.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.childNodes[0];
      }
      arr = Array.from(obj.childNodes);
      for(let i=0; i<arr.length; i++) {
        if(obj.childNodes[i] === undefined
          || obj.childNodes[i].getAttribute('aria-selected') !== 'true') continue;
        return i;
      }
    }
    ,getIdxParent:(obj) => {
      var o = obj.parentElement.parentElement.parentElement.parentElement.parentElement;
      if(o !== undefined && o.id !== undefined && o.id.startsWith('div_customize_')
        && !Number.isNaN(Number(o.id.split('_')[2]))) return o.id.split('_')[2];
      o = obj.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement;
      if(o !== undefined && o.id !== undefined && o.id.startsWith('div_customize_')
        && !Number.isNaN(Number(o.id.split('_')[2]))) return o.id.split('_')[2];
      o = obj.parentElement.parentElement.parentElement.parentElement;
      if(o !== undefined && o.id !== undefined && o.id.startsWith('div_customize_')
        && !Number.isNaN(Number(o.id.split('_')[2]))) return o.id.split('_')[2];
      o = obj.parentElement;
      if(o !== undefined && o.id !== undefined && o.id.startsWith('div_customize_')
        && !Number.isNaN(Number(o.id.split('_')[2]))) return o.id.split('_')[2];
      return null;
    }
    ,getDivParent:(obj) => {
      var o = obj.parentElement.parentElement.parentElement.parentElement.parentElement;
      if(o !== undefined && o.id !== undefined && o.id.startsWith('div_customize_')) return o;
      o = obj.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement;
      if(o !== undefined && o.id !== undefined && o.id.startsWith('div_customize_')) return o;
      return null;
    }
    ,getLanguages:() => {
      return ['ja', 'en', 'vi'];
    }
};

module.exports = object;