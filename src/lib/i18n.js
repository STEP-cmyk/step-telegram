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
    fallbackQuote: "The first step doesn't have to be perfect, it has to be taken.",
    motivationOn: 'Motivation ON',
    goals: 'Goals',
    habits: 'Habits',
    wishes: 'Wishes',
    heavyGoals: 'Heavy Goals',
    urgentGoals: 'Urgent Goals',
         overdueGoals: 'Overdue Goals',
         completedGoals: 'Completed Goals',
    deletedGoals: 'Deleted Goals',
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
    bestStreakToday: 'Best Streak',
    todayProgress: 'Today',
    avgProgress: 'Avg Progress',
    mostExpensive: 'Most Expensive',
    completion: 'Completion',
    
    // Goals
    myGoals: 'My Goals',
    noGoalsYet: 'No goals yet. Create your first goal to get started!',
    addGoal: 'Add Goal',
    quickGoal: 'Quick Goal',
    quickGoalPlaceholder: 'Quick goal title…',
    quickGoalCreated: 'Quick goal created',
    quickGoalEmptyError: 'Goal title cannot be empty',
    uncategorized: 'Uncategorized',
    goalsDescription: 'Track your progress and achieve your objectives',
    goalTitle: 'Goal Title',
    goalTitlePlaceholder: 'What do you want to achieve?',
    deadline: 'Deadline',
    deadlinePlaceholder: 'Select deadline date',
    unit: 'Unit',
    unitPlaceholder: 'e.g., pages, km, hours...',
    target: 'Target',
    targetPlaceholder: 'Enter your target number',
    currentProgress: 'Current Progress',
    currentProgressPlaceholder: 'Enter current progress',
    priority: 'Priority',
    priorityPlaceholder: 'Select priority level',
    category: 'Category',
    description: 'Description',
    descriptionPlaceholder: 'Describe your goal...',
    tags: 'Tags',
    tagsPlaceholder: 'Add tags to organize your goals...',
    goalCompleted: 'Goal Completed',
    createGoal: 'Create Goal',
    saveChanges: 'Save Changes',
    cancel: 'Cancel',
    close: 'Close',
    edit: 'Edit Goal',
    
    // Habits
    myHabits: 'My Habits',
    noHabitsYet: 'No habits yet. Create your first habit to get started!',
    addHabit: 'Add Habit',
    addNewHabit: 'Add New Habit',
    habitsDescription: 'Build positive habits and track your daily progress',
    habitTitle: 'Habit Title',
    habitTitlePlaceholder: 'What habit do you want to build?',
    type: 'Type',
    typeBinary: 'Binary (Done/Not Done)',
    typeQuantitative: 'Quantitative (Count)',
    dailyTarget: 'Daily Target',
    dailyTargetPlaceholder: 'Enter your daily target',
    activeDays: 'Active Days',
    duration: 'Duration',
    reminders: 'Reminders',
    addReminder: 'Add Reminder',
    createHabit: 'Create Habit',
    markDone: 'Mark Done',
    dayStreak: 'day streak',
    best: 'Best',
    howManyPerDay: 'How many per day?',
    tagsPlaceholder: 'Add tags to organize your habits...',
    // Habit categories
    health: 'Health',
    finance: 'Finance',
    fitness: 'Fitness',
    hobby: 'Hobby',
    learning: 'Learning',
    business: 'Business',
    // Active days options
    everyDay: 'Every day',
    weekdaysOnly: 'Weekdays only',
    weekendsOnly: 'Weekends only',
    customDays: 'Custom days',
    sevenDaysWeek: '7 days a week',
    mondayToFriday: 'Monday to Friday',
    saturdayAndSunday: 'Saturday and Sunday',
    chooseSpecificDays: 'Choose specific days',
    // Duration options
    oneWeek: '1 Week',
    oneMonth: '1 Month',
    threeMonths: '3 Months',
    oneYear: '1 Year',
    indefinite: 'Indefinite',
    sevenDays: '7 days',
    thirtyDays: '30 days',
    ninetyDays: '90 days',
    threeHundredSixtyFiveDays: '365 days',
    noEndDate: 'No end date',
    
    // Wishes
    myWishes: 'My Wishes',
    noWishesYet: 'No wishes yet. Create your first wish to get started!',
    addWish: 'Add Wish',
    addNewWish: 'Add New Wish',
    wishTitle: 'Wish Title',
    wishTitlePlaceholder: 'What do you wish for?',
    targetAmount: 'Target Amount',
    targetAmountPlaceholder: 'Enter target amount',
    alreadySaved: 'Already Saved',
    savedAmount: 'Saved Amount',
    savedAmountPlaceholder: 'Enter saved amount',
    deadline: 'Deadline',
    deadlinePlaceholder: 'When do you want it by?',
    link: 'Link',
    linkPlaceholder: 'Add a link to the item',
    linkOptional: 'Link (Optional)',
    productLinkReference: 'Product link or reference',
    addMoreDetails: 'Add more details about your wish...',
    tagsPlaceholder: 'Add tags to organize your wishes...',
    wishDetails: 'Wish Details',
    createWish: 'Create Wish',
    wishDescription: 'Track your savings and plan your purchases',
    target: 'Target',
    saved: 'Saved',
    savedAmount: 'saved',
    // Categories
    personal: 'Personal',
    work: 'Work',
    health: 'Health',
    education: 'Education',
    finance: 'Finance',
    hobbies: 'Hobbies',
    learning: 'Learning',
    travel: 'Travel',
    entertainment: 'Entertainment',
    other: 'Other',
    // Priorities
    low: 'Low',
    medium: 'Medium',
    high: 'High',
    
    // Common
    loading: 'Loading...',
    error: 'Error',
    success: 'Success',
    errorLoadingData: 'There was an error loading your data. Please refresh the page.',
    refreshPage: 'Refresh Page',
    confirm: 'Confirm',
    delete: 'Delete',
    deleteForever: 'Delete Forever',
    deleteForeverConfirm: 'Are you sure you want to permanently delete this item? This action cannot be undone.',
    edit: 'Edit',
    restore: 'Restore',
    completed: 'Completed',
    deleted: 'Deleted',
    offline: 'Offline',
    undo: 'Undo',
    dismiss: 'Dismiss',
    user: 'User',
    addGoalFailed: 'Failed to add goal. Please try again.',
    goalDeletedForever: 'Goal permanently deleted',
    habitDeletedForever: 'Habit permanently deleted',
    wishDeletedForever: 'Wish permanently deleted',
    close: 'Close',
    saveChanges: 'Save Changes',
    cancel: 'Cancel',
    tags: 'Tags',
    description: 'Description',
    
    // Categories
    personal: 'Personal',
    work: 'Work',
    health: 'Health',
    education: 'Education',
    finance: 'Finance',
    hobbies: 'Hobbies',
    learning: 'Learning',
    travel: 'Travel',
    entertainment: 'Entertainment',
    other: 'Other',
    
    // Priorities
    low: 'Low',
    medium: 'Medium',
    high: 'High',
    
    // Theme names
    light: 'Light',
    dark: 'Dark',
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
    
    // Icon translations
    icon: 'Icon',
    iconPlaceholder: 'Choose an icon',
    chooseIcon: 'Choose Icon',
    
    // Footer
    madeInRussia: 'Made in Russia',
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
    fallbackQuote: 'Первый шаг не должен быть идеальным, его просто нужно сделать.',
    motivationOn: 'Мотивация ВКЛ',
    goals: 'Цели',
    habits: 'Привычки',
    wishes: 'Хотелки',
    heavyGoals: 'Тяжелые цели',
    urgentGoals: 'Срочные цели',
    overdueGoals: 'Просроченные',
    completedGoals: 'Завершенные цели',
    deletedGoals: 'Удаленные цели',
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
    bestStreakToday: 'Лучшая серия',
    todayProgress: 'Сегодня',
    avgProgress: 'Средний прогресс',
    mostExpensive: 'Самое дорогое',
    completion: 'Завершение',
    
    // Goals
    myGoals: 'Мои цели',
    noGoalsYet: 'Пока нет целей. Создайте первую цель для начала!',
    addGoal: 'Добавить цель',
    quickGoal: 'Быстрая цель',
    quickGoalPlaceholder: 'Название быстрой цели…',
    quickGoalCreated: 'Быстрая цель создана',
    quickGoalEmptyError: 'Название цели не может быть пустым',
    uncategorized: 'Без категории',
    goalsDescription: 'Отслеживайте прогресс и достигайте целей',
    goalTitle: 'Название цели',
    goalTitlePlaceholder: 'Чего вы хотите достичь?',
    deadline: 'Срок',
    deadlinePlaceholder: 'Выберите дату срока',
    unit: 'Единица',
    unitPlaceholder: 'например, страницы, км, часы...',
    target: 'Цель',
    targetPlaceholder: 'Введите целевое число',
    currentProgress: 'Текущий прогресс',
    currentProgressPlaceholder: 'Введите текущий прогресс',
    priority: 'Приоритет',
    priorityPlaceholder: 'Выберите уровень приоритета',
    category: 'Категория',
    description: 'Описание',
    descriptionPlaceholder: 'Опишите вашу цель...',
    tags: 'Теги',
    tagsPlaceholder: 'Добавьте теги для организации целей...',
    goalCompleted: 'Цель завершена',
    createGoal: 'Создать цель',
    saveChanges: 'Сохранить изменения',
    cancel: 'Отмена',
    close: 'Закрыть',
    edit: 'Редактировать цель',
    
    // Habits
    myHabits: 'Мои привычки',
    noHabitsYet: 'Пока нет привычек. Создайте первую привычку для начала!',
    addHabit: 'Добавить привычку',
    addNewHabit: 'Добавить новую привычку',
    habitsDescription: 'Вырабатывайте положительные привычки и отслеживайте ежедневный прогресс',
    habitTitle: 'Название привычки',
    habitTitlePlaceholder: 'Какую привычку вы хотите выработать?',
    type: 'Тип',
    typeBinary: 'Бинарная (Выполнено/Не выполнено)',
    typeQuantitative: 'Количественная (Подсчет)',
    dailyTarget: 'Дневная цель',
    dailyTargetPlaceholder: 'Введите вашу дневную цель',
    activeDays: 'Активные дни',
    duration: 'Длительность',
    reminders: 'Напоминания',
    addReminder: 'Добавить напоминание',
    createHabit: 'Создать привычку',
    markDone: 'Отметить выполненным',
    dayStreak: 'дней подряд',
    best: 'Лучший',
    howManyPerDay: 'Сколько в день?',
    tagsPlaceholder: 'Добавьте теги для организации привычек...',
    // Habit categories
    health: 'Здоровье',
    finance: 'Финансы',
    fitness: 'Фитнес',
    hobby: 'Хобби',
    learning: 'Обучение',
    business: 'Бизнес',
    // Active days options
    everyDay: 'Каждый день',
    weekdaysOnly: 'Только будни',
    weekendsOnly: 'Только выходные',
    customDays: 'Выборочные дни',
    sevenDaysWeek: '7 дней в неделю',
    mondayToFriday: 'Понедельник - пятница',
    saturdayAndSunday: 'Суббота и воскресенье',
    chooseSpecificDays: 'Выберите конкретные дни',
    // Duration options
    oneWeek: '1 неделя',
    oneMonth: '1 месяц',
    threeMonths: '3 месяца',
    oneYear: '1 год',
    indefinite: 'Бессрочно',
    sevenDays: '7 дней',
    thirtyDays: '30 дней',
    ninetyDays: '90 дней',
    threeHundredSixtyFiveDays: '365 дней',
    noEndDate: 'Без даты окончания',
    
    // Wishes
    myWishes: 'Мои хотелки',
    noWishesYet: 'Пока нет хотелок. Создайте первую хотелку для начала!',
    addWish: 'Добавить хотелку',
    addNewWish: 'Добавить новую хотелку',
    wishTitle: 'Название хотелки',
    wishTitlePlaceholder: 'О чем вы мечтаете?',
    targetAmount: 'Целевая сумма',
    targetAmountPlaceholder: 'Введите целевую сумму',
    alreadySaved: 'Уже сохранено',
    savedAmount: 'Сохраненная сумма',
    savedAmountPlaceholder: 'Введите сохраненную сумму',
    deadline: 'Срок',
    deadlinePlaceholder: 'К какому времени вы хотите это получить?',
    link: 'Ссылка',
    linkPlaceholder: 'Добавьте ссылку на товар',
    linkOptional: 'Ссылка (необязательно)',
    productLinkReference: 'Ссылка на товар или описание',
    addMoreDetails: 'Добавьте больше деталей о вашем желании...',
    tagsPlaceholder: 'Добавьте теги для организации желаний...',
    wishDetails: 'Детали желания',
    createWish: 'Создать хотелку',
    wishDescription: 'Отслеживайте сбережения и планируйте покупки',
    target: 'Цель',
    saved: 'Сохранено',
    savedAmount: 'сохранено',
    // Categories
    personal: 'Личное',
    work: 'Работа',
    health: 'Здоровье',
    education: 'Образование',
    finance: 'Финансы',
    hobbies: 'Хобби',
    learning: 'Обучение',
    travel: 'Путешествия',
    entertainment: 'Развлечения',
    other: 'Другое',
    // Priorities
    low: 'Низкий',
    medium: 'Средний',
    high: 'Высокий',
    
    // Common
    loading: 'Загрузка...',
    error: 'Ошибка',
    success: 'Успех',
    errorLoadingData: 'Произошла ошибка при загрузке данных. Пожалуйста, обновите страницу.',
    refreshPage: 'Обновить страницу',
    confirm: 'Подтвердить',
    delete: 'Удалить',
    deleteForever: 'Удалить навсегда',
    deleteForeverConfirm: 'Вы уверены, что хотите навсегда удалить этот элемент? Это действие нельзя отменить.',
    edit: 'Редактировать',
    restore: 'Восстановить',
    completed: 'Завершено',
    deleted: 'Удалено',
    offline: 'Офлайн',
    undo: 'Отменить',
    dismiss: 'Закрыть',
    user: 'Пользователь',
    addGoalFailed: 'Не удалось добавить цель. Попробуйте еще раз.',
    goalDeletedForever: 'Цель удалена навсегда',
    habitDeletedForever: 'Привычка удалена навсегда',
    wishDeletedForever: 'Хотелка удалена навсегда',
    close: 'Закрыть',
    saveChanges: 'Сохранить изменения',
    cancel: 'Отмена',
    tags: 'Теги',
    description: 'Описание',
    
    // Categories
    personal: 'Личное',
    work: 'Работа',
    health: 'Здоровье',
    education: 'Образование',
    finance: 'Финансы',
    hobbies: 'Хобби',
    learning: 'Обучение',
    travel: 'Путешествия',
    entertainment: 'Развлечения',
    other: 'Другое',
    
    // Priorities
    low: 'Низкий',
    medium: 'Средний',
    high: 'Высокий',
    
    // Theme names
    light: 'Светлая',
    dark: 'Тёмная',
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
    
    // Icon translations
    icon: 'Иконка',
    iconPlaceholder: 'Выберите иконку',
    chooseIcon: 'Выбрать иконку',
    
    // Footer
    madeInRussia: 'Сделано в России',
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
