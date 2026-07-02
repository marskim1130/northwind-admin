import { describe, expect, it } from "vitest";
import { summarizeInspection } from "./db-inspection";

describe("数据库结构检查摘要 [Database Inspection Summary]", () => {
  it("根据 information_schema 行报告已发现表数量与缺失表 [Found and Missing Tables]", () => {
    const summary = summarizeInspection({
      requiredTables: ["products", "orders"],
      rows: [
        { tableName: "products", columnName: "product_id", dataType: "integer" },
        { tableName: "products", columnName: "product_name", dataType: "character varying" }
      ]
    });

    expect(summary.tablesInspected).toBe(1);
    expect(summary.missingTables).toEqual(["orders"]);
  });

  it("表存在但字段缺失时报告缺失字段 [Missing Columns]", () => {
    const summary = summarizeInspection({
      requiredTables: ["products"],
      requiredColumnsByTable: {
        products: ["product_id", "product_name", "unit_price"]
      },
      rows: [
        { tableName: "products", columnName: "product_id", dataType: "integer" },
        { tableName: "products", columnName: "product_name", dataType: "character varying" }
      ]
    });

    expect(summary.missingColumns).toEqual([
      { tableName: "products", columnName: "unit_price" }
    ]);
  });
});
