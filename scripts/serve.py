"""Local preview server with caching disabled (stdlib only).

Usage:  python scripts/serve.py [port]        (default 8765, serves the repo root)
Pages also work when opened directly via file://, but a server avoids stale caches
while editing and is what .claude/launch.json uses for the preview pane.
"""
import functools
import http.server
import pathlib
import sys

ROOT = pathlib.Path(__file__).resolve().parent.parent


class NoCacheHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header("Cache-Control", "no-store, max-age=0")
        super().end_headers()

    def log_message(self, fmt, *args):  # keep the console quiet
        pass


def main() -> None:
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 8765
    handler = functools.partial(NoCacheHandler, directory=str(ROOT))
    with http.server.ThreadingHTTPServer(("127.0.0.1", port), handler) as httpd:
        print(f"Serving {ROOT} at http://127.0.0.1:{port}/  (Ctrl+C to stop)")
        httpd.serve_forever()


if __name__ == "__main__":
    main()
