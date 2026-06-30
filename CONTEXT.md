# CONTEXT

## 词汇表 [Glossary]

### 最小可运行后台 [Runnable MVP Admin]

本项目第一轮交付的可运行 Northwind 管理系统基础版本。它覆盖商品 [Products]、客户 [Customers]、订单 [Orders]、仪表盘 [Dashboard]、报表 [Reports] 与健康检查 [Health Check] 的关键读路径 [Critical Read Paths]。

分类 [Categories] 与供应商 [Suppliers] 在该阶段只作为商品上下文 [Product Context] 的关联信息出现，不作为完整管理对象 [Managed Resources]。认证 [Authentication]、系统管理 [System Administration]、审计日志 [Audit Logs] 不属于该阶段。

### 只读 MVP [Read-only MVP]

最小可运行后台 [Runnable MVP Admin] 对 Northwind 原业务表 [Business Tables] 严格只读 [Read-only]。它允许查看列表 [Lists]、详情 [Details]、筛选 [Filtering]、排序 [Sorting]、分页 [Pagination]、统计 [Metrics] 与报表 [Reports]，不允许新增 [Create]、编辑 [Update] 或删除 [Delete] 商品 [Products]、客户 [Customers]、订单 [Orders] 等原业务数据。

后续若需要写操作 [Write Operations]，必须先重新定义对应业务规则 [Business Rules] 与数据保护边界 [Data Protection Boundary]。
