# 金额字段使用固定两位小数字符串 [Money Fields as Fixed Decimal Strings]

API 中的金额字段 [Money Fields] 统一返回固定两位小数字符串 [Fixed 2-decimal String]，例如 `"1234.50"`，用于避免 JavaScript `number` 的浮点精度问题 [Floating Point Precision] 影响表格展示 [Table Display] 与金额合计 [Money Totals]。折扣 [Discount] 保持 Northwind 数据库语义 [Database Semantics]，仍返回 `0` 到 `1` 的数字，并由前端展示为百分比 [Percentage]。

图表 [Charts] 需要数值输入时，由前端图表适配层 [Chart Adapter] 显式把金额字符串转换为数字，避免页面业务代码 [Page Business Logic] 隐式混用金额字符串与数字。
