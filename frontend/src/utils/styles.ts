// Estilos base reutilizables para mantener consistencia en todo el sistema

export const baseStyles = {
  // Contenedores principales
  container: "bg-slate-800/30 backdrop-blur-sm rounded-xl shadow-sm border border-slate-700",
  cardContainer: "bg-slate-800/50 border border-slate-700 rounded-xl hover:bg-slate-800/70 hover:border-slate-600 transition-all duration-200 backdrop-blur-sm",
  
  // Headers y títulos
  headerBorder: "border-b border-slate-700",
  title: "text-xl font-semibold text-white",
  subtitle: "text-sm text-slate-300",
  sectionTitle: "text-lg font-medium text-white",
  
  // Texto
  primaryText: "text-white",
  secondaryText: "text-slate-300",
  mutedText: "text-slate-400",
  
  // Botones
  primaryButton: "inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition-colors duration-200",
  secondaryButton: "inline-flex items-center px-4 py-2 border border-slate-600 rounded-lg text-sm font-medium text-slate-300 bg-slate-700 hover:bg-slate-600 disabled:opacity-50 transition-colors duration-200",
  dangerButton: "inline-flex items-center px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium disabled:opacity-50 transition-colors duration-200",
  ghostButton: "inline-flex items-center px-3 py-2 text-sm font-medium hover:bg-slate-700/50 rounded-lg transition-colors duration-200",
  
  // Inputs
  input: "w-full px-3 py-2 border border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-slate-700/50 text-white placeholder-slate-400 backdrop-blur-sm",
  searchInput: "w-full pl-10 pr-4 py-2 border border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-slate-700/50 text-white placeholder-slate-400 backdrop-blur-sm",
  select: "w-full px-3 py-2 border border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-slate-700/50 text-white backdrop-blur-sm",
  
  // Estados y badges
  badge: {
    base: "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border",
    success: "bg-green-500/20 text-green-300 border-green-500/30",
    warning: "bg-orange-500/20 text-orange-300 border-orange-500/30",
    error: "bg-red-500/20 text-red-300 border-red-500/30",
    info: "bg-blue-500/20 text-blue-300 border-blue-500/30",
    neutral: "bg-slate-700/50 text-slate-400 border-slate-600"
  },
  
  // Tarjetas de estadísticas
  statCard: {
    base: "text-center p-4 rounded-xl backdrop-blur-sm border",
    blue: "bg-blue-500/10 border-blue-500/20",
    green: "bg-green-500/10 border-green-500/20",
    orange: "bg-orange-500/10 border-orange-500/20",
    purple: "bg-purple-500/10 border-purple-500/20",
    red: "bg-red-500/10 border-red-500/20"
  },
  
  // Íconos de colores
  iconColors: {
    blue: "text-blue-400",
    green: "text-green-400",
    orange: "text-orange-400",
    purple: "text-purple-400",
    red: "text-red-400",
    neutral: "text-slate-400"
  },
  
  // Modales
  modal: {
    overlay: "fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50",
    container: "bg-slate-800/95 backdrop-blur-sm border border-slate-700 rounded-xl shadow-xl",
    header: "px-6 py-4 border-b border-slate-700",
    body: "px-6 py-6",
    footer: "px-6 py-4 border-t border-slate-700"
  },
  
  // Dropdowns
  dropdown: {
    container: "absolute right-0 mt-2 bg-slate-800/95 backdrop-blur-md rounded-xl shadow-xl border border-slate-600 z-[60] overflow-hidden",
    item: "w-full flex items-start p-3 rounded-lg hover:bg-slate-700/70 transition-colors",
    itemActive: "bg-blue-500/20 border border-blue-500/40"
  },
  
  // Listas y elementos
  listItem: "flex items-center justify-between p-4 bg-slate-800/50 border border-slate-700 rounded-xl hover:bg-slate-800/70 transition-all duration-200 backdrop-blur-sm",
  divider: "border-t border-slate-700",
  
  // Estados de carga
  loading: "flex items-center justify-center py-12",
  empty: "text-center py-12"
};

// Utilidades para combinar clases
export const cn = (...classes: (string | undefined | null | false)[]): string => {
  return classes.filter(Boolean).join(' ');
};