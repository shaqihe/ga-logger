//打点配置，项目使用时可以读取配置文件
var logConfig = {
    product: '2c_admin',
    cookie: 'STUDY_UUID',
    csrf_cookie: 'edu-script-token', //防止攻击
    url: 'http://log.study.163.com/__utm.gif'
}
/**
 * 通用埋点采集器， 结构中埋点信息配置为
 *
 * ```html
 *  <div data-log-id="a" data-log-data='{"a":098}'>
 *      <div data-log-id="b" data-log-data='{"b":678}'>
 *          <div>
 *              <input type="button" value="添加" data-log-act="d" data-log-data='{"d":234}'/>
 *          </div>
 *      </div>
 *  </div>
 * ```
 *
 * 当按钮点击后会生成一条打点记录，打点标识为 a_b_d_click，对应的记录数据信息为 {"a":098,"b":678,"d":234}
 *
 *
 * @param   {Object} options - 构造参数
 */

var Logger = {};

/**
 * 记录打点信息
 *
 * @param   {Object} data - 统计数据信息
 * @param   {String} data.actionId - 操作标识
 * @param   {String} data.bizData  - 操作相关数据，如果不是字符串则自动用JSON序列化
 * @returns {void}
 */
Logger.logserver = function(data) {

    var conf = logConfig; // 也可读取配置文件
    util.setCookie(conf.cookie, {
        value: util.uuid(),
        path: '/'
    });
    // merge request url
    var url = conf.url;

    url += url.indexOf('?') < 0 ? '?' : '&';

    var query = {
        p: conf.product,
        dt: data.bizData || {},
        csrfKey: util.getCookie(conf.csrf_cookie)
    };

    query.dt.action = data.actionId;
    var value = JSON.stringify(query.dt);
    console.log(value);

    query.dt = encodeURI(value);

    url += util.urlencode(query);
    // send request
    var img = new Image();
    img.src = url;
};


/**
 * 解析埋点信息，比如如下结构，利用事件委托
 *
 * @param   {Element} node - DOM树节点
 * @returns {Object} 打点信息，e.g. {id:['a','b'],action:'d',data:{"a":098,"b":678,"d":234}}
 */
Logger.parseLog = function(node) {
    var act = '',
        ret = [],
        dat = {};

    // find log action
    var findAct = function(node) {
        act = node.getAttribute('data-log-act');
        if (!!act) {
            mergeData(node);
        }
    };
    // find log path
    var findPath = function(node) {
        var id = node.getAttribute('data-log-id');
        if (!!id) {
            ret.unshift(id);
            mergeData(node);
        }
    };
    // merge log data
    var mergeData = function(node) {
        var str = node.getAttribute('data-log-data');
        if (!!str) {
            var data = util.text2type(str, 'json');
            if (!!data) {
                dat = Object.assign(data, dat);
            }
        }
    };

    // 转化日志数据信息，利用事件委托
    while (node) {
        if (!act) {
            findAct(node);
        } else {
            findPath(node);
        }
        if (node.parentNode == document) {
            node = null;
        }else {
            node = node.parentNode;
        }
    }
    // act 代表有触发行为，则返回数据
    if (!!act) {
        return {
            id: ret,
            data: dat,
            action: act
        };
    }
};


/**
 * 解析日志信息
 *
 * @param  {String} type - 日志类型
 * @param  {Object} data - 通过 parseLog 接口获取的日志信息
 * @return {Object} 日志结果,{actionId:'a_b_d_click',bizData:'{"a":098,"b":678,"d":234}'}
 */
Logger.formatLog = function(type, data) {
    var ret = data.id || [];
    ret.push(data.action, type);
    return {
        bizData: data.data,
        actionId: ret.join('_')
    };
};

/**
 * 打点日志代理事件
 *
 * @method  module:pool/cache-base/src/logger#delegate
 * @param   {Element} node - 代理节点
 * @param   {String}  type - 事件类型名称
 * @returns {void}
 */
Logger.delegate = function (node, type) {
    node.addEventListener(type, function (event) {
        var node = event.target;
        this.log(node, type);
    }.bind(this),0);
};

/**
 * 手动打点接口
 *
 * @param   {Element} node   - 代理节点
 * @param   {String}  type   - 事件类型名称
 * @param   {String}  status - 路径状态
 * @returns {void}
 */
Logger.log = function (node, type, status) {
    var ret = this.parseLog(node);
    if (!ret){
        return;
    }
    if (!!status){
        ret.action += '_'+status;
    }
    // parse log information
    ret = this.formatLog(
        type||'click', ret
    );
    if (!ret){
        return;
    }
    // log to server
    this.logserver(ret);
};
