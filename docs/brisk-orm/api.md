# API

## 1. connect

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
}
```

案例：连接mysql数据库

```ts
import BriskOrm from 'brisk-orm';

BriskOrm.connect({
host: 'xxx.xxx.xxx',
user: 'xxxx',
password: 'xxxxx',
database: 'xxxx'
})
```

## 2. distory

断开连接，方法签名：

```ts
function distory(): Promise<void>;
```

案例：断开连接

```ts
import BriskOrm from 'brisk-orm';

await BriskOrm.distory();
```


## 3. getSelect

获取一个查询方法，用于执行查询语句，方法签名：

```ts
/**
 * 获取一个select方法，用于查询
 * @param sql sql语句
 * @param Target 结果对象的类
 * @param option 结果选项
 * @param id sql语句的唯一标识
 * @param propertyArgs 作为字段名称的参数序号
 * @returns select方法
 */
function getSelect<T>(sql: string, Target?: Class, option?: BriskOrmResultOption, id?: string, propertyArgs?: number[]): BriskOrmSelectFunction<T>;
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
}

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

## 4. getInsert

获取一个插入方法，用于执行插入语句，方法签名：

```ts
/**
 * 获取一个insert方法，用于插入数据
 * @param sql sql语句
 * @param propertis 插入对象字段列表，需要按顺序
 * @returns insert方法
 */
function getInsert<T>(sql: string, propertis: string[]): BriskOrmInsertFunction<T>;
```

选项结构：

```ts
interface BriskOrmOperationResult {
  success: boolean;
  affectedRows: number;
}

type BriskOrmInsertFunction<T = any> = (data: T) => Promise<BriskOrmOperationResult>;
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

## 5. getUpdate

获取一个更新方法，用于执行更新语句，方法签名：

```ts
/**
 * 获取一个update方法，用于更新
 * @param sql sql语句
 * @param propertis 修改对象的字段列表，需要按set顺序填写
 * @returns update方法
 */
function getUpdate<T>(sql: string, propertis: string[]): BriskOrmUpdateFunction<T>;
```

选项结构：

```ts
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

## 6. getDelete

获取一个删除方法，用于执行删除语句，方法签名：

```ts
/**
 * 获取一个delete方法，用于更新
 * @param sql sql语句
 * @returns delete方法
 */
function getDelete(sql: string): BriskOrmDeleteFunction;
```

选项结构：

```ts
type BriskOrmUpdateFunction<T = any> = (data: T, ...args: any[]) => Promise<BriskOrmOperationResult>;
```

案例：删除一条数据

```ts
import BriskOrm from 'brisk-orm';

const deleteFunc = BriskOrm.getDelete('delete from test where name = ?');
const res = await deleteFunc('11');
```