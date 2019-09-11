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
      console.log(obj);
      return obj.hasAttribute(attr);
    }
};

module.exports = object;