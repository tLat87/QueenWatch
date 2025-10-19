# Components

Эта папка содержит переиспользуемые компоненты приложения.

## Header.tsx

Универсальный компонент хедера для всех экранов приложения.

### Использование

```typescript
import Header from '../components/Header';

// Базовый хедер с логотипом
<Header />

// Хедер с кнопкой "Назад"
<Header showBackButton={true} />

// Хедер с кастомным заголовком
<Header 
  showBackButton={true}
  title="Custom Title"
  subtitle="Custom Subtitle"
/>
```

### Props

- `showBackButton?: boolean` - Показать кнопку "Назад" (по умолчанию: false)
- `title?: string` - Заголовок (по умолчанию: "QUEEN WATCH")
- `subtitle?: string` - Подзаголовок (по умолчанию: "TAP AND REACT")

### Особенности

- Автоматически использует логотип из `../photos/log.png`
- Кнопка "Назад" автоматически вызывает `navigation.goBack()`
- Адаптивный дизайн с фиксированными размерами логотипа (200x100px)
- Единообразный стиль для всех экранов приложения

### Стили

- Логотип: 200x100px с `resizeMode="contain"`
- Кнопка "Назад": 40x40px с фиолетовым фоном
- Отступы: 20px по горизонтали, 10px сверху и снизу
