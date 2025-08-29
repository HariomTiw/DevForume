import "dotenv/config"
import express from "express"
import cors from "cors"
import helmet from "helmet"
import morgan from "morgan"
import passport from "passport"
import { connectDB } from "./lib/db.js"
import { jwtStrategy } from "./lib/passport.js"
import authRoutes from "./routes/auth.js"
import threadRoutes from "./routes/threads.js"

const app = express()

// Security & middleware
app.use(helmet())
app.use(express.json({ limit: "1mb" }))
app.use(express.urlencoded({ extended: true }))
app.use(
  cors({
    origin: process.env.CORS_ORIGIN?.split(",") || "*",
    credentials: true,
  }),
)
app.use(morgan("dev"))

// Passport
passport.use(jwtStrategy)
app.use(passport.initialize())

// Routes
app.get("/health", (_req, res) => res.json({ ok: true }))
app.use("/api/auth", authRoutes)
app.use("/api/threads", threadRoutes)

// Start server after DB connects
const port = process.env.PORT || 4000
connectDB()
  .then(() => {
    app.listen(port, () => {
      console.log(`[server] Listening on http://localhost:${port}`)
    })
  })
  .catch((err) => {
    console.error("[server] DB connect error:", err)
    process.exit(1)
  })
