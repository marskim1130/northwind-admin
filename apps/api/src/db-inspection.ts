export interface InformationSchemaColumn {
  tableName: string;
  columnName: string;
  dataType: string;
}

export interface InspectionSummary {
  tablesInspected: number;
  missingTables: string[];
  missingColumns: Array<{
    tableName: string;
    columnName: string;
  }>;
}

interface SummarizeInspectionInput {
  requiredTables: string[];
  requiredColumnsByTable?: Record<string, string[]>;
  rows: InformationSchemaColumn[];
}

export function summarizeInspection(input: SummarizeInspectionInput): InspectionSummary {
  const foundTables = new Set(input.rows.map((row) => row.tableName));
  const foundColumnsByTable = new Map<string, Set<string>>();

  for (const row of input.rows) {
    const foundColumns = foundColumnsByTable.get(row.tableName) ?? new Set<string>();
    foundColumns.add(row.columnName);
    foundColumnsByTable.set(row.tableName, foundColumns);
  }

  const missingColumns = Object.entries(input.requiredColumnsByTable ?? {}).flatMap(
    ([tableName, columnNames]) => {
      if (!foundTables.has(tableName)) {
        return [];
      }

      const foundColumns = foundColumnsByTable.get(tableName) ?? new Set<string>();

      return columnNames
        .filter((columnName) => !foundColumns.has(columnName))
        .map((columnName) => ({ tableName, columnName }));
    }
  );

  return {
    tablesInspected: foundTables.size,
    missingTables: input.requiredTables.filter((tableName) => !foundTables.has(tableName)),
    missingColumns
  };
}
