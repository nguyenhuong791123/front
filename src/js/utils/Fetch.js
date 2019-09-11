function postData(url, options, token) {
    const headers = {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    }

    if (token !== undefined && token !== null) {
        headers['Authorization'] = 'Bearer ' + token
    }

    // 既定のオプションには * が付いています
    return fetch(url, {
        method: "POST"
        ,mode: "cors"
        ,cache: "no-cache"
        ,credentials: "same-origin"
        ,headers: headers
        ,redirect: "follow"
        ,referrer: "no-referrer"
        ,body: JSON.stringify(options)
    }).then(status
    ).then(res => {
        if (res.ok) {
          return res.json(); 
        }
    }).then(json => {
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

module.exports.postData = postData;
module.exports.status = status;