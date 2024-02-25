package db

import (
	"context"
	"errors"
	"fmt"

	"github.com/deanrtaylor1/simplebase/internal"
	"github.com/jackc/pgx/v5/pgxpool"
)

func TestConnection(ctx context.Context, connString string, connector DBConnector) (bool, DBQuerier) {
	conn, err := connector.Connect(ctx, connString)
	if err != nil {
		fmt.Println("Failed to connect to database:", err)
		return false, nil
	}

	return true, conn
}

func RunTestQuery(ctx context.Context, conn DBQuerier) bool {
	defer conn.Close(ctx)
	var testQueryResponse int
	err := conn.QueryRow(ctx, internal.Testquery).Scan(&testQueryResponse)
	if err != nil {
		fmt.Println("Test query failed:", err)
		return false
	}
	return true
}

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
