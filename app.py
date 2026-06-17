"""
BigQuery Release Notes Viewer
Fetches and displays release notes from the official Google Cloud XML feed.
"""

import xml.etree.ElementTree as ET
from datetime import datetime

import requests
from flask import Flask, jsonify, render_template

app = Flask(__name__)

FEED_URL = "https://docs.cloud.google.com/feeds/bigquery-release-notes.xml"

# Atom namespace used in the feed
ATOM_NS = "{http://www.w3.org/2005/Atom}"


def fetch_release_notes():
    """Fetch and parse the BigQuery release notes XML feed."""
    response = requests.get(FEED_URL, timeout=30)
    response.raise_for_status()

    root = ET.fromstring(response.content)
    entries = []

    for entry in root.findall(f"{ATOM_NS}entry"):
        title = entry.findtext(f"{ATOM_NS}title", default="")
        link_el = entry.find(f"{ATOM_NS}link")
        link = link_el.get("href", "") if link_el is not None else ""
        updated = entry.findtext(f"{ATOM_NS}updated", default="")
        content_el = entry.find(f"{ATOM_NS}content")
        content = content_el.text if content_el is not None and content_el.text else ""

        # Parse date for display
        display_date = updated
        try:
            dt = datetime.fromisoformat(updated.replace("Z", "+00:00"))
            display_date = dt.strftime("%B %d, %Y")
        except (ValueError, AttributeError):
            pass

        entries.append(
            {
                "title": title,
                "link": link,
                "updated": updated,
                "display_date": display_date,
                "content": content,
            }
        )

    return entries


@app.route("/")
def index():
    """Serve the main page."""
    return render_template("index.html")


@app.route("/api/releases")
def api_releases():
    """API endpoint that returns release notes as JSON."""
    try:
        entries = fetch_release_notes()
        return jsonify({"status": "ok", "entries": entries})
    except requests.RequestException as e:
        return jsonify({"status": "error", "message": str(e)}), 502
    except ET.ParseError as e:
        return jsonify({"status": "error", "message": f"XML parse error: {e}"}), 500


if __name__ == "__main__":
    app.run(debug=True, port=5000)
