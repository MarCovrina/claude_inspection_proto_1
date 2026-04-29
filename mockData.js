// Моковые данные
// Список мероприятий для устранения дефектов
export const remediationMeasures = [
  { id: 1, name: 'Замена оборудования', category: 'replacement' },
  { id: 2, name: 'Ремонт оборудования', category: 'repair' },
  { id: 3, name: 'Восстановление изоляции', category: 'repair' },
  { id: 4, name: 'Установка дополнительной изоляции', category: 'installation' },
  { id: 5, name: 'Замена изоляторов', category: 'replacement' },
  { id: 6, name: 'Очистка от загрязнений', category: 'maintenance' },
  { id: 7, name: 'Подтяжка креплений', category: 'maintenance' },
  { id: 8, name: 'Замена заземляющего проводника', category: 'replacement' },
  { id: 9, name: 'Антикоррозийная обработка', category: 'treatment' },
  { id: 10, name: 'Замена металлических элементов', category: 'replacement' },
  { id: 11, name: 'Восстановление бетона', category: 'repair' },
  { id: 12, name: 'Усиление фундамента', category: 'repair' },
  { id: 13, name: 'Регулировка натяжения проводов', category: 'adjustment' },
  { id: 14, name: 'Замена провода', category: 'replacement' },
  { id: 15, name: 'Замена концевой муфты', category: 'replacement' },
  { id: 16, name: 'Доливка масла', category: 'maintenance' },
  { id: 17, name: 'Замена выключателя', category: 'replacement' },
  { id: 18, name: 'Ремонт контактных соединений', category: 'repair' },
  { id: 19, name: 'Установка предупреждающих знаков', category: 'installation' },
  { id: 20, name: 'Тепловизионный контроль', category: 'diagnostics' },
];

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
        inspected: false,
        defects: [
          { id: 1, name: 'Коррозия металлических элементов', severity: 'none', photos: [], comment: '', date: '2026-01-15', status: 'new' },
          { id: 2, name: 'Механические повреждения', severity: 'none', photos: [], comment: '', date: '2026-01-15', status: 'new' },
          { id: 3, name: 'Трещины в бетоне', severity: 'none', photos: [], comment: '', date: '2026-01-15', status: 'new' },
        ]
      },
      { 
        id: 2, 
        name: 'Проверка фундамента', 
        inspected: false,
        defects: [
          { id: 4, name: 'Осадка фундамента', severity: 'none', photos: [], comment: '', date: '2026-01-16', status: 'new' },
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
        inspected: false,
        defects: [
          { id: 12, name: 'Превышение нормы провеса', severity: 'none', photos: [], comment: '', date: '2026-01-19', status: 'new' },
        ]
      },
      { 
        id: 8, 
        name: 'Проверка натяжения проводов', 
        inspected: false,
        defects: [
          { id: 13, name: 'Недостаточное натяжение', severity: 'none', photos: [], comment: '', date: '2026-01-19', status: 'new' },
          { id: 14, name: 'Повреждение провода', severity: 'none', photos: [], comment: '', date: '2026-01-19', status: 'new' },
        ]
      },
      { 
        id: 9, 
        name: 'Осмотр изоляторов', 
        inspected: false,
        defects: [
          { id: 15, name: 'Загрязнение изоляторов', severity: 'none', photos: [], comment: '', date: '2026-01-20', status: 'new' },
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
        inspected: false,
        defects: [
          { id: 18, name: 'Механические повреждения оболочки', severity: 'none', photos: [], comment: '', date: '2026-01-21', status: 'new' },
          { id: 19, name: 'Коррозия брони', severity: 'none', photos: [], comment: '', date: '2026-01-21', status: 'new' },
        ]
      },
      { 
        id: 12, 
        name: 'Проверка концевых муфт', 
        inspected: false,
        defects: [
          { id: 20, name: 'Нагрев концевой муфты', severity: 'none', photos: [], comment: '', date: '2026-01-21', status: 'new' },
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

  // Трансформаторная подстанция (Transformer Substation)
  {
    id: 5,
    name: 'Подстанция ПС-15',
    type: 'Подстанция',
    stages: [
      { 
        id: 15, 
        name: 'Осмотр трансформатора', 
        inspected: false,
        defects: [
          { id: 23, name: 'Течь масла', severity: 'none', photos: [], comment: '', date: '2026-01-23', status: 'new' },
          { id: 24, name: 'Перегрев трансформатора', severity: 'none', photos: [], comment: '', date: '2026-01-23', status: 'new' },
        ]
      },
      { 
        id: 16, 
        name: 'Проверка РУ', 
        inspected: false,
        defects: [
          { id: 25, name: 'Неисправность выключателя', severity: 'none', photos: [], comment: '', date: '2026-01-23', status: 'new' },
        ]
      },
    ]
  },

  // Распределительный пункт (Distribution Point)
  {
    id: 6,
    name: 'Распределительный пункт РП-3',
    type: 'Распределительный пункт',
    stages: [
      { 
        id: 17, 
        name: 'Осмотр оборудования', 
        inspected: false,
        defects: [
          { id: 26, name: 'Загрязнение изоляторов', severity: 'none', photos: [], comment: '', date: '2026-01-24', status: 'new' },
          { id: 27, name: 'Коррозия металлических частей', severity: 'none', photos: [], comment: '', date: '2026-01-24', status: 'new' },
        ]
      },
      { 
        id: 18, 
        name: 'Проверка заземляющего устройства', 
        inspected: false,
        defects: [
          { id: 28, name: 'Обрыв заземляющего проводника', severity: 'none', photos: [], comment: '', date: '2026-01-24', status: 'new' },
        ]
      },
    ]
  },
];
