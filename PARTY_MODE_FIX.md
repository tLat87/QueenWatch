# Исправление проблемы с вводом имен в Party Mode

## Проблема
При вводе имени второго игрока автоматически происходил переход к выбору персонажей, что мешало завершить ввод имени.

## Причина
Функция `canProceedToCharacterSelection()` проверяла, что ВСЕ игроки имеют непустые имена, и если это условие выполнялось, то автоматически переключала экран на выбор персонажей. Это происходило даже когда пользователь только начал вводить имя.

## Решение

### 1. Изменена логика перехода
- Убрана автоматическая проверка и переход
- Добавлена кнопка "Continue to Character Selection"
- Переход происходит только по нажатию кнопки

### 2. Добавлена кнопка "Next"
```typescript
{canProceedToCharacterSelection() && (
  <TouchableOpacity style={styles.continueButton} onPress={handleContinueToCharacters}>
    <Text style={styles.continueButtonText}>Next</Text>
  </TouchableOpacity>
)}
```

### 3. Добавлена кнопка "Back to Names"
- Позволяет вернуться к вводу имен из экрана выбора персонажей
- Устанавливает `currentPlayerIndex = -1` для возврата к экрану ввода

### 4. Обновлена функция `renderContent`
```typescript
const renderContent = () => {
  if (currentPlayerIndex >= 0 && currentPlayerIndex < players.length) {
    return renderCharacterSelection();
  }
  return renderPlayerInput();
};
```

## Результат

### До исправления:
- ❌ Автоматический переход при вводе символа
- ❌ Невозможность завершить ввод имени
- ❌ Нет возможности вернуться к вводу имен

### После исправления:
- ✅ Пользователь может спокойно вводить имена всех игроков
- ✅ Переход к выбору персонажей только по кнопке "Next"
- ✅ Возможность вернуться к вводу имен кнопкой "Back to Names"
- ✅ Улучшенный UX для настройки партийной игры
- ✅ Все кнопки на английском языке

## Новые стили

```typescript
continueButton: {
  backgroundColor: '#8B5CF6',
  paddingHorizontal: 20,
  paddingVertical: 15,
  borderRadius: 25,
  alignSelf: 'center',
  marginTop: 20,
},
backToNamesButton: {
  backgroundColor: '#6B7280',
  paddingHorizontal: 20,
  paddingVertical: 15,
  borderRadius: 25,
  alignSelf: 'center',
  marginTop: 20,
},
```

## Тестирование

1. **Ввод имен**: Введите имена всех игроков без автоматического перехода
2. **Кнопка "Next"**: Появляется только когда все имена введены
3. **Выбор персонажей**: Переход происходит только по нажатию кнопки "Next"
4. **Возврат**: Кнопка "Back to Names" позволяет вернуться к вводу имен
5. **Выбор персонажа**: Кнопка "Choose" для подтверждения выбора персонажа
