util = {}

//写cookies
util.setCookie = function(name, value, t) {
    var Days = t || 30;
    var exp = new Date();
    exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 1000);
    document.cookie = name + "=" + escape(value) + ";expires=" + exp.toGMTString();
}

//读取cookies
util.getCookie = function(name) {
    var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");

    if (arr = document.cookie.match(reg))

        return unescape(arr[2]);
    else
        return null;
}

/**
 * 生成 UUID v4
 *
 * @returns {String} UUID
 */
util.uuid = function() {
    var d = +new Date();
    // 使用更高精度的时间戳
    if (typeof performance !== 'undefined' && typeof performance.now === 'function') {
        d += performance.now();
    }
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = (d + Math.random() * 16) % 16 | 0;
        d = Math.floor(d / 16);
        return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
};


/**
 * 文本转指定类型的数据
 *
 *       // 转成json字符串
 *       var _json = _e._$text2type('{"a":"aaaaaaaaaaaaa"}',"json");
 *       // 原样返回
 *       var _text = _e._$text2type('<div id="abc">123</div>');
 *
 * @param  {String} arg0 - 文本内容
 * @param  {String} arg1 - 类型，如xml/json/text
 * @return {Variable}      指定类型的数据
 */
util.text2type = (function() {
    var fmap = {
        json: function(text) {
            try {
                return JSON.parse(text);
            } catch (ex) {
                return null;
            }
        },
        dft: function(text) {
            return text;
        }
    };
    return function(text, type) {
        type = (type || '').toLowerCase();
        return (fmap[type] || _fmap.dft)(text || '');
    };
})();


/**
 * 对象转化城url参数
 *
 * @param  {String} arg0 - js对象
 * @return {String}   query
 */
util.urlencode = function(data) {
    var _result = [];
    for (var key in data) {
        var value = data[key];
        if (Array.isArray(value)) {
            value.forEach(function(_value) {
                _result.push(key + "=" + _value);
            });
        } else {
            _result.push(key + '=' + value);
        }
    }

    return _result.join('&');
}
