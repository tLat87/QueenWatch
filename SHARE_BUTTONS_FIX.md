# Исправление кнопок Share в RulesScreen и InfoScreen

## Проблема
Кнопки Share в RulesScreen и InfoScreen не работали - они содержали только TODO комментарии и не выполняли никаких действий.

## Решение

### 1. Установлена библиотека react-native-share
```bash
npm install react-native-share
```

### 2. Исправлен RulesScreen
- Добавлен импорт `Share` из `react-native-share`
- Реализована функция `handleShare` с полной функциональностью
- Share текст зависит от активной вкладки (Solo/Party)

#### Solo Mode Share Text:
```
QueenWatch Solo Mode Rules:

In QueenWatch solo mode, you play on your own reaction speed. A square appears on the screen and lights up at a random moment - your task is to click on it as quickly as possible. After each round, the game shows your reaction time so you can improve your skills.

Download QueenWatch and test your reaction speed!
```

#### Party Mode Share Text:
```
QueenWatch Party Mode Rules:

In QueenWatch party mode, players compete against each other on a single reaction stage. Each player takes turns tapping a square when it lights up—the fastest player wins. After the round is over, the game displays the results of all participants and determines the Speed Queen.

Download QueenWatch and challenge your friends!
```

### 3. Исправлен InfoScreen
- Добавлен импорт `Share` из `react-native-share`
- Реализована функция `handleShare` с описанием приложения
- Исправлены синтаксические ошибки в JSX

#### InfoScreen Share Text:
```
QueenWatch: Tap and React

A fast-paced reaction game that challenges your focus and reflexes. Tap the glowing square as quickly as possible and compete for the fastest time. Play solo to beat your own records or switch to party mode to challenge friends in real-time duels.

Track your stats, improve your speed, and prove you have the quickest reaction in the kingdom!

Download QueenWatch now!
```

### 4. Добавлены недостающие стили в InfoScreen
```typescript
largeLogo: {
  fontSize: 48,
  fontWeight: 'bold',
  color: '#8B5CF6',
  marginRight: 10,
},
crownContainer: {
  position: 'absolute',
  top: -10,
  right: -5,
},
crown: {
  fontSize: 24,
},
appTitle: {
  fontSize: 24,
  fontWeight: 'bold',
  color: '#000000',
  marginBottom: 5,
},
appSubtitle: {
  fontSize: 16,
  color: '#6B7280',
  fontWeight: '600',
},
```

## Функциональность Share

### Общие возможности:
- **Title**: Заголовок для share диалога
- **Message**: Текст с описанием/правилами
- **URL**: Ссылка на App Store (заменить на реальную)
- **Error Handling**: Обработка ошибок с Alert уведомлениями

### Share Options:
```typescript
const shareOptions = {
  title: 'QueenWatch Rules', // или 'QueenWatch: Tap and React'
  message: rulesText, // или shareText
  url: 'https://play.google.com/store/apps/details?id=com.queenwatch',
};
```

## Результат

### До исправления:
- ❌ Кнопки Share не работали
- ❌ Только console.log в функциях
- ❌ Синтаксические ошибки в InfoScreen

### После исправления:
- ✅ Кнопки Share работают корректно
- ✅ Открывается нативный share диалог
- ✅ Разные тексты для Solo/Party режимов
- ✅ Обработка ошибок
- ✅ Исправлены синтаксические ошибки

## Тестирование

1. **RulesScreen**: 
   - Переключите между Solo/Party вкладками
   - Нажмите кнопку Share
   - Проверьте, что текст соответствует активной вкладке

2. **InfoScreen**:
   - Нажмите кнопку Share
   - Проверьте, что открывается share диалог
   - Проверьте содержимое сообщения

3. **Error Handling**:
   - Проверьте обработку ошибок (если share отменен)

## Примечания

- URL в shareOptions нужно заменить на реальную ссылку на App Store
- Библиотека `react-native-share` требует настройки для iOS (если используется)
- Share диалог может отличаться в зависимости от платформы
