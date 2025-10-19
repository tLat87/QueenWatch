# QueenWatch: Tap and React

A fast-paced reaction game built with React Native that challenges your focus and reflexes. Tap the glowing square as quickly as possible and compete for the fastest time.

## Features

### 🎮 Game Modes
- **Solo Mode**: Test your reflexes and beat your own records
- **Party Mode**: Challenge friends in real-time duels with character selection

### 📊 Statistics
- Track your reaction times
- View average response times by date
- Share your best results
- Historical performance data

### 🎨 Design
- Clean, modern UI with purple and green color scheme
- Intuitive navigation with bottom tabs
- Responsive design for all screen sizes

## Game Flow

### Solo Mode
1. **Start Screen**: Press the button to begin
2. **Instructions**: Wait for the green light to turn on
3. **Game**: Tap the red button as quickly as possible when the green square appears
4. **Results**: View your reaction time and share or play again

### Party Mode
1. **Add Players**: Enter names for 2-4 players
2. **Character Selection**: Each player chooses their character
3. **Game**: Compete in reaction duels
4. **Results**: See who has the fastest reactions

## Technical Details

### Built With
- React Native 0.80.0
- TypeScript
- React Navigation
- AsyncStorage for data persistence
- React Native Vector Icons

### Project Structure
```
src/
├── screens/          # All screen components
├── components/       # Reusable components
├── utils/           # Utility functions
└── types/           # TypeScript type definitions
```

### Key Features
- Real-time reaction time measurement
- Data persistence with AsyncStorage
- Responsive design
- TypeScript for type safety
- Modular component architecture

## Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. For iOS:
   ```bash
   cd ios && pod install && cd ..
   npm run ios
   ```
4. For Android:
   ```bash
   npm run android
   ```

## Game Rules

- Wait for the green light to appear
- Tap the red button as quickly as possible
- Your reaction time is measured in milliseconds
- Lower times are better
- Track your progress over time

## Contributing

Feel free to submit issues and enhancement requests!

## License

This project is licensed under the MIT License.