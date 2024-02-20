package internal

const (
	ListTablesQuery = `SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'`
	Testquery       = "SELECT 1"
)
