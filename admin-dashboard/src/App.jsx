import React, { useEffect, useState } from "react"
import { supabase } from "./lib/supabase"

// ================= APP (AUTH) =================
export default function App() {
  const [session, setSession] = useState(null)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
    })

    const { data: listener } = supabase.auth.onAuthStateChange((_e, session) => {
      setSession(session)
    })

    return () => listener.subscription.unsubscribe()
  }, [])

  if (!session) {
    return (
      <div style={styles.loginContainer}>
        <h2 style={{ color: "gold" }}>Admin Login</h2>

        <input
          style={styles.input}
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          style={styles.input}
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          style={styles.btn}
          onClick={() =>
            supabase.auth.signInWithPassword({ email, password })
          }
        >
          Login
        </button>
      </div>
    )
  }

  return <Dashboard />
}

// ================= DASHBOARD =================
function Dashboard() {
  const [books, setBooks] = useState([])
  const [form, setForm] = useState({})
  const [castList, setCastList] = useState([])
  const [editingId, setEditingId] = useState(null)
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    fetchBooks()
  }, [])

  const fetchBooks = async () => {
    const { data } = await supabase.from("books").select("*")
    setBooks(data || [])
  }

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const uploadFile = async (file, bucket) => {
    const fileName = Date.now() + "-" + file.name

    const { error } = await supabase.storage
      .from(bucket)
      .upload(fileName, file)

    if (error) {
      alert(error.message)
      return null
    }

    return `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/${bucket}/${fileName}`
  }

  const handleFile = async (e, field, bucket) => {
    const file = e.target.files[0]
    if (!file) return

    setUploading(true)

    const preview = URL.createObjectURL(file)
    setForm(prev => ({ ...prev, [`${field}_preview`]: preview }))

    const url = await uploadFile(file, bucket)

    if (url) {
      setForm(prev => ({ ...prev, [field]: url }))
    }

    setUploading(false)
  }

  // ===== CAST FUNCTIONS =====
  const addCast = () => {
    setCastList([...castList, { name: "", image: "" }])
  }

  const updateCastName = (index, value) => {
    const updated = [...castList]
    updated[index].name = value
    setCastList(updated)
  }

  const uploadCastImage = async (e, index) => {
    const file = e.target.files[0]
    if (!file) return

    setUploading(true)

    const fileName = Date.now() + "-" + file.name

    const { error } = await supabase.storage
      .from("cast")
      .upload(fileName, file)

    if (error) {
      alert(error.message)
      setUploading(false)
      return
    }

    const url = `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/cast/${fileName}`

    const updated = [...castList]
    updated[index].image = url
    setCastList(updated)

    setUploading(false)
  }

  const removeCast = (index) => {
    setCastList(castList.filter((_, i) => i !== index))
  }

  const saveBook = async () => {
    const cleanForm = { ...form }

    delete cleanForm.poster_url_preview
    delete cleanForm.logo_url_preview

    cleanForm.cast = castList

    if (editingId) {
      await supabase.from("books").update(cleanForm).eq("id", editingId)
    } else {
      await supabase.from("books").insert([cleanForm])
    }

    alert("Saved successfully ✅")

    setForm({})
    setCastList([])
    setEditingId(null)
    fetchBooks()
  }

  const editBook = (b) => {
    setForm({
      ...b,
      poster_url_preview: b.poster_url,
      logo_url_preview: b.logo_url
    })

    setCastList(b.cast || [])
    setEditingId(b.id)
  }

  const deleteBook = async (id) => {
    await supabase.from("books").delete().eq("id", id)
    fetchBooks()
  }

  return (
    <div style={styles.container}>

      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <h1 style={{ color: "gold" }}>Admin Dashboard</h1>

        <button
          style={{ ...styles.btn, background: "#333" }}
          onClick={() => supabase.auth.signOut()}
        >
          Logout
        </button>
      </div>

      {/* FORM */}
      <div style={styles.card}>
        <h3>{editingId ? "Edit Book" : "Add Book"}</h3>

        <input style={styles.input} name="title" placeholder="Title" onChange={handleChange} value={form.title || ""} />
        <input style={styles.input} name="genre" placeholder="Genre" onChange={handleChange} value={form.genre || ""} />
        <input style={styles.input} name="trailer_url" placeholder="Trailer URL" onChange={handleChange} value={form.trailer_url || ""} />
        <input style={styles.input} name="buy_color" placeholder="Buy Color Link" onChange={handleChange} value={form.buy_color || ""} />
        <input style={styles.input} name="buy_bw" placeholder="Buy B&W Link" onChange={handleChange} value={form.buy_bw || ""} />

        <textarea style={styles.input} name="description" placeholder="Description" onChange={handleChange} value={form.description || ""} />

        {uploading && <p style={{ color: "gold" }}>Uploading...</p>}

        {/* POSTER */}
        <p>Poster</p>
        <input type="file" onChange={(e) => handleFile(e, "poster_url", "posters")} />
        {(form.poster_url_preview || form.poster_url) && (
          <img src={form.poster_url_preview || form.poster_url} style={styles.preview} />
        )}

        {/* LOGO */}
        <p>Logo</p>
        <input type="file" onChange={(e) => handleFile(e, "logo_url", "logos")} />
        {(form.logo_url_preview || form.logo_url) && (
          <img src={form.logo_url_preview || form.logo_url} style={styles.preview} />
        )}

        {/* CAST UI */}
        <h4 style={{ marginTop: 20 }}>Cast</h4>

        {castList.map((c, index) => (
          <div key={index} style={{ display: "flex", gap: 10, marginTop: 10, alignItems: "center" }}>
            <input
              style={styles.input}
              placeholder="Actor Name"
              value={c.name}
              onChange={(e) => updateCastName(index, e.target.value)}
            />

            <input type="file" onChange={(e) => uploadCastImage(e, index)} />

            {c.image && (
              <img
                src={c.image}
                style={{ width: 50, height: 50, borderRadius: "50%" }}
              />
            )}

            <button
              style={{ ...styles.btn, background: "crimson" }}
              onClick={() => removeCast(index)}
            >
              X
            </button>
          </div>
        ))}

        <button style={styles.btn} onClick={addCast}>
          + Add Cast
        </button>

        <button style={styles.btn} onClick={saveBook}>
          {editingId ? "Update Book" : "Add Book"}
        </button>
      </div>

      {/* BOOK LIST */}
      {books.map((b) => (
        <div key={b.id} style={styles.card}>
          <h3>{b.title}</h3>
          <p style={{ color: "gold" }}>{b.genre}</p>

          <div style={{ display: "flex", gap: 10 }}>
            <img src={b.poster_url} style={styles.preview} />
            <img src={b.logo_url} style={styles.preview} />
          </div>

          <button style={styles.btn} onClick={() => editBook(b)}>
            Edit
          </button>

          <button
            style={{ ...styles.btn, background: "crimson" }}
            onClick={() => deleteBook(b.id)}
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  )
}

// ================= STYLES =================
const styles = {
  container: {
    padding: 30,
    maxWidth: 1100,
    margin: "auto",
    background: "#0a0a0a",
    minHeight: "100vh",
    color: "white"
  },
  card: {
    background: "rgba(255,255,255,0.05)",
    padding: 20,
    borderRadius: 16,
    marginBottom: 20
  },
  input: {
    width: "100%",
    padding: 10,
    marginTop: 10,
    borderRadius: 8,
    border: "none",
    background: "#111",
    color: "white"
  },
  btn: {
    background: "linear-gradient(135deg, gold, #b8962e)",
    border: "none",
    padding: "10px 16px",
    marginTop: 15,
    marginRight: 10,
    borderRadius: 10,
    cursor: "pointer",
    fontWeight: "bold"
  },
  preview: {
    marginTop: 10,
    height: 100,
    borderRadius: 10,
    objectFit: "cover"
  },
  loginContainer: {
    padding: 50,
    background: "#0a0a0a",
    minHeight: "100vh",
    color: "white"
  }
}
