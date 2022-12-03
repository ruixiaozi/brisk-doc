# 日志配置

可以通过 `全局配置` 或者 `单独配置` 控制日志的输出级别、输出方式、保留时长、大小等。

日志配置选项定义：
```ts
interface LoggerOption {
  // 默认DEBUG
  level?: LOGGER_LEVEL_E;
  // 默认 `[${msg.level}]: ${msg.timeStr} [${msg.region}]${msg.message}`
  format?: (msg: LoggerMsg) => string;
  // 是否开启控制台日志，默认true
  enableConsole?: boolean;
  // 是否开启文件日志，默认false
  enableFile?: boolean;
  // 指定文件日志的相对项目的执行路径，默认为logs
  filePath?: string;
  // 文件最大尺寸，默认20m
  fileMaxSize?: string;
  // 文件最大保留时间，默认30d
  fileMaxDate?: string;
}
```

## 全局配置

### 1. 设置配置信息

可以通过 `configure` 方法对全局特定 `命名空间` 进行日志配置，将对所有 `具有相同命名空间` 的日志实例生效。

> 命名空间：默认命名空间为global，也可以根据实际需求定义自己的命名空间。命名空间主要用于多个模块。需要不同的日志配置，比如不同的日志级别。

方法签名：

```ts
export function configure(option: LoggerOption, namespace: symbol = globalNamespaceSymbol): void;
```

#### 案例1（配置global命名空间日志选项）

```ts
import { configure, getLogger, LOGGER_LEVEL_E } from '../src/core/logger';

configure({
  level: LOGGER_LEVEL_E.error
});

const logger = getLogger();
logger.info('test'); // 不输出
logger.error('test'); // [error]: 2022-12-03 16:44:16 [global]    test
```

#### 案例2（配置特定命名空间日志选项）

```ts
import { configure, getLogger, LOGGER_LEVEL_E } from '../src/core/logger';

const myNamespace = Symbol('myNamespace');
const myRegion = Symbol('myRegion')

configure({
  level: LOGGER_LEVEL_E.error
}, myNamespace);

const logger = getLogger();
const myLogger = getLogger(myRegion, myNamespace);
logger.info('test'); // [info]: 2022-12-03 16:44:16 [global]    test
logger.error('test'); // [error]: 2022-12-03 16:44:16 [global]    test
myLogger.info('test'); // 不输出
myLogger.error('test'); // [error]: 2022-12-03 16:44:16 [myRegion]    test
```

### 2. 获取配置信息

可以通过 `getConfiguration` 方法获取全局特定 `命名空间` 进行日志配置。

方法签名：

```ts
export function getConfiguration(namespace: symbol = globalNamespaceSymbol): LoggerOptionActual;
```

#### 案例1（获取global全局配置信息）

```ts
import { getConfiguration } from '../src/core/logger';

console.log(getConfiguration());
/*
{
  level: 0,
  format: [Function: format],
  enableConsole: true,
  enableFile: false,
  filePath: 'logs',
  fileMaxSize: '20m',
  fileMaxDate: '30d'
}
 */
```

## 单实例(region)配置

### 1. 设置配置信息

可以通过日志实例上的 `configure` 方法对特定实例进行日志配置，仅对当前实例（region相同实例也相同，即对region相同的实例生效）生效。

方法签名：

```ts
configure(option: LoggerOption): void;
```

#### 案例1（改变指定region实例的配置）

```ts
import { configure, getLogger, LOGGER_LEVEL_E } from '../src/core/logger';

const myNamespace = Symbol('myNamespace');
const myRegion1 = Symbol('myRegion1');
const myRegion2 = Symbol('myRegion2');

configure({
  level: LOGGER_LEVEL_E.error
}, myNamespace);

const logger = getLogger();
const myLogger1 = getLogger(myRegion1, myNamespace);
const myLogger2 = getLogger(myRegion2, myNamespace);

myLogger1.configure({
  level: LOGGER_LEVEL_E.warn
});

logger.info('test'); // [info]: 2022-12-03 16:44:16 [global]    test
logger.warn('test'); // [warn]: 2022-12-03 16:44:16 [global]    test
logger.error('test'); // [error]: 2022-12-03 16:44:16 [global]    test

myLogger1.info('test'); // 不输出
myLogger1.warn('test'); // [warn]: 2022-12-03 16:44:16 [myRegion1]    test
myLogger1.error('test'); // [error]: 2022-12-03 16:44:16 [myRegion1]    test

myLogger2.info('test'); // 不输出
myLogger2.warn('test'); // 不输出
myLogger2.error('test'); // [error]: 2022-12-03 16:44:16 [myRegion2]    test
```

### 2. 获取配置信息

可以通过日志实例上的 `option` getter获取特定实例进行日志配置。

方法签名：

```ts
get option(): LoggerOptionActual;
```

#### 案例1（获取指定region实例的配置）

```ts
import { configure, getLogger, LOGGER_LEVEL_E } from '../src/core/logger';

const myNamespace = Symbol('myNamespace');
const myRegion1 = Symbol('myRegion1');

configure({
  level: LOGGER_LEVEL_E.error
}, myNamespace);

const myLogger1 = getLogger(myRegion1, myNamespace);

console.log(myLogger1.option);
/*
{
  level: 3,
  format: [Function: format],
  enableConsole: true,
  enableFile: false,
  filePath: 'logs',
  fileMaxSize: '20m',
  fileMaxDate: '30d'
}
*/
```