# 手动（函数式）

通过 `setBean` 方法设置要管理的Bean类，通过 `getBean` 获取实例，完成控制反转，方法签名：

```ts
export function setBean(tragetClassName: string, target: any, region?: Symbol): void;
export function setBean(TargetClass: Class, target?: any, region?: Symbol): void;
export function setBean(TargetClass: Class, target?: any, region?: Symbol, customName?: string): void;

export function getBean<T>(tragetClassName: string, region?: Symbol): T | undefined;
export function getBean<T>(TargetClass: Class<T>, region?: Symbol): T | undefined;
```

> Class：类的构造方法  
> target：实例，用于指定bean实例  
> customName：自定义类名称  
> region：当前bean放在某个指定域下面，如果不传入，则再默认域；每个域下不能有重名的类

## 1. 将类加入到IoC容器进行管理

```ts
import BriskIoC from 'brisk-ioc';

class Test3 {
  name = 'test3';
}
BriskIoC.setBean(Test3);

// 指定实例
const test3 = new Test3();
test3.name = '123';
BriskIoC.setBean(Test3, test3);

// 自定义类名称
BriskIoC.setBean(Test3, test3, undefined, 'Test31');

// 使用类名，并指定实例
BriskIoC.setBean('Test3', test3);
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

// 通过类目获取Bean
const bean3 = BriskIoC.getBean('Test3');
console.log(bean1 === bean3); // true，单例模式下是唯一实例
```