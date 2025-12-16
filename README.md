# Email Insight Engine - Frontend

A beautiful, modern React frontend for the Email Insight Engine API. Analyzes your emails using AI and categorizes them into actionable insights.

![Email Insight Engine](https://img.shields.io/badge/React-18-blue) ![Vite](https://img.shields.io/badge/Vite-5-purple) ![TailwindCSS](https://img.shields.io/badge/Tailwind-3-cyan)

## Features

- **8 Smart Categories**: Importance, Urgency, Informational, Schedule, Commitments, Outbound Commitments, Requests, and Deadlines
- **Beautiful Dark UI**: Glass morphism design with gradient accents
- **Expandable Email Cards**: View summaries, important dates, and calendar events
- **Configurable Analysis**: Adjust days to analyze, batch size, folders, and confidence threshold
- **Real-time Feedback**: Loading states, error handling, and success notifications

## Quick Start

### Prerequisites

- Node.js 18+ installed
- Backend API running on `http://127.0.0.1:8000`

### Installation

```bash
# Install dependencies
npm install

# Start the development server
npm run dev
```

The app will be available at `http://localhost:3000`

## Configuration

The frontend connects to the backend at `http://127.0.0.1:8000` by default. You can configure:

- **Days to Analyze**: Number of days to look back (1-90)
- **Batch Size**: AI processing batch size (1-50)
- **Confidence Threshold**: Minimum confidence for entity extraction (0-1)
- **Folders**: Email folders to scan (e.g., INBOX, [Gmail]/Sent Mail)

## Tech Stack

- **React 18** - UI framework
- **Vite 5** - Build tool
- **Tailwind CSS 3** - Styling
- **Lucide React** - Icons

## API Endpoints Used

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/analyze` | POST | Analyze emails and get categorized insights |
| `/health` | GET | Check API health status |
| `/categories` | GET | Get available categories |

## Email Categories

| Category | Description |
|----------|-------------|
| 🔥 **Urgent** | Time-sensitive matters requiring immediate action |
| ⚡ **Important** | High-priority emails requiring attention |
| ⏰ **Deadlines** | Emails with time-bound deliverables |
| 📋 **Requests** | Tasks and action items assigned to you |
| 🤝 **Commitments** | Promises made by others to you |
| 📤 **Your Commitments** | Promises you made to others |
| 📅 **Schedule** | Calendar events and important dates |
| ℹ️ **Informational** | News, newsletters, and updates |

## Development

```bash
# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## License

MIT
