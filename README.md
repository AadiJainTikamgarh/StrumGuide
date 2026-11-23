# StrumGuide 🎸
### Modern Analog Guitar Rhythm & Strumming Trainer

**StrumGuide** is a web-based guitar strumming and rhythm trainer designed like a tactile, physical musical instrument — combining Teenage Engineering-inspired modern industrial aesthetics with vintage guitar gear craftsmanship and a native Web Audio API acoustic guitar engine.

---

## ✨ Features

- **Modern Analog Industrial Interface**: Tactile rotary tempo knob, vintage gauge metronome with continuous oscillating pendulum motion, physical rhythm keycaps, and breadcrumb chord progressions.
- **Authentic Acoustic Guitar Engine**:
  - Built with native **Web Audio API** and recorded steel-string acoustic guitar samples from **Meta Open Sound — Steel Guitar** (CC0 1.0 Universal).
  - Physical 6-string choke groups and voice stealing (a new pluck on a string cuts previously ringing notes with anti-pop micro-ramps).
  - Directional downstrokes (~11ms spread from low E to high E) and upstrokes (~9ms spread from high E to bass strings).
  - Dreadnought wooden body filter bank (108 Hz air chamber, 220 Hz spruce soundboard warmth, 2800 Hz pick bite, and 8 kHz smooth top roll-off).
- **5 Strumming Actions**:
  - `DOWN`: Full downstroke strike with low-end resonance.
  - `UP`: Crisp treble-forward upstroke brush.
  - `GHOST`: Soft unvoiced pick brush.
  - `MUTE`: Percussive acoustic chuck / fretboard slap + instant string dampening.
  - `REST`: Rhythmic rest / ring-through.
- **Single Chord & Progression Modes**:
  - **Single Chord**: Loop continuously on any chord (`G`, `C`, `D`, `Em`, `Am`, `E`, `A`, `F`, `Dm`) for focused rhythm drill.
  - **Progression**: Chain custom multi-bar sequences with interactive bar editing.
- **Full Pattern Sequencer**:
  - Interactive 8-beat and 16-beat keycap sequencer.
  - Live animated playhead tracking audio schedule timestamps.
  - Time signatures (4/4, 3/4) and subdivision toggles.
  - Undo / Redo history stack.
- **Analog Audio Mixer & Metronome**:
  - Dedicated sliders and switches for Guitar and Metronome channels.
  - Precision woodblock downbeat and regular beat click generator.
  - Customizable 3 or 4 beat Count-in.
- **Interactive Chord Explorer**:
  - Fretboard diagrams with interactive open, fretted, and muted string markings.
  - Real-time acoustic chord audition on click.
- **Themes**: Complete light and dark themes adhering to the Modern Analog palette.

---

## 🎨 Color System (Modern Analog)

| Token | Light Theme | Dark Theme | Usage |
|---|---|---|---|
| **Background** | `#F4F0E7` | `#20211E` | Main application canvas |
| **Surface** | `#FBF9F4` | `#292B26` | Hardware panels and console cards |
| **Elevated** | `#ECE7DC` | `#32352F` | Raised buttons and keycaps |
| **Ink / Primary Text** | `#25251F` | `#F4F0E7` | Headings and primary readouts |
| **Secondary Text** | `#8C887D` | `#AAA69A` | Supporting metadata and units |
| **Primary Accent** | `#E45B38` | `#E97852` | Transport, highlights, active selections |
| **Downstroke** | `#65A889` | `#65A889` | Down direction keycaps and indicators |
| **Upstroke** | `#75A9C9` | `#75A9C9` | Up direction keycaps and indicators |
| **Mute / Slap** | `#D69B4C` | `#D69B4C` | Percussive mutes |
| **Border** | `#DCD6C9` | `#41433C` | Precision dividers and guides |

---

## 🛠️ Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router, React 19)
- **Language**: TypeScript
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Animation**: [Motion](https://motion.dev/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Audio**: Native Web Audio API (`AudioContext`, `AudioBufferSourceNode`, `GainNode`, `BiquadFilterNode`)
- **Samples**: [Meta Open Sound — Steel Guitar](https://github.com/facebookincubator/Meta-open-sound) (CC0 1.0 Universal)

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm, pnpm, or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/AadiJainTikamgarh/StrumGuide.git
   cd StrumGuide
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📁 Project Architecture

```text
src/
├── app/
│   ├── layout.tsx                # App shell and metadata
│   ├── page.tsx                  # Main application orchestrator & telemetry
│   └── globals.css               # Design tokens, fonts, and theme CSS
├── audio/
│   ├── AudioEngine.ts            # High-level engine coordinator
│   ├── AudioContextManager.ts    # User-gesture unlocked AudioContext singleton
│   ├── SampleLoader.ts           # Asynchronous AudioBuffer fetch, decode & caching
│   ├── GuitarSampler.ts          # Polyphony, choke groups, directional strum plucking
│   ├── StrumScheduler.ts         # Precision lookahead scheduler (~25ms interval, 120ms window)
│   ├── Metronome.ts              # Synthesized dual-frequency woodblock metronome
│   ├── AudioMixer.ts             # Dreadnought body resonance EQ and gain staging
│   ├── useAudioEngine.ts         # Decoupled React hook
│   └── types.ts                  # Audio engine interfaces
├── components/
│   ├── analog/
│   │   ├── TempoCard.tsx         # Analog rotary tempo instrument with +/- controls
│   │   ├── MechanicalPendulum.tsx# Metronome gauge with oscillating pick arm
│   │   ├── CurrentChordCard.tsx  # Fretboard diagram and acoustic hand preview
│   │   ├── PatternSequencerCard.tsx# 8/16-step rhythm keycaps with playhead
│   │   ├── BottomControlsRow.tsx # Single Chord / Progression switcher, Mixer, Count-in
│   │   ├── FloatingTransportBar.tsx# Tape deck transport with large play button
│   │   └── RotaryKnob.tsx        # Dial interaction primitive
│   ├── navigation/
│   │   └── Sidebar.tsx           # Fixed desktop and mobile bottom navigation
│   └── views/
│       ├── PracticeStudio.tsx    # Main practice studio
│       ├── PatternLibraryView.tsx# Built-in genre and folk patterns
│       ├── ChordExplorerView.tsx # Voicing and fingering library
│       ├── ProgressionBuilderView.tsx# Custom multi-bar progression composer
│       ├── CustomLibraryView.tsx # Custom pattern storage
│       ├── ProgressView.tsx      # Practice time telemetry and stats
│       └── SettingsView.tsx      # Audio latency and preferences
└── data/
    ├── sampleManifest.ts         # String/fret/velocity sample lookup table
    └── chords.ts                 # Open chord voicing definitions (G, C, D, Em, Am, E, A, F, Dm)
```

---

## 📄 License & Attribution

- **Code**: MIT License
- **Guitar Samples**: Derived from [Meta Open Sound — Steel Guitar](https://github.com/facebookincubator/Meta-open-sound), licensed under the **Creative Commons CC0 1.0 Universal** public domain dedication. Full license preserved in [public/audio/guitar/meta-steel/LICENSE](public/audio/guitar/meta-steel/LICENSE).
