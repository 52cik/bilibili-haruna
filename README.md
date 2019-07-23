# bilibili-haruna

> B站看板娘集合 (live2d)

## 介绍

心血来潮从B站扒下来的看板娘（22娘，33娘），目前有10多套服装，其实核心 model 就2个。

基于 live2d-widget 插件实现，项目地址: <https://github.com/xiazeyu/live2d-widget.js>

**本例子中的 live2d-widget 修改过，如果要随机换装功能，推荐用本例子中的代码，或者坐等原作者更新**

> PS: urls.txt 文件就是从B站直播间的 model 里找的资源，如果你发现新的资源，请 pr 或联系我更新。

## 更新

> 2018-11-22 更新 bls 冬装  
> 2018-08-31 更新 bls 夏装  

> 2018-03-31 更新  
> 写了 [fetch.js](fetch.js) 脚本爬取了 <https://live.bilibili.com/> 100页分页，最终得到的目前最新集合。


## hexo 中使用

1. 在你的 hexo 博客的 source 目录下创建 live2d_models 目录
2. 将本仓库中的 assets/haruna 复制到刚才创建的 live2d_models 目录中  
   然后完整路径就是这样的 source/live2d_models/haruna
3. 安装 hexo-helper-live2d 模块
4. 在 _config.yml 中配置 live2d

```yml
live2d:
  enable: true
  scriptFrom: local
  pluginRootPath: live2dw/
  pluginJsPath: lib/
  pluginModelPath: assets/
  tagMode: false
  debug: false
  model:
    use: ./live2d_models/haruna/22/model.2017.tomo-bukatsu.low.json
  display:
    position: right
    width: 150
    height: 300
  mobile:
    show: true
  react:
    opacity: 0.7
```

这个配置是插件文档那复制黏贴过来的，我没改其他的，只改了其中的 model use 这个字段。  
其中的 ./live2d_models/haruna/22/model.2017.tomo-bukatsu.low.json 就是你想要的模型完整路径。

需要想要哪个模型，自己换地址就好了。
