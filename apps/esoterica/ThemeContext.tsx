import { useTheme as useSharedTheme } from '../../shared/ThemeContext';
export { ThemeProvider } from '../../shared/ThemeContext';

export function useTheme() {
  const theme = useSharedTheme();
  const highlightColor = theme.isDarkMode ? '#FF99B9' : '#87CEEB';
  return { ...theme, highlightColor };
}
