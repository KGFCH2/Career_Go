import sys, traceback

try:
    from app import app as application
except Exception as e:
    # Log full traceback to stderr so Vercel captures it in function logs
    traceback.print_exc(file=sys.stderr)

    # Provide a minimal WSGI app that responds with 500 and a short message
    def application(environ, start_response):
        start_response('500 Internal Server Error', [('Content-Type', 'text/plain')])
        return [b'Application failed to start. Check server logs for details.']

# Minimal serverless adapter for Vercel
# Vercel's Python builder will look for a WSGI callable named
# `application` in this file. We import the `app` Flask instance
# from the project root `app.py` and expose it as `application`.
