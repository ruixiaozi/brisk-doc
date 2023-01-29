# API

## 1. configure

通过 `configure` 方法对IoC容器进行配置，方法签名：

```ts
export function configure(option: BriskIoCOption): void;
```

用法：参考 [IoC配置](./configuration)

## 2. scanBean

通过 `scanBean` 方法对通过 `configure` 配置的路径列表 进行扫描，将相关的 `装饰器` 类进行预处理，方法签名：

```ts
export function scanBean(): Promise<void>;
```

用法：参考 [IoC配置](./configuration)

## 3. onBeforeScan

添加扫描前执行的钩子方法，优先级数字越小越先执行，方法签名：

```ts
export function onBeforeScan(cbk: Function, priority = 10): void;
```

## 4. onAfterScan

添加扫描后执行的钩子方法，优先级数字越小越先执行，方法签名：

```ts
export function onAfterScan(cbk: Function, priority = 10): void;
```

## 5. setBean

通过 `setBean` 方法设置需要IoC容器管理的Bean类，方法签名：

```ts
export function setBean(tragetClassName: string, target: any, region?: Symbol): void;
export function setBean(TargetClass: Class, target?: any, region?: Symbol): void;
export function setBean(TargetClass: Class, target?: any, region?: Symbol, customName?: string): void;
```

> Class：类的构造方法  
> target：实例，用于指定bean实例  
> customName：自定义类名称  
> region：当前bean放在某个指定域下面，如果不传入，则再默认域；每个域下不能有重名的类

案例：将类加入到IoC容器进行管理

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

## 6. getBean

通过 `getBean` 获取实例，方法签名：

```ts
export function getBean<T>(tragetClassName: string, region?: Symbol): T | undefined;
export function getBean<T>(TargetClass: Class<T>, region?: Symbol): T | undefined;
```

案例： 获取容器中的实例

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