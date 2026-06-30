# shared 包只包含 API 契约类型 [Shared Package Contains API Contract Types Only]

`packages/shared` 只保存 API 契约类型 [API Contract Types]、统一响应类型 [Shared Response Types]、分页类型 [Pagination Types] 与纯工具类型 [Pure Utility Types]。这些类型面向前后端共同遵守的接口契约 [Interface Contract]，统一使用 camelCase，不包含 Drizzle schema、数据库字段名 [Database Field Names]、服务层内部类型 [Service Internal Types] 或任何数据库所有权 [Database Ownership] 信息。

这样做可以让前端依赖稳定的读取 DTO [Read DTO]，而不是依赖后端内部实现 [Backend Internals]。snake_case 到 camelCase 的映射 [Mapping] 由后端完成，并在 API 边界 [API Boundary] 处停止。
