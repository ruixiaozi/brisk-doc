# 装饰器

通过 `BriskIoC.scanBean` 方法扫描指定路径（见[IoC配置](../brisk-ioc/configuration.html)）下的所有文件，被相关装饰器装饰的类将被容器自动收集管理。

## 基础装饰器

基础装饰器为方法装饰器，用于将一个方法与一个特定的数据库语句进行映射。可通过基础装饰器为特定类创建自定义数据库操作的映射方法。

### 1. Select、Result与Raw

方法装饰器，用于给方法注入一个select操作，装饰器签名：

```ts
/**
 * Select查询装饰器
 * @param sql sql语句
 * @param id 当前select的id
 * @returns
 */
function Select(sql: string, id?: string): Function;
/**
 * 结果装饰器
 * @param Target 结果类
 * @param option 结果选项
 * @returns
 */
function Result(Target: Class, option?: BriskOrmResultOption): Function;
/**
 * Raw参数 装饰器
 * 被该装饰器装饰的参数，加入getSelect的sqlArgs参数中
 * @returns
 */
export function Raw(): Function
```

> 选项结构参考 [API#getSelect](./api)。


案例：查询所有数据

```ts
class Info {
  myName?: string;
  myValue?: number;
}
class Test {
  @Select('select * from test')
  @Result(Info, { isList: true, mapping: { myName: 'name', myValue: 'value' } })
  findList(minValue: number): Promise<Info[] | undefined> { 
    throw new Error('no inject select');
  }
}
const res = await new Test().findList(0);
```

### 2. Insert

方法装饰器，用于给方法注入一个Insert操作，装饰器签名：

```ts
/**
 * Insert装饰器
 * @param sql sql语句
 * @param propertis 插入对象字段列表，需要按顺序
 * @returns
 */
function Insert(sql: string, propertis: string[]): Function;
```

案例：插入一条数据

```ts
class Info {
  name?: string;
  age?: number;
}
class Test {
  @Insert('insert into test (name, age) values ?', ['name', 'age'])
  insertInfo(info: Info): Promise<BriskOrmOperationResult>{ 
    throw new Error('no inject insert');
  }

}
const res = await new Test().insertInfo({name: '5', age: 123});
```

### 3. Update

方法装饰器，用于给方法注入一个Update操作，装饰器签名：

```ts
/**
 * Update装饰器
 * @param sql sql语句
 * @param propertis 修改对象的字段列表，需要按set顺序填写
 * @returns update方法
 */
function Update(sql: string, propertis: string[]): Function;
```


案例：更新一条数据

```ts
class Info {
  name?: string;
  age?: number;
}
class Test {
  @Update('update test set age = ? where name = ?', ['age', 'name'])
  updateInfo(info: Info): Promise<BriskOrmOperationResult> { 
    throw new Error('no inject update'); 
  }

}
const res = await new Test().updateInfo({name: '4', age: 444});
```

### 4. Delete

方法装饰器，用于给方法注入一个Delete操作，装饰器签名：

```ts
/**
 * Delete装饰器
 * @param sql sql语句
 * @returns delete方法
 */
function Delete(sql: string): Function
```


案例：删除一条数据

```ts
class Info {
  name?: string;
  age?: number;
}
class Test {
  @Delete('delete from test where name = ?')
  deleteInfo(name: string): Promise<BriskOrmOperationResult> { 
    throw new Error('no inject delete'); 
  }

}
const res = await new Test().deleteInfo('4');
```

### 5. Transaction

方法装饰器，用于将一个方法进行自动事务管理，默认给方法最后一个参数传入ctx上下文对象。如果在调用此方法时，手动传入了其他ctx，则不出触发自动事务，装饰器签名：

```ts
/**
 * Transaction装饰器
 * 被Transaction装饰器修饰的方法，成为自动事务方法
 * 该方法最后一个参数为ctx，默认会被自动注入BriskOrmContext实例
 * 如果调用时手动传入ctx，则不会触发自动事务
 */
export function Transaction(): Function;
```

案例：自动事务

```ts
@Table('test')
class Test9Entity {
  @PrimaryKey({ dbName: 'name' })
  myName?: string;

  @Column({ dbName: 'age' })
  myAge?: number;
}

@Dao(Test9Entity)
class TestDao3 extends BriskOrmDao<Test9Entity> {
}
class TestService9 {

  @Transaction()
  async test(ctx?: BriskOrmContext) {
	const res1 = await new TestDao3().updateByPrimaryKey({
	  myName: '123',
	  myAge: 12
	}, ctx)
	const res2 = await new TestDao3().deleteByPrimaryKey('mynam', ctx);
  }
}
```

### 6. BeforeOrmConn

方法装饰器，添加数据库连接前钩子，装饰器签名：

```ts
/**
 * 数据库连接前
 * @param priority 优先级，默认10
 * @returns
 */
export function BeforeOrmConn(priority: number = 10): Function;
```

### 7. AfterOrmConn

方法装饰器，添加数据库连接后置钩子，装饰器签名：

```ts
/**
 * 数据库连接后
 * @param priority 优先级，默认10
 * @returns
 */
export function AfterOrmConn(priority: number = 10): Function;
```





## 操作装饰器

操作装饰器将自动创建基础的数据表操作映射，包括表结构映射、基础的增删改查操作映射。

### 1. Table

类装饰器，用于将一个类声明为数据表的一个映射类，装饰器签名：

```ts
/**
 * 数据表装饰器
 * @param dbTableName 表名
 * @param options 选项
 * @returns
 */
function Table(dbTableName: string, options?: BriskOrmTableOption): Function

export interface BriskOrmTableOption {
  charset?: string;
  collate?: string;
  engine?: 'InnoDB';
  // 是否开启软删除，软删除的删除将变成更新、更新查找只找未删除的
  softDelete?: boolean;
}
```


案例：声明一个数据表类

```ts
@Table('test')
class Info {
  
}
```

### 2. PrimaryKey

属性装饰器，用于将一个类属性声明为一个数据表的主键（当前类需要使用Table装饰器声明），装饰器签名：

```ts
/**
 * 数据表的主键装饰器
 * @param options 选项
 * @returns
 */
function PrimaryKey(options?: BriskOrmPrimaryKeyOption): Function

export enum BRISK_ORM_TYPE_E {
  INT='int',
  DOUBLE='double',
  FLOAT='float',
  VARCHAR='varchar',
  TEXT='text',
  JSON='json',
  DATETIME='datetime',
  DATE='date',
  TIME='time',
  TINYINT='tinyint',
  // 0.0.4 加入
  GEOMETRY='geometry'
}

export interface BriskOrmPrimaryKeyOption {
  dbName?: string;
  type?: BRISK_ORM_TYPE_E;
  length?: number;
  precision?: number;
  autoIncrement?: boolean;
  default?: any;
}
```


案例：声明一个主键

```ts
@Table('test')
class Info {
  @PrimaryKey({ dbName: 'name' })
  myName?: string;
}
```


### 3. ForeignKey

属性装饰器，用于将一个类属性声明为一个数据表的外键（当前类需要使用Table装饰器声明），装饰器签名：

```ts
/**
 * 数据表的外键装饰器
 * @param Target 引用类（需要被Table修饰）
 * @param targetPropertyName 目标类属性名称
 * @param options 选项
 * @returns 
 */
function ForeignKey<T>(Target: Class<T>, targetPropertyName: keyof T, options?: BriskOrmForeignKeyOption): Function

export interface BriskOrmForeignKeyOption {
  dbName?: string;
  type?: BRISK_ORM_TYPE_E;
  length?: number;
  precision?: number;
  autoIncrement?: boolean;
  default?: any;
  // 所属key名称
  uniqueKey?: string;
  // 默认为CASCADE
  action?: BRISK_ORM_FOREIGN_ACTION_E;
}

export enum BRISK_ORM_FOREIGN_ACTION_E {
  // 默认，级联动作
  CASCADE='CASCADE',
  // 设置为空
  SET_NULL='SET NULL',
  // 无动作
  NO_ACTION='NO ACTION'
}
```


案例：声明一个外键

```ts
@Table('test')
class Info {
  @PrimaryKey({ dbName: 'name' })
  myName?: string;
}

@Table('test2')
class Info2 {
  @ForeignKey(Info, 'myName', 'myName')
  myName?: string;
}
```

### 4. Column 

属性装饰器，用于将一个类属性声明为一个数据表的列（当前类需要使用Table装饰器声明），装饰器签名：

```ts
/**
 * 数据表的列装饰器
 * @package options 选项
 * @returns
 */
function Column(options?: BriskOrmColumnOption): Function

export interface BriskOrmColumnOption {
  dbName?: string;
  type?: BRISK_ORM_TYPE_E;
  length?: number;
  precision?: number;
  autoIncrement?: boolean;
  // 初始默认值和软删除恢复时的值
  default?: any;
  // 所属key名称，可以是数组，构造多唯一键
  uniqueKey?: string | string[];
  // 是否为主键
  isPrimaryKey?: boolean;
  // 为外键
  foreignKey?: {
    // 目标类
    Target: Class,
    // 目标类字段名称
    targetPropertyName: string,
    // 默认为CASCADE
    action?: BRISK_ORM_FOREIGN_ACTION_E;
  };
  // 开启软删除后，删除变成更新，更新后的值，可以是固定值，也可以是方法
  deleteValue?: any | (() => any);
}


```


案例：声明一个列

```ts
@Table('test')
class Info {
  @PrimaryKey({ dbName: 'name' })
  myName?: string;

  @Column({ dbName: 'age' })
  myAge?: number;
}
```

### 5. Many

属性装饰器，用于将一个类属性声明为一对多映射（当前类需要使用Table装饰器声明），装饰器签名：

```ts
/**
 * 一对多关系，仅对象类使用，不映射数据库
 * @param Entity 一对多对应的实体（必须有对应的Dao装饰器类）
 * @param sourceDbName 当前表的外键的列名
 * @param targetDbName 目标表存储当前表外键的列名
 * @returns
 */
export function Many(Entity: Class, sourceDbName: string, targetDbName: string): Function
```


案例：声明一对多映射

```ts
@Table('test')
class Info {
  @PrimaryKey({ dbName: 'name' })
  myName?: string;

  @Column({ dbName: 'age' })
  myAge?: number;
}

@Table('test1')
class Info2 {
  @PrimaryKey({ dbName: 'name' })
  myName?: string;

  @Column({ dbName: 'value' })
  myValue?: number;

  @Many(Info, 'name', 'name')
  infos?: Info[];
}
```

### 6. One

属性装饰器，用于将一个类属性声明为一对一或者多对一映射（当前类需要使用Table装饰器声明），装饰器签名：

```ts
/**
 * 一对一，多对一关系
 * @param Entity 一对一，多对一对应的实体（必须有对应的Dao装饰器类）
 * @param sourceDbName 当前表的外键的列名
 * @param targetDbName 目标表存储当前表外键的列名
 * @returns
 */
export function One(Entity: Class, sourceDbName: string, targetDbName: string): Function
```


案例：声明一对一或者多对一映射

```ts
@Table('test')
class Info {
  @PrimaryKey({ dbName: 'name' })
  myName?: string;

  @Column({ dbName: 'age' })
  myAge?: number;
}

@Table('test1')
class Info2 {
  @PrimaryKey({ dbName: 'name' })
  myName?: string;

  @Column({ dbName: 'value' })
  myValue?: number;

  @One(Info, 'name', 'name')
  info?: Info;
}
```

### 7. Dao

类装饰器，用于将一个类声明为Dao类，该类继承BriskOrmDao\<T\>，框架已经实现了部分常用的ORM操作。装饰器签名：

```ts
/**
 * Dao类装饰器
 * @param Entity 实体类，需要使用Table装饰器修饰
 * @returns
 */
function Dao<K>(Entity: Class<K>): <T extends BriskOrmDao<K>>(Target: Class<T>, ...args: any[]) => any
```

BriskOrmDao定义如下：

```ts
export interface BriskOrmPage {
  // 第几页，0开始
  page: number;
  // 页大小
  pageSize: number;
}

class BriskOrmQuery<T> {
    eq(key: keyof T, value: any): BriskOrmQuery<T>;
    ne(key: keyof T, value: any): BriskOrmQuery<T>;
    gt(key: keyof T, value: any): BriskOrmQuery<T>;
    ge(key: keyof T, value: any): BriskOrmQuery<T>;
    lt(key: keyof T, value: any): BriskOrmQuery<T>;
    le(key: keyof T, value: any): BriskOrmQuery<T>;
    between(key: keyof T, value1: any, value2: any): BriskOrmQuery<T>;
    notBetween(key: keyof T, value1: any, value2: any): BriskOrmQuery<T>;
    like(key: keyof T, value: any): BriskOrmQuery<T>;
    notLike(key: keyof T, value: any): BriskOrmQuery<T>;
    likeLeft(key: keyof T, value: any): BriskOrmQuery<T>;
    likeRight(key: keyof T, value: any): BriskOrmQuery<T>;
    notLikeLeft(key: keyof T, value: any): BriskOrmQuery<T>;
    notLikeRight(key: keyof T, value: any): BriskOrmQuery<T>;
    isNull(key: keyof T): BriskOrmQuery<T>;
    isNotNull(key: keyof T): BriskOrmQuery<T>;
    in(key: keyof T, value: any[]): BriskOrmQuery<T>;
    notIn(key: keyof T, value: any[]): BriskOrmQuery<T>;
    includes(key: keyof T, value: any): BriskOrmQuery<T>;
    nested(sub: BriskOrmSubConditionFactor<T>): BriskOrmQuery<T>;
    or(sub?: BriskOrmSubConditionFactor<T>): BriskOrmQuery<T>;
    and(sub?: BriskOrmSubConditionFactor<T>): BriskOrmQuery<T>;
    everyEq(entity: Partial<T>): BriskOrmQuery<T>;
    everyEqOrLike(entity: Partial<T>): BriskOrmQuery<T>;
    someEq(entity: Partial<T>): BriskOrmQuery<T>;
    groupBy(...keys: (keyof T)[]): BriskOrmQuery<T>;
    orderBy(direction: BRISK_ORM_ORDER_BY_E, ...keys: (keyof T)[]): BriskOrmQuery<T>;
    withDel(): BriskOrmQuery<T>;
    onlyDel(): BriskOrmQuery<T>;
    toSqlString(mapping: BriskOrmEntityMapping, softDelete = false): string;
    toWhereSqlString(mapping: BriskOrmEntityMapping): string;
}

class BriskOrmDao<K> {
    // 计数
    count(ctx?: BriskOrmContext): Promise<number | undefined>;
    countQuery(query: BriskOrmQuery<K>, ctx?: BriskOrmContext): Promise<number | undefined>;
    countEveryEq(queryEntity: Partial<K>, ctx?: BriskOrmContext): Promise<number | undefined>;
    countSomeEq(queryEntity: Partial<K>, ctx?: BriskOrmContext): Promise<number | undefined>;
    // 列表
    list(ctx?: BriskOrmContext): Promise<K[] | undefined>;
    listQuery(query: BriskOrmQuery<K>, ctx?: BriskOrmContext): Promise<K[] | undefined>;
    listEveryEq(queryEntity: Partial<K>, ctx?: BriskOrmContext): Promise<K[] | undefined>;
    listSomeEq(queryEntity: Partial<K>, ctx?: BriskOrmContext): Promise<K[] | undefined>;
    // 分页
    page(page: BriskOrmPage, ctx?: BriskOrmContext): Promise<K[] | undefined>;
    pageQuery(query: BriskOrmQuery<K>, page: BriskOrmPage, ctx?: BriskOrmContext): Promise<K[] | undefined>;
    pageEveryEq(queryEntity: Partial<K>, page: BriskOrmPage, ctx?: BriskOrmContext): Promise<K[] | undefined>;
    pageSomeEq(queryEntity: Partial<K>, page: BriskOrmPage, ctx?: BriskOrmContext): Promise<K[] | undefined>;
    // 查找
    findByPrimaryKey(_value: any, ctx?: BriskOrmContext): Promise<K | undefined>;
    findQuery(query: BriskOrmQuery<K>, ctx?: BriskOrmContext): Promise<K | undefined>;
    findEveryEq(queryEntity: Partial<K>, ctx?: BriskOrmContext): Promise<K | undefined>;
    findSomeEq(queryEntity: Partial<K>, ctx?: BriskOrmContext): Promise<K | undefined>;
    // 保存
    save(_value: K, ctx?: BriskOrmContext): Promise<BriskOrmOperationResult>;
    saveAll(_value: K[], ctx?: BriskOrmContext): Promise<BriskOrmOperationResult>;
    // 保存或者更新
    /**
   * @deprecated 更新将导致关联表数据被删除
   */
    saveOrUpdate(_value: K, ctx?: BriskOrmContext): Promise<BriskOrmOperationResult>;
    /**
   * @deprecated 更新将导致关联表数据被删除
   */
    saveOrUpdateAll(_value: K[], ctx?: BriskOrmContext): Promise<BriskOrmOperationResult>;
    // 更新
    updateByPrimaryKey(_value: K, ctx?: BriskOrmContext): Promise<BriskOrmOperationResult>;
    updateQuery(_value: K, query: BriskOrmQuery<K>, ctx?: BriskOrmContext): Promise<BriskOrmOperationResult>;
    updateEveryEq(_value: K, queryEntity: Partial<K>, ctx?: BriskOrmContext): Promise<BriskOrmOperationResult>;
    updateSomeEq(_value: K, queryEntity: Partial<K>, ctx?: BriskOrmContext): Promise<BriskOrmOperationResult>;
    deleteByPrimaryKey(primaryKey: any, ctx?: BriskOrmContext): Promise<BriskOrmOperationResult>;
    deleteQuery(query: BriskOrmQuery<K>, ctx?: BriskOrmContext): Promise<BriskOrmOperationResult>;
    deleteEveryEq(queryEntity: Partial<K>, ctx?: BriskOrmContext): Promise<BriskOrmOperationResult>;
    deleteSomeEq(queryEntity: Partial<K>, ctx?: BriskOrmContext): Promise<BriskOrmOperationResult>;
    /**
     * @deprecated
     */
    findList(ctx?: BriskOrmContext): Promise<K[] | undefined>;
    /**
     * @deprecated
     */
    findListBy(_key: string, _value: any, ctx?: BriskOrmContext): Promise<K[] | undefined>;
    /**
     * @deprecated
     */
    findBy(_key: string, _value: any, ctx?: BriskOrmContext): Promise<K | undefined>;
}
```


案例：声明Dao类

```ts
@Table('test')
class Info {
  @PrimaryKey({ dbName: 'name' })
  myName?: string;

  @Column({ dbName: 'age' })
  myAge?: number;
}

@Dao(Info)
class TestDao extends BriskOrmDao<Info> {
}
```