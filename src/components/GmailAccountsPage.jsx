import { useState, useEffect, useCallback } from 'react'
import { 
  Mail, 
  Plus, 
  Trash2, 
  X, 
  Check, 
  AlertCircle,
  Eye,
  EyeOff,
  ArrowLeft,
  CheckCircle2,
  Server,
  Shield,
  Key
} from 'lucide-react'

// const API_BASE = 'http://127.0.0.1:8000'  // Local development
const API_BASE = 'https://summarize-ai-1098668201338.us-central1.run.app'  // Production

// Google logo SVG component
function GoogleLogo({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  )
}

function WalletCard({ wallet, onDelete }) {
  const isOAuth = wallet.auth_type === 'oauth'
  
  return (
    <div className="glass rounded-xl p-5 border border-emerald-200 transition-all">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
            isOAuth 
              ? 'bg-white border-2 border-slate-200' 
              : 'bg-gradient-to-br from-blue-500 to-violet-600'
          }`}>
            {isOAuth ? (
              <GoogleLogo className="w-7 h-7" />
            ) : (
              <Mail className="w-6 h-6 text-white" />
            )}
          </div>
          <div className="min-w-0">
            <h3 className="font-semibold text-slate-800 truncate">
              {wallet.display_name || wallet.email_address}
            </h3>
            <p className="text-sm text-slate-500 truncate">{wallet.email_address}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={() => onDelete(wallet)}
            className="p-2 rounded-lg hover:bg-slate-100 transition-colors text-slate-500 hover:text-rose-600"
            title="Delete"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-slate-200">
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-500">Auth Type</span>
          <span className={`flex items-center gap-1.5 font-medium ${
            isOAuth ? 'text-emerald-600' : 'text-blue-600'
          }`}>
            {isOAuth ? (
              <>
                <Shield className="w-3.5 h-3.5" />
                OAuth
              </>
            ) : (
              <>
                <Key className="w-3.5 h-3.5" />
                App Password
              </>
            )}
          </span>
        </div>
        <div className="flex items-center justify-between text-sm mt-1">
          <span className="text-slate-500">IMAP Server</span>
          <span className="text-slate-700 font-mono text-xs">{wallet.imap_server}</span>
        </div>
        <div className="flex items-center justify-between text-sm mt-1">
          <span className="text-slate-500">Added</span>
          <span className="text-slate-700">
            {new Date(wallet.created_at).toLocaleDateString()}
          </span>
        </div>
      </div>
    </div>
  )
}

function WalletModal({ onClose, onSave, isLoading }) {
  const [formData, setFormData] = useState({
    email_address: '',
    password: '',
    imap_server: 'imap.gmail.com',
    display_name: ''
  })
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave(formData)
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md animate-slide-up">
        <div className="p-6 border-b border-slate-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-slate-800">
              Add Email (App Password)
            </h2>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5 text-slate-500" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Display Name <span className="text-slate-400">(optional)</span>
            </label>
            <input
              type="text"
              value={formData.display_name}
              onChange={(e) => setFormData({ ...formData, display_name: e.target.value })}
              placeholder="Work Email, Personal, etc."
              className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 text-slate-800 placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Email Address
            </label>
            <input
              type="email"
              value={formData.email_address}
              onChange={(e) => setFormData({ ...formData, email_address: e.target.value })}
              placeholder="your.email@gmail.com"
              required
              className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 text-slate-800 placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              App Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="Enter app password"
                required
                className="w-full px-4 py-3 pr-12 rounded-xl bg-white border border-slate-200 text-slate-800 placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all font-mono"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            <p className="mt-2 text-xs text-slate-500">
              For Gmail, generate an app password at{' '}
              <a 
                href="https://myaccount.google.com/apppasswords" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                Google Account Settings
              </a>
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              IMAP Server
            </label>
            <div className="relative">
              <Server className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                value={formData.imap_server}
                onChange={(e) => setFormData({ ...formData, imap_server: e.target.value })}
                placeholder="imap.gmail.com"
                required
                className="w-full pl-11 pr-4 py-3 rounded-xl bg-white border border-slate-200 text-slate-800 placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all font-mono text-sm"
              />
            </div>
            <p className="mt-2 text-xs text-slate-500">
              Common servers: imap.gmail.com, outlook.office365.com, imap.mail.yahoo.com
            </p>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 px-4 rounded-xl border border-slate-200 text-slate-700 font-medium hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 text-white font-medium hover:from-blue-500 hover:to-violet-500 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <Check className="w-5 h-5" />
                  Add Wallet
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function EmailWalletsPage({ user, onBack }) {
  const [wallets, setWallets] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [isConnectingGoogle, setIsConnectingGoogle] = useState(false)
  const [toast, setToast] = useState(null)

  const getAuthHeaders = () => ({
    'Authorization': `Bearer ${localStorage.getItem('token')}`,
    'Content-Type': 'application/json'
  })

  const showToast = (message, type = 'success') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3000)
  }

  const fetchWallets = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE}/api/wallets`, {
        headers: getAuthHeaders()
      })
      const data = await response.json()
      if (response.ok) {
        setWallets(data.wallets)
      } else {
        setError(data.detail || data.error || 'Failed to load wallets')
      }
    } catch (err) {
      setError('Failed to load wallets')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchWallets()
  }, [fetchWallets])

  // Listen for OAuth callback messages
  useEffect(() => {
    const handleOAuthMessage = (event) => {
      if (event.data.type === 'oauth_success') {
        setIsConnectingGoogle(false)
        showToast(`Gmail connected: ${event.data.email}`)
        fetchWallets()
      } else if (event.data.type === 'oauth_error') {
        setIsConnectingGoogle(false)
        showToast(`Connection failed: ${event.data.error}`, 'error')
      }
    }

    window.addEventListener('message', handleOAuthMessage)
    return () => window.removeEventListener('message', handleOAuthMessage)
  }, [fetchWallets])

  const handleConnectGoogle = async () => {
    setIsConnectingGoogle(true)
    
    try {
      // Get OAuth URL from backend
      const response = await fetch(`${API_BASE}/api/auth/google/url`, {
        headers: getAuthHeaders()
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.detail || 'Failed to get OAuth URL')
      }
      
      // Open popup for OAuth
      const width = 500
      const height = 600
      const left = window.screenX + (window.outerWidth - width) / 2
      const top = window.screenY + (window.outerHeight - height) / 2
      
      const popup = window.open(
        data.auth_url,
        'gmail-oauth',
        `width=${width},height=${height},left=${left},top=${top},popup=1`
      )
      
      // Check if popup was blocked
      if (!popup) {
        throw new Error('Popup blocked. Please allow popups for this site.')
      }
      
      // Poll to check if popup was closed without completing OAuth
      const checkPopup = setInterval(() => {
        if (popup.closed) {
          clearInterval(checkPopup)
          setIsConnectingGoogle(false)
        }
      }, 500)
      
    } catch (err) {
      setIsConnectingGoogle(false)
      showToast(err.message || 'Failed to connect Google', 'error')
    }
  }

  const handleSave = async (formData) => {
    setIsSaving(true)
    try {
      const response = await fetch(`${API_BASE}/api/wallets`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(formData)
      })

      const data = await response.json()
      
      if (response.ok) {
        showToast('Email wallet added successfully')
        setShowModal(false)
        fetchWallets()
      } else {
        showToast(data.detail || data.error || 'Failed to add wallet', 'error')
      }
    } catch (err) {
      showToast('Failed to add wallet', 'error')
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async (wallet) => {
    if (!confirm(`Are you sure you want to delete ${wallet.email_address}?`)) return

    try {
      const response = await fetch(`${API_BASE}/api/wallets/${wallet.id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      })

      if (response.ok) {
        showToast('Wallet deleted successfully')
        fetchWallets()
      } else {
        const data = await response.json()
        showToast(data.detail || data.error || 'Failed to delete wallet', 'error')
      }
    } catch (err) {
      showToast('Failed to delete wallet', 'error')
    }
  }

  return (
    <div className="min-h-screen text-slate-800">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="p-2 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-slate-600" />
            </button>
            <div>
              <h1 className="text-xl font-bold text-slate-800">Email Wallets</h1>
              <p className="text-sm text-slate-500">Manage your connected email accounts for analysis</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Add Wallet Buttons */}
        <div className="mb-8">
          <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">
            Connect Email Account
          </h2>
          <div className="flex flex-wrap gap-3">
            {/* Connect with Google Button */}
            <button
              onClick={handleConnectGoogle}
              disabled={isConnectingGoogle}
              className="flex items-center gap-3 px-5 py-3 rounded-xl bg-white border-2 border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-all shadow-sm hover:shadow disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isConnectingGoogle ? (
                <div className="w-5 h-5 border-2 border-slate-300 border-t-slate-600 rounded-full animate-spin" />
              ) : (
                <GoogleLogo className="w-5 h-5" />
              )}
              <span className="font-medium text-slate-700">
                {isConnectingGoogle ? 'Connecting...' : 'Connect with Google'}
              </span>
            </button>

            {/* Manual Entry Button */}
            <button
              onClick={() => setShowModal(true)}
              className="flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 text-white font-medium hover:from-blue-500 hover:to-violet-500 transition-all shadow-lg hover:shadow-xl hover:shadow-blue-500/25"
            >
              <Plus className="w-5 h-5" />
              Add with App Password
            </button>
          </div>
          <p className="mt-3 text-sm text-slate-500">
            <strong>Recommended:</strong> Use "Connect with Google" for secure OAuth authentication. 
            Use "App Password" for other email providers or if OAuth isn't available.
          </p>
        </div>

        {/* Wallets Grid */}
        {isLoading ? (
          <div className="grid gap-4 md:grid-cols-2">
            {[1, 2].map(i => (
              <div key={i} className="glass rounded-xl p-5 border border-slate-200">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl shimmer" />
                  <div className="flex-1">
                    <div className="h-4 w-32 rounded shimmer mb-2" />
                    <div className="h-3 w-48 rounded shimmer" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <AlertCircle className="w-12 h-12 mx-auto text-rose-400 mb-4" />
            <p className="text-slate-600">{error}</p>
          </div>
        ) : wallets.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
              <Mail className="w-10 h-10 text-slate-400" />
            </div>
            <h3 className="text-xl font-semibold text-slate-800 mb-2">No Email Wallets</h3>
            <p className="text-slate-500 mb-6">Connect your first email account to start analyzing your inbox</p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {wallets.map(wallet => (
              <WalletCard
                key={wallet.id}
                wallet={wallet}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </main>

      {/* Modal */}
      {showModal && (
        <WalletModal
          onClose={() => setShowModal(false)}
          onSave={handleSave}
          isLoading={isSaving}
        />
      )}

      {/* Toast */}
      {toast && (
        <div className={`fixed bottom-6 right-6 flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg animate-slide-up ${
          toast.type === 'error' 
            ? 'bg-rose-50 border border-rose-200 text-rose-700'
            : 'bg-emerald-50 border border-emerald-200 text-emerald-700'
        }`}>
          {toast.type === 'error' ? (
            <AlertCircle className="w-5 h-5" />
          ) : (
            <CheckCircle2 className="w-5 h-5" />
          )}
          <span>{toast.message}</span>
        </div>
      )}
    </div>
  )
}
