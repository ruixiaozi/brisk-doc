# 介绍

brisk-log 一款基于 winston 使用 typescript 实现的 nodejs 日志库，可以通过 `装饰器` 或者 `函数` 方式获得日志实例，实现对日志等级输出的控制等。


仓库地址：[https://github.com/ruixiaozi/brisk-log](https://github.com/ruixiaozi/brisk-log)

<a href="https://www.npmjs.com/package/brisk-log"><img src="https://img.shields.io/npm/v/brisk-log.svg" alt="NPM Version" /></a>

<a href="https://www.npmjs.com/package/brisk-log"><img src="https://img.shields.io/npm/l/brisk-log.svg" alt="Package License" /></a>

<a href="https://www.npmjs.com/package/brisk-log"><img src="https://img.shields.io/npm/dm/brisk-log.svg" alt="NPM Downloads" /></a>

## 快速开始

1. 安装

    ```sh
    npm i brisk-log
    ```

2. 装饰器方式

    ```ts
    import { Log, Logger } from 'brisk-log';

    class Test1 {
      @Log()
      logger!: Logger;
    }

    const test1 = new Test1();
    test1.logger.debug('test debug'); // [debug]: 2022-12-03 16:44:16 [global]    test debug
    ```

3. 函数方式

    ```ts
    import { getLogger } from 'brisk-log';

    const logger = getLogger();
    logger.debug('test debug'); // [debug]: 2022-12-03 16:44:16 [global]    test debug
    ```
