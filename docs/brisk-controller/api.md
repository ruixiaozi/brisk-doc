# API

## 1. start

启动控制器，方法签名：

```ts
/**
 * 开始运行
 * @param port 端口，默认3000
 * @param option 选项
 * @return Koa koa实例
 */
export function start(port: number = 3000, option?: BriskControllerOption): Promise<Koa>;
```

选项结构：

```ts
export interface BriskControllerOption {
  // 是否开启跨域，默认false
  cors?: boolean;
  // 全局基地址，默认 /
  globalBaseUrl?: string;
  // 静态文件根路径，默认不开启
  staticPath?: string;
  // swagger，默认不开启
  swagger?: boolean;
}
```

## 2. distory

停止控制器，方法签名：

```ts
export function distory(): Promise<void>;
```

## 3. addRequest

添加请求处理器，用于处理指定路由的处理器，方法签名：

```ts
/**
 * 添加Request
 * @param requestPath 路径
 * @param handler 请求处理器
 * @param option 路由选项
 */
export function addRequest(requestPath: string, handler: BriskControllerRequestHandler, option?: BriskControllerRequestOption): void;
```

选项结构：

```ts
// 返回值将被作为响应内容，如果是一个对象，则返回json，如果是字符串，则返回text
// 返回值也可以是redirect或者forward方法的结果，参考对应api
export type BriskControllerRequestHandler = (...params: any[]) => any;

// 参数是什么方法获取
export declare enum BRISK_CONTROLLER_PARAMETER_IS_E {
    IN_BODY = "inBody",
    BODY = "body",
    FORM_DATA = "formData",
    QUERY = "query",
    HEADER = "header",
    PATH = "path",
    // TODO：待处理
    FILE = "file",
    COOKIE = "cookie",
    // 不需要赋值参数
    NULL = "null",
    // 用于拦截器、转发请求传递数据
    STATE='state',
}

// TODO: 校验器
export type BriskControllerValidator = (value: any) => {
    [key: string]: any | null;
} | null;

// 参数描述
export interface BriskControllerParameter {
  // 参数实际名称
  name: string;
  is: BRISK_CONTROLLER_PARAMETER_IS_E;
  description?: string;
  required?: boolean;
  // 类型
  type?: TypeKind;
  // 默认值
  default?: any;
  // 校验器
  validator?: BriskControllerValidator;
}

export interface BriskControllerInterceptorOption {
  // 默认为GET
  method?: BRISK_CONTROLLER_METHOD_E | BRISK_CONTROLLER_METHOD_E[];
  // 基础地址，默认相对于globalBaseUrl的根路径
  baseUrl?: string;
}

export interface BriskControllerSwaggerTag {
  name: string;
  description?: string;
}

export interface BriskControllerRedirectInfo {
  // 可能的跳转地址列表
  urls: string[];
  // 默认301
  status?: number;
}

export interface BriskControllerRequestOption extends BriskControllerInterceptorOption {
  // 接口具体名称
  name?: string;
  // 接口标题
  title?: string;
  // 描述
  description?: string;
  // 参数列表
  params?: BriskControllerParameter[];
  // 标签
  tag?: BriskControllerSwaggerTag;
  // 成功响应体类型，默认为any类型
  successResponseType?: TypeKind;
  // 跳转信息，仅当返回redrect方法时
  redirect?: BriskControllerRedirectInfo;
}
```

案例：添加一个路由处理器

```ts
import BriskController from 'brisk-controller';

BriskController.addRequest('/test1', (a: number, b: boolean) => {
  console.log(a); // 1
  console.log(b); // true
  return {
	msg: 'test1'
  }
}, {
  params: [
	{
	  name: 'a',
	  is: BRISK_CONTROLLER_PARAMETER_IS_E.QUERY,
	  required: true,
	  type: 'number',
	},
	{
	  name: 'b',
	  is: BRISK_CONTROLLER_PARAMETER_IS_E.QUERY,
	  required: true,
	  type: 'boolean',
	},
  ]
});
const app = await BriskController.start();
// 访问 http://localhost:3000/test1?a=1&b=true
// 返回： {"msg": "test1"}
```

## 4. redirect

跳转到其他路由，仅用于 addRequest 中 handler处理器的返回值，方法签名：

```ts
/**
 * 路由跳转
 * @param targetPath 目标路由
 * @param status 状态码，默认301
 * @returns
 */
export function redirect(targetPath: string, status: number = 301): BriskControllerRedirect;
```

案例：301跳转

```ts
import BriskController from 'brisk-controller';

BriskController.addRequest('/test12/2', () => {
  return redirect('/test12/1');
}, {
  redirect: {
    targetPath: '/test12/1',
	status: 301
  }
});
const app = await BriskController.start();
// 访问 http://localhost:3000/test12/2
// 返回：301 -> http://localhost:3000/test12/1
```

## 5. forward

转发到其他路由，仅用于 addRequest 中 handler处理器的返回值，方法签名：

```ts
/**
 * 路由转发
 * @param targetPath 目标路由
 * @param method 转发方法，默认get
 * @returns
 */
export async function forward<T>(targetPath: string, method = BRISK_CONTROLLER_METHOD_E.GET): Promise<T>
```

案例：路由转发

```ts
import BriskController from 'brisk-controller';

BriskController.addRequest('/test13/1', () => {
  return {
	msg: 'test13'
  };
});
BriskController.addRequest('/test13/2', async () => {
  return await forward('/test13/1');
});
const app = await BriskController.start();
// 访问 http://localhost:3000/test13/2
// 返回：{ "msg": "test13" }
```

## 6. addInterceptor

添加路由拦截器，拦截器在路由请求处理器之前以添加顺序执行，方法签名：

```ts
/**
 * 添加拦截器
 * @param requestPath 路径
 * @param fn 路由处理器
 * @param option 拦截器选项
 */
export function addInterceptor(requestPath: string, handler: BriskControllerInterceptorHandler, option?: BriskControllerInterceptorOption): void;
```

选项结构：

```ts
export {
  Request as BriskControllerRequest,
  Response as BriskControllerResponse,
} from 'koa';

// 拦截器处理方法，返回true则继续执行，不返回或者返回false，终止向下执行
export type BriskControllerInterceptorHandler = (req: BriskControllerRequest, res: BriskControllerResponse) => boolean | void;

export interface BriskControllerInterceptorOption {
  // 默认为GET
  method?: BRISK_CONTROLLER_METHOD_E;
  // 基础地址，默认相对于globalBaseUrl的根路径
  baseUrl?: string;
}
```

案例：添加前置拦截器

```ts
import BriskController from 'brisk-controller';

BriskController.addInterceptor('/test10', (req, res) => {
  req.query.a = '1';
  return true;
});
BriskController.addInterceptor('/test10', (req, res) => {
  req.query.a = '2';
  return true;
});
BriskController.addRequest('/test10', (a: number) => {
  console.log(a); // 2
  return {
	msg: a
  }
}, {
  params: [
	{
	  name: 'a',
	  is: BRISK_CONTROLLER_PARAMETER_IS_E.QUERY,
	  required: true,
	  type: 'number',
	},
  ]
});
const app = await BriskController.start();
// 访问 http://localhost:3000/test10
// 返回：{ "msg": 2 }
```

## 7. throwError

已弃用，使用 `BriskControllerError` 异常类处理

抛出异常响应（可用于addRequest或者addInterceptor中的handler方法内），并终止方法执行，立即响应请求，方法签名：

```ts
/**
 * 抛出错误响应
 * @deprecated
 * @link BriskControllerError 可以抛出BriskControllerError异常代替此方法
 * @param status 状态码
 * @param msg 错误内容
 */
export function throwError(status: number, msg?: any): void;

export declare class BriskControllerError extends Error {
    status: number;
    text?: string | any;
    headers?: BriskControllerHeaders;
    constructor(_status: number, headers: BriskControllerHeaders, _text?: string);
    constructor(_status?: number, _text?: string);
    
    // 0.0.4 加入
    setBody(body: any): void;
}
```

案例：校验参数，返回400错误

```ts
import BriskController, { BriskControllerError } from 'brisk-controller';

BriskController.addRequest('/test1', (a: number, b: boolean) => {
  if (a !== 1) {
    // 已弃用：throwError(400, 'param a is error');
    // 抛出控制层异常
    throw new BriskControllerError(400, 'param a is error');
  }
  return {
	msg: 'test1'
  }
}, {
  params: [
	{
	  name: 'a',
	  is: BRISK_CONTROLLER_PARAMETER_IS_E.QUERY,
	  required: true,
	  type: 'number',
	},
	{
	  name: 'b',
	  is: BRISK_CONTROLLER_PARAMETER_IS_E.QUERY,
	  required: true,
	  type: 'boolean',
	},
  ]
});
const app = await BriskController.start();
// 访问 http://localhost:3000/test1?a=2&b=true
// 返回： 400 -> param a is error
```

## 8. resultFactory


返回结果工厂，通过返回结果工厂的toResult()返回的对象，可以用作addRequest的handler的返回值。主要场景为设置响应头和cookie。方法签名：

```ts
/**
 * 返回结果工厂
 * @param result 返回对象
 * @returns 返回一个工厂对象
 */
export declare function resultFactory<T>(result: T): BriskControllerResultFactory<T>;

export interface BriskControllerResultFactory<T> {
  setCookie(key: string, value: string, option?: BriskControllerCookieOption): BriskControllerResultFactory<T>;

  setHeader(key: string, value: string): BriskControllerResultFactory<T>;

  toResult(): T;
}

```

## 9. addHook

添加钩子，可以添加控制层前置和后置钩子，方法签名：

```ts
// 添加钩子
export function addHook(pos: 'before_start' | 'after_start', hook: BriskControllerHooks): void;

export interface BriskControllerHooks {
  priority: number;
  handler: () => Promise<void> | void;
}

```

## 10. getBaseUrl

获取当前控制层的基地址，方法签名：

```ts
export function getBaseUrl(): string;
```

## 11. getSwaggerConfig

获取当前的swagger的配置信息，方法签名：

```ts
export function getSwaggerConfig(): string;
```

