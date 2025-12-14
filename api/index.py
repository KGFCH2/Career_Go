from app import app as application

# Minimal serverless adapter for Vercel
# Vercel's Python builder will look for a WSGI callable named
# `application` in this file. We import the `app` Flask instance
# from the project root `app.py` and expose it as `application`.
