# API

## 基础API

### 1. connect

连接数据库，方法签名：

```ts
function connect(option: BriskOrmConnectOption): void;
```

选项结构：

```ts
interface BriskOrmConnectOption {
host: string;
port?: number;
user: string;
password: string;
database: string;
charset?: string;
// 是否开启数据库同步，默认只同步新增表
autoSync: {
  enable: boolean;
  expectTables?: string[];
  // 默认false。设置true开启删除多余表格
  enableDeleteTable?: boolean;
  // 默认false。设置true开启更新存在的表格
  enableUpdateTable?: boolean;
};
}
```

案例：连接mysql数据库

```ts
import BriskOrm from 'brisk-orm';

BriskOrm.connect({
host: 'xxx.xxx.xxx',
user: 'xxxx',
password: 'xxxxx',
database: 'xxxx',
autoSync: {
  enable: false,
}
})
```

### 2. distory

断开连接，方法签名：

```ts
function distory(): Promise<void>;
```

案例：断开连接

```ts
import BriskOrm from 'brisk-orm';

await BriskOrm.distory();
```


### 3. getSelect

获取一个查询方法，用于执行查询语句，方法签名：

```ts
/**
 * 获取一个select方法，用于查询
 * @param sql sql语句
 * @param Target 结果对象的类
 * @param option 结果选项
 * @param id sql语句的唯一标识
 * @param sqlArgs 作为原生SQL插入的参数序号
 * @returns select方法
 */
export function getSelect<T>(
  sql: string,
  Target?: Class,
  option?: BriskOrmResultOption,
  id?: string,
  sqlArgs?: number[],
): BriskOrmSelectFunction<T>;
```

选项结构：

```ts
interface BriskOrmComplexMapping {
  // 取dbProp列对应的值作为参数调用selelct
  dbProp: string;
  // select的时候目标的列名，可选
  targetDbProp?: string;
  selectId: string;
}

interface BriskOrmEntityMapping {
  // 映射关系，key为类字段，value为数据库字段 或者 复杂映射对象
  [key: string]: string | BriskOrmComplexMapping;
}

interface BriskOrmResultOption {
  // 默认false
  isList?: boolean;
  // 映射关系，key为类字段，value为数据库字段
  mapping?: BriskOrmEntityMapping;
  // 默认false
  /**
   * @deprecated 使用aggregation
   */
  isCount?: boolean;
  // 0.0.4 加入
  aggregation?: boolean;
}

// 如果开启事务，args最后一个参数需要传入ctx上下文
type BriskOrmSelectFunction<T = any> = (...args: any[]) => Promise<T>;
```

案例：查询所有数据

```ts
import BriskOrm from 'brisk-orm';

class T1 {
  myName?: string;
  myAge?: number;
}
const selectFunc = BriskOrm.getSelect<T1[] | undefined>('select * from test', T1, {
  isList: true,
  mapping: {
    myName: 'name',
    myAge: 'age',
  }
});
const res = await selectFunc();
```

### 4. getInsert

获取一个插入方法，用于执行插入语句，方法签名：

```ts
/**
 * 获取一个insert方法，用于插入数据
 * @param sql sql语句
 * @param propertis 插入对象字段列表，需要按顺序
 * @param Target 目标类
 * @returns insert方法
 */
export function getInsert<T>(
  sql: string,
  propertis: string[],
  Target?: Class,
): BriskOrmInsertFunction<T>;
```

选项结构：

```ts
interface BriskOrmOperationResult {
  success: boolean;
  affectedRows: number;
}

// 如果开启事务，需要传入ctx上下文
type BriskOrmInsertFunction<T = any> = (data: T ctx?: BriskOrmContext) => Promise<BriskOrmOperationResult>;
```

案例1：插入一条数据

```ts
import BriskOrm from 'brisk-orm';

class T1 {
  name?: string;
  age?: number;
}
const insertOne = BriskOrm.getInsert<T1>('insert into test (name, age) values ?', ['name', 'age']);
const res = await insertOne({
  name: '11',
  age: 11
});
```

案例1：插入多条数据

```ts
import BriskOrm from 'brisk-orm';

class T1 {
  name?: string;
  age?: number;
}
const insertMany = BriskOrm.getInsert<T1>('insert into test (name, age) values ?', ['name', 'age']);
const res = await insertMany([
  { name: '22', age: 22 },
  { name: '33', age: 33 },
]);
```

### 5. getUpdate

获取一个更新方法，用于执行更新语句，方法签名：

```ts
/**
 * 获取一个update方法，用于更新
 * @param sql sql语句
 * @param propertis 修改对象的字段列表，需要按set顺序填写
 * @param mapping 映射对象
 * @param sqlArgs 作为原生SQL插入的参数序号
 * @param Target 目标对象
 * @returns
 */
export function getUpdate<T>(
  sql: string,
  propertis: string[],
  mapping?: BriskOrmEntityMapping,
  sqlArgs?: number[],
  Target?: Class,
): BriskOrmUpdateFunction<T>;
```

选项结构：

```ts
// 如果开启事务，args最后一个参数需要传入ctx上下文
type BriskOrmUpdateFunction<T = any> = (data: T, ...args: any[]) => Promise<BriskOrmOperationResult>;
```

案例：更新一条数据

```ts
import BriskOrm from 'brisk-orm';

class T1 {
  name?: string;
  age?: number;
}
const update = BriskOrm.getUpdate<T1>('update test set age = ? where name = ?', ['age', 'name']);
const res = await update({
  name: '11',
  age: 11
});
```

### 6. getDelete

获取一个删除方法，用于执行删除语句，方法签名：

```ts
/**
 * 获取一个delete方法，用于更新
 * @param sql sql语句
 * @param mapping 映射对象
 * @param sqlArgs 作为原生SQL插入的参数序号
 * @param Target 目标类
 * @param id 删除方法的id
 * @returns
 */
export function getDelete(
  sql: string,
  mapping?: BriskOrmEntityMapping,
  sqlArgs?: number[],
  Target?: Class,
  id?: string,
): BriskOrmDeleteFunction;
```

选项结构：

```ts
// 如果开启事务，args最后一个参数需要传入ctx上下文
type BriskOrmUpdateFunction<T = any> = (data: T, ...args: any[]) => Promise<BriskOrmOperationResult>;
```

案例：删除一条数据

```ts
import BriskOrm from 'brisk-orm';

const deleteFunc = BriskOrm.getDelete('delete from test where name = ?');
const res = await deleteFunc('11');
```

### 7. startTransaction

开启手动事务方法，返回一个上下文对象，可通过该对象进行事务控制，方法签名：

```ts
/**
 * 开启手动事务
 * @returns ctx BriskOrmContext
 */
export async function startTransaction(): Promise<BriskOrmContext>;
```

上下文对象：

```ts
export interface BriskOrmContext {
  // 事务回滚
  rollback: (transactionName: string) => Promise<void> | undefined;
  // 事务提交
  commit: () => Promise<void> | undefined;
  // 事务结束（必须调用）
  end: () => void | undefined;
  // 内部使用，忽略
  query: (options: QueryOptions) => Promise<any> | undefined;
}
```

案例：简单的事务管理

```ts
const ctx = await startTransaction();
try {
  class T6 {
	name?: string;
	age?: number;
  }
  const updateT6 = getUpdate<T6>('update test set age = ? where name = ?', ['age', 'name']);
  const res1 = await updateT6({
	name: '11',
	age: 11
  },);
  if (!res1.affectedRows) {
	throw new Error();
  }
  const deleteFunc = getDelete('delete from test where name = ?');
  const res = await deleteFunc('2', ctx);

  await ctx.commit();
} catch (error) {
  await ctx.rollback('test');
} finally {
  ctx.end();
}
```

### 8. transaction

开启自动事务，方法签名：

```ts
/**
 * 自动事务
 * @param handler 事务实际业务处理器
 * @param transactionName 事务名称，用于表示当前事务
 * @param parentCtx 父级ctx，可以传递ctx
 */
export async function transaction<T>(
  handler: (ctx: BriskOrmContext) => T,
  transactionName: string,
  parentCtx?: BriskOrmContext,
): Promise<T>;
```

案例：简单的自动事务

```ts
await transaction(async(ctx) => {
  class T7 {
	name?: string;
	age?: number;
  }
  const updateT7 = getUpdate<T7>('update test set age = ? where name = ?', ['age', 'name']);
  const res1 = await updateT7({
	name: '11',
	age: 11
  },);
  const deleteFunc = getDelete('delete from test where name = ?');
  const res = await deleteFunc('2', ctx);
}, 'test');
```

### 9. addHook

添加书籍库链接的前置和后置钩子，方法签名：

```ts
// 添加钩子
export function addHook(pos: 'before_conn' | 'after_conn', hook: BriskOrmHooks): void;

export interface BriskOrmHooks {
  priority: number;
  handler: () => Promise<void> | void;
}
```





## 表结构API

### 1. createTable

创建表，方法签名：

```ts
/**
 * 创建表
 * @param name 表名
 * @param table 表对象
 * @param ctx orm上下文
 * @returns
 */
function createTable(name: string, table: BriskOrmTable, ctx?: BriskOrmContext): Promise<any>;

export interface BriskOrmTable {
  charset: string;
  collate: string;
  engine: 'InnoDB';
  columns: BriskOrmColumn[];
  primaryKeys: string[];
  // 子对象的key和父对象key一样，name为column名称
  uniqueKeys: { [key: string]: BriskOrmUniqueKey };
  // name为列名
  foreignKeys: { [name: string]: BirskOrmForeignKey };
}

// key为唯一键名称，name为列名
export type BriskOrmUniqueKey = { key: string, name: string }[];

export interface BirskOrmForeignKey {
  targetTableName: string;
  targetColumnName: string;
  action: BRISK_ORM_FOREIGN_ACTION_E;
}

export enum BRISK_ORM_FOREIGN_ACTION_E {
  // 默认，级联动作
  CASCADE='CASCADE',
  // 设置为空
  SET_NULL='SET NULL',
  // 无动作
  NO_ACTION='NO ACTION'
}

export interface BriskOrmColumn {
  name: string;
  type: BRISK_ORM_TYPE_E;
  length?: number;
  precision?: number;
  notNull?: boolean;
  autoIncrement?: boolean;
  default?: any;
}

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
```

### 2. getAllTable

获取所有表名列表，方法签名：

```ts
/**
 * 获取所有表名列表
 * @param ctx orm上下文
 * @returns
 */
export async function getAllTable(ctx?: BriskOrmContext): Promise<string[]>;
```

### 3. deleteTable

删除表，方法签名：

```ts
/**
 * 删除表
 * @param name 表名
 * @param ctx orm上下文
 * @returns
 */
export async function deleteTable(name: string, ctx?: BriskOrmContext): Promise<any>;
```

### 4. getCreateTableSQL

获取表的原创建SQL，方法签名：

```ts
/**
 * 获取表的原创建SQL
 * @param name 表名
 * @param ctx orm上下文
 * @returns
 */
export async function getCreateTableSQL(name: string, ctx?: BriskOrmContext): Promise<any>;
```

### 5. updateTable

更新表，方法签名：

```ts
/**
 * 更新表
 * @param name 表名
 * @param table 表对象
 * @param ctx orm上下文
 * @returns
 */
export async function updateTable(name: string, table: BriskOrmTable, ctx?: BriskOrmContext): Promise<any>;
```

### 6. addTable

添加表对象到列表中，用于 autoSync 自动同步表，方法签名：

```ts
/**
 * 添加表对象到列表中
 * @param name 表名
 * @param table 表对象
 */
export function addTable(name: string, table: BriskOrmTable): Promise<any>;
```

### 7. setGlobalAutoSyncExpect

*设置全局排除表*，在排除表内的table在autoSync时，将跳过

```ts
/**
 * 设置全局排除表
 * @param expectTables 指定要排除同步的表名列表
 */
export function setGlobalAutoSyncExpect(expectTables: string[]): void;
```

### 8. addGlobalAutoSyncExpect

添加全局排除表，在排除表内的table在autoSync时，将跳过

```ts
/**
 * 添加全局排除表
 * @param expectTables 指定要排除同步的表名列表
 */
export function addGlobalAutoSyncExpect(expectTables: string[]): void;
```

