'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

interface UserProfile {
  id: string
  user_id: string
  full_name: string
  email: string
  phone: string | null
  role: string
  created_at: string
  updated_at: string
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserProfile[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterRole, setFilterRole] = useState('')
  const supabase = createClient()

  useEffect(() => {
    fetchUsers()
  }, [filterRole])

  async function fetchUsers() {
    setLoading(true)
    let query = supabase
      .from('user_profiles')
      .select('*')
      .order('created_at', { ascending: false })

    if (filterRole) {
      query = query.eq('role', filterRole)
    }

    const { data, error } = await query

    if (!error && data) {
      setUsers(data)
    }
    setLoading(false)
  }

  async function handleRoleChange(userId: string, newRole: string) {
    const { error } = await supabase
      .from('user_profiles')
      .update({ 
        role: newRole,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId)

    if (error) {
      alert('Rol güncellenirken hata: ' + error.message)
    } else {
      setUsers(users.map(u => 
        u.id === userId ? { ...u, role: newRole } : u
      ))
    }
  }

  async function handleDelete(userId: string) {
    if (!confirm('Bu kullanıcıyı silmek istediğinizden emin misiniz?')) return

    const { error } = await supabase
      .from('user_profiles')
      .delete()
      .eq('id', userId)

    if (error) {
      alert('Kullanıcı silinirken hata: ' + error.message)
    } else {
      setUsers(users.filter(u => u.id !== userId))
    }
  }

  const filteredUsers = users.filter(user =>
    user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.phone?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getRoleBadge = (role: string) => {
    const styles: Record<string, string> = {
      admin: 'bg-red-500/20 text-red-400',
      customer: 'bg-blue-500/20 text-blue-400'
    }
    const labels: Record<string, string> = {
      admin: 'Admin',
      customer: 'Müşteri'
    }
    return (
      <span className={`px-3 py-1 rounded text-xs ${styles[role] || 'bg-gray-500/20 text-gray-400'}`}>
        {labels[role] || role}
      </span>
    )
  }

  return (
    <div className="space-y-6 pt-24 pb-12 px-4">
      <h1 className="text-2xl font-bold text-white">Kullanıcı Yönetimi</h1>

      <div className="neon-glass-island p-6">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <input
            type="text"
            placeholder="Ad, email veya telefon ara..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 px-4 py-2 bg-black/40 border border-white/10 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-red-500/50"
          />
          
          <select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            className="px-4 py-2 bg-black/40 border border-white/10 rounded-lg text-white focus:outline-none focus:border-red-500/50"
          >
            <option value="">Tüm Roller</option>
            <option value="customer">Müşteri</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        {loading ? (
          <div className="text-center py-12 text-white/50">Yükleniyor...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left py-3 px-4 text-white/70 font-medium">Ad Soyad</th>
                  <th className="text-left py-3 px-4 text-white/70 font-medium">E-posta</th>
                  <th className="text-left py-3 px-4 text-white/70 font-medium">Telefon</th>
                  <th className="text-left py-3 px-4 text-white/70 font-medium">Rol</th>
                  <th className="text-left py-3 px-4 text-white/70 font-medium">Kayıt Tarihi</th>
                  <th className="text-left py-3 px-4 text-white/70 font-medium">İşlemler</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-8 text-white/50">
                      Kullanıcı bulunamadı
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map(user => (
                    <tr key={user.id} className="border-b border-white/5 hover:bg-white/5">
                      <td className="py-3 px-4 text-white">{user.full_name || 'N/A'}</td>
                      <td className="py-3 px-4 text-white/70">{user.email}</td>
                      <td className="py-3 px-4 text-white/70">{user.phone || '-'}</td>
                      <td className="py-3 px-4">{getRoleBadge(user.role)}</td>
                      <td className="py-3 px-4 text-white/70 text-sm">
                        {new Date(user.created_at).toLocaleDateString('tr-TR')}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex gap-2">
                          <select
                            value={user.role}
                            onChange={(e) => handleRoleChange(user.id, e.target.value)}
                            className="px-3 py-1 bg-black/40 border border-white/10 rounded text-white text-sm focus:outline-none focus:border-red-500/50"
                          >
                            <option value="customer">Müşteri</option>
                            <option value="admin">Admin</option>
                          </select>
                          <button
                            onClick={() => handleDelete(user.id)}
                            className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-sm rounded transition-colors"
                          >
                            Sil
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="neon-glass-island p-6">
        <h2 className="text-lg font-semibold text-white mb-4">İstatistikler</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-black/20 p-4 rounded-lg">
            <div className="text-white/70 text-sm mb-1">Toplam Kullanıcı</div>
            <div className="text-white text-2xl font-bold">{users.length}</div>
          </div>
          <div className="bg-black/20 p-4 rounded-lg">
            <div className="text-white/70 text-sm mb-1">Admin</div>
            <div className="text-red-400 text-2xl font-bold">
              {users.filter(u => u.role === 'admin').length}
            </div>
          </div>
          <div className="bg-black/20 p-4 rounded-lg">
            <div className="text-white/70 text-sm mb-1">Müşteri</div>
            <div className="text-blue-400 text-2xl font-bold">
              {users.filter(u => u.role === 'customer').length}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
