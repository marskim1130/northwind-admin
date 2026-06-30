# MVP 延后真实认证 [Defer Real Authentication for MVP]

最小可运行后台 [Runnable MVP Admin] 的优先目标是跑通真实 Northwind 数据库的关键读路径 [Critical Read Paths]，因此本轮不实现真实认证 [Real Authentication]、JWT、`app_` 系统表 [System Tables] 或默认管理员种子数据 [Admin Seed Data]。前端可以保留 `/login` 路由 [Login Route]、认证状态存储 [Authentication Store] 与开发模式占位用户 [Development Placeholder User]，但它们不构成生产级认证边界 [Production Authentication Boundary]。

真实认证 [Real Authentication] 需要单独进入后续 PRD [Product Requirements Document]，再明确用户 [Users]、角色 [Roles]、权限 [Permissions]、审计日志 [Audit Logs] 与生产密码策略 [Production Password Policy]。
