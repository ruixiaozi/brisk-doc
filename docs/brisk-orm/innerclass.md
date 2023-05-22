# 内部类型

0.0.4 加入

## 1. BriskOrmGeometryPoint

地理（Point）类型，对应数据库 （geometry） 类型，用于将被@Column装饰器修饰的字段转换为数据库地理信息类型，签名：

```ts
export declare class BriskOrmGeometryPoint extends BriskOrmInnerClass {
    longtitude: string;
    latitude: string;
    srid: string;
    static ormType?: BRISK_ORM_TYPE_E;
    static toObject(_value: any): BriskOrmGeometryPoint;
    // default：0, 0, 4326
    constructor(longtitude?: string, latitude?: string, srid?: string);
    toSqlString(): string;
}
```
