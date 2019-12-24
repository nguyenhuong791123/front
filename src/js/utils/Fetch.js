function FetchLogin(uLid, pw, uri, redirect_uris, callback) {
    const method = "POST";
    var body = JSON.stringify({ username: uLid, password: pw, redirect_uris: redirect_uris });
    let client = FetchAPI(uri + "/authorize", method, true, body)
    client.then(function(data) {
      body = "client_id=" + data.client_id + "&client_secret=" + data.client_secret + "&grant_type=" + data.grant_type + "&code=" + data.code
      let token = FetchAPI(uri + "/token", method, false, body)
      token.then((data) => {
        callback(data)
      }).catch(function(error) {
        console.log("Request _onLogin FetchAPI", error)
      })
    }).catch(function(error) {
      console.log("Request _onLogin FetchLogin", error)
    });
}

function FetchAPI(url, method, type, body, token, basicId, basicPw) {
    var headers = { "Accept": "application/json" };
    if(type) {
        headers["Content-Type"] = "application/json"
    } else {
        headers["Content-Type"] = "application/x-www-form-urlencoded"
    }

    if (token !== undefined && token !== null) {
        headers['Authorization'] = 'Bearer ' + token
    }

    if(basicId !== undefined && basicPw !== null) {
        headers["Authorization"] = "Basic " + btoa(basicId + ":" + basicPw)
    }

    // 既定のオプションには * が付いています
    return fetch(url, {
        method: method
        // ,mode: "cors"
        // ,cache: "no-cache"
        // ,credentials: "same-origin"
        ,headers: headers
        // ,redirect: "follow"
        // ,referrer: "no-referrer"
        ,body: body
    }).then(
        status
    ).then(function(response) {
        return response.json(); 
    }).then(function(json) {
        return json;
    });
}

var status = function status(response) {
    // raises an error in case response status is not a success
    if (response.status >= 200 && response.status < 300) { // Success status lies between 200 to 300
        return response
    } else {
        var error = new Error(response.statusText)
        error.response = response
        throw error
    }
}

module.exports.FetchLogin = FetchLogin;
module.exports.FetchAPI = FetchAPI;
module.exports.status = status;