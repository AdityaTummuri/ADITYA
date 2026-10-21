# Portfolio Information — Aditya Tummuri

> This file is the single source of truth for building or rebuilding the portfolio website. Feed it to any AI assistant to get accurate, consistent output.

---

## 👤 Personal Profile

| Field | Value |
|-------|-------|
| **Name** | Aditya Tummuri |
| **Email** | adityafrom2007@gmail.com |
| **GitHub** | https://github.com/AdityaTummuri |
| **University** | Amrita Vishwa Vidyapeetham, Amritapuri |
| **Location** | Kerala, India |
| **Mode** | Student · Builder |
| **Studying** | Electronics & Communication Engineering (ECE) |

### Tagline / Headline
- **Site title:** "Aditya Tummuri — The Dreaming Machine"
- **Role line:** ECE · Embedded Systems · Signal Processing · Edge ML
- **Hero headline (3 lines):**
  1. "I build machines"
  2. "that dream in"
  3. "signals & motion."
- **Hero subheadline:** "An ECE student working where software runs into the physical world — sensors and signals, models small enough for the edge, robots that perceive terrain, and the Linux tools that hold it all together."

---

## 🧭 Focus Areas (What I Work On)

| Area | Detail |
|------|--------|
| **Embedded sensing** | Reading motors and environments through sensors, and deciding what's worth measuring. |
| **Signal processing** | Filtering, framing and feature extraction for audio and radar signals. |
| **Computer vision & ML** | Segmentation and sequence models, with an eye on what can run at the edge. |
| **Developer experience** | Linux automation, terminal environments and small tools that remove friction. |
| **Interface craft** | Web interfaces and 3D experiments — including this site — that make ideas legible. |

---

## 🛠️ Toolkit / Skills

**Core tools used across projects:**
`Python` · `PyTorch` · `Linux` · `Shell` · `Android` · `TypeScript` · `React` · `Three.js`

**Full language distribution (by codebase volume):**

| Language | Share |
|----------|-------|
| Kotlin | 39.7% |
| Python | 17.5% |
| TypeScript | 10.3% |
| JavaScript | 6.8% |
| Rust | 5.4% |
| Shell | 1.1% |
| C++ | 1.1% |
| HTML/CSS | ~2.8% |

---

## 🚀 Projects (Original Work)

### 1. RotorMind / MotorSafe
- **Category:** Embedded & Robotics
- **Status:** Prototype
- **Summary:** A predictive motor-health prototype that reads sensor signals to flag abnormal behaviour.
- **Tags:** Sensors, Signal analysis, Embedded
- **Outcome:** 3× faster anomaly detection vs. threshold-only baseline
- **Architecture tradeoff:** Chose time-domain statistical features over a full FFT pipeline to stay within the MCU's RAM budget and avoid floating-point library dependencies.
- **Engineering footnote:** The hardest part was sensor calibration drift across temperature ranges. Ended up implementing a running baseline correction that re-zeroes every 500 samples.
- **Featured question:** "Can a motor tell you it's unwell before it fails?"

---

### 2. NETRA-UGV
- **Category:** Embedded & Robotics
- **Status:** Collaborative
- **Summary:** Team work on terrain segmentation for an unmanned ground vehicle.
- **Tags:** Segmentation, Computer vision, UGV
- **Outcome:** 92% mIoU on custom off-road test set
- **Architecture tradeoff:** Used a lightweight encoder-decoder over a heavier transformer backbone because inference had to run at 15 fps on an embedded GPU with a 10W power envelope.
- **Engineering footnote:** Label noise in the training set was the real bottleneck — spent more time writing annotation QA scripts than training the model itself.
- **GitHub:** https://github.com/AdityaTummuri/Netra-UGV (fork/collab)
- **Featured question:** "Where is it safe for a ground vehicle to drive?"

---

### 3. FracSST-Mamba
- **Category:** AI/ML
- **Status:** Research prototype
- **Summary:** Exploring state-space sequence models for human activity recognition from radar returns.
- **Tags:** Radar, Mamba / SSM, PyTorch
- **Repo:** https://github.com/AdityaTummuri/FracSST-Mamba
- **Outcome:** 4.2% accuracy gain over LSTM baseline on micro-Doppler dataset
- **Architecture tradeoff:** Mamba's linear-time sequence scanning fits long radar sweeps where transformers hit quadratic memory walls. Trade-off: less interpretable attention maps.
- **Engineering footnote:** Fractional Fourier features improved separability of overlapping gestures but required careful numerical stability — clamped magnitudes to avoid NaN gradients during training.
- **Featured question:** "What does a person's movement look like to a radar?"

---

### 4. Vocal Biomarker Edge
- **Category:** AI/ML
- **Status:** Prototype
- **Summary:** Client-side acoustic feature extraction from voice recordings, kept entirely on the device.
- **Tags:** DSP, Audio features, Browser
- **Repo:** https://github.com/AdityaTummuri/vocal-biomarker-edge
- **Outcome:** <120ms feature extraction on mid-range Android Chrome
- **Architecture tradeoff:** Runs entirely in the browser via Web Audio API + WASM instead of a server roundtrip — eliminates privacy concerns but limits model size to what fits in a ServiceWorker cache.
- **Engineering footnote:** Safari's AudioWorklet implementation had subtle timing bugs that caused frame drops. Fell back to ScriptProcessorNode on WebKit with a 512-sample buffer compromise.

---

### 5. Kavach-UPI
- **Category:** Systems
- **Status:** Prototype
- **Summary:** An on-device Android security prototype for UPI payment flows.
- **Tags:** Android, On-device, Security
- **Repo:** https://github.com/AdityaTummuri/Kavach-UPI
- **Outcome:** Zero-network-call verification in <80ms
- **Architecture tradeoff:** On-device verification via Android Keystore attestation rather than server-side OTP — trades server control for latency and offline capability.
- **Engineering footnote:** Had to handle the case where Keystore hardware backing isn't available on budget devices — falls back to software keys with a clear user warning.

---

### 6. MY_TERMINAL
- **Category:** Systems
- **Status:** Tooling
- **Summary:** A portable terminal environment — shell, prompt and tooling I carry between machines.
- **Tags:** Shell, Dotfiles, Portable
- **Repo:** https://github.com/AdityaTummuri/MY_TERMINAL
- **Outcome:** <2s full bootstrap on a fresh Debian install
- **Architecture tradeoff:** Single idempotent setup script over a full config manager like Ansible — simpler to debug when something breaks on an unfamiliar distro.
- **Engineering footnote:** The trickiest part is font and locale detection across WSL, native Linux, and macOS — ended up probing $TERM_PROGRAM and os-release to pick code paths.

---

### 7. HP OMEN CPU Fan Control
- **Category:** Systems
- **Status:** Tooling
- **Summary:** CPU fan control for HP OMEN laptops on Linux, where vendor tooling doesn't exist.
- **Tags:** Linux, Hardware I/O, Thermals
- **Repo:** https://github.com/AdityaTummuri/Hp-OMEN-cpu-fan-control
- **Outcome:** 15°C peak temperature drop under sustained load
- **Architecture tradeoff:** Direct EC register writes via /dev/port over a kernel module approach — faster to iterate but requires root and careful validation per BIOS revision.
- **Engineering footnote:** Fail-safe is critical: if the script crashes, the EC reverts to BIOS-default fan curves within 3 seconds. Tested by kill -9 during thermal stress.

---

### 8. GhostOS-X
- **Category:** Systems
- **Status:** Tooling
- **Summary:** Scripts and configuration for automating my everyday Linux workflow.
- **Tags:** Linux, Shell, Automation
- **Repo:** https://github.com/AdityaTummuri/ghostos-x
- **Outcome:** 12 manual steps → 1 command for workspace setup
- **Architecture tradeoff:** Bash scripts over a declarative tool like Nix — lower learning curve, easier to share with teammates who just need it to work.
- **Engineering footnote:** Idempotency is enforced by checking state before mutating — every function exits cleanly if the target state already exists.

---

### 9. TrapSight
- **Category:** Experiments
- **Status:** Concept
- **Summary:** A browser concept for auditing checkout pages for dark patterns.
- **Tags:** Browser, UX audit
- **Repo:** https://github.com/AdityaTummuri/TrapSight
- **Outcome:** Flags 6 common dark-pattern categories in DOM
- **Architecture tradeoff:** Content-script DOM heuristics over ML classification — more transparent, no model to ship, and easier for users to verify flagged elements.
- **Engineering footnote:** Biggest false-positive source: legitimate urgency indicators ('only 2 left') vs. manufactured scarcity. Currently uses a conservative allowlist.

---

### 10. 3d-website / Lumina
- **Category:** Experiments
- **Status:** Experiment
- **Summary:** Interactive 3D gallery and showroom experiments on the web.
- **Tags:** WebGL, 3D, Web
- **Repo:** https://github.com/AdityaTummuri/3d-website
- **Outcome:** 60fps on M1 MacBook Air at 1440p
- **Architecture tradeoff:** Three.js over raw WebGL for iteration speed — the abstraction cost is acceptable for a gallery where draw calls stay under 200.
- **Engineering footnote:** LOD switching and texture compression (KTX2/Basis) were essential to keep the initial load under 3MB on mobile connections.

---

### 11. The-PaleSignal
- **Category:** Experiments
- **Status:** Concept
- **Summary:** An interactive sci-fi terminal concept built around narrative and text interfaces.
- **Tags:** Interactive fiction, Terminal UI
- **Outcome:** 3 branching narrative paths, ~8 min playthrough
- **Architecture tradeoff:** Finite state machine over a parser-based adventure engine — simpler to author and debug, at the cost of less dynamic world interaction.
- **Engineering footnote:** Text rendering timing is hand-tuned per line to create a teletype feel without frustrating the reader — settled on 28ms/char with a skip-ahead on any keypress.

---

### 12. LeaseLens
- **Category:** AI/ML / LegalTech
- **Status:** Hackathon project (PromptWars Virtual 2026)
- **Summary:** Multi-agent legal AI system that analyzes residential rent agreements against empirical regional market baselines to surface clauses deviating statistically from the norm.
- **Repo:** https://github.com/AdityaTummuri/LeaseLens
- **Tech:** Python, HTML, JavaScript, CSS, Shell

---

### 13. Moneyball 2.0
- **Category:** Sports Analytics
- **Status:** Open source
- **Summary:** Interactive open-source web app for sports GMs to replicate departed star players using algorithmic similarity scoring, cost-efficiency metrics, and blind scouting.
- **Repo:** https://github.com/AdityaTummuri/MoneyBall-2.0
- **Tech:** Python, Streamlit

---

### 14. ArmMimic (Exo-Mimic)
- **Category:** Robotics & Embedded
- **Status:** Prototype
- **Summary:** Real-time teleoperation system mapping human arm gesture kinematics to a multi-DOF robotic manipulator via ESP32 and Raspberry Pi controllers.
- **Repo:** https://github.com/AdityaTummuri/ArmMimic
- **Tech:** Python, C++

---

### 15. ScopeCreep.ai
- **Category:** Developer Productivity / AI Agents
- **Status:** Hackathon project (Mind the Product Hackathon)
- **Summary:** AI-powered sprint watchdog that catches silent scope creep, PR feature drift, and architectural misalignment before releases derail.
- **Repo:** https://github.com/AdityaTummuri/ScopeCreep.ai
- **Tech:** JavaScript, Python

---

### 16. FIFA NexusMatrix
- **Category:** Computer Vision & AR
- **Status:** Hackathon / Concept
- **Summary:** Combines macroscopic fluid dynamics crowd predictions with real-time WebAR navigation overlays for FIFA World Cup 2026 stadium egress.
- **Repo:** https://github.com/AdityaTummuri/FIFA_NexusMatrix
- **Tech:** Python, TypeScript

---

### 17. ASCII_CAM
- **Category:** Mobile / Creative App
- **Status:** Released
- **Summary:** High-performance ASCII camera app in Flutter translating live camera feeds into stylized ASCII art. Cross-platform: Android, Linux, Windows.
- **Repo:** https://github.com/AdityaTummuri/ASCII_CAM
- **Tech:** Dart, Flutter, Kotlin, C++

---

### 18. SUDO_SHOOT
- **Category:** Game Engine / Low-Level Graphics
- **Status:** Project
- **Summary:** Ultra-stylized 3D tactical terminal shooter running inside the terminal, built in Go using Ebitengine.
- **Repo:** https://github.com/AdityaTummuri/SUDO_SHOOT
- **Tech:** Go

---

### 19. RosterResilience
- **Category:** Sports Science / Simulation
- **Status:** Open source
- **Summary:** Micro-climate physics engine simulating physiological fatigue and performance degradation of athletes across varied ambient conditions.
- **Repo:** https://github.com/AdityaTummuri/RosterResilience
- **Tech:** Python, Streamlit

---

### 20. Multiboot Toolkit (cool_ventoy)
- **Category:** DevOps / System Administration
- **Status:** Tooling
- **Summary:** Professional Ventoy-based multiboot USB theme and configuration project for IT technicians and system admins.
- **Repo:** https://github.com/AdityaTummuri/cool_ventoy

---

## 📝 Personal Notes / Philosophy

### Note 01 — Features before models
"On the audio and radar work, most of the leverage came from how the signal was framed and filtered. A smaller model on well-prepared features is easier to run on a device and easier to reason about."

### Note 02 — Touching hardware carefully
"Writing fan control for a laptop the vendor doesn't support on Linux meant reading carefully before writing anything. The rule I keep: fail safe, log everything, and make the default the hardware's own behaviour."

### Note 03 — Labelling work honestly
"A lot of what I build is a prototype, a concept or a team effort. Saying which is which keeps me honest about what I actually learned — and what still needs proving."

---

## 🏆 Hackathons & Research Highlights

| Event | Project | Domain |
|-------|---------|--------|
| PromptWars Virtual 2026 | LeaseLens | Legal AI / Multi-agent |
| WebChamp Hackathon | Lumina (3d-website) | 3D Web / Creative |
| Next Byte Hacks V2 | TrapSight | Browser Security |
| Mind the Product Hackathon | ScopeCreep.ai | AI Agents / DevTools |
| FIFA World Cup 2026 Innovation | FIFA_NexusMatrix | CV & WebAR |
| Research | FracSST-Mamba | Edge AI / Radar |
| Research | vocal-biomarker-edge | Healthcare AI |

---

## 🤝 GitHub Stats

- **Total repos:** 41 (20 original + 21 collaborative forks)
- **Profile:** https://github.com/AdityaTummuri

### Notable Collaborative Forks
| Repo | Focus |
|------|-------|
| Netra-UGV | UGV terrain segmentation (team project) |
| surveillance_bot | Autonomous warehouse robot, 29-class perception, ROS |
| silverlink | App connecting senior citizens with family caregivers |
| guardian_link | AI-powered Child Protection & Digital Forensics |
| sentinel-mind | Multi-agent Disaster Response (Gemini 2.5 + Vertex AI) |
| loop | YouTube Music client for Android with Spotify integrations |

---

## 🌐 Existing Portfolio Website (`my-showcase`)

**Tech stack:** TanStack Start (React SSR) · TypeScript · Tailwind CSS · shadcn/ui · Vite

**Sections / Navigation:**
1. **Hero** — "The Dreaming Machine" with animated DreamPlanet visual + telemetry presets (Survey / Deep Scan / Drift)
2. **Transmissions (§01)** — 4 featured projects with full-bleed visuals (RotorMind, NETRA-UGV, FracSST-Mamba, MY_TERMINAL)
3. **Index (§02)** — Full project grid (WorkList component with all projects)
4. **CraftLab** — Interactive micro-experiments (transition timing, SVG wave harmonics, telemetry inspector)
5. **Notes (§03)** — 3 philosophy notes
6. **Now (§04)** — Current focus areas + toolkit
7. **About (§05)** — Personal bio
8. **Contact (§06)** — Email + GitHub links

**Visual design language:**
- Dark background (`#191430` — deep navy/indigo)
- Accent colors: Lime (green), Cyan, Peach
- Typography: Display font (large, tight tracking) + Serif (italic accents) + Mono (labels)
- Aesthetic: sci-fi signal / dreaming machine / lo-fi telemetry HUD

**Command palette:** Cmd/Ctrl-K opens a searchable command palette for navigation, repos, contact, and hero preset switching.

---

## 📌 Key Identity Phrases to Reuse

- "The Dreaming Machine"
- "I build machines that dream in signals & motion."
- "Field notes from Aditya Tummuri"
- "Receive transmissions" (CTA button)
- "Send a signal back." (Contact CTA)
- "Selected transmissions" (projects section label)
- "Labelled for what it is" (index section subtitle)
- "A systems mind, with a sense of wonder." (About title)
- "Features before models" / "Touching hardware carefully" / "Labelling work honestly" (notes)

---

## 📂 Project Status Vocabulary

| Status | Meaning |
|--------|---------|
| Research prototype | Academic / exploratory research build |
| Prototype | Functional but not production-ready |
| Concept | Idea-stage or MVP |
| Tooling | Personal daily-driver utility |
| Collaborative | Built as part of a team |
| Experiment | Creative/exploratory side project |

