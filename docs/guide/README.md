# 快速开始


## 环境要求

+ node > 16.0.0

## 创建项目

通过 `brisk-cli` 脚手架搭建项目：

```shell
npm install -g brisk-cli

// 其中app1 为项目名称
brisk create app1
```

## 运行项目

进入项目根目录，运行命令：

```shell
npm run start
```

## 打包部署

进入项目根目录，运行命令：

```shell
npm run build
```

运行成功后，将在项目目录下产出 `dist` 文件夹，将 `dist` 文件夹上传到服务器，运行 `npm run start` 即可。