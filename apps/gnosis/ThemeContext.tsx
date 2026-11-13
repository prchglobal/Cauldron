import { useTheme as useSharedTheme } from '../../shared/ThemeContext';
export { ThemeProvider } from '../../shared/ThemeContext';

export function useTheme() {
  const theme = useSharedTheme();
  const accentColor = theme.isDarkMode ? '#ef4444' : '#3b82f6';
  return { ...theme, accentColor };
}
