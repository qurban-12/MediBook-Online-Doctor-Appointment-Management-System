## Environment & Secrets

This file explains how to rotate secrets safely and avoid committing sensitive values.

1. Do not commit `.env` to git. Use `.env.example` to document required variables.

2. To generate a strong JWT secret locally (safe):

```bash
cd backend
node scripts/generate_jwt_secret.js
# To write it into backend/.env (creates a backup):
node scripts/generate_jwt_secret.js --apply
```

3. After rotating secrets, restart the backend server.

4. For database credential rotation, perform rotation in your DB provider (Atlas, etc.), then update `MONGO_URI` in your `.env`.
