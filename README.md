# 课题组GPU任务监控面板(GPU看板)

用于GPU查看GPU的任务情况，包括GPU的使用情况，任务的状态，任务的进度等。

前后端分离，前端使用Vue3 + Element Plus + Pinia，后端使用Python + Flask。

Author: [Haomin Kong](http://github.com/a645162)

## 使用方法

1. 配置环境

2. 编写服务器配置

仿照`src/assets/machineList.json`文件，
创建`src/assets/machineListTemplate.json`文件与
`src/assets/machineListTest.json`文件。

3. 编译

## 环境要求

* Node.js >= 21.0.0(Ubuntu 22.04的Node.js不可以)

- Node.js 21
- Vite
- Vue3
- Element-Plus
- Pinia

## 环境准备

* 安装 [Node.js](https://nodejs.org/en/download)

* 如:使用HomeBrew安装Node.js
```bash
curl -o- https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh | bash
brew install node@21
```

* 安装依赖
```bash
npm install
```

## npm换源

列出所有可以使用的源

```bash
npm install nrm -g
nrm ls
```

使用淘宝源

```bash
nrm use taobao
```

## 开发

```bash
npm run dev
```

## 构建

```bash
npm run build
```

Or

```bash
bash build.sh
```

## 系列项目

### GPU看板

https://github.com/a645162/web-gpu-dashboard

### GPU监控脚本

https://github.com/a645162/nvi-notify

### 测试数据后端

https://github.com/a645162/backend-gpu-dashboard-test
