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

**1. Push from your PC, pull on the server**
```bash
# on PC — after changes are committed
git push

# on server
cd /path/to/bitcoin.info.zm   # pm2 show bitcoin-info-zm → script path
git pull
npm install
```

**2. Env file on server** (create once, never in git)
```bash
cp .env.example .env
nano .env
```
Example:
```
BITCOIN_INFO_PORT=3000
SATREWARD_URL=http://127.0.0.1:30001
```

**3. SatReward** (separate repo — see SatReward README)
```bash
cd /path/to/SatReward
git pull
npm install
npm run build
npx prisma db push
cp .env.example .env
nano .env          # add BLINK_API_KEY and wallet ID
pm2 start npm --name satreward -- start
pm2 save
```

**4. Restart main site**
```bash
cd /path/to/bitcoin.info.zm
pm2 restart bitcoin-info-zm
pm2 save
```

Open: `https://bitcoin.info.zm/satreward`

## Notes
- `.env` is gitignored. Only `.env.example` goes to GitHub.
- Set `SATREWARD_URL` if SatReward runs on a different host or port.
- Set `BITCOIN_INFO_PORT` to change this site's port (default `3000`).
