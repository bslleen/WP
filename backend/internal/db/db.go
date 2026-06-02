package db

import (
	"database/sql"
	"fmt"

	_ "github.com/glebarez/sqlite"
)

// Connect opens (or creates) the SQLite database at the given file path.
func Connect(path string) (*sql.DB, error) {
	if path == "" {
		path = "portfolio.db"
	}
	// _loc=auto  → datetime strings are parsed to time.Time automatically
	// journal_mode=WAL → better read concurrency
	dsn := fmt.Sprintf("file:%s?_pragma=journal_mode(WAL)&_loc=auto", path)
	db, err := sql.Open("sqlite", dsn)
	if err != nil {
		return nil, fmt.Errorf("opening db: %w", err)
	}
	if err := db.Ping(); err != nil {
		return nil, fmt.Errorf("pinging db: %w", err)
	}
	db.SetMaxOpenConns(1) // SQLite allows one writer at a time
	db.SetMaxIdleConns(1)
	return db, nil
}

// Migrate runs DDL to create tables and triggers if they don't exist.
func Migrate(db *sql.DB) error {
	schema := `
CREATE TABLE IF NOT EXISTS works (
    id           INTEGER PRIMARY KEY AUTOINCREMENT,
    title        TEXT    NOT NULL,
    description  TEXT    NOT NULL,
    excerpt      TEXT    DEFAULT '',
    category     TEXT    NOT NULL CHECK (category IN ('novel','poetry','short story')),
    year         TEXT    DEFAULT '',
    pages        INTEGER DEFAULT 0,
    status       TEXT    DEFAULT 'published' CHECK (status IN ('published','in progress','archived')),
    cover_image  TEXT    DEFAULT '',
    accent_color TEXT    DEFAULT '#c9a84c',
    created_at   DATETIME DEFAULT (datetime('now')),
    updated_at   DATETIME DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS journal_entries (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    title      TEXT    NOT NULL,
    body       TEXT    NOT NULL,
    excerpt    TEXT    DEFAULT '',
    category   TEXT    DEFAULT '',
    read_time  TEXT    DEFAULT '',
    published  INTEGER DEFAULT 1,
    created_at DATETIME DEFAULT (datetime('now')),
    updated_at DATETIME DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS private_entries (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    title      TEXT,
    body       TEXT    NOT NULL,
    created_at DATETIME DEFAULT (datetime('now')),
    updated_at DATETIME DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS config (
    key   TEXT PRIMARY KEY,
    value TEXT NOT NULL
);
`
	_, err := db.Exec(schema)
	return err
}
