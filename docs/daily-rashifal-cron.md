# Daily Rashifal Cron — AWS Deployment Guide

Generates LLM-powered Marathi rashifal for all 12 rashis every morning at 5:00 AM IST via Gemini 2.5 Pro. Results cached in SQLite and served by `/api/rashifal`.

---

## 1. Prerequisites on AWS (EC2 / Lightsail / ECS)

```bash
# Minimum specs: t3.micro (1 GB RAM) is enough for cron — app itself decides
#
# Required packages:
sudo apt update
sudo apt install -y nodejs npm sqlite3
sudo npm install -g pnpm tsx
```

Node 20+ required. Verify: `node -v`.

---

## 2. Deploy the project

```bash
# As ubuntu user:
cd ~
git clone https://github.com/YOUR_REPO/venkaa-kundali.git
cd venkaa-kundali
pnpm install --ignore-scripts   # skip swisseph native rebuild issues
# Rebuild native module separately if needed:
cd node_modules/.pnpm/swisseph@*/node_modules/swisseph && npm rebuild && cd ~/venkaa-kundali
```

---

## 3. Set environment

Create `.env.local` at project root:

```bash
cat > ~/venkaa-kundali/.env.local <<'EOF'
GEMINI_API_KEY=your_key_from_aistudio_google_com
GEMINI_MODEL=gemini-2.5-pro
# ... plus any other env vars from local .env.local
EOF

chmod 600 ~/venkaa-kundali/.env.local
```

---

## 4. Test manual run

```bash
cd ~/venkaa-kundali
tsx scripts/generate-daily-rashifal.ts
```

Expected output: 12 rashis × 1 attempt = 12 LLM calls, ~₹20 cost.

Verify DB:
```bash
sqlite3 data/app.db "SELECT date, COUNT(*) FROM daily_rashifal GROUP BY date;"
```

---

## 5. Setup cron (server time should be UTC — 5 AM IST = 23:30 UTC previous day)

```bash
crontab -e
```

Add lines:

```cron
# Daily Marathi rashifal — generate today + next 2 days at 5:00 AM IST
30 23 * * * cd /home/ubuntu/venkaa-kundali && /usr/local/bin/tsx scripts/generate-daily-rashifal.ts >> /var/log/rashifal.log 2>&1

# Weekly panchang sanity check vs Drikpanchang — alerts on mismatch (optional)
# 0 3 * * 0 cd /home/ubuntu/venkaa-kundali && /usr/local/bin/tsx scripts/verify-panchang.ts >> /var/log/panchang-verify.log 2>&1
```

Find tsx path: `which tsx` — substitute if not `/usr/local/bin/tsx`.

**Timezone note:** most AWS defaults to UTC.
- IST = UTC + 5:30
- 5 AM IST = 23:30 UTC previous day → cron spec `30 23 * * *`

If your server runs IST: `0 5 * * *` instead.

Check server timezone: `date` or `timedatectl`.

---

## 6. Log setup

```bash
sudo touch /var/log/rashifal.log
sudo chown ubuntu:ubuntu /var/log/rashifal.log

# Rotate daily — create /etc/logrotate.d/rashifal
sudo tee /etc/logrotate.d/rashifal <<'EOF'
/var/log/rashifal.log {
    daily
    rotate 30
    compress
    missingok
    notifempty
}
EOF
```

Inspect last run:
```bash
tail -50 /var/log/rashifal.log
```

---

## 7. Alert on failure (optional)

Simple bash wrapper that emails on non-zero exit:

```bash
# ~/venkaa-kundali/scripts/rashifal-cron-wrapper.sh
#!/bin/bash
cd /home/ubuntu/venkaa-kundali
/usr/local/bin/tsx scripts/generate-daily-rashifal.ts >> /var/log/rashifal.log 2>&1
if [ $? -ne 0 ]; then
    echo "Rashifal cron FAILED on $(hostname) at $(date)" | mail -s "Rashifal cron alert" you@example.com
fi
```

Then crontab:
```cron
30 23 * * * /home/ubuntu/venkaa-kundali/scripts/rashifal-cron-wrapper.sh
```

Telegram/Slack webhook alternative — replace `mail` with `curl` POST.

---

## 8. Monitoring

Quick dashboard query:

```bash
sqlite3 /home/ubuntu/venkaa-kundali/data/app.db <<'SQL'
SELECT date,
       SUM(CASE WHEN source = 'llm-validated' THEN 1 ELSE 0 END) AS llm,
       SUM(CASE WHEN source = 'template-fallback' THEN 1 ELSE 0 END) AS fallback,
       COUNT(*) AS total
FROM daily_rashifal
WHERE date >= date('now', '-7 days')
GROUP BY date
ORDER BY date DESC;
SQL
```

**Healthy output:** `llm=12, fallback=0` for each day.
**If fallback > 2:** review logs for validator rejections or API quota issues.

---

## 9. App hosting (separate concern)

Next.js app can run via:
- **PM2 / systemd** (self-managed)
- **Docker** (AWS ECS / App Runner)
- **Vercel** (NOT used — per memory)

Minimum to serve the API + pages:
```bash
cd ~/venkaa-kundali
pnpm build
pm2 start pnpm --name "bhaagyavedh" -- start
pm2 save
pm2 startup   # auto-start on reboot
```

---

## 10. Quick sanity check after deploy

```bash
# 1. Run script
tsx scripts/generate-daily-rashifal.ts

# 2. Query via API
curl -s http://localhost:6630/api/rashifal?rashi=10 | python3 -c "import sys,json; d=json.loads(sys.stdin.read()); print(d['source'], d['prediction']['overall']['mr'][:100])"
# Expect: source=llm-validated  + fresh Marathi prose

# 3. Visit in browser
# /mr/rashifal          — all 12
# /mr/rashifal/kumbh    — single
```

---

## 11. Troubleshooting

| Symptom | Fix |
|---|---|
| `ENOENT: no such file or directory, open 'data/app.db'` | Ensure `cd ~/venkaa-kundali` in crontab; DB path is relative |
| `GEMINI_API_KEY not set` | `.env.local` not loaded — script uses dotenv with explicit path |
| All rashis → `template-fallback` | Check Gemini billing on Google Cloud + API key valid |
| Quota 429 errors | Enable billing at https://console.cloud.google.com/billing |
| Swisseph native module error | `cd node_modules/.pnpm/swisseph@*/node_modules/swisseph && npm rebuild` |
| `Cannot find module tsx` | `sudo npm i -g tsx` + absolute path in crontab |

---

## 12. Estimated costs

| Item | Monthly |
|---|---|
| EC2 t3.micro | ~₹700 (covered by free tier year 1) |
| Gemini 2.5 Pro | ~₹700 (12 rashis/day × 30 days) |
| SQLite/Storage | ₹0 |
| **Total** | **~₹1400/month** |
