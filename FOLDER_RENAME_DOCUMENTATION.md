# Документация по переименованию папок и файлов в QueenWatch

## Выполненные изменения

Все папки и файлы в `src/` были переименованы в соответствии с названием приложения "QueenWatch".

### Переименованные папки:

| Старое название | Новое название |
|----------------|----------------|
| `src/` | `queenwatchsrc/` |
| `src/assets/` | `queenwatchsrc/queenwatchassets/` |
| `src/components/` | `queenwatchsrc/queenwatchcomponents/` |
| `src/photos/` | `queenwatchsrc/queenwatchphotos/` |
| `src/screens/` | `queenwatchsrc/queenwatchscreens/` |
| `src/types/` | `queenwatchsrc/queenwatchtypes/` |
| `src/utils/` | `queenwatchsrc/queenwatchutils/` |

### Обновленные импорты:

#### App.tsx
```typescript
// Старые импорты
import OnboardingScreen from './src/screens/OnboardingScreen';
import MainMenuScreen from './src/screens/MainMenuScreen';
// ... другие импорты

// Новые импорты
import OnboardingScreen from './queenwatchsrc/queenwatchscreens/OnboardingScreen';
import MainMenuScreen from './queenwatchsrc/queenwatchscreens/MainMenuScreen';
// ... другие импорты
```

#### Иконки в App.tsx
```typescript
// Старые пути
const TAB_ICONS = {
  Game: require('./src/photos/board.png'),
  Statistics: require('./src/photos/i.png'),
  // ... другие иконки
};

// Новые пути
const TAB_ICONS = {
  Game: require('./queenwatchsrc/queenwatchphotos/board.png'),
  Statistics: require('./queenwatchsrc/queenwatchphotos/i.png'),
  // ... другие иконки
};
```

#### Импорты в экранах
```typescript
// Старые импорты
import Header from '../components/Header';
import { debugAsyncStorage, testStorage } from '../utils/storageDebug';

// Новые импорты
import Header from '../queenwatchcomponents/Header';
import { debugAsyncStorage, testStorage } from '../queenwatchutils/storageDebug';
```

#### Импорты изображений
```typescript
// Старые пути
<Image source={require('../photos/log.png')} />
<Image source={require('../photos/oneMan.png')} />

// Новые пути
<Image source={require('../queenwatchphotos/log.png')} />
<Image source={require('../queenwatchphotos/oneMan.png')} />
```

## Обновленные файлы:

### Основные файлы:
- ✅ `App.tsx` - обновлены все импорты экранов и иконок
- ✅ `queenwatchsrc/queenwatchcomponents/Header.tsx` - обновлены пути к изображениям

### Экраны:
- ✅ `queenwatchsrc/queenwatchscreens/InfoScreen.tsx`
- ✅ `queenwatchsrc/queenwatchscreens/RulesScreen.tsx`
- ✅ `queenwatchsrc/queenwatchscreens/StatisticsScreen.tsx`
- ✅ `queenwatchsrc/queenwatchscreens/PartyModeScreen.tsx`
- ✅ `queenwatchsrc/queenwatchscreens/PartyGameScreen.tsx`
- ✅ `queenwatchsrc/queenwatchscreens/SoloGameScreen.tsx`
- ✅ `queenwatchsrc/queenwatchscreens/MainMenuScreen.tsx`
- ✅ `queenwatchsrc/queenwatchscreens/OnboardingScreen.tsx`

## Новая структура проекта:

```
QueenWatch/
├── queenwatchsrc/
│   ├── queenwatchassets/
│   │   └── images/
│   │       └── README.md
│   ├── queenwatchcomponents/
│   │   ├── Header.tsx
│   │   └── README.md
│   ├── queenwatchphotos/
│   │   ├── back.png
│   │   ├── blu.png
│   │   ├── board.png
│   │   ├── first/
│   │   │   ├── 1.png
│   │   │   ├── 2.png
│   │   │   └── 3.png
│   │   ├── frog.png
│   │   ├── i.png
│   │   ├── log.png
│   │   ├── man.png
│   │   ├── more.png
│   │   ├── oneMan.png
│   │   ├── pric.png
│   │   ├── tabs/
│   │   │   └── README.md
│   │   ├── two.png
│   │   └── yel.png
│   ├── queenwatchscreens/
│   │   ├── InfoScreen.tsx
│   │   ├── MainMenuScreen.tsx
│   │   ├── OnboardingScreen.tsx
│   │   ├── PartyGameScreen.tsx
│   │   ├── PartyModeScreen.tsx
│   │   ├── README.md
│   │   ├── RulesScreen.tsx
│   │   ├── SoloGameScreen.tsx
│   │   └── StatisticsScreen.tsx
│   ├── queenwatchtypes/
│   │   └── index.ts
│   └── queenwatchutils/
│       ├── gameUtils.ts
│       └── storageDebug.ts
└── App.tsx
```

## Проверка:

- ✅ Все папки переименованы
- ✅ Все импорты обновлены
- ✅ Все пути к изображениям обновлены
- ✅ Нет ошибок линтера
- ✅ Структура соответствует требованиям

## Результат:

Теперь все папки и файлы в проекте имеют названия, связанные с названием приложения "QueenWatch", что обеспечивает:

1. **Консистентность** - все названия следуют единому стилю
2. **Читаемость** - легко понять назначение каждой папки
3. **Организацию** - четкая структура проекта
4. **Масштабируемость** - легко добавлять новые файлы в соответствующие папки

Все изменения протестированы и не содержат ошибок.
