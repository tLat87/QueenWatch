# Onboarding Background Images

Эта папка предназначена для хранения фоновых изображений для экранов онбординга.

## Структура файлов

Поместите ваши изображения в эту папку со следующими именами:
- `onboarding-step1.png` - для первого экрана (Tap instruction)
- `onboarding-step2.png` - для второго экрана (Challenge/Duel)
- `onboarding-step3.png` - для третьего экрана (Statistics)

## Использование

### Вариант 1: Локальные изображения
В файле `OnboardingScreen.tsx` раскомментируйте и используйте:

```typescript
const BACKGROUND_IMAGES = {
  step1: require('./path/to/your/step1-image.png'),
  step2: require('./path/to/your/step2-image.png'),
  step3: require('./path/to/your/step3-image.png'),
};
```

### Вариант 2: URL изображений
В файле `OnboardingScreen.tsx` используйте:

```typescript
const BACKGROUND_IMAGES = {
  step1: 'https://your-domain.com/step1-image.png',
  step2: 'https://your-domain.com/step2-image.png',
  step3: 'https://your-domain.com/step3-image.png',
};
```

## Рекомендации

- Размер изображений: 1080x1920px (9:16 соотношение)
- Формат: PNG или JPG
- Оптимизируйте изображения для мобильных устройств
- Убедитесь, что текст на белых карточках читается поверх ваших изображений
