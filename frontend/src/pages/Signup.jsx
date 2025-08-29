"use client"

import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import api from "../api/client.js"
import { useAuth } from "../context/AuthContext.jsx"

export default function Signup() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: "", email: "", password: "" })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const submit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    try {
      const { data } = await api.post("/api/auth/register", form)
      login(data)
      navigate("/")
    } catch (err) {
      setError(err?.response?.data?.message || "Sign up failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container" style={{ maxWidth: 480 }}>
      <div className="card">
        <h2>Create your account</h2>
        <p className="small">
          Already have an account? <Link to="/login">Log in</Link>
        </p>
        {error && (
          <p className="small" style={{ color: "#fca5a5" }}>
            {error}
          </p>
        )}
        <form onSubmit={submit} className="grid">
          <input placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <input
            placeholder="Email"
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
          <input
            placeholder="Password"
            type="password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
          <button disabled={loading}>{loading ? "Creating..." : "Sign up"}</button>
        </form>
      </div>
    </div>
  )
}
