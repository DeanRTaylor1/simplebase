package db

import (
	"context"
	"fmt"

	"github.com/jackc/pgx/v5/pgxpool"
)

type TableSizeInfo struct {
	TotalSize int64
	DataSize  int64
	IndexSize int64
	Comment   string
}

func GetTableSizeInfo(ctx context.Context, pool *pgxpool.Pool, schemaName, tableName string) ([]TableSizeInfo, error) {
	query := fmt.Sprintf(`
SELECT
  pg_total_relation_size(relid) AS total_size,
  pg_table_size(relid) AS data_size,
  pg_indexes_size(relid) AS index_size,
  obj_description(relid, 'pg_class') AS comment
FROM
  pg_catalog.pg_statio_user_tables
WHERE
  schemaname = '%s'
  AND relname = '%s'
UNION
SELECT
  NULL AS total_size,
  NULL AS data_size,
  NULL AS index_size,
  obj_description(p.oid, 'pg_proc') AS comment
FROM
  pg_catalog.pg_proc p
  LEFT JOIN pg_catalog.pg_namespace n ON n.oid = p.pronamespace
WHERE
  n.nspname = '%s'
 AND p.proname = '%s'
UNION
SELECT
  NULL AS total_size,
  NULL AS data_size,
  NULL AS index_size,
  obj_description(p.oid, 'pg_class') AS comment
FROM
  pg_catalog.pg_class p
  LEFT JOIN pg_catalog.pg_namespace n ON n.oid = p.relnamespace
WHERE
  n.nspname = '%s'
  AND p.relname = '%s'
  AND p.relkind = 'v';
`, schemaName, tableName, schemaName, tableName, schemaName, tableName)

	rows, err := pool.Query(ctx, query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var results []TableSizeInfo
	for rows.Next() {
		var info TableSizeInfo
		if err := rows.Scan(&info.TotalSize, &info.DataSize, &info.IndexSize, &info.Comment); err != nil {
			return nil, err
		}
		results = append(results, info)
	}

	return results, nil
}

type TableColumn struct {
	ColumnName string `json:"columnName"`
	DataType   string `json:"dataType"`
}

func FetchTableSchema(ctx context.Context, pool *pgxpool.Pool, tableName string) ([]TableColumn, error) {
	query := `
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = $1
ORDER BY ordinal_position;
`
	rows, err := pool.Query(ctx, query, tableName)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var columns []TableColumn
	for rows.Next() {
		var col TableColumn
		if err := rows.Scan(&col.ColumnName, &col.DataType); err != nil {
			return nil, err
		}
		columns = append(columns, col)
	}

	return columns, nil
}
