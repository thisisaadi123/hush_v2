# HUSH – Adaptive Mental Wellness Coach

A privacy-first, emotionally-centered mental wellness application built with React and Tailwind CSS.

## 🌱 About HUSH

HUSH is your safe space for emotional wellness. The app adapts to you through three gentle modes:
- **Journaling** - Write freely in a safe, private space
- **Voice Input** - Share through voice with tone analysis
- **Video Check-ins** - Optional presence-based emotional understanding

## 🎨 Design Philosophy

HUSH follows a warm, nature-inspired design system centered on:
- **Soft, organic shapes** - No harsh angles or sterile interfaces
- **Calming color palette** - Sage greens, warm creams, and gentle yellows
- **Validating language** - Warm support, never clinical judgment
- **Privacy-first messaging** - Clear transparency about data use

### Color Palette

**Primary Colors:**
- Soft Sage Green `#A8C5A7` - Main brand color
- Mint Whisper `#D4E7D4` - Secondary backgrounds
- Leaf Shadow `#7A9A79` - Hover states, active elements

**Accent Colors:**
- Sunrise Yellow `#F9E5A7` - Highlights, rewards
- Warm Honey `#EDD084` - Button hover states
- Morning Glow `#FFF4D6` - Alert backgrounds

**Neutrals:**
- Cream Base `#FDFDF8` - Primary background
- Soft Linen `#F5F5ED` - Card surfaces
- Natural Gray `#C8C8BC` - Borders, dividers
- Warm Charcoal `#5A5A52` - Primary text
- Gentle Slate `#8B8B7E` - Secondary text

### Typography

- **Primary Font:** Nunito (Google Fonts)
  - 700 Bold - Headlines
  - 600 Semi-Bold - Subheads, buttons
  - 400 Regular - Body text
  - 300 Light - Captions

- **Accent Font:** Crimson Text (Google Fonts)
  - 400 Italic - Journal prompts, reflective quotes
  - 600 Semi-Bold - Inspirational headers

## 🏗️ Project Structure

```
├── App.tsx                          # Main app with routing
├── components/
│   ├── Navigation.tsx               # Top navigation bar
│   ├── Hero.tsx                     # Landing hero section
│   ├── ModeSelection.tsx            # Three mode cards
│   ├── ModeCard.tsx                 # Individual mode card
│   ├── JournalingInterface.tsx      # Full journaling experience
│   ├── PlantVisualization.tsx       # Streak plant growth stages
│   ├── VoiceInput.tsx               # Voice recording flow
│   ├── VideoInput.tsx               # Video check-in flow
│   ├── Dashboard.tsx                # Main dashboard layout
│   ├── ExplainabilityPanel.tsx      # AI transparency panel
│   └── ui/                          # Shadcn UI components
└── styles/
    └── globals.css                  # HUSH design tokens
```

## ✨ Key Features

### 1. **Journaling Interface**
- Rotating journal prompts for inspiration
- Real-time autosave with visual indicator
- Past entries archive
- Streak plant visualization showing growth

### 2. **Voice Input**
- Safe voice recording with privacy reassurance
- Waveform visualization during recording
- Pause/resume functionality
- Tone analysis (simulated)

### 3. **Video Check-ins**
- Optional camera-based check-ins
- Expression analysis (simulated)
- Privacy-first messaging
- Countdown and capture flow

### 4. **Dashboard**
- Wellness score with circular progress
- Growth journey with plant visualization
- Personalized micro-interventions
- Recent activity feed
- Supportive resources

### 5. **Explainability Panel**
- Transparent AI score breakdown
- Collapsible sections for each input type
- Reassuring, non-clinical language
- Privacy reminders

## 🌿 Growth Journey (Streak Plant)

The streak plant grows through 5 stages based on consecutive days:
1. **Seed** (0-2 days) - Small dot in soil
2. **Sprout** (3-6 days) - First leaves emerging
3. **Young Plant** (7-13 days) - Multiple leaves
4. **Mature** (14-29 days) - Full foliage with buds
5. **Blooming** (30+ days) - Full flowers with glow effect

## 🎯 Microcopy Principles

- **Warm, never clinical** - "How are you feeling?" not "Rate your mood"
- **Validating, never judging** - "It's okay to have hard days"
- **Gentle suggestions** - "You might try..." not "You must..."
- **Privacy-first** - "Your entries stay private" prominently displayed
- **Growth-focused** - "Building a practice" not "Complete your goal"

## 🔒 Privacy Commitment

HUSH is built with privacy at its core:
- No actual data storage in this demo
- Clear messaging about what's analyzed vs. stored
- Transparent AI explanations
- User control over all inputs
- Encryption messaging throughout

## 🎨 Design System

### Spacing (8pt Grid)
- XXS: 4px - Icon padding
- XS: 8px - Tight spacing
- S: 16px - Default padding
- M: 24px - Card spacing
- L: 32px - Section spacing
- XL: 48px - Major breaks
- XXL: 64px - Page hero spacing

### Border Radius
- Subtle: 8px - Inputs
- Soft: 16px - Cards
- Rounded: 24px - Buttons
- Organic: 32px - Hero shapes
- Pill: 999px - Tags

### Shadows
- Whisper: `0px 2px 8px rgba(122, 154, 121, 0.08)` - Subtle
- Gentle: `0px 4px 16px rgba(122, 154, 121, 0.12)` - Cards
- Floating: `0px 8px 24px rgba(122, 154, 121, 0.16)` - Modals
- Soft Inner: `inset 0px 2px 8px rgba(122, 154, 121, 0.06)` - Focus

## 🚀 Getting Started

This is a React + Tailwind CSS application built for Figma Make.

### Prerequisites
- Modern web browser
- No installation required (runs in Figma Make environment)

### Features Implemented
✅ Complete navigation system
✅ Hero section with call-to-action
✅ Three input modes (Journal, Voice, Video)
✅ Journaling interface with autosave
✅ Streak plant visualization (5 growth stages)
✅ Voice recording flow with waveforms
✅ Video check-in with privacy messaging
✅ Dashboard with wellness score
✅ Explainability panel for transparency
✅ Responsive grid layouts
✅ Micro-interactions and animations
✅ Complete design system implementation

## 🎭 Animation Guidelines

- Button hover: 200ms ease-out lift + shadow
- Card hover: 300ms ease transform scale(1.02)
- Input focus: 150ms border color transition
- Page transitions: 400ms fade with slide
- Plant growth: Celebrate milestones with gentle effects

## 📱 Responsive Design

- **Desktop:** 1440px (baseline design)
- **Tablet:** 768px (2-column cards)
- **Mobile:** 375px (single column, adjusted spacing)

## 🌟 Future Enhancements

While this is a complete design implementation, potential additions include:
- Actual backend integration with Supabase
- Real voice/video analysis APIs
- User authentication
- Data persistence
- Mobile app version
- Accessibility enhancements
- Multi-language support

## 📄 License

This is a design demonstration project for HUSH - Adaptive Mental Wellness Coach.

---

**Remember:** HUSH is about gentle support, not diagnosis. It's a tool for reflection and growth, built with warmth, privacy, and emotional safety at its core. 🌱
