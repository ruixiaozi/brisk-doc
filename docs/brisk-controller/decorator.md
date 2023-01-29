# 装饰器

通过 `BriskIoC.scanBean` 方法扫描指定路径（见[IoC配置](../brisk-ioc/configuration.html)）下的所有文件，被相关装饰器装饰的类将被容器自动收集管理。

## 1. Controller

类装饰器，用于将一个类声明为一个控制器，装饰器签名：

```ts
/**
 * 控制器类 装饰器
 * @param baseUrl 当前类下的所有request和interceptor的基地址
 * @param option 选项
 * @returns
 */
export function Controller(baseUrl?: string, option?: BriskControllerDecoratorOption): Function;
```

选项结构：

```ts
export interface BriskControllerDecoratorOption {
  // 当前控制器的标签，用于swagger分类，默认为类名
  tag?: string;
}
```

案例：声明一个控制器类

```ts
import { Controller } from 'brisk-controller';

@Controller('/test', { tag: 'test1' })
class TestDecorator1 {

}
```

## 2. RequestMapping

方法装饰器，将一个方法映射为一个请求处理器，装饰器签名：

```ts
/**
 * 请求映射 方法装饰器
 * @param path 路由路径
 * @param option 选项
 * @returns
 */
export function RequestMapping(path: string, option?: BriskControllerDecoratorRequest): Function;
```

选项结构：

```ts
export interface BriskControllerDecoratorRequest {
  // 标题，用于swagger显示
  title?: string;
  // 描述，用于swagger显示
  description?: string;
  // 默认为get
  method?: BRISK_CONTROLLER_METHOD_E;
}
```

案例：添加请求处理器

```ts
import { Controller, RequestMapping, BRISK_CONTROLLER_METHOD_E } from 'brisk-controller';

@Controller('/test', { tag: 'test1' })
class TestDecorator1 {
  test1Data = 'test1';

  @RequestMapping('/test1')
  test1() {
	return {
	  msg: this.test1Data
	}
  }

  @RequestMapping('/test2', { method: BRISK_CONTROLLER_METHOD_E.POST })
  test2() {
	return {
	  msg: this.test1Data
	}
  }
}
```

## 3. Body

参数装饰器（仅用于被RequestMapping装饰器装饰的方法参数），将对应参数与请求体（body内容）进行值映射，装饰器签名：

```ts
/**
 * Body参数 装饰器
 * @param {option} BriskControllerDecoratorParam 选项
 * @returns
 */
export function Body(option?: BriskControllerDecoratorParam): Function;
```

选项结构：

```ts
export interface BriskControllerDecoratorParam {
  name?: string,
  description?: string;
  // 校验器
  validator?: BriskControllerValidator;
}
```

案例：映射body

```ts
import { Controller, RequestMapping, Body, BRISK_CONTROLLER_METHOD_E } from 'brisk-controller';

class TestParam2 {
  a!: string;
  b!: boolean;
  c!: number;
  d!: Array<string>;
}

@Controller('/test', { tag: 'test1' })
class TestDecorator1 {
  test1Data = 'test1';

  @RequestMapping('/test2', { method: BRISK_CONTROLLER_METHOD_E.POST })
  test2(@Body() testParam2: TestParam2) {
	return {
	  msg: this.test1Data
	}
  }
}
```

## 4. InBody

参数装饰器（仅用于被RequestMapping装饰器装饰的方法参数），将对应参数与请求体中的某个字段进行值映射，装饰器签名：

```ts
/**
 * InBody参数 装饰器
 * @param {option} BriskControllerDecoratorParam 选项
 * @returns
 */
export function InBody(option?: BriskControllerDecoratorParam): Function;
```

选项结构：同 Body 装饰器

案例：映射请求体中的某个字段

```ts
import { Controller, RequestMapping, InBody, BRISK_CONTROLLER_METHOD_E } from 'brisk-controller';

@Controller('/test', { tag: 'test1' })
class TestDecorator1 {
  test1Data = 'test1';

  @RequestMapping('/test2', { method: BRISK_CONTROLLER_METHOD_E.POST })
  test2(@InBody() a: number) {
	return {
	  msg: this.test1Data
	}
  }
}
```

## 5. InQuery

参数装饰器（仅用于被RequestMapping装饰器装饰的方法参数），将对应参数与查询字符串中的某个字段进行值映射，装饰器签名：

```ts
/**
 * InQuery参数 装饰器
 * @param {option} BriskControllerDecoratorParam 选项
 * @returns
 */
export function InQuery(option?: BriskControllerDecoratorParam): Function;
```

选项结构：同 Body 装饰器

案例：映射查询字符串中的某个字段

```ts
import { Controller, RequestMapping, InQuery, BRISK_CONTROLLER_METHOD_E } from 'brisk-controller';

@Controller('/test', { tag: 'test1' })
class TestDecorator1 {
  test1Data = 'test1';

  @RequestMapping('/test2')
  test2(@InQuery() a: number) {
	return {
	  msg: this.test1Data
	}
  }
}
```

## 6. InFormData

参数装饰器（仅用于被RequestMapping装饰器装饰的方法参数），将对应参数与请求体为formdata格式的body中的某个字段进行值映射，装饰器签名：

```ts
/**
 * InFormData参数 装饰器
 * @param {option} BriskControllerDecoratorParam 选项
 * @returns
 */
export function InFormData(option?: BriskControllerDecoratorParam): Function;
```

选项结构：同 Body 装饰器

案例：映射formdata中的某个字段

```ts
import { Controller, RequestMapping, InFormData, BRISK_CONTROLLER_METHOD_E } from 'brisk-controller';

@Controller('/test', { tag: 'test1' })
class TestDecorator1 {
  test1Data = 'test1';

  @RequestMapping('/test2', { method: BRISK_CONTROLLER_METHOD_E.POST })
  test2(@InFormData() a: number) {
	return {
	  msg: this.test1Data
	}
  }
}
```

## 7. InHeader

参数装饰器（仅用于被RequestMapping装饰器装饰的方法参数），将对应参数与请求头中的某个字段进行值映射，装饰器签名：

```ts
/**
 * InHeader参数 装饰器
 * @param {option} BriskControllerDecoratorParam 选项
 * @returns
 */
export function InHeader(option?: BriskControllerDecoratorParam): Function;
```

选项结构：同 Body 装饰器

案例：映射请求头中的某个字段

```ts
import { Controller, RequestMapping, InHeader, BRISK_CONTROLLER_METHOD_E } from 'brisk-controller';

@Controller('/test', { tag: 'test1' })
class TestDecorator1 {
  test1Data = 'test1';

  @RequestMapping('/test2', { method: BRISK_CONTROLLER_METHOD_E.POST })
  test2(@InHeader() a: number) {
	return {
	  msg: this.test1Data
	}
  }
}
```

## 8. InPath

参数装饰器（仅用于被RequestMapping装饰器装饰的方法参数），将对应参数与请求路径中的某个动态路径进行值映射，装饰器签名：

```ts
/**
 * InPath参数 装饰器
 * @param {option} BriskControllerDecoratorParam 选项
 * @returns
 */
export function InPath(option?: BriskControllerDecoratorParam): Function;
```

选项结构：同 Body 装饰器

案例：映射请求路径中的某个动态路径

```ts
import { Controller, RequestMapping, InPath, BRISK_CONTROLLER_METHOD_E } from 'brisk-controller';

@Controller('/test', { tag: 'test1' })
class TestDecorator1 {
  test1Data = 'test1';

  @RequestMapping('/test2/:a', { method: BRISK_CONTROLLER_METHOD_E.POST })
  test2(@InPath() a: number) {
	return {
	  msg: this.test1Data
	}
  }
}
```

## 9. InCookie

参数装饰器（仅用于被RequestMapping装饰器装饰的方法参数），将对应参数与Cookie中的某个字段进行值映射，装饰器签名：

```ts
/**
 * InCookie参数 装饰器
 * @param {option} BriskControllerDecoratorParam 选项
 * @returns
 */
export function InCookie(option?: BriskControllerDecoratorParam): Function;
```

选项结构：同 Body 装饰器

案例：映射Cookie中的某个字段

```ts
import { Controller, RequestMapping, InCookie, BRISK_CONTROLLER_METHOD_E } from 'brisk-controller';

@Controller('/test', { tag: 'test1' })
class TestDecorator1 {
  test1Data = 'test1';

  @RequestMapping('/test2', { method: BRISK_CONTROLLER_METHOD_E.POST })
  test2(@InCookie() a: number) {
	return {
	  msg: this.test1Data
	}
  }
}
```

## 10. InFile

TODO

## 11. Interceptor

方法装饰器，将一个方法映射为一个请求拦截器，装饰器签名：

```ts
/**
 * 拦截器 方法装饰器
 * @param path 路由路径
 * @param option 选项
 * @returns
 */
export function Interceptor(path: string, option?: BriskControllerDecoratorInterceptor): Function;
```

选项结构：

```ts
export interface BriskControllerDecoratorInterceptor {
  // 默认为get
  method?: BRISK_CONTROLLER_METHOD_E;
}
```

案例：添加一个拦截器

```ts
import { Controller, RequestMapping, InQuery, Interceptor, BRISK_CONTROLLER_METHOD_E, BriskControllerRequest } from 'brisk-controller';

@Controller('/test', { tag: 'test1' })
class TestDecorator1 {
  test1Data = 'test1';

  @Interceptor('/test2')
  test5Intercptor(req: BriskControllerRequest) {
	req.ctx.query.a = '2';
	return true;
  }

  @RequestMapping('/test2', { method: BRISK_CONTROLLER_METHOD_E.POST })
  test2(@InQuery() a: number) {
	return {
	  msg: this.test1Data
	}
  }
}
```