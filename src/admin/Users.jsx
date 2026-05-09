import React, { useEffect, useState } from 'react'
import axios from 'axios'

const API = import.meta.env.VITE_API_URL 

export default function Users(){
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(false)

  async function fetchUsers(){
    setLoading(true)
    try{
      const r = await axios.get(`${API}/users`)
      setUsers(r.data || [])
    }catch(err){
      console.error(err)
      setUsers([])
    }finally{ setLoading(false) }
  }

  useEffect(()=>{ fetchUsers() }, [])

  return (
    <div>
      <h2>Users</h2>
      <div style={{ marginTop: 12 }}>
        {loading ? <p>Loading…</p> : (
          users.length === 0 ? <p>No users yet.</p> : (
            <ul>
              {users.map(u => (
                <li key={u.id} style={{ padding: '8px 0' }}>{u.name} — {u.email}</li>
              ))}
            </ul>
          )
        )}
      </div>
      <div style={{ marginTop: 16 }}>
        <button onClick={fetchUsers}>Refresh</button>
      </div>
    </div>
  )
}
