"use client"
import { useAuth } from "../context/AuthContext.jsx"

export default function Profile() {
  const { user } = useAuth()
  if (!user) return null
  return (
    <div className="container" style={{ maxWidth: 640 }}>
      <div className="card">
        <h2>Your Profile</h2>
        <div className="grid" style={{ gap: 8, marginTop: 8 }}>
          <div>
            <strong>Name:</strong> {user.name}
          </div>
          <div>
            <strong>Email:</strong> {user.email}
          </div>
        </div>
        <p className="small" style={{ marginTop: 8 }}>
          Future: Edit profile, upload avatar, list your threads and replies.
        </p>
      </div>
    </div>
  )
}
