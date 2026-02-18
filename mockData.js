// Моковые данные
export const initialTechPlaces = [
  // Опора (Support/Pole)
  {
    id: 1,
    name: 'Опора П-1',
    type: 'Опора',
    stages: [
      { 
        id: 1, 
        name: 'Визуальный осмотр', 
        inspected: true,
        defects: [
          { id: 1, name: 'Коррозия металлических элементов', severity: 'medium', photos: [], comment: 'Требуется обработка антикоррозийным составом', date: '2026-01-15', status: 'new' },
          { id: 2, name: 'Механические повреждения', severity: 'none', photos: [], comment: '', date: '2026-01-15', status: 'new' },
          { id: 3, name: 'Трещины в бетоне', severity: 'high', photos: [], comment: 'Критическое состояние', date: '2026-01-15', status: 'repeat' },
        ]
      },
      { 
        id: 2, 
        name: 'Проверка фундамента', 
        inspected: true,
        defects: [
          { id: 4, name: 'Осадка фундамента', severity: 'low', photos: [], comment: 'Не критично', date: '2026-01-16', status: 'new' },
          { id: 5, name: 'Разрушение бетона', severity: 'none', photos: [], comment: '', date: '2026-01-16', status: 'new' },
        ]
      },
      { 
        id: 3, 
        name: 'Проверка заземления', 
        inspected: false,
        defects: [
          { id: 6, name: 'Обрыв заземляющего проводника', severity: 'none', photos: [], comment: '', date: '2026-01-17', status: 'new' },
          { id: 7, name: 'Коррозия заземлителей', severity: 'none', photos: [], comment: '', date: '2026-01-17', status: 'new' },
        ]
      },
      { 
        id: 4, 
        name: 'Проверка креплений', 
        inspected: false,
        defects: [
          { id: 8, name: 'Ослабление болтовых соединений', severity: 'none', photos: [], comment: '', date: '2026-01-17', status: 'new' },
        ]
      },
    ]
  },
  {
    id: 2,
    name: 'Опора П-2',
    type: 'Опора',
    stages: [
      { 
        id: 5, 
        name: 'Визуальный осмотр', 
        inspected: false,
        defects: [
          { id: 9, name: 'Коррозия металлических элементов', severity: 'none', photos: [], comment: '', date: '2026-01-18', status: 'new' },
          { id: 10, name: 'Механические повреждения', severity: 'none', photos: [], comment: '', date: '2026-01-18', status: 'new' },
        ]
      },
      { 
        id: 6, 
        name: 'Проверка фундамента', 
        inspected: false,
        defects: [
          { id: 11, name: 'Осадка фундамента', severity: 'none', photos: [], comment: '', date: '2026-01-18', status: 'new' },
        ]
      },
    ]
  },

  // Пролет (Span)
  {
    id: 3,
    name: 'Пролет П-1 - П-2',
    type: 'Пролет',
    stages: [
      { 
        id: 7, 
        name: 'Проверка стрелы провеса', 
        inspected: true,
        defects: [
          { id: 12, name: 'Превышение нормы провеса', severity: 'low', photos: [], comment: 'В пределах допуска', date: '2026-01-19', status: 'new' },
        ]
      },
      { 
        id: 8, 
        name: 'Проверка натяжения проводов', 
        inspected: true,
        defects: [
          { id: 13, name: 'Недостаточное натяжение', severity: 'medium', photos: [], comment: 'Требуется регулировка', date: '2026-01-19', status: 'repeat' },
          { id: 14, name: 'Повреждение провода', severity: 'none', photos: [], comment: '', date: '2026-01-19', status: 'new' },
        ]
      },
      { 
        id: 9, 
        name: 'Осмотр изоляторов', 
        inspected: false,
        defects: [
          { id: 15, name: 'Загрязнение изоляторов', severity: 'low', photos: [], comment: '', date: '2026-01-20', status: 'new' },
          { id: 16, name: 'Трещины на изоляторах', severity: 'none', photos: [], comment: '', date: '2026-01-20', status: 'new' },
        ]
      },
      { 
        id: 10, 
        name: 'Проверка габаритов', 
        inspected: false,
        defects: [
          { id: 17, name: 'Недостаточный габарит до земли', severity: 'none', photos: [], comment: '', date: '2026-01-20', status: 'new' },
        ]
      },
    ]
  },

  // Кабельная вставка (Cable Insert)
  {
    id: 4,
    name: 'Кабельная вставка КВ-1',
    type: 'Кабельная вставка',
    stages: [
      { 
        id: 11, 
        name: 'Проверка оболочки', 
        inspected: true,
        defects: [
          { id: 18, name: 'Механические повреждения оболочки', severity: 'high', photos: [], comment: 'Требуется ремонт', date: '2026-01-21', status: 'new' },
          { id: 19, name: 'Коррозия брони', severity: 'low', photos: [], comment: 'Поверхностная коррозия', date: '2026-01-21', status: 'repeat' },
        ]
      },
      { 
        id: 12, 
        name: 'Проверка концевых муфт', 
        inspected: true,
        defects: [
          { id: 20, name: 'Нагрев концевой муфты', severity: 'medium', photos: [], comment: 'Превышение температуры на 15°С', date: '2026-01-21', status: 'new' },
        ]
      },
      { 
        id: 13, 
        name: 'Измерение сопротивления изоляции', 
        inspected: false,
        defects: [
          { id: 21, name: 'Низкое сопротивление изоляции', severity: 'none', photos: [], comment: '', date: '2026-01-22', status: 'new' },
        ]
      },
      { 
        id: 14, 
        name: 'Проверка заземления', 
        inspected: false,
        defects: [
          { id: 22, name: 'Отсутствие заземления', severity: 'none', photos: [], comment: '', date: '2026-01-22', status: 'new' },
        ]
      },
    ]
  },

  // Ответвление (Branch)
  {
    id: 5,
    name: 'Ответвление О-1',
    type: 'Ответвление',
    stages: [
      { 
        id: 15, 
        name: 'Проверка соединений', 
        inspected: true,
        defects: [
          { id: 23, name: 'Окисление контактов', severity: 'medium', photos: [], comment: 'Требуется зачистка', date: '2026-01-23', status: 'repeat' },
          { id: 24, name: 'Ослабление контактного соединения', severity: 'high', photos: [], comment: 'Риск перегрева', date: '2026-01-23', status: 'new' },
        ]
      },
      { 
        id: 16, 
        name: 'Проверка изоляции', 
        inspected: true,
        defects: [
          { id: 25, name: 'Повреждение изоляции', severity: 'low', photos: [], comment: 'Не критично', date: '2026-01-23', status: 'new' },
        ]
      },
      { 
        id: 17, 
        name: 'Проверка креплений', 
        inspected: false,
        defects: [
          { id: 26, name: 'Ослабление крепления', severity: 'none', photos: [], comment: '', date: '2026-01-24', status: 'new' },
        ]
      },
    ]
  },

  // РУ-ВН (HV Switchgear)
  {
    id: 6,
    name: 'РУ-10кВ секция 1',
    type: 'РУ-ВН',
    stages: [
      { 
        id: 18, 
        name: 'Проверка разъединителей', 
        inspected: true,
        defects: [
          { id: 27, name: 'Неполное включение/отключение', severity: 'high', photos: [], comment: 'Требуется ремонт привода', date: '2026-01-25', status: 'new' },
          { id: 28, name: 'Износ контактов', severity: 'medium', photos: [], comment: 'Предельный износ', date: '2026-01-25', status: 'repeat' },
        ]
      },
      { 
        id: 19, 
        name: 'Проверка выключателей', 
        inspected: true,
        defects: [
          { id: 29, name: 'Утечка масла', severity: 'low', photos: [], comment: 'Долить масло', date: '2026-01-25', status: 'new' },
          { id: 30, name: 'Неисправность привода', severity: 'none', photos: [], comment: '', date: '2026-01-25', status: 'new' },
        ]
      },
      { 
        id: 20, 
        name: 'Проверка ОПН', 
        inspected: false,
        defects: [
          { id: 31, name: 'Повреждение ОПН', severity: 'none', photos: [], comment: '', date: '2026-01-26', status: 'new' },
          { id: 32, name: 'Отсутствие пломбы', severity: 'low', photos: [], comment: '', date: '2026-01-26', status: 'new' },
        ]
      },
      { 
        id: 21, 
        name: 'Проверка шин', 
        inspected: false,
        defects: [
          { id: 33, name: 'Перегрев шин', severity: 'none', photos: [], comment: '', date: '2026-01-26', status: 'new' },
          { id: 34, name: 'Механическое повреждение', severity: 'none', photos: [], comment: '', date: '2026-01-26', status: 'new' },
        ]
      },
      { 
        id: 22, 
        name: 'Проверка заземления', 
        inspected: false,
        defects: [
          { id: 35, name: 'Обрыв заземления', severity: 'none', photos: [], comment: '', date: '2026-01-26', status: 'new' },
        ]
      },
    ]
  },

  // РУ-НН (LV Switchgear)
  {
    id: 7,
    name: 'РУ-0.4кВ секция 1',
    type: 'РУ-НН',
    stages: [
      { 
        id: 23, 
        name: 'Проверка шин', 
        inspected: true,
        defects: [
          { id: 36, name: 'Окисление контактов', severity: 'low', photos: [], comment: 'Требуется зачистка', date: '2026-01-27', status: 'repeat' },
          { id: 37, name: 'Перегрев шин', severity: 'medium', photos: [], comment: 'Превышение температуры на 20°С', date: '2026-01-27', status: 'new' },
        ]
      },
      { 
        id: 24, 
        name: 'Проверка автоматических выключателей', 
        inspected: true,
        defects: [
          { id: 38, name: 'Не срабатывает расцепитель', severity: 'high', photos: [], comment: 'Требуется замена', date: '2026-01-27', status: 'new' },
        ]
      },
      { 
        id: 25, 
        name: 'Проверка предохранителей', 
        inspected: false,
        defects: [
          { id: 39, name: 'Перегоревший предохранитель', severity: 'none', photos: [], comment: '', date: '2026-01-28', status: 'new' },
        ]
      },
      { 
        id: 26, 
        name: 'Проверка состояния шкафа', 
        inspected: false,
        defects: [
          { id: 40, name: 'Коррозия корпуса', severity: 'low', photos: [], comment: 'Поверхностная', date: '2026-01-28', status: 'new' },
          { id: 41, name: 'Нарушение уплотнений', severity: 'low', photos: [], comment: '', date: '2026-01-28', status: 'new' },
        ]
      },
      { 
        id: 27, 
        name: 'Проверка изоляции', 
        inspected: false,
        defects: [
          { id: 42, name: 'Низкое сопротивление изоляции', severity: 'none', photos: [], comment: '', date: '2026-01-28', status: 'new' },
        ]
      },
    ]
  },

  // Кабельная муфта (Cable Coupling)
  {
    id: 8,
    name: 'Кабельная муфта КМ-1',
    type: 'Кабельная муфта',
    stages: [
      { 
        id: 28, 
        name: 'Внешний осмотр муфты', 
        inspected: true,
        defects: [
          { id: 43, name: 'Механическое повреждение', severity: 'high', photos: [], comment: 'Нарушена герметичность', date: '2026-01-29', status: 'new' },
          { id: 44, name: 'Трещины на корпусе', severity: 'medium', photos: [], comment: '', date: '2026-01-29', status: 'repeat' },
        ]
      },
      { 
        id: 29, 
        name: 'Проверка герметичности', 
        inspected: true,
        defects: [
          { id: 45, name: 'Утечка компаунда', severity: 'low', photos: [], comment: 'Не критично', date: '2026-01-29', status: 'new' },
          { id: 46, name: 'Нарушение уплотнений', severity: 'medium', photos: [], comment: 'Требуется подтяжка', date: '2026-01-29', status: 'new' },
        ]
      },
      { 
        id: 30, 
        name: 'Измерение сопротивления изоляции', 
        inspected: false,
        defects: [
          { id: 47, name: 'Низкое сопротивление изоляции', severity: 'none', photos: [], comment: '', date: '2026-01-30', status: 'new' },
        ]
      },
      { 
        id: 31, 
        name: 'Проверка заземления', 
        inspected: false,
        defects: [
          { id: 48, name: 'Отсутствие заземления экрана', severity: 'none', photos: [], comment: '', date: '2026-01-30', status: 'new' },
        ]
      },
    ]
  },
  {
    id: 9,
    name: 'Кабельная муфта КМ-2',
    type: 'Кабельная муфта',
    stages: [
      { 
        id: 32, 
        name: 'Внешний осмотр муфты', 
        inspected: false,
        defects: [
          { id: 49, name: 'Механическое повреждение', severity: 'none', photos: [], comment: '', date: '2026-01-31', status: 'new' },
        ]
      },
      { 
        id: 33, 
        name: 'Проверка герметичности', 
        inspected: false,
        defects: [
          { id: 50, name: 'Утечка компаунда', severity: 'none', photos: [], comment: '', date: '2026-01-31', status: 'new' },
        ]
      },
    ]
  },
];
