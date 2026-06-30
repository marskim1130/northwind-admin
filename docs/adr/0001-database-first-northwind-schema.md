# 数据库优先的 Northwind schema [Database-first Northwind Schema]

Northwind 业务表 [Business Tables] 已经存在于 PostgreSQL 中，并且是后台管理系统 [Admin System] 的源数据 [Source Data]。因此，本项目采用数据库优先 [Database-first]，而不是代码优先 [Code-first]：Drizzle schema 只负责映射现有表并提供类型化访问 [Typed Access]，MVP 脚本不得对 Northwind 业务表生成或执行破坏性迁移 [Destructive Migrations]。

未来只有明确归属于本系统的 `app_` 系统表 [System Tables] 才允许通过迁移 [Migrations] 管理。
