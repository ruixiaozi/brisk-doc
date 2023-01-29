# 装饰器

通过 `scanBean` 方法扫描指定路径（见[IoC配置](./configuration.html)）下的所有文件，被相关装饰器装饰的类将被容器自动收集管理。  

## 1. OnBeforeScan

用于方法的装饰器，同 [API#onBeforeScan](./api)，被装饰的方法会在扫描前执行，装饰器签名：

```ts
export function OnBeforeScan(scanOption?: BriskIoCHookOption): Function;
```

> scanOption为扫描选项

```ts
export interface BriskIoCHookOption {
  // 优先级，默认值10，值越小优先级越高
  priority?: number;
}
```

案例：参考 [快速开始](./)

## 2. OnAfterScan

用于方法的装饰器，同 [API#onBeforeScan](./api)，被装饰的方法会在扫描后执行，装饰器签名：

```ts
export function OnAfterScan(scanOption?: BriskIoCHookOption): Function;
```

案例：参考 [快速开始](./)

## 3. Bean

用于类的装饰器，同 [API#setBean](./api)，被装饰的类会被IoC容器管理，装饰器签名：

```ts
export function Bean(beanOption?: BriskIoCBeanOption): Function;
```

> beanOption 为bean类选项

```ts
export interface BriskIoCBeanOption {
  // 域
  region?: Symbol;
}
```

案例：参考 [快速开始](./)

## 4. Service

Bean装饰器的别名。

## 5. AutoWrite

用于类字段的装饰器，同 [API#getBean](./api)，被装饰的字段将被自动注入对应的实例对象（必须声明好字段的类型，将根据类型进行注入依赖），装饰器签名：

```ts
export function AutoWrite(beanOption?: BriskIoCBeanOption): Function;
```

案例：参考 [快速开始](./)