# PRISM / Event Horizon

A real-time Schwarzschild observatory in a single HTML file.

Light is bent with the geodesic equation. The accretion disk, photon ring, Einstein ring and lopsided Doppler beaming are not painted on — they fall out of tracing photons through curved spacetime. A halo of glass prisms orbits the well. Click to drop compact objects; they spiral in and vanish.

Open `index.html` or deploy any static host. No build step.

## What you are looking at

- **Event horizon** — rays that cross `Rs` never return
- **Photon sphere** — the thin gold rim where light can orbit
- **Accretion disk** — Novikov–Thorne temperature, Keplerian Doppler beaming, gravitational redshift, a lensed second image wrapping over the hole
- **Spectral caustics** — prism refraction on the photon ring and shockwaves
- **~40k GPU particles** — disk embers, polar jets, halo dust
- **Instanced glass prisms** — iridescent tetrahedral prisms catching the well
- **Cinematic post** — HDR bloom, anamorphic streaks, chromatic aberration, grain
- **Proper time** — the HUD clock runs at `√(1 − Rs/r)`

## Controls

- Drag to orbit
- Scroll / pinch to approach
- Click to perturb the field and drop mass
- Audio to ignite the instrument

Mobile lowers ray-march steps and particle counts automatically, and quality drops if the frame rate falls.
