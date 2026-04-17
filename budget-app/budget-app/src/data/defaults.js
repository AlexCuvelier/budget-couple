export const FIXED_CHARGES_CATEGORIES = [
  { id: 'loyer', label: 'Loyer', icon: '🏠', group: 'logement' },
  { id: 'pret_maison', label: 'Remboursement prêt maison', icon: '🏦', group: 'logement' },
  { id: 'pret_voiture', label: 'Remboursement prêt voiture', icon: '🚗', group: 'transport' },
  { id: 'electricite', label: 'Électricité', icon: '⚡', group: 'logement' },
  { id: 'eau', label: 'Eau', icon: '💧', group: 'logement' },
  { id: 'assurance_logement', label: 'Assurance logement', icon: '🛡️', group: 'logement' },
  { id: 'assurance_voiture', label: 'Assurance voiture', icon: '🚙', group: 'transport' },
  { id: 'telephone', label: 'Téléphone(s)', icon: '📱', group: 'abonnements' },
  { id: 'telus_streaming', label: 'Telus Streaming', icon: '📺', group: 'abonnements', note: 'Inclut Netflix, Disney+ et Amazon Prime' },
  { id: 'netflix', label: 'Netflix', icon: '🎬', group: 'abonnements' },
  { id: 'disney', label: 'Disney+', icon: '✨', group: 'abonnements' },
  { id: 'amazon', label: 'Amazon Prime', icon: '📦', group: 'abonnements' },
  { id: 'spotify', label: 'Spotify', icon: '🎵', group: 'abonnements' },
  { id: 'youtube', label: 'YouTube Premium', icon: '▶️', group: 'abonnements' },
  { id: 'faceit', label: 'Faceit Premium', icon: '🎮', group: 'abonnements' },
  { id: 'claude', label: 'Claude', icon: '🤖', group: 'abonnements' },
  { id: 'chatgpt', label: 'ChatGPT', icon: '💬', group: 'abonnements' },
  { id: 'autre_fixe', label: 'Autre', icon: '•', group: 'autre' },
];

export const ALLOCATION_CATEGORIES = [
  { id: 'celi', label: 'CELI', icon: '🍁', group: 'épargne' },
  { id: 'livret_a', label: 'Livret A', icon: '🇫🇷', group: 'épargne' },
  { id: 'bourse', label: 'Bourse', icon: '📈', group: 'investissement' },
  { id: 'assurance_sante', label: 'Assurance santé privée', icon: '❤️', group: 'santé' },
  { id: 'una', label: 'Una 🐾', icon: '🐕', group: 'vie' },
  { id: 'fond_urgence', label: "Fonds d'urgence", icon: '🔐', group: 'épargne' },
  { id: 'courses', label: 'Courses', icon: '🛒', group: 'vie' },
  { id: 'essence', label: 'Essence', icon: '⛽', group: 'transport' },
  { id: 'sorties', label: 'Sorties', icon: '🍽️', group: 'loisirs' },
  { id: 'beaute', label: 'Beauté', icon: '💅', group: 'loisirs' },
  { id: 'autre_alloc', label: 'Autre', icon: '•', group: 'autre' },
];

export const defaultPersonState = (name) => ({
  name,
  salary: 0,
  otherIncomes: [],
  charges: [],
  allocations: [],
});

export const defaultCommonState = () => ({
  charges: [],
  allocations: [],
  contributionMode: 'proportional',
});

export const defaultAppState = () => ({
  alex: defaultPersonState('Alex'),
  aurelie: defaultPersonState('Aurélie'),
  commun: defaultCommonState(),
  lang: 'fr',
  lastUpdated: null,
});
