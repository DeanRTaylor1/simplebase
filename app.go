package main

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
func (a *App) startup(ctx context.Context) {
	a.ctx = ctx
}

func (a *App) shutdown(ctx context.Context) {
	if a.pool != nil {
		fmt.Println("Closing database connection pool...")
		a.pool.Close()
		fmt.Println("Database connection pool closed.")
	}
}

// Greet returns a greeting for the given name
func (a *App) Greet(name string) string {
	return fmt.Sprintf("Hello %s, It's show time!", name)
}

func (a *App) Hello(name string) string {
	return fmt.Sprintf("Hello World! from %s", name)
}

func (a *App) ConnectToDB(cfg DBConfig) (string, error) {
	port, err := strconv.Atoi(cfg.Port)
	if err != nil {
		return "", fmt.Errorf("unable to connect to the database: %v", err)
	}
	connString := fmt.Sprintf("host=%s port=%d user=%s password=%s dbname=%s sslmode=%s",
		cfg.Host, port, cfg.User, cfg.Password, cfg.DBName, cfg.SSLMode)

	pool, err := db.NewDbPool(context.Background(), connString)
	if err != nil {
		return "", fmt.Errorf("unable to connect to the database: %v", err)
	}
	a.pool = pool

	return ("Successfully connected to the database."), nil
}
