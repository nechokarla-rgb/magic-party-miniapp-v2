# 魔法佳派对小程序 · 第二版

区别于早期版本的独立移动端原型，面向派对布置、婚礼服务、鲜花预订、主持表演和摄影妆造业务。

> 本目录是第二版独立项目。第一版位于 `../prototype/`，两者的源码、Git 历史、端口和 GitHub 仓库不得混用。完整状态见 [项目交接与版本说明](项目交接与版本说明.md)。

第二版包含完整服务分类、套图浏览、预约记录、商家咨询管理，以及套图上传、下架、恢复和删除流程。

## 当前发布状态

第二版使用独立的公开 GitHub 仓库：https://github.com/nechokarla-rgb/magic-party-miniapp-v2-4174 。

在线预览：https://nechokarla-rgb.github.io/magic-party-miniapp-v2-4174/ 。推送到 `main` 后，GitHub Actions 会自动更新预览。

## 本地运行

```bash
npm install
npm run dev -- --host 0.0.0.0 --port 4174
```

## 构建

```bash
npm run build
```

推送到 `main` 分支后，GitHub Actions 会自动构建并发布 GitHub Pages。
