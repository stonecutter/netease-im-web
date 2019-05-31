var uid = getUrlParam('uid')
var im_token = getUrlParam('im_token')
var app_key = getUrlParam('app_key')

if (!uid || !im_token || !app_key) {
  alert('请在 url 中传入参数：app_key,uid,im_token')
}

setCookie('uid', uid);
setCookie('sdktoken', im_token);

(function() {
  // 配置
  var envir = 'online';
  var configMap = {
    dev: {
      appkey: 'fe416640c8e8a72734219e1847ad2547',
      url: 'https://apptest.netease.im',
      chatroomList: 'https://apptest.netease.im/api/chatroom/homeList',
      chatroomAddr: 'https://apptest.netease.im/api/chatroom/requestAddress'
    },
    test: {
      appkey: 'fe416640c8e8a72734219e1847ad2547',
      url: 'https://apptest.netease.im',
      chatroomList: 'https://apptest.netease.im/api/chatroom/homeList',
      chatroomAddr: 'https://apptest.netease.im/api/chatroom/requestAddress'
    },
    pre: {
      appkey: '45c6af3c98409b18a84451215d0bdd6e',
      url: 'https://apptest.netease.im',
      chatroomList: 'https://apptest.netease.im/api/chatroom/homeList',
      chatroomAddr: 'https://apptest.netease.im/api/chatroom/requestAddress'
    },
    // online: {
    //   appkey: '45c6af3c98409b18a84451215d0bdd6e',
    //   url: 'https://app.netease.im',
    //   chatroomList: 'https://app.netease.im/api/chatroom/homeList',
    //   chatroomAddr: 'https://app.netease.im/api/chatroom/requestAddress'
    // },
    online: {
      appkey: app_key,
      url: 'https://app.netease.im',
      chatroomList: 'https://app.netease.im/api/chatroom/homeList',
      chatroomAddr: 'https://app.netease.im/api/chatroom/requestAddress'
    }
  };
  window.CONFIG = configMap[envir];
  // 是否开启订阅服务
  window.CONFIG.openSubscription = true;
  // 获取私有化环境开关及相应配置
  var privateConfUrl = localStorage && localStorage.getItem('privateConfUrl')
  if (localStorage.getItem('env') === 'private') {
    if (privateConfUrl) {
      window.CONFIG.usePrivateEnv = 1; // undefined 不请求私有化环境 1 使用私有化环境，还未发起请求 2 使用私有化环境已经完成请求
      var xmlHttp
      try {
        xmlHttp = new XMLHttpRequest();
      } catch (e) {
        console.error(e);
        try {
          xmlHttp = new ActiveXObject('Msxml2.XMLHTTP')
        } catch (e) {
          console.error(e);
          try {
            xmlHttp = new ActiveXObject('Microsoft.XMLHTTP')
          } catch (e) {
            console.error(e);
            window.CONFIG.usePrivateEnv = 2;
            console.error('私有化环境配置获取失败');
          }
        }
      }
      xmlHttp.open('get', privateConfUrl, true);
      xmlHttp.onreadystatechange = function () {
        if (xmlHttp.readyState === 4) {
          if (xmlHttp.status === 200) {
            var data
            if (typeof xmlHttp.responseText === 'string') {
              try {
                data = JSON.parse(xmlHttp.responseText);
              } catch (e) {
                console.error('私有化环境配置解析失败');
              }
            }
            if (typeof data === 'object') {
              var webKey = {
                'weblbsUrl': 'lbs_web',
                'nos_downloader': 'nos_downloader',
                'https_enabled': 'https_enabled',
                'nos_accelerate': 'nos_accelerate',
                'nos_accelerate_host': 'nos_accelerate_host',
                'nt_server': 'nt_server',
                'nosAccess': 'nos_uploader_web', // 确认
                'websdkSsl': 'link_ssl_web' // 确认
              }
              var confData = {}
              for (var key in webKey) {
                if (webKey.hasOwnProperty(key)) {
                  confData[webKey[key]] = data[key] || false
                }
              }
              window.CONFIG.privateConf = confData;
              window.CONFIG.appkey = data['appkey']
              window.CONFIG.chatroomList = data['chatroomDemoListUrl']
              window.CONFIG.chatroomAddr = data['webchatroomAddr']
            } else {
              window.CONFIG.privateConf = window.privateConf;
            }
          } else {
            console.error('请求私有化环境配置失败');
            if (window.privateConf) {
              alert('当前使用私有化环境，请求私有化环境配置失败，已读取私有化配置文件')
              window.CONFIG.privateConf = window.privateConf;
            } else {
              alert('私有化环境配置失败，请检查配置URL或配置文件')
            }
          }
        }
      }
      xmlHttp.send();
    } else {
      if (window.privateConf) {
        alert('当前使用私有化环境，已读取私有化配置文件')
        window.CONFIG.privateConf = window.privateConf;
      } else {
        alert('私有化环境配置失败，请检查配置URL或配置文件')
      }
    }
  }
})()
