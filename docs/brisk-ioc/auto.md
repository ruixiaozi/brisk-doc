# 自动（装饰器）

通过 `scanBean` 方法扫描指定路径（见[IoC配置](./configuration.html)）下的所有文件，被相关装饰器装饰的类将被容器自动收集管理。  

同时可用通过方法 `onBeforeScan` 和 `onAfterScan` 插入扫描时的hook，方便再文件扫描的前后做操作。也可用通过装饰器 `OnBeforeScan` 和 `OnAfterScan` 在类方法上绑定。

在对应的Bean文件类，通过 `Bean` 或者 `Service` 装饰器声明当前类需要被容器管理。在类的属性上，可通过 `AutoWrite` 装饰器实现注入（必须声明好属性的类型，将根据类型进行注入依赖）。

方法签名：

```ts
export async function scanBean(): Promise<void>;
export function onBeforeScan(cbk: Function, priority = 10): void;
export function onAfterScan(cbk: Function, priority = 10) : void;
```
> priority：默认值为10，优先级数值越小，优先级越高，越先执行。  

装饰器签名：

```ts
export interface BriskIoCHookOption {
  // 优先级，默认值10，值越小优先级越高
  priority?: number;
}

export interface BriskIoCBeanOption {
  // 域
  region?: Symbol;
}
export function OnBeforeScan(scanOption?: BriskIoCHookOption): Function;
export function OnAfterScan(scanOption?: BriskIoCHookOption): Function;
export function Bean(beanOption?: BriskIoCBeanOption): Function;
export function Service(beanOption?: BriskIoCBeanOption): Function;
export function AutoWrite(beanOption?: BriskIoCBeanOption): Function;
```

案例：参考[快速开始](./#快速开始)