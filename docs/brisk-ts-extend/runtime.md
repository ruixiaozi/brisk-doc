# 运行时扩展

## 1. isLike

运行时类型判断，支持判断 `class` 、 `enum` 与 `interface`，可以进行 `extends` 与 `implements` 的递归判断；其原理是通过比较属性名称、类型进行的相似性判断。

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

```ts
/**
 * 添加类型定义
 * @param typeName 类型名称
 * @param typeDes 类型详情描述
 */
export function append(typeName: string, typeDes: TypeDes): void;
```

## 3. get

获取类型定义（默认不导出此方法，需要从 `brisk-ts-extends/runtime` 中导入），方法签名：

```ts
/**
 * 获取类型定义
 * @param typeName 类型名称
 * @returns
 */
export function get(typeName: string): TypeDes;
```

## 4. getParentTypeKind

获取父类型，用于泛型类型，例如：`Promise<string>` 的 TypeKind 为 `Promise:string` ，通过 `getParentTypeKind` 获取为 `Promise` ，方法签名：

```ts
/**
 * 获取父类型（用于泛型定义）
 * @param kind 类型
 * @returns
 */
export function getParentTypeKind(kind: TypeKind | TypeKind[]): TypeKind | TypeKind[];
```


## 5. getSubTypeKind

获取子类型，用于泛型类型，例如：`Promise<string>` 的 TypeKind 为 `Promise:string` ，通过 `getSubTypeKind` 获取为 `string` ，方法签名：

```ts
/**
 * 获取子类型（用于泛型定义）
 * @param kind 类型
 * @returns
 */
export function getSubTypeKind(kind: TypeKind | TypeKind[]): TypeKind | TypeKind[];
```

## 6. typeCast

运行时类型转换，将一个对象或者对象数组，转换为目标类型。
+ 单个对象：结果中保留目标类型匹配的字段
+ 多个对象：结果中保留所有对象并集与目标类型匹配的字段，注意：数组顺序后者会覆盖前者相同字段值
方法前面：

```ts
/**
 * 类型转换，将源对象转成泛型类型；此typeCast重载会在编译时转换为2个参数的重载
 * @param source 源对象
 */
export function typeCast<T>(source: any): T;
/**
 * 类型转换，根据目标类型名称进行转换
 * @param source 源对象
 * @param targetTypeName 目标类型名称
 */
export function typeCast<T>(source: any, targetTypeName: string): T;
/**
 * 类型转换，将源对象数组转成泛型类型；此typeCast重载会在编译时转换为2个参数的重载
 * @param sources 源对象数组
 */
export function typeCast<T>(sources: any[]): T;
/**
 * 类型转换，根据目标类型名称将源对象数组进行转换
 * @param sources 源对象数组
 * @param targetTypeName 目标类型名称
 */
export function typeCast<T>(sources: any[], targetTypeName: string): T;
```