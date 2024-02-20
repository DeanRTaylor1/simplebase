package core

import (
	"changeme/db"
	"context"
	"fmt"
	"strconv"

	"github.com/jackc/pgx/v5/pgxpool"
)

type DBConfig struct {
	Host     string `json:"host"`
	Port     string `json:"port"`
	User     string `json:"user"`
	Password string `json:"password"`
	DBName   string `json:"dbname"`
	SSLMode  string `json:"sslmode"`
}

type Tables struct {
	TableNames []string `json:"table_names"`
}

// App struct
type App struct {
	ctx  context.Context
	pool *pgxpool.Pool
}

// NewApp creates a new App application struct
func NewApp() *App {
	return &App{}
}

// startup is called when the app starts. The context is saved
// so we can call the runtime methods
func (a *App) Startup(ctx context.Context) {
	a.ctx = ctx
}

func (a *App) Shutdown(ctx context.Context) {
	if a.pool != nil {
		fmt.Println("Closing database connection pool...")
		a.pool.Close()
		fmt.Println("Database connection pool closed.")
	}
}

func (a *App) ConnectToDB(cfg DBConfig) (string, error) {
	fmt.Println(cfg)
	port, err := strconv.Atoi(cfg.Port)
	if err != nil {
		return "", fmt.Errorf("unable to connect to the database: %v", err)
	}
	connString := fmt.Sprintf("host=%s port=%d user=%s password=%s dbname=%s sslmode=%s",
		cfg.Host, port, cfg.User, cfg.Password, cfg.DBName, cfg.SSLMode)

	fmt.Println(connString)
	pool, err := db.NewDbPool(context.Background(), connString)
	if err != nil {
		return "", fmt.Errorf("unable to connect to the database: %v", err)
	}
	a.pool = pool

	return ("Successfully connected to the database."), nil
}

func (a *App) ListTables() (Tables, error) {

	tables, err := db.ListTables(a.ctx, a.pool)
	if err != nil {
		return Tables{}, fmt.Errorf("unable to connect to the database: %v", err)
	}

	return Tables{TableNames: tables}, nil
}
