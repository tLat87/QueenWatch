# Исправление бага Party Mode

## Проблема
После выбора аватарки для игрока и нажатия кнопки "Choose" ничего не происходило - игра не запускалась.

## Причина
В функции `startPartyGame()` в `PartyModeScreen.tsx` был только `console.log()`, но не было навигации к игровому экрану.

## Решение

### 1. Создан новый экран PartyGameScreen
- Полноценный игровой экран для Party режима
- Поддержка множественных игроков
- Измерение времени реакции для каждого игрока
- Определение победителя
- Возможность играть снова

### 2. Обновлена навигация
- Добавлен `PartyGameScreen` в `GameStack`
- Исправлена функция `startPartyGame()` для навигации
- Передача данных игроков через navigation params

### 3. Функциональность PartyGameScreen

#### Экраны игры:
- **Waiting Screen**: Подготовка к игре, список игроков
- **Playing Screen**: Активная игра с зеленым фоном
- **Result Screen**: Результаты с определением победителя

#### Особенности:
- Случайное время ожидания (1-5 секунд)
- Измерение времени реакции в миллисекундах
- Отображение эмодзи персонажей
- Кнопки "Play Again" и "Back to Setup"

### 4. Передача данных
```typescript
// PartyModeScreen.tsx
navigation.navigate('PartyGame', { players });

// PartyGameScreen.tsx
const routePlayers = (route.params as any)?.players;
const [players, setPlayers] = useState<Player[]>(
  routePlayers || defaultPlayers
);
```

## Результат
Теперь после выбора аватарки для всех игроков и нажатия "Choose" происходит переход к полноценной игре Party режима с возможностью измерения времени реакции и определения победителя.

## Файлы изменены:
- `src/screens/PartyModeScreen.tsx` - исправлена навигация
- `src/screens/PartyGameScreen.tsx` - новый игровой экран
- `App.tsx` - добавлен в навигацию
