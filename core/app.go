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

type TableData struct {
	TableData [][]db.ColumnData `json:"table_data"`
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

func (a *App) FetchSchema(tableName string) ([]db.TableColumn, error) {

	cols, err := db.FetchTableSchema(a.ctx, a.pool, tableName)
	if err != nil {
		return []db.TableColumn{}, fmt.Errorf("unable to connect to the database: %v", err)
	}

	return cols, nil
}

// // Assuming db.TableData is similar but not identical to TableData
// func convertDBTableDataToAppTableData(dbData db.TableData) TableData {
// 	var appData TableData
// 	for _, dbRow := range dbData {
// 		var appRow []ColumnData
// 		for _, dbCol := range dbRow {
// 			appCol := ColumnData{
// 				ColumnName: dbCol.ColumnName,
// 				Value:      dbCol.Value,
// 			}
// 			appRow = append(appRow, appCol)
// 		}
// 		appData.TableData = append(appData.TableData, appRow)
// 	}
// 	return appData
// }

func (a *App) DefaultFetchTableData(tableName string, offset uint64, limit uint64) (TableData, error) {
	dbData, err := db.DefaultFetchTableData(a.ctx, a.pool, tableName, offset, limit)
	if err != nil {
		fmt.Println("error")
		return TableData{}, fmt.Errorf("unable to connect to the database: %v", err)
	}

	return TableData{TableData: dbData}, nil
}

func (a *App) ExportColumnDataType() db.ColumnData {
	return db.ColumnData{}
}
