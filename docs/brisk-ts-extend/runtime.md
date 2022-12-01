# 运行时扩展

## isLike - 运行时类型判断

支持判断 `class` 与 `interface`，可以进行 `extends` 与 `implements` 的递归判断；其原理是通过比较属性名称、类型进行的相似性判断。

其返回类型断言，友好的支持 `typescript` 类型系统。

方法签名：
```ts
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