import React, { useEffect, useState } from "react"
import { supabase } from "./lib/supabase"
import { motion } from "framer-motion"
import { FastAverageColor } from "fast-average-color"
import "./index.css"

export default function App() {
  const [books, setBooks] = useState([])
  const [bg, setBg] = useState("#0a0a0a")

  useEffect(() => {
    fetchBooks()
  }, [])

  const fetchBooks = async () => {
    const { data, error } = await supabase.from("books").select("*")

    if (error) {
      console.error(error)
      return
    }

    setBooks(data || [])
  }

  // 🎨 Dynamic color
  const extractColor = (img) => {
    const fac = new FastAverageColor()
    fac.getColorAsync(img).then(c => setBg(c.hex))
  }

  // 🎥 FIX YOUTUBE
  const getEmbed = (url) => {
    if (!url) return ""
    const id =
      url.includes("youtu.be")
        ? url.split("/").pop()
        : url.split("v=")[1]?.split("&")[0]

    return `https://www.youtube.com/embed/${id}?autoplay=1&mute=1`
  }

  return (
    <div style={{ background: bg, transition: "1s ease", minHeight: "100vh" }}>

      {/* HEADER */}
      <div style={{
        position: "fixed",
        top: 0,
        width: "100%",
        display: "flex",
        gap: 20,
        padding: 15,
        overflowX: "auto",
        backdropFilter: "blur(20px)",
        background: "rgba(0,0,0,0.4)",
        zIndex: 1000
      }}>
        <h2 style={{ color: "gold", marginRight: 20 }}>Bookshelf</h2>

        {books.map(b => (
          <img
            key={b.id}
            src={b.logo_url}
            style={{ height: 50, cursor: "pointer" }}
            onClick={() =>
              document.getElementById(b.id)
                .scrollIntoView({ behavior: "smooth" })
            }
          />
        ))}
      </div>

      {/* EMPTY STATE */}
      {!books.length && (
        <div style={{ paddingTop: 120, textAlign: "center" }}>
          <h2>No books found</h2>
          <p>Add from admin dashboard</p>
        </div>
      )}

      {/* SECTIONS */}
      {books.map((b) => (
        <section
          key={b.id}
          id={b.id}
          className="section"
          onMouseEnter={() => extractColor(b.poster_url)}
        >

          {/* BACKGROUND BLEND */}
          <motion.div
            className="overlay-bg"
            style={{ backgroundImage: `url(${b.poster_url})` }}
            initial={{ scale: 1.3 }}
            whileInView={{ scale: 1.1 }}
            transition={{ duration: 1 }}
          />

          {/* DARK GRADIENT OVERLAY */}
          <div style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to right, rgba(0,0,0,0.9), rgba(0,0,0,0.4))",
            zIndex: 1
          }} />

          {/* LEFT */}
          <motion.div
            className="glass"
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            style={{ width: "45%", zIndex: 2 }}
          >
            <img src={b.logo_url} style={{ width: 240 }} />

            <p style={{ color: "gold" }}>{b.genre}</p>

            <div style={{ marginTop: 15 }}>
              <button className="btn" onClick={() => window.open(b.buy_color)}>
                Color
              </button>
              <button className="btn" onClick={() => window.open(b.buy_bw)}>
                B&W
              </button>
            </div>

            <p style={{ marginTop: 20 }}>{b.description}</p>

            {/* CAST */}
            <div style={{ display: "flex", gap: 12, marginTop: 20 }}>
              {b.cast?.map((c, i) => (
                <motion.div key={i} whileHover={{ scale: 1.1 }}>
                  <img
                    src={c.image}
                    style={{
                      width: 65,
                      height: 65,
                      borderRadius: "50%",
                      border: "2px solid gold"
                    }}
                  />
                  <p style={{ fontSize: 12 }}>{c.name}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* TRAILER */}
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            style={{
              width: "55%",
              display: "flex",
              justifyContent: "center",
              zIndex: 2
            }}
          >
            <motion.iframe
              whileHover={{ scale: 1.05 }}
              width="320"
              height="570"
              src={getEmbed(b.trailer_url)}
              allow="autoplay"
              style={{
                borderRadius: 20,
                boxShadow: `0 0 60px ${bg}`
              }}
            />
          </motion.div>
        </section>
      ))}

      {/* FOOTER */}
      <div style={{
        padding: 50,
        textAlign: "center",
        background: "black"
      }}>
        <h2>Connect</h2>

        <div style={{ marginTop: 20 }}>
          <a className="btn" href="https://wa.me/9542648520">WhatsApp</a>
          <a className="btn" href="mailto:pavanntej@gmail.com">Email</a>
        </div>

        <div style={{ marginTop: 20 }}>
          <a href="https://www.instagram.com/pavanntej/">Instagram</a> | 
          <a href="https://www.youtube.com/@pavanntej"> YouTube</a>
        </div>
      </div>
    </div>
  )
}
