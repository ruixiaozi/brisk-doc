# 介绍

eslint-config-brisk 是eslint的一个共享配置，这些规则目前适用用于brisk系列的所有项目中。

> 需要依赖于 eslint

仓库地址：[https://github.com/ruixiaozi/eslint-config-brisk](https://github.com/ruixiaozi/eslint-config-brisk)

<a href="https://www.npmjs.com/package/eslint-config-brisk"><img src="https://img.shields.io/npm/v/eslint-config-brisk.svg" alt="NPM Version" /></a>

<a href="https://www.npmjs.com/package/eslint-config-brisk"><img src="https://img.shields.io/npm/l/eslint-config-brisk.svg" alt="Package License" /></a>

<a href="https://www.npmjs.com/package/eslint-config-brisk"><img src="https://img.shields.io/npm/dm/eslint-config-brisk.svg" alt="NPM Downloads" /></a>

## 快速开始

1. 安装

```sh
npm i eslint eslint-config-brisk -D
// typescript项目
npm i @typescript-eslint/eslint-plugin @typescript-eslint/parser -D
```

2. 配置

在项目根目录添加文件： `.eslintrc.js` 

```javascript
module.exports = {
  'env': {
    'es2021': true,
    'node': true,
  },
  'parserOptions': {
    'ecmaVersion': 'latest',
    'sourceType': 'module',
  },
  'overrides': [
    // typescript项目
    {
      // files匹配ts文件
      'files': ['*.ts'],
      'parser': '@typescript-eslint/parser',
      'plugins': ['@typescript-eslint'],
      'extends': ['eslint-config-brisk/tslint'],
    },
    {
      // files匹配js文件
      'files': ['*.js'],
      'extends': ['eslint-config-brisk/jslint'],
    },
  ],
};
```
