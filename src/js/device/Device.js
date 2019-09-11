import MobileDetect from 'mobile-detect';

let device = 'pc';
let language = 'ja'
const getUA = function() {
  var Device;
  if (typeof window !== 'undefined') {
    Device = new MobileDetect(window.navigator.userAgent);
    //console.log(window.navigator)
    //console.log(Device)
    if(Device.ua === undefined || Device.ua === null) {
      device = null;
    } else {
        if(window.navigator.language != null) language = window.navigator.language
    }
    if(Device.ua.indexOf('iPad') > -1) {
      device = 'ipad';
    }
    if(Device.ua.indexOf('iPhone') > -1) {
      device = 'ios';
    }
    if(Device.ua.indexOf('Android') > -1) {
      device = 'android';
    }
  }
  return { 'device': device, 'language': language};
}

export default getUA;