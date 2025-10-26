# API service (minimal)

This folder contains a minimal FastAPI app used as a starting point for the backend.

Run locally (PowerShell):

```powershell
python -m pip install -r services/api/requirements.txt
python -m uvicorn services.api.main:app --reload
```

Open http://127.0.0.1:8000/health to verify.
