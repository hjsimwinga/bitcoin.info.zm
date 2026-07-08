# Bitcoin for Zambia - Node Server

## Prerequisites
- Node.js 18+

## Install
```bash
npm install
```

## Run (local)
```bash
npm start
```
Then open `http://localhost:3000`.

SatReward lives at **`/satreward`**. Start SatReward first (in its folder):
```bash
cd ../SatReward
npm run dev
```
SatReward runs on port **30001**. This site proxies it at `/satreward`.

Copy env template (secrets stay local only):
```bash
cp .env.example .env
```

## Deploy on VPS (PM2)

Your server paths:
- Main site: `/var/www/bitcoin-info-zm`
- SatReward: `/root/SatReward`

**Step 1 — Main site**
```bash
cd /var/www/bitcoin-info-zm
git pull
npm install
cp .env.example .env
nano .env
```
Put in `.env`:
```
BITCOIN_INFO_PORT=2001
SATREWARD_URL=http://127.0.0.1:30001
```
(Nginx on this VPS sends traffic to port **2001**, not 3000.)

**Step 2 — SatReward** (create `.env` before build)
```bash
cd /root/SatReward
git pull
cp .env.example .env
nano .env
```
Add your Blink key and wallet ID, then:
```bash
npm install
npm run build
npx prisma db push
```

**Step 3 — PM2** (remove bad copies first)
```bash
pm2 delete satreward 2>/dev/null || true
cd /root/SatReward
pm2 start npm --name satreward --cwd /root/SatReward -- start
pm2 restart bitcoin-info-zm
pm2 save
```

Open: `https://bitcoin.info.zm/satreward`

## Notes
- `.env` is gitignored. Only `.env.example` goes to GitHub.
- Set `SATREWARD_URL` if SatReward runs on a different host or port.
- Set `BITCOIN_INFO_PORT` to change this site's port (default `3000`).
