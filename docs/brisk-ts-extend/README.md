# 介绍

brisk-ts-extend 是对typescript的扩展，主要用于提供运行时类型检查、装饰器工厂等功能。

> 需要依赖于 ttypescript 进行编译转换

仓库地址：[https://github.com/ruixiaozi/brisk-ts-extends](https://github.com/ruixiaozi/brisk-ts-extends)

<a href="https://www.npmjs.com/package/brisk-ts-extends"><img src="https://img.shields.io/npm/v/brisk-ts-extends.svg" alt="NPM Version" /></a>

<a href="https://www.npmjs.com/package/brisk-ts-extends"><img src="https://img.shields.io/npm/l/brisk-ts-extends.svg" alt="Package License" /></a>

<a href="https://www.npmjs.com/package/brisk-ts-extends"><img src="https://img.shields.io/npm/dm/brisk-ts-extends.svg" alt="NPM Downloads" /></a>

## 快速开始

1. 安装

```sh
npm i ttypescript -D
npm i brisk-ts-extend
```
> 注意：typescript 4.9.3 版本与ttypescript不兼容，存在bug [issue#51542](https://github.com/microsoft/TypeScript/issues/51542)。可自定义降级到4.8.x版本

2. 配置

在 `tsconfig.json` 中配置：
```json
{
  "compilerOptions": {
    "plugins": [
      {
        "transform": "brisk-ts-extends/transformer"
      }
    ]
  }
}
```

[可选]，在 `package.json` 中配置：

```json
{
  "scripts": {
    "start": "ts-node --compiler ttypescript src/index.ts",
    "build": "ttsc",
  }
}
```
> 需要使用 `ttypescript` 来进行编译，编译的命令为 `ttsc`，如果使用 `ts-node` 运行，需要指定编译器为 `ttypescript`  
> 更多配置参考 [ttypescript GitHub](https://github.com/cevek/ttypescript)