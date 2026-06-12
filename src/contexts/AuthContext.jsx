import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

const AuthContext = createContext(null)

// ── DEV BYPASS ─────────────────────────────────────
// Set via localStorage: localStorage.setItem('dev_role', 'transporter'|'consumer'|'admin')
const DEV_USERS = {
  transporter: { id: 'dev-transporter', email: 'transporter@dev.local' },
  consumer:    { id: 'dev-consumer',    email: 'consumer@dev.local' },
  admin:       { id: 'dev-admin',       email: 'admin@dev.local' },
}
const DEV_PROFILES = {
  transporter: { id: 'dev-transporter', role: 'transporter', full_name: 'Demo Transportista' },
  consumer:    { id: 'dev-consumer',    role: 'consumer',    full_name: 'Demo Consumidor' },
  admin:       { id: 'dev-admin',       role: 'admin',       full_name: 'Demo Admin' },
}
// ───────────────────────────────────────────────────

export function AuthProvider({ children }) {
  const devRole = typeof window !== 'undefined' ? localStorage.getItem('dev_role') : null
  const [user, setUser] = useState(devRole ? DEV_USERS[devRole] : null)
  const [profile, setProfile] = useState(devRole ? DEV_PROFILES[devRole] : null)
  const [loading, setLoading] = useState(!devRole)

  useEffect(() => {
    // Skip Supabase auth when dev bypass is active
    if (devRole) return

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      if (session?.user) loadProfile(session.user.id)
      else setLoading(false)
    })

    // Listen for changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      if (session?.user) loadProfile(session.user.id)
      else { setProfile(null); setLoading(false) }
    })

    return () => subscription.unsubscribe()
  }, [])

  async function loadProfile(userId) {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()
    setProfile(data)
    setLoading(false)
  }

  async function signIn(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    return { data, error }
  }

  async function signUp(email, password, role, fullName) {
    const { data, error } = await supabase.auth.signUp({ email, password })
    if (error) return { data, error }
    // Create profile
    if (data.user) {
      await supabase.from('profiles').insert({
        id: data.user.id,
        role,
        full_name: fullName,
      })
    }
    return { data, error }
  }

  async function signOut() {
    localStorage.removeItem('dev_role')
    await supabase.auth.signOut()
  }

  function devLogin(role) {
    localStorage.setItem('dev_role', role)
    setUser(DEV_USERS[role])
    setProfile(DEV_PROFILES[role])
    setLoading(false)
  }

  return (
    <AuthContext.Provider value={{ user, profile, loading, signIn, signUp, signOut, devLogin }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
