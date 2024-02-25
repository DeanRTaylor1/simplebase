package db

import (
	"context"

	"github.com/jackc/pgx/v5"
)

type DBConnector interface {
	Connect(ctx context.Context, connString string) (DBQuerier, error)
}

type DBQuerier interface {
	QueryRow(ctx context.Context, sql string, args ...interface{}) DBScanner
	Close(ctx context.Context) error
}

type DBScanner interface {
	Scan(dest ...interface{}) error
}

type PgxPoolWrapper struct{}

func (p *PgxPoolWrapper) Connect(ctx context.Context, connString string) (DBQuerier, error) {
	conn, err := pgx.Connect(ctx, connString)
	if err != nil {
		return nil, err
	}
	return &PgxConnWrapper{conn: conn}, nil
}

type PgxConnWrapper struct {
	conn *pgx.Conn
}

func (c *PgxConnWrapper) QueryRow(ctx context.Context, sql string, args ...interface{}) DBScanner {
	return c.conn.QueryRow(ctx, sql, args...)
}

func (c *PgxConnWrapper) Close(ctx context.Context) error {
	return c.conn.Close(ctx)
}
