import express from 'express';
import fs from 'fs';
import path from 'path';
import rateLimit from 'express-rate-limit';

const app = express();
app.use(express.json());

const limiter = rateLimit({ windowMs: 60_000, max: 60 });
app.use(limiter);

app.get('/api/revoked', (req, res) => {
  const nonce = String(req.query.nonce || '');
  const dbPath = path.resolve(__dirname, 'data/revoked.json');
  let list: Array<{ nonce: string }>; 
  try {
    list = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
  } catch {
    list = [];
  }
  const revoked = !!list.find((e) => e.nonce === nonce);
  res.json({ revoked });
});

const port = process.env.PORT || 3001;
app.listen(port, () => console.log(`Revocation API running on :${port}`));
