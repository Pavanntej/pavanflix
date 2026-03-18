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
    const { data } = await supabase.from("books").select("*")
    setBooks(data || [])
  }

  const extractColor = (img) => {
    const fac = new FastAverageColor()
    fac.getColorAsync(img).then(c => {
      setBg(c.hex)
    })
  }

  return (
    <div style={{ background: bg, transition: "1s ease" }}>

      {/* FLOATING HEADER */}
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

      {/* SECTIONS */}
      {books.map((b, index) => (
        <section
          key={b.id}
          id={b.id}
          className="section"
          onMouseEnter={() => extractColor(b.poster_url)}
        >

          {/* PARALLAX BACKGROUND */}
          <motion.div
            className="overlay-bg"
            style={{ backgroundImage: `url(${b.poster_url})` }}
            initial={{ scale: 1.3 }}
            whileInView={{ scale: 1.1 }}
            transition={{ duration: 1 }}
          />

          {/* LEFT CONTENT */}
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
              <button
                className="btn"
                onClick={() =>
                  navigator.share({
                    title: b.title,
                    url: window.location.href
                  })
                }
              >
                Share
              </button>
            </div>

            <p style={{ marginTop: 20 }}>{b.description}</p>

            {/* CAST */}
            <div style={{ display: "flex", gap: 12, marginTop: 20 }}>
              {b.cast?.map((c, i) => (
                <motion.div
                  key={i}
                  whileHover={{ scale: 1.1 }}
                  style={{ textAlign: "center" }}
                >
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
              whileHover={{ scale: 1.08 }}
              width="320"
              height="570"
              src={b.trailer_url + "?autoplay=1&mute=1"}
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
          <a href="https://www.instagram.com/pavanntej/">Instagram</a> | <a href="https://www.youtube.com/@pavanntej">YouTube</a>
        </div>
      </div>
    </div>
  )
}
