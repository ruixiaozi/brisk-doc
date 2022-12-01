# 装饰器工厂

类中不同声明上的装饰器将按以下规定的顺序应用：  

> 参数装饰器，然后依次是方法装饰器，访问符装饰器，或属性装饰器应用到每个实例成员。  
> 参数装饰器，然后依次是方法装饰器，访问符装饰器，或属性装饰器应用到每个静态成员。  
> 参数装饰器应用到构造函数。  
> 类装饰器应用到类。 

`DecoratorFactory` 提供了生成装饰器方法的工厂方法，其主目的是简化装饰器方法的实现，并且植入 `运行时类型`，可以在装饰器中获取类型描述信息，无需借助 `emitDecoratorMetadata`。

类签名：
```ts
export class DecoratorFactory {
  constructor(
    private _classCallback?: ClassCallbackFunc,
    private _propertyCallback?: PropertyCallbackFunc,
    private _paramCallback?: ParamCallbackFunc,
    private _methodCallback?: MethodCallbackFunc,
  ) {}

  public setClassCallback(func: ClassCallbackFunc): DecoratorFactory;

  public setPropertyCallback(func: PropertyCallbackFunc): DecoratorFactory;

  public setParamCallback(func: ParamCallbackFunc): DecoratorFactory;

  public setMethodCallback(func: MethodCallbackFunc): DecoratorFactory;

  public getDecorator(): Decorator;
}
```

## 1. setClassCallback - 设置类装饰器回调方法

给当前工厂实例设置类装饰器回调方法，之后通过当前工厂得到的装饰器可以用作类装饰器，并且触发该回调方法。

`ClassCallbackFunc` 类型定义：
```ts
export type ClassCallbackFunc = (
  target: Class,
  targetTypeDes?: TypeDes
) => Class | void;
```
> target：当前类的构造方法，可通过 new target() 生成实例  
> targetTypeDes：运行时类型描述

> 返回值：可以是一个新的构造方法（Class），用来替换类原来的构造方法；也可以不返回

### 案例1（实现单例模式）：

```ts
import { DecoratorFactory } from "brisk-ts-extends";

const singletons: any = {};
function ClassDecoratorTest() {
  return new DecoratorFactory()
    .setClassCallback((Target, targetDes) => {
      singletons[Target.name] = {
        instance: new Target(),
        des: targetDes,
      };
    })
    .getDecorator();
}

@ClassDecoratorTest()
class Test1 {
  test = 1;
}

console.log(singletons['Test1']?.instance?.test); // 1
console.log(singletons['Test1']?.des?.properties?.[0]?.key); // 'test'
```

### 案例2（实现代理类）：

```ts
import { DecoratorFactory } from "brisk-ts-extends";

function ClassDecoratorTest() {
  return new DecoratorFactory()
    .setClassCallback((Target, targetDes) => {
      return class extends Target {
        test = 1;
        test2 = 2;
      }
    })
    .getDecorator();
}

@ClassDecoratorTest()
class Test1 {
  test = 1;
}

const test11 = new Test11();
console.log(test11); // { test: 1, test2: 2 }
```

## 2. setPropertyCallback - 设置属性（字段）装饰器回调方法

给当前工厂实例设置属性（字段）装饰器回调方法，之后通过当前工厂得到的装饰器可以用作属性（字段）装饰器，并且触发该回调方法。

`PropertyCallbackFunc` 类型定义：
```ts
export type PropertyCallbackFunc = (
  target: any,
  key: Key,
  propertiesDes?: PropertiesDes,
) => void;
```
> target：对于静态属性（字段）来说是类的构造函数，对于实例属性（字段）是类的原型对象。  
> key：当前属性（字段）名称  
> propertiesDes：运行时属性（字段）的类型描述

### 案例（实现值注入）：

```ts
import { DecoratorFactory } from "brisk-ts-extends";

function PropertyDecoratorTest() {
  return new DecoratorFactory()
    .setPropertyCallback((target, key, propertiesDes) => {
      Reflect.defineProperty(target, key, {
        enumerable: true,
        configurable: false,
        get() {
          return {
            myName: propertiesDes?.key,
            myValue: propertiesDes?.default,
          };
        },
        set(value) {}
      });
    })
    .getDecorator();
}

class Test2 {
  @PropertyDecoratorTest()
  test = 1;
}

const test2 = new Test2();
console.log((test2.test as any).myName); // 'test'
console.log((test2.test as any).myValue); // 1
```

## 3. setParamCallback - 设置参数装饰器回调方法

给当前工厂实例设置参数装饰器回调方法，之后通过当前工厂得到的装饰器可以用作参数装饰器，并且触发该回调方法。

`ParamCallbackFunc` 类型定义：
```ts
export type ParamCallbackFunc = (
  target: any,
  key: Key,
  index: number,
  param?: ParamsDes,
) => void;
```
> target：对于静态方法来说是类的构造函数，对于实例方法是类的原型对象。  
> key：当前参数所在方法的名称  
> index：当前参数在方法参数列表的位置  
> param：运行时当前参数的类型描述

### 案例（实现向参数中添加元数据）：

```ts
import { DecoratorFactory } from "brisk-ts-extends";
import { get } from "brisk-ts-extends/runtime";

function ParamDecoratorTest(option?: any) {
  return new DecoratorFactory()
    .setParamCallback((target, key, index, param) => {
      if (param) {
        param.meta = option;
      }
    })
    .getDecorator();
}

class Test3 {
  test(@ParamDecoratorTest({ required: true }) param1: string) {
    console.log(param1);
  }
}
// 可通过 brisk-ts-extends/runtime 中的get，获取运行时类型描述
const test3Des = get('Test3');
console.log(test3Des.functions?.[0]?.params?.[0]?.meta?.required); // true
```

## 4. setMethodCallback - 设置方法装饰器回调方法

给当前工厂实例设置方法装饰器回调方法，之后通过当前工厂得到的装饰器可以用作方法装饰器，并且触发该回调方法。

`MethodCallbackFunc` 类型定义：
```ts
export type MethodCallbackFunc = (
  target: any,
  key: Key,
  descriptor: PropertyDescriptor,
  functionDes?: FunctionsDes,
) => PropertyDescriptor | void;
```
> target：对于静态方法来说是类的构造方法，对于实例方法是类的原型对象  
> key：当前方法的名称  
> descriptor：当前方法的属性描述符 
> functionDes：运行时方法的类型描述

> 返回值：可以返回一个属性描述符，用于替换方法本身的属性描述符；也可以不返回

### 案例（实现方法代理）：

```ts
function MethodDecoratorTest() {
  return new DecoratorFactory()
    .setMethodCallback((target, key, descriptor, functionDes) => {
      return {
        enumerable: true,
        configurable: true,
        writable: false,
        value: () => {
          console.log('front log');
          return descriptor.value?.();
        }
      } as PropertyDescriptor;
    })
    .getDecorator();
}

class Test44 {
  @MethodDecoratorTest()
  test() {
    return '1';
  }
}

const test44 = new Test44();
console.log(test44.test());
// front log
// 1
```