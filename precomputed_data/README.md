# Precomputed RAG Artifacts

This directory contains **precomputed documentation artifacts**
used by the application at runtime.

- Data is generated **offline** via the ingestion pipeline
  (parser → cleaner → chunker → embedder)
- Artifacts are **loaded at startup**, not generated per request
- This is **not training data**
- This is **not the full Jenkins documentation**
- Included to ensure deterministic startup and reproducible demos

In production, these artifacts would be regenerated via
scheduled jobs or stored in external object storage.
