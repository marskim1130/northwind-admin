# Northwind Admin

Northwind Admin 是一个基于既有 PostgreSQL Northwind 数据库的只读 MVP [Read-only MVP] 后台管理系统 [Admin System]。第一轮目标是跑通最小可运行后台 [Runnable MVP Admin]：健康检查 [Health Check]、工程骨架 [Project Skeleton]、shared API 契约类型 [API Contract Types]、前端工作台外壳 [Workbench Shell] 与后端测试入口 [Test Harness]。

## 当前状态 [Current Status]

- 已初始化 pnpm workspace [Workspace]
- 已创建 `apps/api`、`apps/web`、`packages/shared`
- 已提供 `.env.example`
- 已提供只读数据库检查脚本 [Read-only Database Inspection Script] 入口
- 已写入第一个 RED 测试 [Failing Test]：`GET /api/health` 应返回统一成功响应 [Unified Success Response]

## 安装 [Install]

```bash
pnpm install
```

## 环境变量 [Environment Variables]

复制 `.env.example` 为 `.env`，并配置真实数据库连接：

```bash
DATABASE_URL=postgresql://USER:PASSWORD@HOST:5432/northwind
API_PORT=3000
VITE_API_BASE_URL=http://localhost:3000
```

不要把真实密码提交到仓库 [Repository]。

## 常用命令 [Commands]

```bash
pnpm dev
pnpm dev:api
pnpm dev:web
pnpm typecheck
pnpm test
pnpm test:api
pnpm db:inspect
pnpm build
```

## TDD 当前步骤 [Current TDD Step]

当前处于红 [RED] 阶段：项目已经包含一个失败测试 [Failing Test]，但尚未实现 `/api/health`。请运行：

```bash
pnpm test:api
```

预期结果 [Expected Result]：测试失败，因为 `/api/health` 尚未返回统一成功响应 [Unified Success Response]。

## MVP 边界 [MVP Boundary]

本轮只实现只读 MVP [Read-only MVP]。Northwind 原业务表 [Business Tables] 不允许新增 [Create]、编辑 [Update] 或删除 [Delete]。真实认证 [Real Authentication]、系统管理 [System Administration] 与审计日志 [Audit Logs] 延后。
