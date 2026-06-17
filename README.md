# BigQuery Release Notes Viewer

A sleek, dark-themed web application that fetches the latest BigQuery release notes from Google Cloud's official Atom feed and lets you share updates on X (Twitter) with a single click.

![Python](https://img.shields.io/badge/Python-3.10+-3776AB?logo=python&logoColor=white)
![Flask](https://img.shields.io/badge/Flask-3.1-000000?logo=flask&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green)

---

## ✨ Features

- **Live Feed Ingestion** — Fetches and parses the official [BigQuery release notes](https://docs.cloud.google.com/feeds/bigquery-release-notes.xml) Atom XML feed in real time
- **Refresh with Spinner** — One-click refresh button with animated spinner and skeleton loading placeholders
- **Card-based UI** — Each release is displayed as an interactive card with title, date badge, and content preview
- **Post on X** — Select any release card and instantly share it on X (Twitter) with a pre-filled tweet containing the title, link, and hashtags
- **Keyboard Shortcuts** — Press `Escape` to deselect a card
- **Responsive Design** — Works seamlessly on desktop and mobile

## 🏗️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Backend** | Python, Flask |
| **Frontend** | Vanilla HTML, CSS, JavaScript |
| **Data Source** | Google Cloud Atom XML Feed |
| **Sharing** | Twitter/X Intent API |

## 📁 Project Structure

```
bq-releases-notes/
├── app.py                  # Flask server — routes & XML parsing
├── requirements.txt        # Python dependencies
├── .gitignore              # Git ignore rules
├── static/
│   ├── css/
│   │   └── style.css       # Dark theme, glassmorphism, animations
│   └── js/
│       └── app.js          # Fetch, render, select & tweet logic
└── templates/
    └── index.html          # Main HTML template
```

## 🚀 Getting Started

### Prerequisites

- Python 3.10 or higher
- pip

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/Bertodei88/Roberto-event-talks-app.git
   cd Roberto-event-talks-app
   ```

2. **Install dependencies**

   ```bash
   pip install -r requirements.txt
   ```

3. **Run the application**

   ```bash
   python app.py
   ```

4. **Open your browser** and navigate to:

   ```
   http://127.0.0.1:5000
   ```

## 🔄 How It Works

### Architecture

```
Browser (app.js)  ──GET /api/releases──▶  Flask (app.py)  ──GET──▶  Google Cloud XML Feed
                  ◀── JSON response ───                   ◀── XML ──
```

1. The browser calls the `/api/releases` endpoint
2. Flask fetches the Atom XML feed from `docs.cloud.google.com`
3. The XML is parsed using Python's `ElementTree`, extracting title, link, date, and content from each `<entry>`
4. The data is returned as JSON to the browser
5. JavaScript renders each entry as an interactive card

### Tweeting a Release

1. Click any release card to select it
2. A floating action bar slides up from the bottom
3. Click **"Post on X"** to open a pre-filled tweet with:
   - The release title
   - A link to the full release note
   - `#BigQuery #GoogleCloud` hashtags

## 🎨 Design Highlights

- **Dark theme** with a gradient mesh background
- **Glassmorphism** header and tweet bar using `backdrop-filter: blur()`
- **Skeleton loading** cards with pulse animation
- **Staggered fade-in** animations for cards
- **Micro-interactions** — hover effects, glow borders, and smooth transitions

## 📄 API Reference

### `GET /`

Serves the main HTML page.

### `GET /api/releases`

Returns BigQuery release notes as JSON.

**Success Response (200):**

```json
{
  "status": "ok",
  "entries": [
    {
      "title": "BigQuery release notes",
      "link": "https://cloud.google.com/bigquery/docs/release-notes#...",
      "updated": "2026-06-15T18:00:00Z",
      "display_date": "June 15, 2026",
      "content": "<h2>New feature</h2><p>...</p>"
    }
  ]
}
```

**Error Response (502):**

```json
{
  "status": "error",
  "message": "Connection timeout"
}
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/my-feature`)
3. Commit your changes (`git commit -m 'Add my feature'`)
4. Push to the branch (`git push origin feature/my-feature`)
5. Open a Pull Request

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

---

Built with ❤️ by [Bertodei88](https://github.com/Bertodei88)
