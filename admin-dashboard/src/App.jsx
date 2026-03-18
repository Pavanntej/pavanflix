import React, { useEffect, useState } from "react"
import { supabase } from "./lib/supabase"

export default function App() {
  const [session, setSession] = useState(null)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
    })

    supabase.auth.onAuthStateChange((_e, session) => {
      setSession(session)
    })
  }, [])

  if (!session) {
    return (
      <div style={{ padding: 50 }}>
        <h2>Admin Login</h2>

        <input
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
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
