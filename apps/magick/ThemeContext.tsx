import { useTheme as useSharedTheme } from '../../shared/ThemeContext';
export { ThemeProvider } from '../../shared/ThemeContext';

export function useTheme() {
  const theme = useSharedTheme();
  const accentColor = theme.isDarkMode ? '#C41E3A' : '#0099CC';
  const colors = {
    background: theme.isDarkMode ? '#1a1a1a' : '#fff',
    text: theme.isDarkMode ? '#fff' : '#000',
    primary: '#6200ee',
    accent: accentColor,
  };
  return { ...theme, accentColor, colors };
}
