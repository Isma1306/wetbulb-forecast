# wetbulb-forecast

A small Go + SolidJS app that shows the **wet-bulb temperature (Tw)** forecast for any place in the world, for the next 48 hours.

**Live demo:** https://wetbulb.icarrea.dev

## The problem

Weather apps show temperature and humidity separately, but neither tells you how dangerous the heat really is. The human body cools down by sweating, and sweat only evaporates if the air is dry enough. The **wet-bulb temperature** combines heat and humidity into one number: the lowest temperature you can reach by evaporating water.

- Around **28 °C Tw**, even healthy people struggle to work or exercise outside.
- At **35 °C Tw**, the body can't shed heat anymore. That is the theoretical limit of human survival, even in the shade with unlimited water.

Heatwaves are getting more frequent, but very few consumer apps show Tw at all. This app answers one question: *"How dangerous will the heat be here in the next two days?"*

More about Tw: https://en.wikipedia.org/wiki/Wet-bulb_temperature

## How it works

```
Browser (SolidJS + Chart.js)
   │  /api/location?q=Madrid          /api/forecast?lat=..&lon=..
   ▼
nginx (serves the static frontend, proxies /api/ to the backend)
   │
   ▼
Go backend (Gin)  ──►  Open-Meteo geocoding API
                  ──►  Open-Meteo forecast API (hourly temp + relative humidity, 2 days)
                  ──►  calculates Tw for every hour and returns it with the forecast
```

1. You type a place. The frontend calls [`/api/location`](backend/controllers/geolocation.go), and the backend searches [Open-Meteo geocoding](backend/api/geolocation.go) for it.
2. You pick a result. The frontend calls [`/api/forecast`](backend/controllers/wetBulb.go) with its coordinates.
3. The backend gets the hourly temperature and relative humidity from [Open-Meteo](backend/api/weather.go), then [adds a Tw value for every hour](backend/utils/wetBulb.go).
4. The frontend [draws temperature, humidity and Tw on one chart](frontend/src/services/utils.service.ts), with a band for the dangerous zone (28–35 °C) and one for the deadly zone (above 35 °C). Past hours are greyed out and a line marks "now".
5. The current Tw is [interpolated between the two closest hourly values](frontend/src/services/utils.service.ts) using the current minute, so the number matches the time you look at it.

Data comes from https://open-meteo.com. Thanks for the free API!

### The formula

Tw is calculated with Roland Stull's empirical equation (2011), with T in °C and RH in %:

```
Tw = T · atan(0.151977 · (RH + 8.313659)^½)
   + atan(T + RH) − atan(RH − 1.676331)
   + 0.00391838 · RH^(3/2) · atan(0.023101 · RH)
   − 4.686035
```

Implementation: [`CalcWetBulb`](backend/utils/wetBulb.go). Paper: https://journals.ametsoc.org/view/journals/apme/50/11/jamc-d-11-0143.1.xml

## Key decisions and tradeoffs

- **Why Stull's formula instead of the full psychrometric calculation.** The exact method needs air pressure and an iterative solver. Stull's equation needs only temperature and humidity, which Open-Meteo already gives, and it's a single expression. The tradeoff: it's an approximation, accurate to about ±1 °C at sea-level pressure and for normal ranges (RH 5–99 %, T −20 to 50 °C). That's fine for a heat-risk warning, but not for lab-grade work.
- **Why the calculation lives in the backend.** The Go backend ([`utils/wetBulb.go`](backend/utils/wetBulb.go)) owns the physics, so the frontend only renders. The formula is in one place and the API returns ready-to-use data that any other client could reuse.
- **Why a backend at all, instead of calling Open-Meteo from the browser.** The backend is a thin proxy that hides the third-party API's shape, enriches the data, allows only `GET` requests from the frontend's origin through CORS ([`main.go`](backend/main.go)) and gzips the responses.
- **Separate frontend and backend containers.** At first the Go server also served the built frontend. I chose to split them into two containers in [`docker-compose.yml`](docker-compose.yml). The frontend is a static Vite build served by nginx ([`nginx.conf`](frontend/nginx.conf)), which also proxies `/api/` to the backend. The backend is only exposed on the internal Docker network, not to the host. Because the browser calls the API on the same origin, the frontend needs no API URL in production ([`api.service.ts`](frontend/src/services/api.service.ts)). nginx also handles gzip and long-term caching for the hashed build assets.
- **Small, unprivileged images.** Both [Dockerfiles](backend/Dockerfile) use multi-stage builds. The backend is a static Go binary (`CGO_ENABLED=0`, stripped) on Alpine, running as a non-root user, with only the CA certificates it needs for HTTPS calls to Open-Meteo.
- **Configuration through environment variables.** [`.env.example`](.env.example) sets the public URL (used as the CORS origin) and the frontend port. The backend refuses to start without `FEURL`, so a misconfigured deployment fails right away instead of failing quietly with CORS errors.
- **Self-hosted instead of a cloud host.** The app runs in Docker on my home server, managed with Portainer, and is exposed through a Cloudflare Tunnel, so there are no open ports on my network. I chose this over a cloud host to keep costs at zero and to learn the ops side end to end. The tradeoff: uptime depends on my home server and connection, and I'm the one patching and monitoring it.
- **Chart.js instead of ECharts.** I started with ECharts and replaced it with Chart.js plus `chartjs-plugin-annotation`. It's lighter, and the annotation plugin made the danger bands and the "now" line easy to draw.
- **SolidJS for the UI.** Fine-grained reactivity and a tiny bundle for a single-screen app, without a virtual DOM.
- **Timezones.** Open-Meteo returns hourly times in GMT with no offset. The backend [adds the `Z` suffix](backend/utils/wetBulb.go) so the browser reads them as UTC and shows them in the user's local time.

## Tech stack

- **Backend:** Go 1.20, Gin, gin-contrib/cors, gin-contrib/gzip
- **Frontend:** SolidJS, TypeScript, Vite, Chart.js, chartjs-plugin-annotation, Day.js
- **Data:** Open-Meteo forecast and geocoding APIs (no API key needed)
- **Ops:** Docker, Docker Compose, nginx, Portainer, Cloudflare Tunnel, on a self-hosted home server

## Running it with Docker

```bash
cp .env.example .env     # set PUBLIC_URL to the URL you'll open the app at
docker compose up -d --build
```

Open http://localhost:3100 (or the `FRONTEND_PORT` you set). For local use, set `PUBLIC_URL=http://localhost:3100`.

## Running it for development

You need Go 1.20+, Node 18+ and pnpm (or npm).

**Backend** (port 8080 by default; set `PORT` to change it):

```bash
cd backend
FEURL=http://localhost:3000 go run .
```

`FEURL` is required: it's the origin allowed by CORS.

**Frontend** (port 3000; in dev mode it calls `http://localhost:8080`):

```bash
cd frontend
pnpm install
pnpm dev
```

Open http://localhost:3000.

**Production build:** `pnpm build` writes the static site to `frontend/build/`.

## API

| Endpoint | Query | Returns |
|---|---|---|
| `GET /api/location` | `q` = place name | Up to 10 matching places from Open-Meteo geocoding |
| `GET /api/forecast` | `lat`, `lon` | 48 hourly values: time, temperature, relative humidity and `WetBulb2M` (Tw) |

## Next steps

- Unit tests for `CalcWetBulb` against Stull's published reference values.
- A GitHub Actions workflow that builds the Docker images on every push.
- Better error handling for upstream failures from Open-Meteo.
- A configurable forecast length, and alerts when Tw crosses the danger thresholds.

## License

GPL-3.0, see [LICENSE](LICENSE).
