package main

import (
	"log"
	"os"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"

	"writer-portfolio/internal/db"
	"writer-portfolio/internal/handlers"
	"writer-portfolio/internal/middleware"
)

func main() {
	// Load .env
	if err := godotenv.Load(); err != nil {
		log.Println("No .env file found, using environment variables")
	}

	// Connect to database
	database, err := db.Connect(os.Getenv("DATABASE_PATH"))
	if err != nil {
		log.Fatalf("Failed to connect to database: %v", err)
	}
	defer database.Close()

	// Run migrations
	if err := db.Migrate(database); err != nil {
		log.Fatalf("Failed to run migrations: %v", err)
	}

	// Setup Gin
	r := gin.Default()

	// CORS - allow React dev server
	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:5173", os.Getenv("FRONTEND_URL")},
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
		AllowCredentials: true,
	}))

	// Init handlers
	h := handlers.New(database)

	// Routes
	api := r.Group("/api/v1")
	{
		// Public routes
		api.POST("/auth/login", h.Login)

		// Works (public read)
		api.GET("/works", h.GetWorks)
		api.GET("/works/:id", h.GetWork)

		// Journal (public read)
		api.GET("/journal", h.GetJournalEntries)
		api.GET("/journal/:id", h.GetJournalEntry)

		// About (public read)
		api.GET("/about", h.GetAbout)

		// Protected routes (require JWT)
		protected := api.Group("/")
		protected.Use(middleware.AuthRequired(os.Getenv("JWT_SECRET")))
		{
			// Works CRUD (owner only)
			protected.POST("/works", h.CreateWork)
			protected.PUT("/works/:id", h.UpdateWork)
			protected.DELETE("/works/:id", h.DeleteWork)

			// Journal CRUD (owner only)
			protected.POST("/journal", h.CreateJournalEntry)
			protected.PUT("/journal/:id", h.UpdateJournalEntry)
			protected.DELETE("/journal/:id", h.DeleteJournalEntry)

			// Image upload via Cloudinary
			protected.POST("/upload", h.UploadImage)

			// Auth management
			protected.PUT("/auth/password", h.ChangePassword)

			// Admin: all content regardless of published status
			protected.GET("/admin/journal", h.GetAllJournalEntries)
			protected.PUT("/admin/about", h.UpdateAbout)
		}
	}

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	log.Printf("Server running on :%s", port)
	if err := r.Run(":" + port); err != nil {
		log.Fatalf("Failed to start server: %v", err)
	}
}
