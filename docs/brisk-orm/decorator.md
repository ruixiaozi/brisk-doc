# 装饰器用法

## Select与Result 装饰器

方法装饰器，用于给方法注入一个select操作。

方法签名：

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
```

> 选项结构参考基本用法。


### 案例1（查询所有数据）

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

## Insert 装饰器

方法装饰器，用于给方法注入一个Insert操作。

方法签名：

```ts
/**
 * Insert装饰器
 * @param sql sql语句
 * @param propertis 插入对象字段列表，需要按顺序
 * @returns
 */
function Insert(sql: string, propertis: string[]): Function;
```

### 案例1（插入一条数据）

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

## Update 装饰器

方法装饰器，用于给方法注入一个Update操作。

方法签名：

```ts
/**
 * Update装饰器
 * @param sql sql语句
 * @param propertis 修改对象的字段列表，需要按set顺序填写
 * @returns update方法
 */
function Update(sql: string, propertis: string[]): Function;
```


### 案例1（更新一条数据）

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

## Delete 装饰器

方法装饰器，用于给方法注入一个Delete操作。

方法签名：

```ts
/**
 * Delete装饰器
 * @param sql sql语句
 * @returns delete方法
 */
function Delete(sql: string): Function
```


### 案例1（删除一条数据）

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

## Table 装饰器

类装饰器，用于将一个类声明为数据表的一个映射类。

方法签名：

```ts
/**
 * 数据表装饰器
 * @param dbTableName 表名
 * @returns
 */
function Table(dbTableName: string): Function
```


### 案例1（声明一个数据表类）

```ts
@Table('test')
class Info {
  
}
```

## PrimaryKey 装饰器

属性装饰器，用于将一个类属性声明为一个数据表的主键（当前类需要使用Table装饰器声明）

方法签名：

```ts
/**
 * 数据表的主键装饰器
 * @param dbName 数据库列名，默认使用属性名
 * @returns
 */
function PrimaryKey(dbName?: string): Function
```


### 案例1（声明一个主键）

```ts
@Table('test')
class Info {
  @PrimaryKey('name')
  myName?: string;
}
```

## Column 装饰器

属性装饰器，用于将一个类属性声明为一个数据表的列（当前类需要使用Table装饰器声明）

方法签名：

```ts
/**
 * 数据表的列装饰器
 * @param dbName 数据表的列名，默认使用属性名
 * @returns
 */
function Column(dbName?: string): Function
```


### 案例1（声明一个列）

```ts
@Table('test')
class Info {
  @PrimaryKey('name')
  myName?: string;

  @Column('age')
  myAge?: number;
}
```

## Many 装饰器

属性装饰器，用于将一个类属性声明为一对多映射（当前类需要使用Table装饰器声明）

方法签名：

```ts
/**
 * 一对多关系 装饰器
 * @param Entity 一对多对应的实体类（必须有对应的Dao装饰器类）
 * @param foreignKey 当前表的外键的列名
 * @param targetDbName 目标表存储当前表外键的列名
 * @returns
 */
function Many(Entity: Class, foreignKey: string, targetDbName: string): Function
```


### 案例1（声明一对多映射）

```ts
@Table('test')
class Info {
  @PrimaryKey('name')
  myName?: string;

  @Column('age')
  myAge?: number;
}

@Table('test1')
class Info2 {
  @PrimaryKey('name')
  myName?: string;

  @Column('value')
  myValue?: number;

  @Many(Info, 'name', 'name')
  infos?: Info[];
}
```

## One 装饰器

属性装饰器，用于将一个类属性声明为一对一或者多对一映射（当前类需要使用Table装饰器声明）

方法签名：

```ts
/**
 * 一对一，多对一关系 装饰器
 * @param Entity 一对一，多对一对应的实体（必须有Dao类）
 * @param foreignKey 当前表的外键的列名
 * @param targetDbName 目标表存储当前表外键的列名
 * @returns
 */
function One(Entity: Class, foreignKey: string, targetDbName: string): Function
```


### 案例1（声明一对一或者多对一映射）

```ts
@Table('test')
class Info {
  @PrimaryKey('name')
  myName?: string;

  @Column('age')
  myAge?: number;
}

@Table('test1')
class Info2 {
  @PrimaryKey('name')
  myName?: string;

  @Column('value')
  myValue?: number;

  @One(Info, 'name', 'name')
  info?: Info;
}
```

## Dao 装饰器

类装饰器，用于将一个类声明为Dao类，该类继承BriskOrmDao\<T\>，框架已经实现了部分常用的ORM操作。

方法签名：

```ts
/**
 * Dao类装饰器
 * @param Entity 实体类，需要使用Table装饰器修饰
 * @returns
 */
function Dao<K>(Entity: Class<K>): <T extends BriskOrmDao<K>>(Target: Class<T>, ...args: any[]) => any
```


### 案例1（声明Dao类）

```ts
@Table('test')
class Info {
  @PrimaryKey('name')
  myName?: string;

  @Column('age')
  myAge?: number;
}

@Dao(Info)
class TestDao extends BriskOrmDao<Info> {
}
```