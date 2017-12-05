
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
Logger.logserver = function (data) {

};
