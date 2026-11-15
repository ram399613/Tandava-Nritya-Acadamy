export function formatCurrency(amount) {
  if (amount === null || amount === undefined || isNaN(amount)) return '₹0';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function formatTime(timeString) {
  if (!timeString) return '';
  return timeString;
}

export function getInitials(name) {
  if (!name) return 'DA';
  const parts = name.trim().split(' ');
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}

export const DANCE_CATEGORIES = [
  
  { value: 'bharatanatyam', label: '1. Bharatanatyam', color: '#ef4444', icon: '🪔', svgIcon: '/icons/bharatanatyam.svg', photo: '/images/bharatanatyam.jpg' },
  { value: 'kathak', label: '2. Kathak', color: '#f59e0b', icon: '🕉️', svgIcon: '/icons/kathak.svg', photo: '/images/kathak.jpg' },
  { value: 'odissi', label: '3. Odissi', color: '#ec4899', icon: '🌸', svgIcon: '/icons/odissi.svg', photo: '/images/odissi.jpg' },
  { value: 'kathakali', label: '4. Kathakali', color: '#10b981', icon: '🎭', svgIcon: '/icons/kathakali.svg', photo: '/images/kathakali.jpg' },
  { value: 'kuchipudi', label: '5. Kuchipudi', color: '#8b5cf6', icon: '✨', svgIcon: '/icons/kuchipudi.svg', photo: '/images/kuchipudi.jpg' },
  { value: 'mohiniyattam', label: '6. Mohiniyattam', color: '#eab308', icon: '🌾', svgIcon: '/icons/mohiniyattam.svg', photo: '/images/mohiniyattam.jpg' },
  { value: 'manipuri', label: '7. Manipuri', color: '#06b6d4', icon: '🕊️', svgIcon: '/icons/manipuri.svg', photo: '/images/manipuri.jpg' },
  { value: 'sattriya', label: '8. Sattriya', color: '#f97316', icon: '📜', svgIcon: '/icons/sattriya.svg', photo: '/images/sattriya.jpg' },

  
  { value: 'hip-hop', label: 'Hip-Hop & Urban', color: '#8b5cf6', icon: '🔥', svgIcon: '/icons/hiphop.svg', photo: '/images/hiphop.jpg' },
  { value: 'ballet', label: 'Classical Russian Ballet & Pointe', color: '#f472b6', icon: '🩰', svgIcon: '/icons/ballet.svg', photo: '/images/ballet.jpg' },
  { value: 'contemporary', label: 'Contemporary Movement & Flow', color: '#3b82f6', icon: '🌊', svgIcon: '/icons/contemporary.svg', photo: '/images/contemporary.jpg' },
  { value: 'salsa', label: 'Salsa Cubana & Sensual Bachata', color: '#f43f5e', icon: '💃', svgIcon: '/icons/salsa.svg', photo: '/images/salsa.jpg' },
  { value: 'jazz', label: 'Jazz Funk & Commercial Stage', color: '#10b981', icon: '🎷', svgIcon: '/icons/jazz.svg', photo: '/images/jazz.jpg' },
  { value: 'breaking', label: 'Street Breaking & Power Moves', color: '#6366f1', icon: '⚡', svgIcon: '/icons/breakdance.svg', photo: '/images/breakdance.jpg' },
  { value: 'afro', label: 'Afrobeats & Dancehall Grooves', color: '#eab308', icon: '🌴', svgIcon: '/icons/afrobeat.svg', photo: '/images/afrobeat.jpg' },
  { value: 'freestyle', label: 'Freestyle Fusion & Battle Cypher', color: '#06b6d4', icon: '🌪️', svgIcon: '/icons/freestyle.svg', photo: '/images/freestyle.jpg' },
  { value: 'flamenco', label: 'Spanish Flamenco & Zapateado', color: '#e11d48', icon: '🌹', svgIcon: '/icons/flamenco.svg', photo: '/images/flamenco.jpg' },
  { value: 'tango', label: 'Argentine Tango & Milonga', color: '#be123c', icon: '🕺', svgIcon: '/icons/tango.svg', photo: '/images/tango.jpg' },
  { value: 'bellydance', label: 'Oriental Belly Dance & Silk Veil', color: '#a855f7', icon: '✨', svgIcon: '/icons/bellydance.svg', photo: '/images/bellydance.jpg' },
  { value: 'aerial', label: 'Aerial Silks & Acrobatics', color: '#38bdf8', icon: '🎪', svgIcon: '/icons/aerial.svg', photo: '/images/aerial.jpg' },
  { value: 'tap', label: 'Tap Dance Rhythm & Percussion', color: '#f97316', icon: '👞', svgIcon: '/icons/tap.svg', photo: '/images/tap.jpg' },
  { value: 'classical', label: 'Royal Classical Conservatory', color: '#fbbf24', icon: '👑', svgIcon: '/icons/classical.svg', photo: '/images/classical.jpg' },
];

export const DAYS_OF_WEEK = [
  { value: 'monday', label: 'Monday' },
  { value: 'tuesday', label: 'Tuesday' },
  { value: 'wednesday', label: 'Wednesday' },
  { value: 'thursday', label: 'Thursday' },
  { value: 'friday', label: 'Friday' },
  { value: 'saturday', label: 'Saturday' },
  { value: 'sunday', label: 'Sunday' },
];
