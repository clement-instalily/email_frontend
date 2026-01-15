import { useState, useEffect } from 'react'
import {
  Mail,
  AlertTriangle,
  Info,
  Calendar,
  Users,
  ListTodo,
  Sparkles,
  Settings,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  User,
  CheckCircle2,
  XCircle,
  LogOut,
  Database,
  Plane
} from 'lucide-react'
import LoginPage from './components/LoginPage'
import EmailWalletsPage from './components/GmailAccountsPage'

// Python FastAPI backend handles both auth and analysis
// const API_BASE = 'http://127.0.0.1:8000'  // Local development
const API_BASE = 'https://summarize-ai-1098668201338.us-central1.run.app'  // Production

const CATEGORY_CONFIG = {
  ACTIONS_AND_COMMITMENTS: {
    label: 'Actions & Commitments',
    icon: AlertTriangle,
    color: 'from-rose-500 to-red-600',
    bgColor: 'bg-rose-50',
    borderColor: 'border-rose-200',
    textColor: 'text-rose-600',
    description: 'Next steps and promises'
  },
  SCHEDULE_AND_DEADLINES: {
    label: 'Schedule & Deadlines',
    icon: Calendar,
    color: 'from-violet-500 to-purple-600',
    bgColor: 'bg-violet-50',
    borderColor: 'border-violet-200',
    textColor: 'text-violet-600',
    description: 'Calendar events and deadlines'
  },
  BILLS_AND_RECEIPTS: {
    label: 'Bills & Receipts',
    icon: ListTodo,
    color: 'from-amber-500 to-orange-600',
    bgColor: 'bg-amber-50',
    borderColor: 'border-amber-200',
    textColor: 'text-amber-600',
    description: 'Invoices, receipts, statements'
  },
  FINANCE: {
    label: 'Finance',
    icon: Info,
    color: 'from-emerald-500 to-green-600',
    bgColor: 'bg-emerald-50',
    borderColor: 'border-emerald-200',
    textColor: 'text-emerald-600',
    description: 'Market news, portfolio updates'
  },
  RECRUITING: {
    label: 'Recruiting',
    icon: Users,
    color: 'from-sky-500 to-blue-600',
    bgColor: 'bg-sky-50',
    borderColor: 'border-sky-200',
    textColor: 'text-sky-600',
    description: 'Job search and interviews'
  },
  TRAVEL: {
    label: 'Travel',
    icon: Plane,
    color: 'from-indigo-500 to-blue-600',
    bgColor: 'bg-indigo-50',
    borderColor: 'border-indigo-200',
    textColor: 'text-indigo-600',
    description: 'Flights, hotels, itineraries'
  },
  PERSONAL: {
    label: 'Personal',
    icon: User,
    color: 'from-pink-500 to-rose-600',
    bgColor: 'bg-pink-50',
    borderColor: 'border-pink-200',
    textColor: 'text-pink-600',
    description: 'Friends and family'
  }
}

function EmailCard({ email, category }) {
  const [expanded, setExpanded] = useState(false)
  const config = CATEGORY_CONFIG[category]
  
  const formatDate = (dateStr) => {
    if (!dateStr) return ''
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div 
      className={`glass rounded-xl p-4 transition-all duration-300 hover:shadow-md cursor-pointer border ${config.borderColor} hover:border-opacity-80`}
      onClick={() => setExpanded(!expanded)}
    >
      {/* Wallet/Account Badge */}
      {email.wallet_email && (
        <div className="flex items-center gap-1.5 mb-3 pb-2 border-b border-slate-100">
          <Mail className="w-3 h-3 text-slate-400" />
          <span className="text-xs text-slate-500 truncate">
            {email.wallet_email}
          </span>
        </div>
      )}
      
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <User className="w-4 h-4 text-slate-400 flex-shrink-0" />
            <span className="font-medium text-slate-800 truncate">
              {email.sender_name || 'Unknown Sender'}
            </span>
          </div>
          <p className="text-sm text-slate-500 truncate mb-1">
            {email.from_address}
          </p>
          <p className={`text-sm font-medium ${expanded ? '' : 'line-clamp-2'} text-slate-700 leading-relaxed`}>
            {email.subject}
          </p>
        </div>
        <div className="flex flex-col items-end gap-2 flex-shrink-0">
          <span className="text-xs text-slate-400 font-mono">
            {formatDate(email.date_received)}
          </span>
          {expanded ? (
            <ChevronUp className="w-4 h-4 text-slate-400" />
          ) : (
            <ChevronDown className="w-4 h-4 text-slate-400" />
          )}
        </div>
      </div>
      
      {expanded && email.body && (
        <div className="mt-4 pt-4 border-t border-slate-200 animate-fade-in">
          <div className="text-sm text-slate-600 bg-slate-50 rounded-lg p-3 max-h-64 overflow-y-auto whitespace-pre-wrap">
            {email.body}
          </div>
        </div>
      )}
    </div>
  )
}

function CategorySection({ category, emails }) {
  const [isCollapsed, setIsCollapsed] = useState(true)
  const config = CATEGORY_CONFIG[category]
  const Icon = config.icon

  // Sort emails by date_received, most recent first
  const sortedEmails = [...emails].sort((a, b) => {
    const dateA = new Date(a.date_received)
    const dateB = new Date(b.date_received)
    return dateB - dateA // Descending order (most recent first)
  })

  return (
    <div className="animate-slide-up" style={{ animationFillMode: 'backwards' }}>
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className={`w-full flex items-center justify-between p-4 glass rounded-xl mb-3 transition-all duration-300 hover:shadow-md border ${config.borderColor}`}
      >
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${config.color} flex items-center justify-center shadow-lg`}>
            <Icon className="w-5 h-5 text-white" />
          </div>
          <div className="text-left">
            <h3 className="font-semibold text-slate-800">{config.label}</h3>
            <p className="text-sm text-slate-500">{config.description}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className={`text-2xl font-bold ${config.textColor}`}>
            {emails.length}
          </span>
          {isCollapsed ? (
            <ChevronDown className="w-5 h-5 text-slate-400" />
          ) : (
            <ChevronUp className="w-5 h-5 text-slate-400" />
          )}
        </div>
      </button>

      {!isCollapsed && emails.length > 0 && (
        <div className="space-y-3 mt-3">
          {sortedEmails.map((email, idx) => (
            <EmailCard key={idx} email={email} category={category} />
          ))}
        </div>
      )}
    </div>
  )
}

function ConfigPanel({ config, setConfig, onAnalyze, isLoading }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="glass rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 hover:bg-slate-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <Settings className="w-5 h-5 text-slate-500" />
          <span className="font-medium text-slate-700">Analysis Settings</span>
        </div>
        {isOpen ? (
          <ChevronUp className="w-5 h-5 text-slate-400" />
        ) : (
          <ChevronDown className="w-5 h-5 text-slate-400" />
        )}
      </button>
      
      {isOpen && (
        <div className="p-4 pt-0 border-t border-slate-200 animate-fade-in">
          <div className="mb-4 mt-4">
            <label className="block text-sm text-slate-600 mb-1.5">Folders (comma-separated)</label>
            <input
              type="text"
              value={config.folders.join(', ')}
              onChange={(e) => setConfig({ ...config, folders: e.target.value.split(',').map(f => f.trim()).filter(f => f) })}
              placeholder="INBOX, [Gmail]/Sent Mail"
              className="w-full px-3 py-2 rounded-lg bg-white border border-slate-200 text-slate-800 placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all font-mono text-sm"
            />
          </div>
        </div>
      )}
      
      <div className="p-4 border-t border-slate-200 bg-slate-50">
        <button
          onClick={onAnalyze}
          disabled={isLoading}
          className={`w-full py-3 px-6 rounded-xl font-semibold text-white transition-all duration-300 flex items-center justify-center gap-2 ${
            isLoading 
              ? 'bg-slate-300 cursor-not-allowed' 
              : 'bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 shadow-lg hover:shadow-xl hover:shadow-blue-500/25'
          }`}
        >
          {isLoading ? (
            <>
              <RefreshCw className="w-5 h-5 animate-spin" />
              <span>Analyzing Emails...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              <span>Analyze My Inbox</span>
            </>
          )}
        </button>
      </div>
    </div>
  )
}

function SummaryCards({ summary }) {
  const totalEmails = Object.values(summary).reduce((a, b) => a + b, 0)
  const activeCategories = Object.values(summary).filter(v => v > 0).length

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      <div className="glass rounded-xl p-4 border border-slate-200 shadow-sm">
        <p className="text-sm text-slate-500 mb-1">Total Insights</p>
        <p className="text-3xl font-bold gradient-text">{totalEmails}</p>
      </div>
      <div className="glass rounded-xl p-4 border border-slate-200 shadow-sm">
        <p className="text-sm text-slate-500 mb-1">Active Categories</p>
        <p className="text-3xl font-bold text-emerald-600">{activeCategories}</p>
      </div>
      <div className="glass rounded-xl p-4 border border-slate-200 shadow-sm">
        <p className="text-sm text-slate-500 mb-1">Actions & Commitments</p>
        <p className="text-3xl font-bold text-rose-600">{summary.ACTIONS_AND_COMMITMENTS || 0}</p>
      </div>
      <div className="glass rounded-xl p-4 border border-slate-200 shadow-sm">
        <p className="text-sm text-slate-500 mb-1">Schedule</p>
        <p className="text-3xl font-bold text-violet-600">{summary.SCHEDULE_AND_DEADLINES || 0}</p>
      </div>
    </div>
  )
}

function LoadingState() {
  return (
    <div className="space-y-4">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className={`glass rounded-xl p-4 border border-slate-200 stagger-${i}`}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg shimmer" />
            <div className="flex-1">
              <div className="h-4 w-32 rounded shimmer mb-2" />
              <div className="h-3 w-48 rounded shimmer" />
            </div>
            <div className="h-8 w-12 rounded shimmer" />
          </div>
        </div>
      ))}
    </div>
  )
}

function EmptyState() {
  return (
    <div className="text-center py-16">
      <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-blue-100 to-violet-100 flex items-center justify-center">
        <Mail className="w-10 h-10 text-blue-600" />
      </div>
      <h3 className="text-xl font-semibold text-slate-800 mb-2">Ready to Analyze</h3>
      <p className="text-slate-500 max-w-md mx-auto">
        Configure your settings above and click "Analyze My Inbox" to extract insights from your emails.
      </p>
    </div>
  )
}

function ErrorState({ error, onRetry }) {
  return (
    <div className="text-center py-16">
      <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-rose-100 flex items-center justify-center">
        <XCircle className="w-10 h-10 text-rose-600" />
      </div>
      <h3 className="text-xl font-semibold text-slate-800 mb-2">Analysis Failed</h3>
      <p className="text-slate-500 max-w-md mx-auto mb-6">{error}</p>
      <button
        onClick={onRetry}
        className="px-6 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
      >
        Try Again
      </button>
    </div>
  )
}

function SuccessToast({ message, onClose }) {
  return (
    <div className="fixed bottom-6 right-6 flex items-center gap-3 px-4 py-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 animate-slide-up shadow-lg">
      <CheckCircle2 className="w-5 h-5" />
      <span>{message}</span>
      <button onClick={onClose} className="ml-2 hover:text-emerald-500">
        <XCircle className="w-4 h-4" />
      </button>
    </div>
  )
}

function Dashboard({ user, onLogout, onManageAccounts }) {
  const [config, setConfig] = useState({
    folders: ['INBOX', '[Gmail]/Sent Mail']
  })
  const [results, setResults] = useState(null)
  const [summary, setSummary] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [toast, setToast] = useState(null)

  const analyzeEmails = async () => {
    setIsLoading(true)
    setError(null)
    
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`${API_BASE}/analyze`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          folders: config.folders
        })
      })
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.detail || `HTTP error ${response.status}`)
      }
      
      const data = await response.json()
      setResults(data.results)
      setSummary(data.summary)
      setToast('Email analysis completed successfully!')
      setTimeout(() => setToast(null), 4000)
    } catch (err) {
      console.error('Analysis error:', err)
      setError(err.message || 'Failed to analyze emails. Please check your connection and try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const categoryOrder = [
    'ACTIONS_AND_COMMITMENTS',
    'SCHEDULE_AND_DEADLINES',
    'BILLS_AND_RECEIPTS',
    'FINANCE',
    'RECRUITING',
    'TRAVEL',
    'PERSONAL'
  ]

  return (
    <div className="min-h-screen text-slate-800 font-sans">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center shadow-lg shadow-blue-500/25">
              <Mail className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-display font-bold tracking-tight">
                <span className="gradient-text">Samaryz AI</span>
              </h1>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <button
              onClick={onManageAccounts}
              className="flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors"
            >
              <Database className="w-4 h-4 text-slate-600" />
              <span className="text-sm font-medium text-slate-700">Email Wallets</span>
            </button>
            
            <div className="flex items-center gap-3 pl-3 border-l border-slate-200">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center">
                  <span className="text-white text-sm font-medium">
                    {user?.name?.[0] || user?.email?.[0]?.toUpperCase()}
                  </span>
                </div>
                <span className="text-sm text-slate-600 hidden sm:block">{user?.email}</span>
              </div>
              <button
                onClick={onLogout}
                className="p-2 rounded-lg hover:bg-slate-100 transition-colors text-slate-500 hover:text-slate-700"
                title="Sign out"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Config Panel */}
        <div className="mb-8 animate-fade-in">
          <ConfigPanel 
            config={config} 
            setConfig={setConfig} 
            onAnalyze={analyzeEmails}
            isLoading={isLoading}
          />
        </div>

        {/* Results Section */}
        {error ? (
          <ErrorState error={error} onRetry={analyzeEmails} />
        ) : isLoading ? (
          <LoadingState />
        ) : results && summary ? (
          <>
            <SummaryCards summary={summary} />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {categoryOrder.map((category, idx) => (
                <div key={category} className={`stagger-${idx + 1}`}>
                  <CategorySection
                    category={category}
                    emails={results[category] || []}
                  />
                </div>
              ))}
            </div>
          </>
        ) : (
          <EmptyState />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 mt-16 bg-white/50">
        <div className="max-w-6xl mx-auto px-4 py-6 flex items-center justify-between text-sm text-slate-400">
          <span>Powered by AI</span>
          <span className="font-mono">v1.0.0</span>
        </div>
      </footer>

      {/* Toast */}
      {toast && <SuccessToast message={toast} onClose={() => setToast(null)} />}
    </div>
  )
}

function App() {
  const [user, setUser] = useState(null)
  const [currentPage, setCurrentPage] = useState('dashboard')
  const [isLoading, setIsLoading] = useState(true)

  // Check for existing session on mount
  useEffect(() => {
    const savedToken = localStorage.getItem('token')
    const savedUser = localStorage.getItem('user')
    
    if (savedToken && savedUser) {
      setUser(JSON.parse(savedUser))
    }
    setIsLoading(false)
  }, [])

  const handleLogin = (userData) => {
    setUser(userData)
    setCurrentPage('dashboard')
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
    setCurrentPage('dashboard')
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
      </div>
    )
  }

  // Not logged in - show login page
  if (!user) {
    return <LoginPage onLogin={handleLogin} />
  }

  // Email wallets management page
  if (currentPage === 'accounts') {
    return (
      <EmailWalletsPage 
        user={user}
        onBack={() => setCurrentPage('dashboard')}
      />
    )
  }

  // Main dashboard
  return (
    <Dashboard 
      user={user}
      onLogout={handleLogout}
      onManageAccounts={() => setCurrentPage('accounts')}
    />
  )
}

export default App
