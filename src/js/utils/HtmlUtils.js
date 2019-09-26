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
};

module.exports = object;