# rides.cash - Demo Backend

**Backend API and WebSocket server**

## Install
1. ```python3 -m venv venv``` ( optional )
2. ```source ./venv/bin/activate``` ( optional )
3. ```pip install -r requirements.txt```

## Run - Development
1. ```uvicorn server:app --reload --port 8080```)

## Run - Production
1. ```uvicorn server:app --host 0.0.0.0 --port 443 --ssl-keyfile=[YOUR-SSL-KEY] --ssl-certfile=[YOUR-CERT]```