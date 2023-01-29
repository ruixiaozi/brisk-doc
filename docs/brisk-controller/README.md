# 介绍

BriskController 一个基于Koa的快速、轻量级、轻快的Controller，可以在nodejs中工作。它参考了SpringMVC框架的装饰器，并改变了javascript中的一些用法。使用brisk-ioc作为 IoC/DI 容器。

> 需要依赖于 brisk-ioc 以及 brisk-ts-extends 对ts进行扩展

仓库地址：[https://github.com/ruixiaozi/brisk-controller](https://github.com/ruixiaozi/brisk-controller)

<a href="https://www.npmjs.com/package/brisk-controller"><img src="https://img.shields.io/npm/v/brisk-controller.svg" alt="NPM Version" /></a>

<a href="https://www.npmjs.com/package/brisk-controller"><img src="https://img.shields.io/npm/l/brisk-controller.svg" alt="Package License" /></a>

<a href="https://www.npmjs.com/package/brisk-controller"><img src="https://img.shields.io/npm/dm/brisk-controller.svg" alt="NPM Downloads" /></a>

## 快速开始

1. 安装brisk-ts-extends/brisk-ioc

    参考 [brisk-ts-extends](../brisk-ts-extend/)  
    参考 [brisk-ioc](../brisk-ioc/)

2. 安装

    ```sh
    npm i brisk-controller
    ```

3. 使用

    controller/TestController.ts:

    ```ts
	import { Controller, InCookie, InHeader, InPath, InQuery, RequestMapping } from 'brisk-controller';
	
	@Controller()
	class TestController {
	
	  test1Data = 'test1';
	
	  @RequestMapping('/test1/:c/:d')
	  test1(
	    @InQuery() a: number,
	    @InHeader({name: 'b'}) testb: string,
	    @InPath({description: 'c param'}) c: string,
	    @InPath() d: number,
	    @InCookie() e?: boolean,
	  ) {
	    console.log(a);
	    console.log(testb);
	    console.log(c);
	    console.log(d);
	    console.log(e);
	    return {
	      msg: this.test1Data
	    }
	  }
	}
    ```

    index.ts:

    ```ts
    import BriskIoC from 'brisk-ioc';
	import BriskController from 'brisk-controller';
	import path from 'path';
	
	(async function() {;
	  BriskIoC.configure({
	    beanPathes: [path.join(__dirname, './controller')]
	  });
	  await BriskIoC.scanBean();
	  const app = await BriskController.start(3000, {
	    swagger: true,
	  });
	})();
    ```
