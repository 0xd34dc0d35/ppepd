#!/bin/bash

# ============================================
# AUTO DEPLOY PPEPD (Nuxt) + NGINX
# Repo: https://github.com/0xd34dc0d35/ppepd.git
#
# Usage:
#   bash deploy.sh          → install/update, nginx tidak diubah
#   bash deploy.sh --nginx  → install/update + tulis ulang config nginx
#
# Catatan arsitektur:
#   Nitro (Node.js) melayani SSR + static asset dari build yang sama.
#   Nginx hanya sebagai reverse proxy — tidak melayani file dari disk.
#   Ini menjamin hash CSS/JS di HTML selalu sinkron dengan asset yang ada.
# ============================================

set -e

APP_DIR="/var/www/ppepd"
REPO_URL="https://github.com/0xd34dc0d35/ppepd.git"
NGINX_SITE="/etc/nginx/sites-available/default"
NODE_PORT=3000
PM2_NAME="ppepd"
BRANCH="main"

# Nama-nama PM2 lama yang mungkin masih berjalan
OLD_PM2_NAMES=("pped" "ppepd")

# ────────────────────────────────────────────
# Parse argumen
# ────────────────────────────────────────────
FORCE_NGINX=false
for arg in "$@"; do
    case $arg in
        --nginx) FORCE_NGINX=true ;;
    esac
done

# ────────────────────────────────────────────
# Detect: first install atau update
# ────────────────────────────────────────────
if [ -d "$APP_DIR/.git" ]; then
    MODE="update"
else
    MODE="install"
fi

echo "===================================="
echo " MODE  : $MODE"
echo " DIR   : $APP_DIR"
echo " PORT  : $NODE_PORT"
echo " NGINX : $FORCE_NGINX"
echo "===================================="

# ────────────────────────────────────────────
# INSTALL: dependensi sistem (pertama kali saja)
# ────────────────────────────────────────────
if [ "$MODE" = "install" ]; then

    echo "===================================="
    echo "UPDATE SYSTEM & INSTALL DEPENDENCIES"
    echo "===================================="
    sudo apt update
    sudo apt install -y git curl nginx lsof

    curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
    sudo apt install -y nodejs

    sudo npm install -g pm2

    echo "===================================="
    echo "CLONE PROJECT"
    echo "===================================="
    sudo git clone $REPO_URL $APP_DIR
    sudo chown -R $USER:$USER $APP_DIR

fi

# ────────────────────────────────────────────
# UPDATE: ambil kode terbaru
# ────────────────────────────────────────────
if [ "$MODE" = "update" ]; then

    echo "===================================="
    echo "PULL LATEST CODE"
    echo "===================================="
    cd $APP_DIR
    git fetch origin
    git reset --hard origin/$BRANCH

fi

echo "===================================="
echo "NODE / NPM VERSION"
echo "===================================="
node -v
npm -v

cd $APP_DIR

# ────────────────────────────────────────────
# BERSIHKAN PROSES LAMA
# Hapus sebelum build agar port bebas saat start nanti
# ────────────────────────────────────────────
echo "===================================="
echo "CLEAN UP OLD PROCESSES"
echo "===================================="

for OLD_NAME in "${OLD_PM2_NAMES[@]}"; do
    if pm2 describe $OLD_NAME > /dev/null 2>&1; then
        pm2 delete $OLD_NAME
        echo "  ✓ PM2 '$OLD_NAME' dihapus"
    fi
    # Cek juga di PM2 milik root
    if sudo pm2 describe $OLD_NAME > /dev/null 2>&1; then
        sudo pm2 delete $OLD_NAME
        echo "  ✓ PM2 root '$OLD_NAME' dihapus"
    fi
done

# Stop systemd PM2 service dulu agar tidak auto-restart saat daemon di-kill
sudo systemctl stop pm2-$USER 2>/dev/null || true
sudo systemctl stop pm2-root 2>/dev/null || true
echo "  ✓ PM2 systemd service dihentikan"

# Matikan PM2 daemon
pm2 kill 2>/dev/null || true
echo "  ✓ PM2 daemon dihentikan"

# Kill semua proses (termasuk orphan) yang pakai port ini
sudo fuser -k ${NODE_PORT}/tcp 2>/dev/null || true
sudo pkill -f "$APP_DIR/.output" 2>/dev/null || true

# Tunggu port benar-benar bebas (max 10 detik)
for i in $(seq 1 10); do
    sleep 1
    STILL_OPEN=$(sudo lsof -ti tcp:$NODE_PORT 2>/dev/null || true)
    if [ -z "$STILL_OPEN" ]; then
        break
    fi
    echo "  ... menunggu port bebas ($i/10)"
done

echo "===================================="
echo "INSTALL NODE MODULES"
echo "===================================="
npm ci

echo "===================================="
echo "CLEAN OLD BUILD ARTIFACTS"
echo "===================================="
rm -rf .output .nuxt

echo "===================================="
echo "BUILD NUXT PROJECT"
echo "===================================="
npm run build

echo "  ✓ Port $NODE_PORT bebas"

# ────────────────────────────────────────────
# START PM2
# ────────────────────────────────────────────
echo "===================================="
echo "START PM2 ($PM2_NAME)"
echo "===================================="

pm2 start $APP_DIR/.output/server/index.mjs --name $PM2_NAME
pm2 save

# Flush koneksi upstream nginx yang mungkin stale ke proses lama
if sudo systemctl is-active --quiet nginx; then
    sudo systemctl reload nginx
    echo "  ✓ Nginx di-reload"
fi

if [ "$MODE" = "install" ]; then
    PM2_STARTUP=$(pm2 startup 2>&1 | grep "sudo env" | head -1)
    if [ -n "$PM2_STARTUP" ]; then
        eval "$PM2_STARTUP"
        echo "  ✓ PM2 startup on boot dikonfigurasi"
    fi
fi

# ────────────────────────────────────────────
# CONFIGURE NGINX
# Semua request di-proxy ke Nitro (Node.js).
# Nitro melayani SSR + static asset dari build
# yang sama → hash selalu sinkron, tidak ada mismatch.
# ────────────────────────────────────────────
NGINX_HAS_SSL=false
NGINX_EXISTS=false

if [ -f "$NGINX_SITE" ]; then
    NGINX_EXISTS=true
    if grep -qiE "listen.*443|ssl_certificate" "$NGINX_SITE" 2>/dev/null; then
        NGINX_HAS_SSL=true
    fi
fi

SHOULD_CONFIGURE_NGINX=false
[ "$FORCE_NGINX" = true ] && SHOULD_CONFIGURE_NGINX=true
[ "$MODE" = "install" ] && [ "$NGINX_EXISTS" = false ] && SHOULD_CONFIGURE_NGINX=true

echo "===================================="
echo "NGINX STATUS"
echo " exists : $NGINX_EXISTS"
echo " ssl    : $NGINX_HAS_SSL"
echo " update : $SHOULD_CONFIGURE_NGINX"
echo "===================================="

if [ "$NGINX_HAS_SSL" = true ] && [ "$FORCE_NGINX" = true ]; then
    echo "⚠  Config nginx memiliki SSL/HTTPS."
    echo "   Overwrite akan menghapus konfigurasi SSL."
    echo "   Lanjutkan? (yes/no)"
    read -r CONFIRM
    if [ "$CONFIRM" != "yes" ]; then
        SHOULD_CONFIGURE_NGINX=false
        echo "  Nginx tidak diubah."
    fi
fi

if [ "$SHOULD_CONFIGURE_NGINX" = true ]; then

    echo "===================================="
    echo "CONFIGURE NGINX"
    echo "===================================="

    if [ "$NGINX_EXISTS" = true ]; then
        BACKUP_FILE="${NGINX_SITE}.bak.$(date +%Y%m%d%H%M%S)"
        sudo cp $NGINX_SITE $BACKUP_FILE
        echo "  ✓ Backup: $BACKUP_FILE"
    fi

    sudo tee $NGINX_SITE > /dev/null <<EOF
map \$http_upgrade \$connection_upgrade {
    default upgrade;
    ''      close;
}

server {
    listen 80;
    server_name _;

    location / {
        proxy_pass http://127.0.0.1:$NODE_PORT;
        proxy_http_version 1.1;

        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection \$connection_upgrade;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;

        proxy_read_timeout    60s;
        proxy_connect_timeout 10s;
        proxy_send_timeout    60s;
    }
}
EOF

    echo "===================================="
    echo "TEST & RELOAD NGINX"
    echo "===================================="
    if sudo nginx -t; then
        sudo systemctl reload nginx
        sudo systemctl enable nginx
        echo "  ✓ Nginx dikonfigurasi ulang"
    else
        echo "  ✗ Config tidak valid — rollback"
        if [ -n "$BACKUP_FILE" ] && [ -f "$BACKUP_FILE" ]; then
            sudo cp $BACKUP_FILE $NGINX_SITE
            sudo systemctl reload nginx
            echo "  ✓ Rollback berhasil"
        fi
        exit 1
    fi

else
    echo "  Nginx tidak diubah."
    [ "$NGINX_EXISTS" = true ] && echo "  Gunakan: bash deploy.sh --nginx  untuk update config."
fi

# ────────────────────────────────────────────
# HEALTH CHECK
# ────────────────────────────────────────────
echo "===================================="
echo "HEALTH CHECK"
echo "===================================="
sleep 3

HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://127.0.0.1:$NODE_PORT)

if [ "$HTTP_STATUS" = "200" ] || [ "$HTTP_STATUS" = "301" ] || [ "$HTTP_STATUS" = "302" ]; then
    echo "  ✓ App responding (HTTP $HTTP_STATUS) on port $NODE_PORT"
else
    echo "  ✗ App tidak merespon (HTTP $HTTP_STATUS)"
    echo "    Cek: pm2 logs $PM2_NAME"
    exit 1
fi

echo "===================================="
echo "DONE"
echo "===================================="
echo ""
echo "  PM2 status : pm2 status"
echo "  App logs   : pm2 logs $PM2_NAME"
echo "  Nginx logs : sudo tail -f /var/log/nginx/error.log"
echo ""
