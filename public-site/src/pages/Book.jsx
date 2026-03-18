import React, { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { supabase } from "../lib/supabase"
import { motion } from "framer-motion"
import { FastAverageColor } from "fast-average-color"
import Header from "../components/Header"

export default function Book() {
  const { id } = useParams()
  const [book, setBook] = useState(null)
  const [books, setBooks] = useState([])
  const [bg, setBg] = useState("#0a0a0a")

  useEffect(() => {
    fetchBook()
    fetchBooks()
  }, [])

  const fetchBook = async () => {
    const { data } = await supabase
      .from("books")
      .select("*")
      .eq("id", id)
      .single()

    if (data) {
      setBook(data)

      const fac = new FastAverageColor()
      fac.getColorAsync(data.poster_url).then(c => {
        setBg(c.hex)
      })

      document.title = data.title
    }
  }

  const fetchBooks = async () => {
    const { data } = await supabase.from("books").select("*")
    setBooks(data || [])
  }

  if (!book) return <div style={{ padding: 100 }}>Loading...</div>

  return (
    <div style={{ background: bg, minHeight: "100vh", transition: "1s" }}>
      <Header books={books} />

      <div style={{
        display: "flex",
        padding: 40,
        paddingTop: 120,
        flexWrap: "wrap"
      }}>
        
        {/* LEFT */}
        <div style={{ flex: 1, minWidth: 300 }}>
          <img src={book.logo_url} style={{ width: 250 }} />

          <p style={{ color: "gold" }}>{book.genre}</p>

          <div style={{ marginTop: 20 }}>
            <button onClick={() => window.open(book.buy_color)}>
              Buy Color
            </button>
            <button onClick={() => window.open(book.buy_bw)}>
              Buy B&W
            </button>
          </div>

          <p style={{ marginTop: 20 }}>{book.description}</p>

          <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
            {book.cast?.map((c, i) => (
              <div key={i}>
                <img src={c.image} width={60} />
                <p>{c.name}</p>
              </div>
            ))}
          </div>
        </div>

        {/* TRAILER */}
        <div style={{
          flex: 1,
          display: "flex",
          justifyContent: "center"
        }}>
          <motion.iframe
            whileHover={{ scale: 1.05 }}
            width="320"
            height="570"
            src={book.trailer_url + "?autoplay=1&mute=1"}
            allow="autoplay"
          />
        </div>
      </div>
    </div>
  )
}
