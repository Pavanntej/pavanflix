import React, { useEffect, useState } from "react"
import { supabase } from "./lib/supabase"

export default function App() {
  const [books, setBooks] = useState([])
  const [form, setForm] = useState({})
  const [editingId, setEditingId] = useState(null)

  useEffect(() => {
    fetchBooks()
  }, [])

  const fetchBooks = async () => {
    const { data } = await supabase.from("books").select("*")
    setBooks(data)
  }

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleCast = (e) => {
    setForm({ ...form, cast: JSON.parse(e.target.value) })
  }

  const saveBook = async () => {
    if (editingId) {
      await supabase
        .from("books")
        .update(form)
        .eq("id", editingId)
    } else {
      await supabase.from("books").insert([form])
    }

    setForm({})
    setEditingId(null)
    fetchBooks()
  }

  const editBook = (b) => {
    setForm(b)
    setEditingId(b.id)
  }

  const deleteBook = async (id) => {
    await supabase.from("books").delete().eq("id", id)
    fetchBooks()
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>Admin Dashboard</h2>

      {/* FORM */}
      <input name="title" placeholder="Title" onChange={handleChange} value={form.title || ""} />
      <input name="genre" placeholder="Genre" onChange={handleChange} value={form.genre || ""} />
      <input name="poster_url" placeholder="Poster URL" onChange={handleChange} value={form.poster_url || ""} />
      <input name="logo_url" placeholder="Logo URL" onChange={handleChange} value={form.logo_url || ""} />
      <input name="trailer_url" placeholder="Trailer URL" onChange={handleChange} value={form.trailer_url || ""} />
      <input name="buy_color" placeholder="Buy Color Link" onChange={handleChange} value={form.buy_color || ""} />
      <input name="buy_bw" placeholder="Buy BW Link" onChange={handleChange} value={form.buy_bw || ""} />

      <textarea name="description" placeholder="Description" onChange={handleChange} value={form.description || ""} />

      <textarea
        placeholder='Cast JSON'
        onChange={handleCast}
        value={JSON.stringify(form.cast || [])}
      />

      <button onClick={saveBook}>
        {editingId ? "Update" : "Add"}
      </button>

      {/* LIST */}
      {books.map((b) => (
        <div key={b.id}>
          <h3>{b.title}</h3>
          <button onClick={() => editBook(b)}>Edit</button>
          <button onClick={() => deleteBook(b.id)}>Delete</button>
        </div>
      ))}
    </div>
  )
}
