# 日志实例

日志实例是使用日志库的核心对象，其实例实现了一下接口：

```ts
interface Logger {
  get region(): symbol;
  get namespace(): symbol;
  get option(): LoggerOptionActual;
  configure(option: LoggerOption): void;
  debug(message: string, ...meta: any[]): Logger;
  info(message: string, ...meta: any[]): Logger;
  warn(message: string, ...meta: any[]): Logger;
  error(message: string, ...meta: any[]): Logger;
}
```

> region：当前实例的域（每个实例和region一一对应），用于划分不同的业务模块，但是不同的region可以共用相同的日志配置。  
> namespace：当前实例的命名空间，每个命名空间相互独立，拥有一套独立的全局日志配置。可通过不同的命名空间，划分不同的日志配置。  
> option：当前实例的日志配置。  
> configure：配置特定实例的日志配置。  
> debug/info/warn/error：输出日志信息的方法。   

## 获取日志实例

可以通过 `装饰器` 或者 `函数` 方式获得日志实例。

> 同一命名空间下，同一region，获取到的实例相同（单例）。

### 1. 装饰器

装饰器签名：
```ts
// region默认为global，namespace默认为global
function Log(region?: symbol, namespace?: symbol): Function;
```

#### 案例1（获取global实例）：

```ts
import { Log, Logger } from 'brisk-log';

class Test1 {
  @Log()
  logger!: Logger;
}

const test1 = new Test1();
test1.logger.debug('test debug'); // [debug]: 2022-12-03 16:44:16 [global]    test debug
```

#### 案例2（获取特定命名空间）：

```ts
import { Log, Logger, configure, LOGGER_LEVEL_E } from 'brisk-log';

const myNamespace = Symbol('myNamespace');
configure({
  level: LOGGER_LEVEL_E.error
}, myNamespace);

class Test1 {
  @Log(undefined, myNamespace)
  logger!: Logger;
}

const test1 = new Test1();
test1.logger.debug('test debug'); // 不输出
test1.logger.error('test error'); // [error]: 2022-12-03 16:44:16 [global]    test error
```

#### 案例3（获取特定region）：

```ts
import { Log, Logger } from 'brisk-log';

class Test1 {
  @Log(Symbol(Test1.name))
  logger!: Logger;
}

const test1 = new Test1();
test1.logger.error('test error'); // [error]: 2022-12-03 16:44:16 [Test1]    test error
```

### 2. 函数式

方法签名：
```ts
function getLogger(region: symbol = globalRegionSymbol, namespace: symbol = globalNamespaceSymbol): Logger;
```

#### 案例1（获取global实例）：

```ts
import { getLogger } from 'brisk-log';

const logger = getLogger();
logger.debug('test debug'); // [debug]: 2022-12-03 16:44:16 [global]    test debug
```

#### 案例2（获取特定命名空间）：

```ts
import { getLogger, configure, LOGGER_LEVEL_E } from 'brisk-log';

const myNamespace = Symbol('myNamespace');
configure({
  level: LOGGER_LEVEL_E.error
}, myNamespace);

const logger = getLogger(undefined, myNamespace);
logger.debug('test debug'); // 不输出
logger.error('test error'); // [error]: 2022-12-03 16:44:16 [global]    test error
```

#### 案例3（获取特定region）：

```ts
import { getLogger } from 'brisk-log';

const logger = getLogger(Symbol('Test1'));
test1.logger.error('test error'); // [error]: 2022-12-03 16:44:16 [Test1]    test error
```

## 打印日志

日志实例中的 `debug/info/warn/error` 方法用于打印日志信息，可以链式调用。

方法签名：

```ts
debug(message: string, ...meta: any[]): Logger;
info(message: string, ...meta: any[]): Logger;
warn(message: string, ...meta: any[]): Logger;
error(message: string, ...meta: any[]): Logger;
```

> message：日志字符串内容。  
> meta：元数据，将通过JSON.stringfy输出为一个数组字符串。   

### 1. 打印基本信息

```ts
import { getLogger } from 'brisk-log';

const logger = getLogger();
logger.debug('test debug'); // [debug]: 2022-12-03 16:44:16 [global]    test debug
```

### 2. 打印元数据

```ts
import { getLogger } from 'brisk-log';

const logger = getLogger();
logger.debug('test debug', 'meta1', { name: 'jone' });
/* 
[debug]: 2022-12-03 18:22:44 [global]   test debug
[
  "meta1",
  {
    "name": "jone"
  }
]
*/
```