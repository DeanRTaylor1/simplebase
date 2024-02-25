package db

import (
	"changeme/internal"
	"context"
	"errors"
	"fmt"

	"github.com/jackc/pgx/v5/pgxpool"
)

func NewDbPool(ctx context.Context, connString string) (*pgxpool.Pool, error) {
	pool, err := pgxpool.New(ctx, connString)
	if err != nil {
		fmt.Println(err.Error())
		return nil, errors.New("error connecting to db")
	}

	var testQueryResponse int
	err = pool.QueryRow(ctx, internal.Testquery).Scan(&testQueryResponse)
	if err != nil {
		fmt.Println("Test query failed:", err.Error())
		return nil, errors.New("test query failed")
	}

	fmt.Println("Database pool instantiated successfully")

	return pool, nil
}

func ListTables(ctx context.Context, pool *pgxpool.Pool) ([]string, error) {
	rows, err := pool.Query(ctx, internal.ListTablesQuery)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	tableNames := []string{}
	for rows.Next() {
		var tableName string
		if err := rows.Scan(&tableName); err != nil {
			return nil, err
		}
		tableNames = append(tableNames, tableName)
	}

	return tableNames, nil
}
