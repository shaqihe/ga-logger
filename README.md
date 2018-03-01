# ga-logger

在一个通用模块中打点，做到不同使用者发出的打点数据差异化

####**dome在线预览：[dome在线预览][1]**
demo:
    git clone

    Open ./demo.html in a browser

    Then press F12 and you will find some Network info.


 - ga打点，灵活配置
 - 在一个通用模块（组件）埋的点，通用模块（组件）在不同的业务线中应该有区分


解决打点的“灵活配置”和“使用场合产生不同命名空间” 简单的写一个logger解决方案。

```
<div data-log-id="a">
        <ul data-log-id="b" data-log-data='{"user":"testName"}'>
            <li   data-log-data='{"age":"1111"}' data-log-act="publish">点击此处</li>
        </ul>
</div>

//发送的数据为：
{
    "user":"testName",
    "age":"1111",
    "action":"a_b_publish_click"
}
```

  [1]: http://happy.g1024.top/ga-logger/demo.html

