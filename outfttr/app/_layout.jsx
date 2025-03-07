import { Stack } from 'expo-router';
import { ThemeProvider } from './screens/utility/themeContext';

export default function Layout() {

  return (
  <ThemeProvider>
    <Stack />
  </ThemeProvider>



  )
}
