# 介绍

brisk-ioc 一款使用 typescript 实现的依赖注入（DI/IOC）容器库，可以通过 `装饰器` 或者 `函数` 方式实现实例的获取。支持 `原型` 和 `单例` 两种模式。

> 需要依赖于 brisk-ts-extends 对ts进行扩展

仓库地址：[https://github.com/ruixiaozi/brisk-ioc](https://github.com/ruixiaozi/brisk-ioc)

<a href="https://www.npmjs.com/package/brisk-ioc"><img src="https://img.shields.io/npm/v/brisk-ioc.svg" alt="NPM Version" /></a>

<a href="https://www.npmjs.com/package/brisk-ioc"><img src="https://img.shields.io/npm/l/brisk-ioc.svg" alt="Package License" /></a>

<a href="https://www.npmjs.com/package/brisk-ioc"><img src="https://img.shields.io/npm/dm/brisk-ioc.svg" alt="NPM Downloads" /></a>

## 快速开始

1. 安装brisk-ts-extends

    参考 [brisk-ts-extends](../brisk-ts-extend/)

2. 安装

    ```sh
    npm i brisk-ioc
    ```

2. 使用

    bean/Test.ts:

    ```ts
    import { Bean } from "brisk-ioc";

    @Bean()
    export class Test {

      show(){
        console.log("test show123");
      }
    }
    ```

    service/T2.ts:

    ```ts
    import { AutoWrite, OnBeforeScan, Service } from "brisk-ioc";
    import { Test } from "../bean/Test";

    @Service()
    export class T2 {

      @AutoWrite()
      t1?: Test;

      @OnBeforeScan({
        priority: 1
      })
      static before() {
        console.log('before');
      }
    }
    ```

    index.ts:

    ```ts
    import BriskIoC from 'brisk-ioc';
    import path from 'path';
    import { T2 } from './service/T2';

    (async function() {
      BriskIoC.configure({
        beanPathes: [path.join(__dirname, './bean'), path.join(__dirname, './service')]
      });
      BriskIoC.onBeforeScan(() => {
        console.log(123);
      })
      await BriskIoC.scanBean();

      BriskIoC.getBean(T2)?.t1?.show();
      /* 
      before
      123
      test show123
      */
    })();
    ```
    