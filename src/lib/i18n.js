import React from 'react'
import { safeGet, safeSet } from './safe-storage'

// Internationalization system
const TRANSLATIONS = {
  en: {
    // Navigation
    summary: 'Summary',
    goals: 'Goals',
    habits: 'Habits',
    wishes: 'Wishes',
    notes: 'Notes',
    competitions: 'Competitions',
    settings: 'Settings',
    themes: 'Themes',
    
    // Settings
    profile: 'Profile',
    nickname: 'Nickname',
    defaultTab: 'Default Tab',
    theme: 'Theme',
    currentTheme: 'Current Theme',
    change: 'Change',
    notifications: 'Notifications',
    quietMode: 'Quiet Mode',
    quietModeDescription: 'Disable notifications during specified hours',
    from: 'From',
    to: 'To',
    data: 'Data',
    dataDescription: 'Application data management',
    exportJSON: 'Export JSON',
    importJSON: 'Import JSON',
    resetData: 'Reset Data',
    resetDataConfirm: 'Are you sure you want to reset all data? This action cannot be undone.',
    
    // Theme Selection
    themeSelection: 'Theme Selection',
    availableThemes: 'Available Themes',
    aboutThemes: 'About Themes',
    systemTheme: 'System: Automatically follows your OS theme.',
    highContrast: 'High Contrast: Maximum readability for users with visual impairments.',
    amoled: 'AMOLED: Pure black color for battery saving on OLED screens.',
    
    // Summary
    motivationOfTheDay: 'Motivation of the Day',
    tapToChange: 'Tap to change',
    goals: 'Goals',
    habits: 'Habits',
    wishes: 'Wishes',
    heavyGoals: 'Heavy Goals',
    urgentGoals: 'Urgent Goals',
         overdueGoals: 'Overdue Goals',
     completedGoals: 'Completed Goals',
     completedThisWeek: 'Completed This Week',
    today: 'Today',
    completed: 'Completed',
    otherGoals: 'Other Goals',
    overdue: 'Overdue',
    total: 'Total',
    longestStreak: 'Longest Streak',
    streakAtRisk: 'Streak at Risk',
    missedYesterday: 'Missed Yesterday',
    inProgress: 'In Progress',
    fullyFunded: 'Fully Funded',
    averageCompletion: 'Avg Completion',
    largestWish: 'Largest Wish',
    highPriority: 'High Priority',
    dueThisWeek: 'Due This Week',
    pastDeadline: 'Past Deadline',
    achievements: 'Achievements',
    days: 'days',
    needsAction: 'Needs Action',
    catchUp: 'Catch Up',
    saving: 'Saving',
    readyToBuy: 'Ready to Buy',
    progress: 'Progress',
    remaining: 'Remaining',
    
    // Goals
    myGoals: 'My Goals',
    noGoalsYet: 'No goals yet. Create your first goal to get started!',
    addGoal: 'Add Goal',
    goalTitle: 'Goal Title',
         deadline: 'Deadline',
     unit: 'Unit',
     target: 'Target',
     currentProgress: 'Current Progress',
     priority: 'Priority',
    category: 'Category',
    description: 'Description',
    createGoal: 'Create Goal',
    saveChanges: 'Save Changes',
    cancel: 'Cancel',
    close: 'Close',
    
    // Habits
    myHabits: 'My Habits',
    noHabitsYet: 'No habits yet. Create your first habit to get started!',
    addHabit: 'Add Habit',
    habitTitle: 'Habit Title',
    type: 'Type',
    dailyTarget: 'Daily Target',
    activeDays: 'Active Days',
    duration: 'Duration',
    reminders: 'Reminders',
    createHabit: 'Create Habit',
    markDone: 'Mark Done',
    dayStreak: 'day streak',
    best: 'Best',
    
    // Wishes
    myWishes: 'My Wishes',
    noWishesYet: 'No wishes yet. Create your first wish to get started!',
    addWish: 'Add Wish',
    wishTitle: 'Wish Title',
    targetAmount: 'Target Amount',
    savedAmount: 'Saved Amount',
    link: 'Link',
    createWish: 'Create Wish',
    
    // Common
    loading: 'Loading...',
    error: 'Error',
    success: 'Success',
    confirm: 'Confirm',
    delete: 'Delete',
    edit: 'Edit',
    restore: 'Restore',
    completed: 'Completed',
    deleted: 'Deleted',
    offline: 'Offline',
    
    // Categories
    personal: 'Personal',
    work: 'Work',
    health: 'Health',
    education: 'Education',
    finance: 'Finance',
    hobbies: 'Hobbies',
    other: 'Other',
    
    // Priorities
    low: 'Low',
    medium: 'Medium',
    high: 'High',
    
    // Theme names
    dark: 'Dark',
    dim: 'Dim',
    amoled: 'AMOLED',
    solarizedDark: 'Solarized Dark',
    highContrast: 'High Contrast',
    system: 'System',
    
    // Language
    language: 'Language',
    english: 'English',
    russian: 'Russian',
    
    // Units & Currency
    unitsAndCurrency: 'Units & Currency',
    currency: 'Currency',
    currencyDescription: 'Default currency for wishes and financial goals',
    weight: 'Weight',
    weightDescription: 'Default unit for weight measurements',
    length: 'Length',
    lengthDescription: 'Default unit for length and height measurements',
    
    // Visibility
    visibility: 'Visibility',
    notesVisibilityDescription: 'Show or hide the Notes section from navigation',
    competitionsVisibilityDescription: 'Show or hide the Competitions section from navigation',
    sectionHidden: 'Section Hidden',
    sectionHiddenDescription: 'The {section} section is currently hidden. You can enable it in Settings.',
    goToSettings: 'Go to Settings',
  },
  
  ru: {
    // Navigation
    summary: 'Сводка',
    goals: 'Цели',
    habits: 'Привычки',
    wishes: 'Хотелки',
    notes: 'Записи',
    competitions: 'Соревнования',
    settings: 'Настройки',
    themes: 'Темы',
    
    // Settings
    profile: 'Профиль',
    nickname: 'Никнейм',
    defaultTab: 'Стартовая вкладка',
    theme: 'Тема',
    currentTheme: 'Текущая тема',
    change: 'Изменить',
    notifications: 'Уведомления',
    quietMode: 'Тихий режим',
    quietModeDescription: 'Отключить уведомления в указанное время',
    from: 'С',
    to: 'До',
    data: 'Данные',
    dataDescription: 'Управление данными приложения',
    exportJSON: 'Экспорт JSON',
    importJSON: 'Импорт JSON',
    resetData: 'Сбросить данные',
    resetDataConfirm: 'Вы уверены, что хотите сбросить все данные? Это действие нельзя отменить.',
    
    // Theme Selection
    themeSelection: 'Выбор темы',
    availableThemes: 'Доступные темы',
    aboutThemes: 'О темах',
    systemTheme: 'Системная: Автоматически следует теме вашей операционной системы.',
    highContrast: 'Высокий контраст: Максимальная читаемость для пользователей с нарушениями зрения.',
    amoled: 'AMOLED: Чистый черный цвет для экономии батареи на OLED экранах.',
    
    // Summary
    motivationOfTheDay: 'Мотивация дня',
    tapToChange: 'Нажмите для смены',
    goals: 'Цели',
    habits: 'Привычки',
    wishes: 'Хотелки',
    heavyGoals: 'Тяжелые цели',
    urgentGoals: 'Срочные цели',
         overdueGoals: 'Просроченные',
     completedGoals: 'Завершенные цели',
     completedThisWeek: 'Завершено на неделе',
    today: 'Сегодня',
    completed: 'Завершено',
    otherGoals: 'Другие цели',
    overdue: 'Просрочено',
    total: 'Всего',
    longestStreak: 'Лучшая серия',
    streakAtRisk: 'Серия под угрозой',
    missedYesterday: 'Пропущено вчера',
    inProgress: 'В процессе',
    fullyFunded: 'Полностью оплачено',
    averageCompletion: 'Средний прогресс',
    largestWish: 'Самое дорогое',
    highPriority: 'Высокий приоритет',
    dueThisWeek: 'На этой неделе',
    pastDeadline: 'Просрочено',
    achievements: 'Достижения',
    days: 'дней',
    needsAction: 'Требует действий',
    catchUp: 'Наверстать',
    saving: 'Копим',
    readyToBuy: 'Готово к покупке',
    progress: 'Прогресс',
    remaining: 'Осталось',
    
    // Goals
    myGoals: 'Мои цели',
    noGoalsYet: 'Пока нет целей. Создайте первую цель для начала!',
    addGoal: 'Добавить цель',
    goalTitle: 'Название цели',
         deadline: 'Срок',
     unit: 'Единица',
     target: 'Цель',
     currentProgress: 'Текущий прогресс',
     priority: 'Приоритет',
    category: 'Категория',
    description: 'Описание',
    createGoal: 'Создать цель',
    saveChanges: 'Сохранить изменения',
    cancel: 'Отмена',
    close: 'Закрыть',
    
    // Habits
    myHabits: 'Мои привычки',
    noHabitsYet: 'Пока нет привычек. Создайте первую привычку для начала!',
    addHabit: 'Добавить привычку',
    habitTitle: 'Название привычки',
    type: 'Тип',
    dailyTarget: 'Дневная цель',
    activeDays: 'Активные дни',
    duration: 'Длительность',
    reminders: 'Напоминания',
    createHabit: 'Создать привычку',
    markDone: 'Отметить выполненным',
    dayStreak: 'дней подряд',
    best: 'Лучший',
    
    // Wishes
    myWishes: 'Мои хотелки',
    noWishesYet: 'Пока нет хотелок. Создайте первую хотелку для начала!',
    addWish: 'Добавить хотелку',
    wishTitle: 'Название хотелки',
    targetAmount: 'Целевая сумма',
    savedAmount: 'Сохраненная сумма',
    link: 'Ссылка',
    createWish: 'Создать хотелку',
    
    // Common
    loading: 'Загрузка...',
    error: 'Ошибка',
    success: 'Успех',
    confirm: 'Подтвердить',
    delete: 'Удалить',
    edit: 'Редактировать',
    restore: 'Восстановить',
    completed: 'Завершено',
    deleted: 'Удалено',
    offline: 'Офлайн',
    
    // Categories
    personal: 'Личное',
    work: 'Работа',
    health: 'Здоровье',
    education: 'Образование',
    finance: 'Финансы',
    hobbies: 'Хобби',
    other: 'Другое',
    
    // Priorities
    low: 'Низкий',
    medium: 'Средний',
    high: 'Высокий',
    
    // Theme names
    dark: 'Тёмная',
    dim: 'Приглушенная',
    amoled: 'AMOLED',
    solarizedDark: 'Solarized Dark',
    highContrast: 'Высокий контраст',
    system: 'Системная',
    
    // Language
    language: 'Язык',
    english: 'English',
    russian: 'Русский',
    
    // Units & Currency
    unitsAndCurrency: 'Единицы и валюта',
    currency: 'Валюта',
    currencyDescription: 'Валюта по умолчанию для желаний и финансовых целей',
    weight: 'Вес',
    weightDescription: 'Единица измерения веса по умолчанию',
    length: 'Длина',
    lengthDescription: 'Единица измерения длины и роста по умолчанию',
    
    // Visibility
    visibility: 'Видимость',
    notesVisibilityDescription: 'Показать или скрыть раздел Записи из навигации',
    competitionsVisibilityDescription: 'Показать или скрыть раздел Соревнования из навигации',
    sectionHidden: 'Раздел скрыт',
    sectionHiddenDescription: 'Раздел {section} в данный момент скрыт. Вы можете включить его в Настройках.',
    goToSettings: 'Перейти в настройки',
  }
}

// Get current language from localStorage or default to 'ru'
export function getCurrentLanguage() {
  try {
    return safeGet('step_020_language', 'ru')
  } catch (error) {
    console.error('Error getting language:', error)
    return 'ru'
  }
}

// Set language and save to localStorage
export function setLanguage(lang) {
  try {
    safeSet('step_020_language', lang)
  } catch (error) {
    console.error('Error setting language:', error)
  }
}

// Get translation for a key
export function t(key, lang = null, params = {}) {
  const currentLang = lang || getCurrentLanguage()
  let translation = TRANSLATIONS[currentLang]?.[key]
  
  if (!translation) {
    console.warn(`Translation missing for key: ${key} in language: ${currentLang}`)
    translation = TRANSLATIONS.en[key] || key
  }
  
  // Replace parameters in translation
  if (params && typeof translation === 'string') {
    Object.keys(params).forEach(param => {
      translation = translation.replace(`{${param}}`, params[param])
    })
  }
  
  return translation
}

// Hook for using translations in components
export function useTranslation() {
  const [currentLang, setCurrentLang] = React.useState(getCurrentLanguage())
  
  const changeLanguage = (lang) => {
    setLanguage(lang)
    setCurrentLang(lang)
    // Force re-render of all components
    window.location.reload()
  }
  
  return {
    t: (key, params) => t(key, currentLang, params),
    currentLang,
    changeLanguage
  }
}
