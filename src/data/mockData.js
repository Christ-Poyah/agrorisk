export const CROPS = [
  { id: 'mais',     label: 'Maïs',     color: '#CA8A04', image: require('../assets/images/mais.png') },
  { id: 'riz',      label: 'Riz',      color: '#0891B2', image: require('../assets/images/riz.png') },
  { id: 'cacao',    label: 'Cacao',    color: '#92400E', image: require('../assets/images/cacao.png') },
  { id: 'cafe',     label: 'Café',     color: '#3F3F46', image: require('../assets/images/cafe.png') },
  { id: 'manioc',   label: 'Manioc',   color: '#65A30D', image: require('../assets/images/manioc.png') },
  { id: 'igname',   label: 'Igname',   color: '#B45309', image: require('../assets/images/igname.png') },
  { id: 'coton',    label: 'Coton',    color: '#6D28D9', image: require('../assets/images/coton.png') },
  { id: 'arachide', label: 'Arachide', color: '#C2410C', image: require('../assets/images/arrachide.png') },
  { id: 'sorgho',   label: 'Sorgho',   color: '#B45309', image: require('../assets/images/sorgo.png') },
  { id: 'tomate',   label: 'Tomate',   color: '#DC2626', image: require('../assets/images/tomate.png') },
  { id: 'autre',    label: 'Autre',    color: '#6B7280', image: null },
];

export const REGIONS = [
  'Abidjan', 'Yamoussoukro', 'Bouaké', 'Daloa', 'Korhogo',
  'Man', 'Divo', 'Gagnoa', 'San-Pédro', 'Abengourou',
  'Bondoukou', 'Soubré', 'Agboville', 'Adzopé', 'Touba',
  'Odienné', 'Bongouanou', 'Dimbokro', 'Séguéla', 'Mankono',
  'Zuénoula', 'Sassandra', 'Tabou', 'Ferkessédougou', 'Katiola',
  'Tiassalé', 'Issia', 'Grand-Bassam', 'Tiébissou', 'Lakota',
];

export const INITIAL_PLANTATIONS = [
  {
    id: '1',
    name: 'Plantation Kofi Sud',
    crop: 'mais',
    cropLabel: 'Maïs',
    cropColor: '#CA8A04',
    region: 'Yamoussoukro',
    area: 2.5,
    plantingDate: '2024-03-15',
    status: 'actif',
    riskLevel: 'modere',
    risks: {
      secheresse: { level: 'modere', score: 52, trend: 'up' },
      inondation: { level: 'faible', score: 18, trend: 'stable' },
      criquets:   { level: 'eleve',  score: 71, trend: 'up' },
    },
    weather: { temp: 30, humidity: 62, rainfall: 45, windSpeed: 14 },
    insurance: {
      active: true, coverage: 850000, premium: 42500,
      smartContract: '0x7f3a...b4e2', triggered: false,
    },
    lastScan: '2024-06-25T08:30:00',
    aiPrediction: {
      summary: 'Risque sécheresse en hausse. Invasion criquets possible à 68% dans 30 jours.',
      recommendation: 'Irriguer dans les 48h. Préparer insecticides préventifs.',
    },
  },
  {
    id: '2',
    name: 'Rizière Ama',
    crop: 'riz',
    cropLabel: 'Riz',
    cropColor: '#0891B2',
    region: 'Bouaké',
    area: 1.8,
    plantingDate: '2024-04-02',
    status: 'actif',
    riskLevel: 'eleve',
    risks: {
      secheresse: { level: 'faible', score: 22,  trend: 'down' },
      inondation: { level: 'eleve',  score: 78,  trend: 'up' },
      criquets:   { level: 'modere', score: 45,  trend: 'stable' },
    },
    weather: { temp: 27, humidity: 85, rainfall: 180, windSpeed: 22 },
    insurance: {
      active: true, coverage: 680000, premium: 34000,
      smartContract: '0x2c9d...f7a1', triggered: true, triggerAmount: 120000,
    },
    lastScan: '2024-06-25T09:15:00',
    aiPrediction: {
      summary: 'Risque inondation critique — 180mm de pluie en 72h prévus.',
      recommendation: 'Vérifier drains. Indemnisation smart contract déclenchée automatiquement.',
    },
  },
  {
    id: '3',
    name: 'Cacaoyère Koffi',
    crop: 'cacao',
    cropLabel: 'Cacao',
    cropColor: '#92400E',
    region: 'Daloa',
    area: 4.2,
    plantingDate: '2023-09-10',
    status: 'actif',
    riskLevel: 'faible',
    risks: {
      secheresse: { level: 'faible', score: 15, trend: 'stable' },
      inondation: { level: 'faible', score: 12, trend: 'stable' },
      criquets:   { level: 'faible', score: 8,  trend: 'down' },
    },
    weather: { temp: 26, humidity: 74, rainfall: 88, windSpeed: 10 },
    insurance: { active: false, coverage: 0, premium: 0, smartContract: null, triggered: false },
    lastScan: '2024-06-24T14:00:00',
    aiPrediction: {
      summary: 'Conditions optimales. Aucun risque majeur détecté.',
      recommendation: 'Envisager une assurance avant la saison des pluies.',
    },
  },
];

export const INITIAL_ALERTS = [
  {
    id: 'a1', type: 'criquets', severity: 'critique',
    title: 'Invasion de criquets détectée',
    message: 'Un essaim localisé à 45km au nord de Yamoussoukro. Déplacement prévu dans 24–48h.',
    region: 'Yamoussoukro', timestamp: '2024-06-25T06:00:00',
    read: false, actionRequired: true, smartContractTriggered: false,
  },
  {
    id: 'a2', type: 'inondation', severity: 'eleve',
    title: 'Risque inondation élevé',
    message: 'Précipitations cumulées 180mm en 72h prévues. Risque de submersion pour zones basses.',
    region: 'Bouaké', timestamp: '2024-06-25T07:30:00',
    read: false, actionRequired: true, smartContractTriggered: true, indemnisation: 120000,
  },
  {
    id: 'a3', type: 'secheresse', severity: 'modere',
    title: 'Déficit hydrique détecté',
    message: 'Précipitations 40% en dessous de la normale sur images satellites. Irrigation recommandée.',
    region: 'Yamoussoukro', timestamp: '2024-06-24T15:00:00',
    read: true, actionRequired: true, smartContractTriggered: false,
  },
  {
    id: 'a4', type: 'meteo', severity: 'info',
    title: 'Conditions favorables cette semaine',
    message: 'Pluies modérées prévues sur Daloa. Conditions idéales pour la floraison du cacao.',
    region: 'Daloa', timestamp: '2024-06-24T10:00:00',
    read: true, actionRequired: false, smartContractTriggered: false,
  },
];

export const WEATHER_DATA = {
  temp: 29, feelsLike: 32, humidity: 68,
  rainfall: 12, windSpeed: 16, uvIndex: 7,
  condition: 'Partiellement nuageux',
  forecast: [
    { day: 'Auj.', high: 31, low: 22, rain: 20, sunny: true },
    { day: 'Dem.',  high: 27, low: 20, rain: 75, sunny: false },
    { day: 'Mar.',  high: 25, low: 19, rain: 80, sunny: false },
    { day: 'Mer.',  high: 28, low: 21, rain: 40, sunny: false },
    { day: 'Jeu.',  high: 33, low: 23, rain: 5,  sunny: true },
  ],
};
