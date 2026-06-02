package models

import "time"

type Work struct {
	ID          int       `json:"id"`
	Title       string    `json:"title"`
	Description string    `json:"description"`
	Excerpt     string    `json:"excerpt"`
	Category    string    `json:"category"` // novel | poetry | short story
	Year        string    `json:"year"`
	Pages       int       `json:"pages"`
	Status      string    `json:"status"` // published | in progress | archived
	CoverImage  string    `json:"cover_image"`
	AccentColor string    `json:"accent_color"`
	CreatedAt   time.Time `json:"created_at"`
	UpdatedAt   time.Time `json:"updated_at"`
}

type CreateWorkRequest struct {
	Title       string `json:"title"       binding:"required"`
	Description string `json:"description" binding:"required"`
	Excerpt     string `json:"excerpt"`
	Category    string `json:"category"    binding:"required,oneof=novel poetry 'short story'"`
	Year        string `json:"year"`
	Pages       int    `json:"pages"`
	Status      string `json:"status"`
	CoverImage  string `json:"cover_image"`
	AccentColor string `json:"accent_color"`
}

type UpdateWorkRequest struct {
	Title       *string `json:"title"`
	Description *string `json:"description"`
	Excerpt     *string `json:"excerpt"`
	Category    *string `json:"category"`
	Year        *string `json:"year"`
	Pages       *int    `json:"pages"`
	Status      *string `json:"status"`
	CoverImage  *string `json:"cover_image"`
	AccentColor *string `json:"accent_color"`
}

type JournalEntry struct {
	ID        int       `json:"id"`
	Title     string    `json:"title"`
	Body      string    `json:"body"`
	Excerpt   string    `json:"excerpt"`
	Category  string    `json:"category"`
	ReadTime  string    `json:"read_time"`
	Published bool      `json:"published"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

type CreateJournalRequest struct {
	Title     string `json:"title"     binding:"required"`
	Body      string `json:"body"      binding:"required"`
	Excerpt   string `json:"excerpt"`
	Category  string `json:"category"`
	ReadTime  string `json:"read_time"`
	Published *bool  `json:"published"`
}

type UpdateJournalRequest struct {
	Title     *string `json:"title"`
	Body      *string `json:"body"`
	Excerpt   *string `json:"excerpt"`
	Category  *string `json:"category"`
	ReadTime  *string `json:"read_time"`
	Published *bool   `json:"published"`
}

type LoginRequest struct {
	Password string `json:"password" binding:"required"`
}

type LoginResponse struct {
	Token string `json:"token"`
}

type UploadResponse struct {
	URL      string `json:"url"`
	PublicID string `json:"public_id"`
}

type ChangePasswordRequest struct {
	NewPassword string `json:"new_password" binding:"required"`
}

type AboutBioSection struct {
	Heading string `json:"heading"`
	Text    string `json:"text"`
}

type AboutStat struct {
	Num   string `json:"num"`
	Label string `json:"label"`
}

type About struct {
	Name     string            `json:"name"`
	Tagline  string            `json:"tagline"`
	Email    string            `json:"email"`
	PhotoURL string            `json:"photo_url"`
	Bio      []AboutBioSection `json:"bio"`
	Stats    []AboutStat       `json:"stats"`
}
