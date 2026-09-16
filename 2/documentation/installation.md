# Installation Guide

## Local use

1. Copy the complete project folder to a web-accessible location.
2. Open `index.html` for a direct preview.
3. For consistent local routing, run a static server from the project root:

   `python3 -m http.server 8080`

4. Open `http://localhost:8080` in a browser.

## Web hosting

Upload the complete folder without changing its directory structure. Configure `index.html` as the default document and `pages/404.html` as the not-found page when supported by the host.

No build step, package installation, database, or server runtime is required.
