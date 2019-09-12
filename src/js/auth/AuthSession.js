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
  if(json === undefined || json === null
    || key === undefined || key === null || key === '') return defVal;
    if(json[obj] === undefined || json[obj] === null) return defVal;
    if(key in json) return json[key];
    return defVal;
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
      ,uId:  getJsonValue(isUser, 'info', 'uId', '')
      ,uName:  getJsonValue(isUser, 'info', 'uName', '')
      ,viewHeader: getJsonValue(isUser, 'info', 'viewHeader', false)
      ,path: getJsonValue(isUser, 'info', 'path', '/')
      ,action: getJsonValue(isUser, 'info', 'action', 'customer')
      ,theme: getJsonValue(isUser, 'info', 'theme', 'journal')
      ,logo: getJsonValue(isUser, 'info', 'logo', '')
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