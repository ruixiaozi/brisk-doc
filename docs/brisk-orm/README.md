# 介绍

BriskORM 是一个基于nodejs的快速，轻量级，轻快的ORM，支持mysql。使用brisk-ioc作为IoC/DI容器。

> 需要依赖于 brisk-ioc 以及 brisk-ts-extends 对ts进行扩展

仓库地址：[https://github.com/ruixiaozi/brisk-orm](https://github.com/ruixiaozi/brisk-orm)

<a href="https://www.npmjs.com/package/brisk-orm"><img src="https://img.shields.io/npm/v/brisk-orm.svg" alt="NPM Version" /></a>

<a href="https://www.npmjs.com/package/brisk-orm"><img src="https://img.shields.io/npm/l/brisk-orm.svg" alt="Package License" /></a>

<a href="https://www.npmjs.com/package/brisk-orm"><img src="https://img.shields.io/npm/dm/brisk-orm.svg" alt="NPM Downloads" /></a>

## 快速开始

1. 安装brisk-ts-extends/brisk-ioc

    参考 [brisk-ts-extends](../brisk-ts-extend/)  
    参考 [brisk-ioc](../brisk-ioc/)

2. 安装

    ```sh
    npm i brisk-orm
    ```

3. 使用

    entity/TestPo.ts:

    ```ts
    import { Column, PrimaryKey, Table } from "brisk-orm";

    @Table('test')
    export class TestPo {
      @PrimaryKey({ dbName: 'name' })
      myName?: string;

      @Column({ dbName: 'age' })
      myAge?: number;
    }
    ```

    dao/TestDao.ts:

    ```ts
    import { BriskOrmDao, Dao } from "brisk-orm";
    import { TestPo } from "../entity/TestPo";

    @Dao(TestPo)
    export class TestDao extends BriskOrmDao<TestPo> {

    }
    ```

    service/TestService.ts:

    ```ts
    import { AutoWrite, Service } from "brisk-ioc";
    import { TestDao } from "../dao/TestDao";

    @Service()
    export class TestService {

      @AutoWrite()
      testDao?: TestDao;

      getAll() {
        return this.testDao?.list();
      }
    }
    ```

    