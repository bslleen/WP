package handlers

import (
	"context"
	"database/sql"
	"encoding/json"
	"fmt"
	"net/http"
	"os"
	"strconv"
	"strings"
	"time"

	"github.com/cloudinary/cloudinary-go/v2"
	"github.com/cloudinary/cloudinary-go/v2/api/uploader"
	"github.com/gin-gonic/gin"
	"golang.org/x/crypto/bcrypt"

	"writer-portfolio/internal/middleware"
	"writer-portfolio/internal/models"
)

type Handler struct {
	db *sql.DB
}

func New(db *sql.DB) *Handler {
	return &Handler{db: db}
}

// ─── AUTH ────────────────────────────────────────────────────────────────────

// POST /api/v1/auth/login
func (h *Handler) Login(c *gin.Context) {
	var req models.LoginRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var storedPassword string
	fromDB := true
	if err := h.db.QueryRowContext(c, `SELECT value FROM config WHERE key = 'owner_password'`).Scan(&storedPassword); err != nil {
		fromDB = false
		storedPassword = os.Getenv("OWNER_PASSWORD")
		if storedPassword == "" {
			storedPassword = "inkandashes"
		}
	}

	var authed bool
	if fromDB && strings.HasPrefix(storedPassword, "$2") {
		authed = bcrypt.CompareHashAndPassword([]byte(storedPassword), []byte(req.Password)) == nil
	} else {
		authed = req.Password == storedPassword
	}
	if !authed {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "incorrect password"})
		return
	}

	token, err := middleware.GenerateToken(os.Getenv("JWT_SECRET"))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "could not generate token"})
		return
	}
	c.JSON(http.StatusOK, models.LoginResponse{Token: token})
}

// ─── WORKS ───────────────────────────────────────────────────────────────────

// GET /api/v1/works?category=novel&status=published
func (h *Handler) GetWorks(c *gin.Context) {
	query := `SELECT id, title, description, COALESCE(excerpt,''), category, COALESCE(year,''),
		pages, status, COALESCE(cover_image,''), COALESCE(accent_color,'#c9a84c'), created_at, updated_at
		FROM works WHERE 1=1`
	args := []interface{}{}
	n := 0

	if cat := c.Query("category"); cat != "" {
		n++
		query += fmt.Sprintf(" AND category = $%d", n)
		args = append(args, cat)
	}
	if status := c.Query("status"); status != "" {
		n++
		query += fmt.Sprintf(" AND status = $%d", n)
		args = append(args, status)
	}
	query += " ORDER BY created_at DESC"

	rows, err := h.db.QueryContext(c, query, args...)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	defer rows.Close()

	works := []models.Work{}
	for rows.Next() {
		var w models.Work
		if err := rows.Scan(&w.ID, &w.Title, &w.Description, &w.Excerpt, &w.Category,
			&w.Year, &w.Pages, &w.Status, &w.CoverImage, &w.AccentColor,
			&w.CreatedAt, &w.UpdatedAt); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		works = append(works, w)
	}
	c.JSON(http.StatusOK, works)
}

// GET /api/v1/works/:id
func (h *Handler) GetWork(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid id"})
		return
	}
	var w models.Work
	err = h.db.QueryRowContext(c, `SELECT id, title, description, COALESCE(excerpt,''), category,
		COALESCE(year,''), pages, status, COALESCE(cover_image,''), COALESCE(accent_color,'#c9a84c'),
		created_at, updated_at FROM works WHERE id = $1`, id).Scan(
		&w.ID, &w.Title, &w.Description, &w.Excerpt, &w.Category, &w.Year, &w.Pages,
		&w.Status, &w.CoverImage, &w.AccentColor, &w.CreatedAt, &w.UpdatedAt)
	if err == sql.ErrNoRows {
		c.JSON(http.StatusNotFound, gin.H{"error": "not found"})
		return
	} else if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, w)
}

// POST /api/v1/works  (protected)
func (h *Handler) CreateWork(c *gin.Context) {
	var req models.CreateWorkRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	if req.Status == "" {
		req.Status = "published"
	}
	if req.AccentColor == "" {
		req.AccentColor = "#c9a84c"
	}

	var w models.Work
	err := h.db.QueryRowContext(c,
		`INSERT INTO works (title, description, excerpt, category, year, pages, status, cover_image, accent_color)
		VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
		RETURNING id, title, description, COALESCE(excerpt,''), category, COALESCE(year,''),
		pages, status, COALESCE(cover_image,''), COALESCE(accent_color,'#c9a84c'), created_at, updated_at`,
		req.Title, req.Description, req.Excerpt, req.Category, req.Year,
		req.Pages, req.Status, req.CoverImage, req.AccentColor).Scan(
		&w.ID, &w.Title, &w.Description, &w.Excerpt, &w.Category, &w.Year,
		&w.Pages, &w.Status, &w.CoverImage, &w.AccentColor, &w.CreatedAt, &w.UpdatedAt)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusCreated, w)
}

// PUT /api/v1/works/:id  (protected)
func (h *Handler) UpdateWork(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid id"})
		return
	}
	var req models.UpdateWorkRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var w models.Work
	err = h.db.QueryRowContext(c, `SELECT id, title, description, COALESCE(excerpt,''), category,
		COALESCE(year,''), pages, status, COALESCE(cover_image,''), COALESCE(accent_color,'#c9a84c'),
		created_at, updated_at FROM works WHERE id = $1`, id).Scan(
		&w.ID, &w.Title, &w.Description, &w.Excerpt, &w.Category, &w.Year,
		&w.Pages, &w.Status, &w.CoverImage, &w.AccentColor, &w.CreatedAt, &w.UpdatedAt)
	if err == sql.ErrNoRows {
		c.JSON(http.StatusNotFound, gin.H{"error": "not found"})
		return
	} else if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	if req.Title != nil       { w.Title = *req.Title }
	if req.Description != nil { w.Description = *req.Description }
	if req.Excerpt != nil     { w.Excerpt = *req.Excerpt }
	if req.Category != nil    { w.Category = *req.Category }
	if req.Year != nil        { w.Year = *req.Year }
	if req.Pages != nil       { w.Pages = *req.Pages }
	if req.Status != nil      { w.Status = *req.Status }
	if req.CoverImage != nil  { w.CoverImage = *req.CoverImage }
	if req.AccentColor != nil { w.AccentColor = *req.AccentColor }

	err = h.db.QueryRowContext(c,
		`UPDATE works SET title=$1, description=$2, excerpt=$3, category=$4, year=$5,
		pages=$6, status=$7, cover_image=$8, accent_color=$9, updated_at=NOW()
		WHERE id=$10 RETURNING updated_at`,
		w.Title, w.Description, w.Excerpt, w.Category, w.Year,
		w.Pages, w.Status, w.CoverImage, w.AccentColor, id).Scan(&w.UpdatedAt)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, w)
}

// DELETE /api/v1/works/:id  (protected)
func (h *Handler) DeleteWork(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid id"})
		return
	}
	res, err := h.db.ExecContext(c, `DELETE FROM works WHERE id = $1`, id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	n, _ := res.RowsAffected()
	if n == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "not found"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"deleted": id})
}

// ─── JOURNAL ─────────────────────────────────────────────────────────────────

// GET /api/v1/journal
func (h *Handler) GetJournalEntries(c *gin.Context) {
	rows, err := h.db.QueryContext(c,
		`SELECT id, title, body, COALESCE(excerpt,''), COALESCE(category,''),
		COALESCE(read_time,''), published, created_at, updated_at
		FROM journal_entries WHERE published = 1 ORDER BY created_at DESC`)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	defer rows.Close()

	entries := []models.JournalEntry{}
	for rows.Next() {
		var e models.JournalEntry
		if err := rows.Scan(&e.ID, &e.Title, &e.Body, &e.Excerpt, &e.Category,
			&e.ReadTime, &e.Published, &e.CreatedAt, &e.UpdatedAt); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		entries = append(entries, e)
	}
	c.JSON(http.StatusOK, entries)
}

// GET /api/v1/journal/:id
func (h *Handler) GetJournalEntry(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid id"})
		return
	}
	var e models.JournalEntry
	err = h.db.QueryRowContext(c,
		`SELECT id, title, body, COALESCE(excerpt,''), COALESCE(category,''),
		COALESCE(read_time,''), published, created_at, updated_at
		FROM journal_entries WHERE id = $1 AND published = 1`, id).Scan(
		&e.ID, &e.Title, &e.Body, &e.Excerpt, &e.Category,
		&e.ReadTime, &e.Published, &e.CreatedAt, &e.UpdatedAt)
	if err == sql.ErrNoRows {
		c.JSON(http.StatusNotFound, gin.H{"error": "not found"})
		return
	} else if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, e)
}

// POST /api/v1/journal  (protected)
func (h *Handler) CreateJournalEntry(c *gin.Context) {
	var req models.CreateJournalRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	published := true
	if req.Published != nil {
		published = *req.Published
	}

	var e models.JournalEntry
	err := h.db.QueryRowContext(c,
		`INSERT INTO journal_entries (title, body, excerpt, category, read_time, published)
		VALUES ($1,$2,$3,$4,$5,$6)
		RETURNING id, title, body, COALESCE(excerpt,''), COALESCE(category,''),
		COALESCE(read_time,''), published, created_at, updated_at`,
		req.Title, req.Body, req.Excerpt, req.Category, req.ReadTime, published).Scan(
		&e.ID, &e.Title, &e.Body, &e.Excerpt, &e.Category,
		&e.ReadTime, &e.Published, &e.CreatedAt, &e.UpdatedAt)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusCreated, e)
}

// PUT /api/v1/journal/:id  (protected)
func (h *Handler) UpdateJournalEntry(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid id"})
		return
	}
	var req models.UpdateJournalRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var e models.JournalEntry
	err = h.db.QueryRowContext(c,
		`SELECT id, title, body, COALESCE(excerpt,''), COALESCE(category,''),
		COALESCE(read_time,''), published, created_at, updated_at
		FROM journal_entries WHERE id = $1`, id).Scan(
		&e.ID, &e.Title, &e.Body, &e.Excerpt, &e.Category,
		&e.ReadTime, &e.Published, &e.CreatedAt, &e.UpdatedAt)
	if err == sql.ErrNoRows {
		c.JSON(http.StatusNotFound, gin.H{"error": "not found"})
		return
	} else if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	if req.Title != nil     { e.Title = *req.Title }
	if req.Body != nil      { e.Body = *req.Body }
	if req.Excerpt != nil   { e.Excerpt = *req.Excerpt }
	if req.Category != nil  { e.Category = *req.Category }
	if req.ReadTime != nil  { e.ReadTime = *req.ReadTime }
	if req.Published != nil { e.Published = *req.Published }

	err = h.db.QueryRowContext(c,
		`UPDATE journal_entries SET title=$1, body=$2, excerpt=$3, category=$4,
		read_time=$5, published=$6, updated_at=NOW() WHERE id=$7 RETURNING updated_at`,
		e.Title, e.Body, e.Excerpt, e.Category, e.ReadTime, e.Published, id).Scan(&e.UpdatedAt)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, e)
}

// DELETE /api/v1/journal/:id  (protected)
func (h *Handler) DeleteJournalEntry(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid id"})
		return
	}
	res, err := h.db.ExecContext(c, `DELETE FROM journal_entries WHERE id = $1`, id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	n, _ := res.RowsAffected()
	if n == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "not found"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"deleted": id})
}

// ─── AUTH: CHANGE PASSWORD ────────────────────────────────────────────────────

// PUT /api/v1/auth/password (protected)
func (h *Handler) ChangePassword(c *gin.Context) {
	var req models.ChangePasswordRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	if len(req.NewPassword) < 6 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "password must be at least 6 characters"})
		return
	}

	hashed, err := bcrypt.GenerateFromPassword([]byte(req.NewPassword), bcrypt.DefaultCost)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "could not hash password"})
		return
	}

	_, err = h.db.ExecContext(c,
		`INSERT INTO config (key, value) VALUES ('owner_password', $1)
		 ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value`,
		string(hashed))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "password updated"})
}

// ─── ADMIN: ALL JOURNAL ENTRIES ───────────────────────────────────────────────

// GET /api/v1/admin/journal (protected)
func (h *Handler) GetAllJournalEntries(c *gin.Context) {
	rows, err := h.db.QueryContext(c,
		`SELECT id, title, body, COALESCE(excerpt,''), COALESCE(category,''),
		COALESCE(read_time,''), published, created_at, updated_at
		FROM journal_entries ORDER BY created_at DESC`)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	defer rows.Close()

	entries := []models.JournalEntry{}
	for rows.Next() {
		var e models.JournalEntry
		if err := rows.Scan(&e.ID, &e.Title, &e.Body, &e.Excerpt, &e.Category,
			&e.ReadTime, &e.Published, &e.CreatedAt, &e.UpdatedAt); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		entries = append(entries, e)
	}
	c.JSON(http.StatusOK, entries)
}

// ─── UPLOAD ──────────────────────────────────────────────────────────────────

// POST /api/v1/upload  (protected)
func (h *Handler) UploadImage(c *gin.Context) {
	cloudName := os.Getenv("CLOUDINARY_CLOUD_NAME")
	apiKey := os.Getenv("CLOUDINARY_API_KEY")
	apiSecret := os.Getenv("CLOUDINARY_API_SECRET")

	if cloudName == "" || apiKey == "" || apiSecret == "" {
		c.JSON(http.StatusServiceUnavailable, gin.H{"error": "cloudinary not configured"})
		return
	}

	file, header, err := c.Request.FormFile("file")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "no file provided"})
		return
	}
	defer file.Close()

	cld, err := cloudinary.NewFromParams(cloudName, apiKey, apiSecret)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "cloudinary init failed"})
		return
	}

	ctx, cancel := context.WithTimeout(c.Request.Context(), 30*time.Second)
	defer cancel()

	result, err := cld.Upload.Upload(ctx, file, uploader.UploadParams{
		Folder:   "writer-portfolio",
		PublicID: header.Filename,
	})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, models.UploadResponse{
		URL:      result.SecureURL,
		PublicID: result.PublicID,
	})
}

// ─── ABOUT ───────────────────────────────────────────────────────────────────

var defaultAbout = models.About{
	Name:    "E. Ashworth",
	Tagline: "Author & Poet",
	Email:   "eleanor@ashworthwrites.com",
	Bio: []models.AboutBioSection{
		{Heading: "What Is Known", Text: "Edmund Ashworth was born in 1847 in a town that appeared on only one map, which was later lost. His father was a clockmaker. His mother read to him from books she wouldn't let him see the covers of. He grew up believing stories had no authors — that they simply arrived, like weather, and someone had to be present to receive them."},
		{Heading: "What Was Said of the Work", Text: "The novels were described, by the one reviewer who encountered them during his lifetime, as 'architecturally unsound and emotionally unavoidable.' The poetry was read aloud at three funerals before it was published. The short fiction was found in an envelope addressed to no one."},
		{Heading: "The Disappearance", Text: "At forty-one, Ashworth ceased to appear in any record. No death certificate was filed. No forwarding address was left. What exists is this: a house discovered in 1923 by a surveyor who was not looking for it, containing a library, three manuscripts, a journal kept across forty years, and a candle that was still warm."},
		{Heading: "What Little Remains", Text: "Three witnesses remembered him. None agreed on what he looked like. One said he was tall. One said he was unremarkable in every visible way. The third said only: he listened as though he already knew what you were going to say, and was grateful you said it anyway."},
	},
	Stats: []models.AboutStat{
		{Num: "4", Label: "Recovered Works"},
		{Num: "1", Label: "Known Residence"},
		{Num: "1923", Label: "Year of Discovery"},
		{Num: "0", Label: "Confirmed Sightings"},
	},
}

// GET /api/v1/about
func (h *Handler) GetAbout(c *gin.Context) {
	var raw string
	if err := h.db.QueryRowContext(c, `SELECT value FROM config WHERE key = 'about'`).Scan(&raw); err != nil {
		c.JSON(http.StatusOK, defaultAbout)
		return
	}
	var about models.About
	if err := json.Unmarshal([]byte(raw), &about); err != nil {
		c.JSON(http.StatusOK, defaultAbout)
		return
	}
	c.JSON(http.StatusOK, about)
}

// PUT /api/v1/admin/about  (protected)
func (h *Handler) UpdateAbout(c *gin.Context) {
	var about models.About
	if err := c.ShouldBindJSON(&about); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	raw, err := json.Marshal(about)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "could not encode"})
		return
	}
	_, err = h.db.ExecContext(c,
		`INSERT INTO config (key, value) VALUES ('about', $1) ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value`,
		string(raw))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, about)
}
