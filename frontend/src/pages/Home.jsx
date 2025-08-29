"use client"

import { useEffect, useState } from "react"
import api from "../api/client.js"
import ThreadCard from "../components/ThreadCard.jsx"
import { useAuth } from "../context/AuthContext.jsx"

export default function Home() {
  const { token } = useAuth()
  const [loading, setLoading] = useState(true)
  const [threads, setThreads] = useState([])
  const [q, setQ] = useState("")
  const [category, setCategory] = useState("")
  const [tags, setTags] = useState("")
  const [sort, setSort] = useState("recent")

  const load = async () => {
    setLoading(true)
    try {
      const params = {}
      if (q) params.q = q
      if (category) params.category = category
      if (tags) params.tags = tags
      if (sort) params.sort = sort
      const { data } = await api.get("/api/threads", { params })
      setThreads(data)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sort])

  const onSearch = (e) => {
    e.preventDefault()
    load()
  }

  const voteThread = async (id, value) => {
    if (!token) return alert("Please log in to vote")
    // optimistic update
    setThreads((prev) => prev.map((t) => (t._id === id ? { ...t, score: (t.score ?? 0) + value } : t)))
    try {
      const { data } = await api.post(`/api/threads/${id}/vote`, { value })
      setThreads((prev) => prev.map((t) => (t._id === id ? { ...t, score: data.score } : t)))
    } catch {
      // revert on error
      load()
    }
  }

  return (
    <div className="grid" style={{ gap: 16 }}>
      <form onSubmit={onSearch} className="card grid" style={{ gap: 12 }}>
        <div className="grid grid-3">
          <input placeholder="Search title or content..." value={q} onChange={(e) => setQ(e.target.value)} />
          <input placeholder="Tags (comma separated)" value={tags} onChange={(e) => setTags(e.target.value)} />
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="">All Categories</option>
            <option value="Programming">Programming</option>
            <option value="Internships">Internships</option>
            <option value="Career">Career</option>
            <option value="Tech">Tech</option>
            <option value="Education">Education</option>
          </select>
        </div>
        <div className="row" style={{ justifyContent: "space-between" }}>
          <div className="row" style={{ gap: 8 }}>
            <span className="small">Sort by:</span>
            <select value={sort} onChange={(e) => setSort(e.target.value)}>
              <option value="recent">Most Recent</option>
              <option value="top">Most Upvoted</option>
            </select>
          </div>
          <button>Apply</button>
        </div>
      </form>

      {loading ? (
        <div className="card">Loading...</div>
      ) : threads.length === 0 ? (
        <div className="card">No threads found.</div>
      ) : (
        <div className="grid" style={{ gap: 12 }}>
          {threads.map((t) => (
            <ThreadCard key={t._id} thread={t} onVote={voteThread} />
          ))}
        </div>
      )}
    </div>
  )
}
