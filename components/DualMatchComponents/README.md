# Dual Match Arena

A competitive real-time quiz feature where two students compete against each other in a timed quiz battle.

## Features

### 🔍 Opponent Search
- Animated search interface with progress tracking
- Real-time online player count
- Skill-based matching simulation
- Premium UI with glassmorphism effects

### ⚔️ Live Competition
- Head-to-head quiz battles
- 5-minute time limit per match
- 15-second timer per question
- Real-time scoring system
- Visual feedback for correct/incorrect answers

### 🎨 Premium UI Components
- **GlareHover**: Interactive cards with stunning glare effects
- **QuestionTimer**: Animated circular countdown timer with warning states
- **OpponentSearch**: Multi-step search animation with progress visualization
- **Countdown**: Full-screen countdown overlay with smooth animations

### 🎯 Game States
1. **Searching**: Finding an online opponent
2. **Waiting**: Both players ready, showing matchup
3. **Countdown**: 3-2-1 start sequence
4. **Playing**: Active quiz with timer and scoring
5. **Finished**: Results screen with stats and options

### 🎮 Interactive Elements
- Smooth animations with Framer Motion
- Responsive hover effects
- Visual answer feedback
- Timer warnings and critical states
- Score tracking and comparison

## Technology Stack

- **React 18** with TypeScript
- **Next.js 15** with Turbopack
- **Framer Motion** for animations
- **Tailwind CSS** for styling
- **Lucide React** for icons
- **ReactBits** components for premium UI elements

## File Structure

```
components/DualMatchComponents/
├── DualMatchArena.tsx      # Main component
├── Countdown.tsx           # Countdown overlay
├── QuestionTimer.tsx       # Circular timer
├── OpponentSearch.tsx      # Search animation
└── index.ts               # Component exports

app/(protected)/@student/dual-match/
└── page.tsx               # Route page
```

## Color Scheme

- **Primary Blue**: `rgb(59, 130, 246)` - Player indicators
- **Secondary Purple**: `rgb(147, 51, 234)` - Opponent indicators
- **Success Green**: `rgb(34, 197, 94)` - Correct answers
- **Danger Red**: `rgb(239, 68, 68)` - Incorrect answers
- **Warning Yellow**: `rgb(245, 158, 11)` - Timer warnings

## Usage

Navigate to `/dual-match` to access the arena. The component handles the complete game flow automatically, from finding opponents to displaying results.

## Future Enhancements

- WebSocket integration for real multiplayer
- Voice chat support
- Different quiz categories
- Leaderboards and rankings
- Custom question sets
- Tournament mode
