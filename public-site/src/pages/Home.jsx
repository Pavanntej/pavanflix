import React, { useEffect, useState } from "react"
import { supabase } from "../lib/supabase"
import Header from "../components/Header"
import { useNavigate } from "react-router-dom"

export default function Home() {
  const [books, setBooks] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    fetchBooks()
  }, [])

  const fetchBooks = async () => {
    const { data, error } = await supabase.from("books").select("*")

    if (error) {
      console.error(error)
      return
    }

    setBooks(data)
  }

  return (
    <div>
      <Header books={books} />

      <div style={{ paddingTop: 100 }}>
        {books.map(b => (
          <div
            key={b.id}
            style={{
              padding: 40,
              borderBottom: "1px solid #222",
              cursor: "pointer"
            }}
            onClick={() => navigate(`/book/${b.id}`)}
          >
            <h2>{b.title}</h2>
            <p style={{ color: "gold" }}>{b.genre}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
