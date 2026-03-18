import React, { useEffect, useState } from "react"
import { supabase } from "./lib/supabase"
import { FastAverageColor } from "fast-average-color"

export default function App() {
  const [books, setBooks] = useState([])
  const [bg, setBg] = useState("#111")

  useEffect(() => {
    fetchBooks()
  }, [])

  const fetchBooks = async () => {
    const { data } = await supabase.from("books").select("*")
    setBooks(data)
  }

  const changeBg = (img) => {
    const fac = new FastAverageColor()
    fac.getColorAsync(img).then((c) => setBg(c.hex))
  }

  return (
    <div style={{ background: bg, color: "white", minHeight: "100vh" }}>
      
      {/* HEADER LOGOS */}
      <div style={{ display: "flex", overflowX: "auto", padding: 10 }}>
        {books.map((b) => (
          <img
            key={b.id}
            src={b.logo_url}
            style={{ height: 60, marginRight: 10, cursor: "pointer" }}
            onClick={() =>
              document.getElementById(b.id).scrollIntoView()
            }
          />
        ))}
      </div>

      {/* BOOK SECTIONS */}
      {books.map((b) => (
        <div
          key={b.id}
          id={b.id}
          onMouseEnter={() => changeBg(b.poster_url)}
          style={{
            display: "flex",
            padding: 40,
            alignItems: "center",
            minHeight: "100vh"
          }}
        >
          {/* LEFT */}
          <div style={{ width: "50%" }}>
            <img src={b.logo_url} style={{ width: 200 }} />
            <p>{b.genre}</p>

            <button onClick={() => window.open(b.buy_color)}>
              Buy Color
            </button>

            <button onClick={() => window.open(b.buy_bw)}>
              Buy B&W
            </button>

            <button
              onClick={() =>
                navigator.share({
                  title: b.title,
                  url: window.location.href
                })
              }
            >
              Share
            </button>

            <p>{b.description}</p>

            {/* CAST */}
            <div style={{ display: "flex", gap: 10 }}>
              {b.cast?.map((c, i) => (
                <div key={i}>
                  <img src={c.image} width={60} />
                  <p>{c.name}</p>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT TRAILER */}
          <div style={{ width: "50%" }}>
            <iframe
              width="300"
              height="533"
              src={b.trailer_url + "?autoplay=1&mute=1"}
              allow="autoplay"
            />
          </div>
        </div>
      ))}
    </div>
  )
}
