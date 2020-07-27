const doLogin = (isUser, token) => {
    const response = {
      token: token,
      data: isUserInit(isUser)
    };
    return new Promise(resolve => setTimeout(resolve(response), 1000));
};
  
const doLogout = () => {
    return new Promise(resolve => setTimeout(resolve, 1000));
};

const getJsonValue = function(json, obj, key, defVal) {
  if(isEmpty(json) || !inJson(json, obj)) return defVal;
  if(inJson(json[obj], key)) return json[obj][key];
  return defVal;
}

function isEmpty(val) {
  if(val === undefined || val === null || val === 'null' || val === 'NULL' || val === '') return true;
  return false;
}

function inJson(json, key) {
  if(isEmpty(json) || isEmpty(key)) return '';
  if(key in json) return true;
  return false;
}

const isUserInit = (isUser) => {
  var reUser = {
    info: {
      device: getJsonValue(isUser, 'info', 'device', 'pc')
      ,language: getJsonValue(isUser, 'info', 'language', 'ja')
      ,menu: getJsonValue(isUser, 'info', 'menu', 0)
      ,uLid: getJsonValue(isUser, 'info', 'uLid', '')
      ,cId:  getJsonValue(isUser, 'info', 'cId', '')
      ,gId:  getJsonValue(isUser, 'info', 'gId', '')
      ,uId:  getJsonValue(isUser, 'info', 'uId', 1)
      ,uName:  getJsonValue(isUser, 'info', 'uName', 'systemdemo')
      ,viewHeader: getJsonValue(isUser, 'info', 'viewHeader', false)
      ,path: getJsonValue(isUser, 'info', 'path', '/')
      ,action: getJsonValue(isUser, 'info', 'action', 'customer')
      ,theme: getJsonValue(isUser, 'info', 'theme', 'journal')
      // ,logo: getJsonValue(isUser, 'info', 'logo', '')
    }
    ,options: {
      customize: getJsonValue(isUser, 'options', 'customize', false)
      ,mail: getJsonValue(isUser, 'options', 'mail', true)
      ,chat: getJsonValue(isUser, 'options', 'chat', true)
      ,dailer: getJsonValue(isUser, 'options', 'dailer', true)
    }
  }
  return reUser;  
}

module.exports.getJsonValue = getJsonValue;
module.exports.isUserInit = isUserInit;
module.exports.doLogin = doLogin;
module.exports.doLogout = doLogout;