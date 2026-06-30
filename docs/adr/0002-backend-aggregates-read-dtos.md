# 后端聚合读取 DTO [Backend-aggregated Read DTOs]

最小可运行后台 [Runnable MVP Admin] 的读取接口 [Read APIs] 由后端负责聚合 [Backend Aggregation] 页面所需数据，并返回面向页面的 DTO [Data Transfer Object]。例如商品列表 [Products List] 直接返回分类名称 [Category Name]、供应商名称 [Supplier Name] 与低库存标记 [Low Stock Flag]；订单详情 [Order Detail] 直接返回客户 [Customer]、员工 [Employee]、物流商 [Shipper]、订单明细 [Order Details]、金额合计 [Totals] 与订单状态 [Order Status]。

这样做会让 API 契约 [API Contract] 更贴近页面读模型 [Read Model]，并把金额计算 [Money Calculation]、状态推导 [Status Derivation] 等业务规则 [Business Rules] 留在后端，避免前端通过多个接口拼装并重复实现规则。
