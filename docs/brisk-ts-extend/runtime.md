# 运行时扩展

## 1. isLike

运行时类型判断，支持判断 `class` 与 `interface`，可以进行 `extends` 与 `implements` 的递归判断；其原理是通过比较属性名称、类型进行的相似性判断。

其返回类型断言，友好的支持 `typescript` 类型系统，方法签名：

```ts
/**
 * 根据实际对象和对象名称，判断类型
 * @param target 实际对象
 * @param typeName 类型名称
 */
export function isLike<T>(target: any, typeName: string): target is T;
/**
 * 根据泛型判断实际对象的类型
 * @param target 实际对象
 */
export function isLike<T>(target: any): target is T;
```

使用方法：

```ts
import { isLike } from "brisk-ts-extends";

interface MyInterface {
  b: string;
}

const myObj = { b: '2' };

if (isLike<MyInterface>(myObj)) {
  console.log(myObj.b);
}
```

## 2. append

添加类型定义（默认不导出此方法，需要从 `brisk-ts-extends/runtime` 中导入），方法签名：

```
/**
 * 添加类型定义
 * @param typeName 类型名称
 * @param typeDes 类型详情描述
 */
export function append(typeName: string, typeDes: TypeDes): void;
```

## 3. get

获取类型定义（默认不导出此方法，需要从 `brisk-ts-extends/runtime` 中导入），方法签名：

```
/**
 * 获取类型定义
 * @param typeName 类型名称
 * @returns
 */
export declare function get(typeName: string): TypeDes;
```