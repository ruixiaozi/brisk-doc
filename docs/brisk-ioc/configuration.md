# IoC配置

可用配置当前容器扫描bean的路径列表、当前的容器模式等。

配置选项定义：
```ts
enum BRISK_IOC_MODEL_E {
  SINGLETION = 'singleton',
  PROTOTYPE = 'prototype',
}

interface BriskIoCOption {
  // 默认为执行的当前目录
  beanPathes?: string[];
  // 默认是单例模式
  model?: BRISK_IOC_MODEL_E;
}
```

## 全局配置

方法签名：

```ts
export function configure(option: BriskIoCOption): void;
```

### 案例1（配置原型模式）

```ts
import BriskIoC from 'brisk-ioc';

BriskIoC.configure({
  model: BRISK_IOC_MODEL_E.PROTOTYPE
});
class Test3 {
  name = 'test3';
}
BriskIoC.setBean(Test3);
const bean1 = BriskIoC.getBean(Test3);
const bean2 = BriskIoC.getBean(Test3);
console.log(bean1 === bean2); // false
```

### 案例2（配置扫描路径）

```ts
import BriskIoC from 'brisk-ioc';
import path from 'path';

BriskIoC.configure({
  beanPathes: [path.join(__dirname, './exp.ts')]
});
await scanBean(); // 识别exp.ts 内的装饰器并自动完成依赖注入
```
