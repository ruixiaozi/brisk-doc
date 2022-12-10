# 手动（函数式）

通过 `setBean` 方法设置要管理的Bean类，通过 `getBean` 获取实例，完成控制反转，方法签名：

```ts
export function setBean(TargetClass: Class, region: Symbol = defaultRegion): void;
export function getBean<T>(TargetClass: Class<T>, region: Symbol = defaultRegion): T | undefined;
```

> Class：类的构造方法  
> region：当前bean放在某个指定域下面，如果不传入，则再默认域；每个域下不能有重名的类

## 1. 将类加入到IoC容器进行管理

```ts
import BriskIoC from 'brisk-ioc';

class Test3 {
  name = 'test3';
}
BriskIoC.setBean(Test3);
```

## 2. 获取容器中的实例

```ts
import BriskIoC from 'brisk-ioc';

class Test3 {
  name = 'test3';
}
BriskIoC.setBean(Test3);
const bean1 = BriskIoC.getBean(Test3);
const bean2 = BriskIoC.getBean(Test3);
console.log(bean1 === bean2); // true，单例模式下是唯一实例
```