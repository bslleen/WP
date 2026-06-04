package db

import (
	"database/sql"
	"fmt"
	"os"

	_ "github.com/lib/pq"
)

// Connect opens a PostgreSQL database using DATABASE_URL.
func Connect(databaseURL string) (*sql.DB, error) {
	if databaseURL == "" {
		databaseURL = os.Getenv("DATABASE_URL")
	}
	if databaseURL == "" {
		return nil, fmt.Errorf("DATABASE_URL is not set")
	}
	db, err := sql.Open("postgres", databaseURL)
	if err != nil {
		return nil, fmt.Errorf("opening db: %w", err)
	}
	if err := db.Ping(); err != nil {
		return nil, fmt.Errorf("pinging db: %w", err)
	}
	return db, nil
}

// Migrate creates tables if they don't exist.
func Migrate(db *sql.DB) error {
	schema := `
CREATE TABLE IF NOT EXISTS works (
    id           SERIAL PRIMARY KEY,
    title        TEXT    NOT NULL,
    description  TEXT    NOT NULL,
    excerpt      TEXT    DEFAULT '',
    category     TEXT    NOT NULL CHECK (category IN ('novel','poetry','short story')),
    year         TEXT    DEFAULT '',
    pages        INTEGER DEFAULT 0,
    status       TEXT    DEFAULT 'published' CHECK (status IN ('published','in progress','archived')),
    cover_image  TEXT    DEFAULT '',
    accent_color TEXT    DEFAULT '#c9a84c',
    created_at   TIMESTAMPTZ DEFAULT NOW(),
    updated_at   TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS journal_entries (
    id         SERIAL PRIMARY KEY,
    title      TEXT    NOT NULL,
    body       TEXT    NOT NULL,
    excerpt    TEXT    DEFAULT '',
    category   TEXT    DEFAULT '',
    read_time  TEXT    DEFAULT '',
    published  INTEGER DEFAULT 1,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS private_entries (
    id         SERIAL PRIMARY KEY,
    title      TEXT,
    body       TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS config (
    key   TEXT PRIMARY KEY,
    value TEXT NOT NULL
);
`
	_, err := db.Exec(schema)
	return err
}
