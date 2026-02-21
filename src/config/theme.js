/**
 * CONFIGURACIÓN DE TEMA - Theme Configuration
 * ============================================
 * Centro de control para todos los colores y estilos visuales de la aplicación
 * Modifica aquí para cambiar la apariencia global sin tocar HTML/CSS
 *
 * Index:
 * - Paleta de Colores Primaria (Primary Colors)
 * - Colores de Fondo (Background Colors)
 * - Colores de Texto (Text Colors)
 * - Colores de Componentes (Component Colors)
 * - Sombras (Shadows)
 * - Espaciado (Spacing)
 */

export const theme = {
  // ==========================================
  // PALETA DE COLORES PRIMARIA
  // Primary Color Palette
  // ==========================================
  colors: {
    // Colores principales (Main colors)
    primary: {
      cyan: "#06b6d4", // Color principal cyan
      blue: "#3b82f6", // Color secundario azul
      purple: "#a855f7", // Color terciario púrpura
    },

    // Colores de fondo (Background colors)
    background: {
      light: "#f1f5f9", // Fondo principal claro
      viaColor: "#e0f2fe", // Color intermedio del gradiente
      white: "#ffffff", // Blanco puro
      gray50: "#f9fafb", // Gris muy claro
      gray100: "#f3f4f6", // Gris claro
    },

    // Colores de bordes (Border colors)
    border: {
      light: "#e2e8f0", // Borde claro
      medium: "#cbd5e1", // Borde medio
      dark: "#94a3b8", // Borde oscuro
    },

    // Colores de texto (Text colors)
    text: {
      primary: "#1e293b", // Texto principal oscuro
      secondary: "#64748b", // Texto secundario
      light: "#94a3b8", // Texto luz
      lighter: "#cbd5e1", // Texto muy claro
    },

    // Colores de estado (State colors)
    state: {
      success: "#10b981", // Verde éxito
      error: "#ef4444", // Rojo error
      warning: "#f59e0b", // Naranja advertencia
      info: "#0ea5e9", // Azul información
    },

    // Colores de componentes específicos (Component specific colors)
    components: {
      headerBg: "rgba(255, 255, 255, 0.8)",
      sidebarBg: "rgba(255, 255, 255, 1)",
      noteBg: "#ffffff",
      iaPanelBg: "rgba(219, 234, 254, 0.5)",
      selectedNoteBg: "rgba(6, 182, 212, 0.1)",
      selectedNoteBorder: "rgba(6, 182, 212, 0.5)",
    },
  },

  // ==========================================
  // GRADIENTES
  // Gradients
  // ==========================================
  gradients: {
    background:
      "linear-gradient(135deg, #f1f5f9 0%, #e0f2fe 50%, #f1f5f9 100%)",
    buttonPrimary: "linear-gradient(to right, #06b6d4, #0ea5e9)",
    buttonHover: "linear-gradient(to right, #0891b2, #0284c7)",
    scrollbar: "linear-gradient(180deg, #06b6d4, #3b82f6)",
    scrollbarHover: "linear-gradient(180deg, #0891b2, #2563eb)",
    headerTitle: "linear-gradient(to right, #06b6d4, #3b82f6, #a855f7)",
    filterButtonActive: "linear-gradient(to right, #06b6d4, #0ea5e9)",
    selectedNoteGradient: "linear-gradient(to right, #cffafe, #bfdbfe)",
    iaPanelGradient:
      "linear-gradient(135deg, rgba(219, 234, 254, 0.5), rgba(243, 232, 255, 0.5))",
  },

  // ==========================================
  // SOMBRAS (SHADOWS)
  // ==========================================
  shadows: {
    sm: "0 1px 2px rgba(0, 0, 0, 0.05)",
    base: "0 1px 3px rgba(0, 0, 0, 0.1)",
    md: "0 4px 6px rgba(0, 0, 0, 0.07)",
    lg: "0 10px 15px rgba(0, 0, 0, 0.1)",
    xl: "0 10px 25px rgba(6, 182, 212, 0.15)",
    inner: "inset 0 2px 4px rgba(0, 0, 0, 0.05)",
    glow: "0 0 20px rgba(6, 182, 212, 0.6)",
  },

  // ==========================================
  // ESPACIADO (SPACING)
  // ==========================================
  spacing: {
    xs: "4px",
    sm: "8px",
    md: "12px",
    lg: "16px",
    xl: "24px",
    xxl: "32px",
  },

  // ==========================================
  // BORDES (BORDERS)
  // ==========================================
  radius: {
    sm: "6px",
    md: "8px",
    lg: "12px",
    xl: "16px",
    full: "9999px",
  },

  // ==========================================
  // DIMENSIONES (DIMENSIONS)
  // ==========================================
  dimensions: {
    sidebarWidth: "256px", // 16rem / w-64
    rightPanelWidth: "320px", // w-80
    headerHeight: "80px", // Altura del header
  },

  // ==========================================
  // TRANSICIONES (TRANSITIONS)
  // ==========================================
  transitions: {
    fast: "150ms ease",
    base: "200ms ease",
    slow: "300ms ease",
    slower: "500ms ease",
  },

  // ==========================================
  // BREAKPOINTS (PUNTOS DE QUIEBRE RESPONSIVE)
  // ==========================================
  breakpoints: {
    sm: "640px",
    md: "768px",
    lg: "1024px",
    xl: "1280px",
    xxl: "1536px",
  },
};

/**
 * FUNCIONES DE UTILIDAD PARA EL TEMA
 * Theme Utilities
 */
export const themeUtils = {
  /**
   * Obtiene un color de la paleta
   * @param {string} path - Ruta del color (ej: 'colors.primary.cyan')
   * @returns {string} Valor del color
   */
  getColor: (path) => {
    const keys = path.split(".");
    let value = theme;
    for (const key of keys) {
      value = value[key];
    }
    return value;
  },

  /**
   * Mezcla dos colores con opacidad
   * @param {string} color - Color en hex
   * @param {number} alpha - Opacidad 0-1
   * @returns {string} Color RGBA
   */
  withAlpha: (color, alpha) => {
    const hex = color.replace("#", "");
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  },
};

export default theme;
