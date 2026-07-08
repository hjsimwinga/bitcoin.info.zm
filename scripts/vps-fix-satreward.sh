#!/bin/bash
# Run on VPS as root. Fixes SatReward 502 at bitcoin.info.zm/satreward
set -e

echo "=== 1. SatReward ==="
cd /root/SatReward
git pull
if [ ! -f .env ]; then
  cp .env.example .env
  echo "Created .env — edit it now: nano /root/SatReward/.env"
  echo "Add BLINK_API_KEY and BLINK_USD_WALLET_ID, then run this script again."
  exit 1
fi
npm install
npm run build
npx prisma db push

echo "=== 2. Main site ==="
cd /var/www/bitcoin-info-zm
git pull
npm install
if [ ! -f .env ]; then cp .env.example .env; fi

echo "=== 3. PM2 ==="
pm2 delete satreward 2>/dev/null || true
pm2 start npm --name satreward --cwd /root/SatReward -- start
pm2 restart bitcoin-info-zm
pm2 save

echo "=== 4. Test ==="
sleep 3
curl -sf -o /dev/null -w "Home (3000): %{http_code}\n" http://127.0.0.1:3000/ || echo "Home (3000): FAIL"
curl -sf -o /dev/null -w "SatReward (30001): %{http_code}\n" http://127.0.0.1:30001/satreward || echo "SatReward (30001): FAIL"
curl -sf -o /dev/null -w "Proxy (3000): %{http_code}\n" http://127.0.0.1:3000/satreward || echo "Proxy (3000): FAIL"
echo "Done. Open https://bitcoin.info.zm/"
