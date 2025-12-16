import { useState } from 'react'
import { 
  Mail, 
  Zap, 
  AlertTriangle, 
  Info, 
  Calendar, 
  Users, 
  Send, 
  ListTodo, 
  Clock,
  Sparkles,
  Settings,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  User,
  CheckCircle2,
  XCircle
} from 'lucide-react'

const API_BASE = 'http://127.0.0.1:8000'

const CATEGORY_CONFIG = {
  IMPORTANCE: {
    label: 'Important',
    icon: Zap,
    color: 'from-amber-500 to-orange-600',
    bgColor: 'bg-amber-50',
    borderColor: 'border-amber-200',
    textColor: 'text-amber-600',
    description: 'High-priority emails requiring attention'
  },
  URGENCY: {
    label: 'Urgent',
    icon: AlertTriangle,
    color: 'from-rose-500 to-red-600',
    bgColor: 'bg-rose-50',
    borderColor: 'border-rose-200',
    textColor: 'text-rose-600',
    description: 'Time-sensitive matters'
  },
  INFORMATIONAL: {
    label: 'Informational',
    icon: Info,
    color: 'from-sky-500 to-blue-600',
    bgColor: 'bg-sky-50',
    borderColor: 'border-sky-200',
    textColor: 'text-sky-600',
    description: 'News, newsletters & updates'
  },
  SCHEDULE: {
    label: 'Schedule',
    icon: Calendar,
    color: 'from-violet-500 to-purple-600',
    bgColor: 'bg-violet-50',
    borderColor: 'border-violet-200',
    textColor: 'text-violet-600',
    description: 'Calendar events & dates'
  },
  COMMITMENTS: {
    label: 'Commitments to You',
    icon: Users,
    color: 'from-emerald-500 to-green-600',
    bgColor: 'bg-emerald-50',
    borderColor: 'border-emerald-200',
    textColor: 'text-emerald-600',
    description: 'Promises made by others'
  },
  OUTBOUND_COMMITMENTS: {
    label: 'Your Commitments',
    icon: Send,
    color: 'from-cyan-500 to-teal-600',
    bgColor: 'bg-cyan-50',
    borderColor: 'border-cyan-200',
    textColor: 'text-cyan-600',
    description: 'Promises you made'
  },
  REQUESTS: {
    label: 'Requests',
    icon: ListTodo,
    color: 'from-fuchsia-500 to-pink-600',
    bgColor: 'bg-fuchsia-50',
    borderColor: 'border-fuchsia-200',
    textColor: 'text-fuchsia-600',
    description: 'Tasks & action items'
  },
  DEADLINES: {
    label: 'Deadlines',
    icon: Clock,
    color: 'from-red-500 to-rose-600',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200',
    textColor: 'text-red-600',
    description: 'Time-bound deliverables'
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
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <User className="w-4 h-4 text-slate-400 flex-shrink-0" />
            <span className="font-medium text-slate-800 truncate">
              {email.sender_name || 'Unknown Sender'}
            </span>
          </div>
          <p className="text-sm text-slate-500 truncate mb-2">
            {email.from_address}
          </p>
          <p className={`text-sm ${expanded ? '' : 'line-clamp-2'} text-slate-600 leading-relaxed`}>
            {email.summary}
          </p>
        </div>
        <div className="flex flex-col items-end gap-2 flex-shrink-0">
          <span className="text-xs text-slate-400 font-mono">
            {formatDate(email.date_received || email.date_sent)}
          </span>
          {email.category && (
            <span className={`text-xs px-2 py-0.5 rounded-full ${config.bgColor} ${config.textColor}`}>
              {email.category}
            </span>
          )}
          {expanded ? (
            <ChevronUp className="w-4 h-4 text-slate-400" />
          ) : (
            <ChevronDown className="w-4 h-4 text-slate-400" />
          )}
        </div>
      </div>
      
      {expanded && (
        <div className="mt-4 pt-4 border-t border-slate-200 animate-fade-in">
          {email.important_dates && email.important_dates.length > 0 && (
            <div className="mb-3">
              <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                Important Dates
              </h4>
              <div className="space-y-1">
                {email.important_dates.map((date, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-sm">
                    <Calendar className="w-3.5 h-3.5 text-violet-500" />
                    <span className="text-slate-700">{date.date}</span>
                    <span className="text-slate-400">—</span>
                    <span className="text-slate-600">{date.description}</span>
                    {date.urgency && (
                      <span className={`text-xs px-1.5 py-0.5 rounded ${
                        date.urgency === 'high' ? 'bg-rose-100 text-rose-600' :
                        date.urgency === 'medium' ? 'bg-amber-100 text-amber-600' :
                        'bg-emerald-100 text-emerald-600'
                      }`}>
                        {date.urgency}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {email.calendar && email.calendar.length > 0 && (
            <div>
              <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                Calendar Events
              </h4>
              <div className="space-y-2">
                {email.calendar.map((event, idx) => (
                  <div key={idx} className="flex items-start gap-2 p-2 rounded-lg bg-slate-50">
                    <Calendar className="w-4 h-4 text-violet-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-slate-700 font-medium">{event.title}</p>
                      <p className="text-xs text-slate-500">
                        {event.date} {event.time && `at ${event.time}`}
                        {event.location && ` • ${event.location}`}
                      </p>
                      {event.suggested_action && (
                        <span className="inline-flex items-center gap-1 mt-1 text-xs text-violet-600">
                          <ExternalLink className="w-3 h-3" />
                          {event.suggested_action}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function CategorySection({ category, emails }) {
  const [isCollapsed, setIsCollapsed] = useState(emails.length === 0)
  const config = CATEGORY_CONFIG[category]
  const Icon = config.icon

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
        <div className="space-y-3 ml-4 pl-4 border-l-2 border-slate-200 mb-6">
          {emails.map((email, idx) => (
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4 mt-4">
            <div>
              <label className="block text-sm text-slate-600 mb-1.5">Days to Analyze</label>
              <input
                type="number"
                min="1"
                max="90"
                value={config.days_back}
                onChange={(e) => setConfig({ ...config, days_back: parseInt(e.target.value) || 7 })}
                className="w-full px-3 py-2 rounded-lg bg-white border border-slate-200 text-slate-800 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
              />
            </div>
            <div>
              <label className="block text-sm text-slate-600 mb-1.5">Batch Size</label>
              <input
                type="number"
                min="1"
                max="50"
                value={config.batch_size}
                onChange={(e) => setConfig({ ...config, batch_size: parseInt(e.target.value) || 10 })}
                className="w-full px-3 py-2 rounded-lg bg-white border border-slate-200 text-slate-800 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
              />
            </div>
            <div>
              <label className="block text-sm text-slate-600 mb-1.5">Confidence Threshold</label>
              <input
                type="number"
                min="0"
                max="1"
                step="0.1"
                value={config.confidence_threshold}
                onChange={(e) => setConfig({ ...config, confidence_threshold: parseFloat(e.target.value) || 0.6 })}
                className="w-full px-3 py-2 rounded-lg bg-white border border-slate-200 text-slate-800 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
              />
            </div>
          </div>
          <div className="mb-4">
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
        <p className="text-sm text-slate-500 mb-1">Important</p>
        <p className="text-3xl font-bold text-amber-600">{summary.IMPORTANCE || 0}</p>
      </div>
      <div className="glass rounded-xl p-4 border border-slate-200 shadow-sm">
        <p className="text-sm text-slate-500 mb-1">Urgent</p>
        <p className="text-3xl font-bold text-rose-600">{summary.URGENCY || 0}</p>
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

function App() {
  const [config, setConfig] = useState({
    days_back: 7,
    batch_size: 10,
    confidence_threshold: 0.6,
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
      const response = await fetch(`${API_BASE}/analyze`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          days_back: config.days_back,
          batch_size: config.batch_size,
          confidence_threshold: config.confidence_threshold,
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
    'URGENCY',
    'IMPORTANCE', 
    'DEADLINES',
    'REQUESTS',
    'COMMITMENTS',
    'OUTBOUND_COMMITMENTS',
    'SCHEDULE',
    'INFORMATIONAL'
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
                <span className="gradient-text">Email Insight</span>
                <span className="text-slate-500 ml-1">Engine</span>
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-400">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-mono">localhost:8000</span>
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
            <div className="space-y-2">
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

export default App
