export const API_URL = import.meta.env.VITE_API_URL || '/api'

export const PAYMENT_MODE = import.meta.env.VITE_PAYMENT_MODE || 'test' // 'test' or 'live'

export const CATEGORIES = [
  { slug: 'hosting-samp', icon: 'Server', type: 'hosting' },
  { slug: 'hosting-bot', icon: 'Bot', type: 'hosting' },
  { slug: 'developer-bot', icon: 'Code', type: 'developer' },
  { slug: 'developer-package', icon: 'Package', type: 'developer' },
  { slug: 'minecraft-skin', icon: 'Paintbrush', type: 'design' },
  { slug: 'hosting-minecraft', icon: 'Cube', type: 'hosting' },
  { slug: 'custom-script', icon: 'FileCode', type: 'developer' },
  { slug: 'server-rental', icon: 'Server', type: 'hosting' },
  { slug: 'server-bundle', icon: 'Layers', type: 'bundle' },
]

export const HOSTING_OPTIONS = {
  cpu: {
    min: 1,
    max: 8,
    step: 1,
    pricePerUnit: 25000,
    unit: 'vCPU',
  },
  ram: {
    min: 512,
    max: 16384,
    step: 512,
    pricePerUnit: 15000,
    unit: 'MB',
  },
  storage: {
    min: 5,
    max: 100,
    step: 5,
    pricePerUnit: 5000,
    unit: 'GB',
  },
}

export const DEVELOPER_OPTIONS = {
  duration: {
    options: [
      { value: 3, label: '3 Days', labelId: '3 Hari', multiplier: 1 },
      { value: 7, label: '7 Days', labelId: '7 Hari', multiplier: 0.9 },
      { value: 14, label: '14 Days', labelId: '14 Hari', multiplier: 0.8 },
      { value: 30, label: '30 Days', labelId: '30 Hari', multiplier: 0.7 },
    ],
  },
  requests: {
    min: 1,
    max: 10,
    pricePerUnit: 50000,
  },
  complexity: {
    options: [
      { value: 'simple', label: 'Simple', labelId: 'Sederhana', multiplier: 1 },
      { value: 'medium', label: 'Medium', labelId: 'Menengah', multiplier: 1.5 },
      { value: 'complex', label: 'Complex', labelId: 'Kompleks', multiplier: 2.5 },
      { value: 'advanced', label: 'Advanced', labelId: 'Lanjutan', multiplier: 4 },
    ],
  },
  basePrice: 150000,
}
