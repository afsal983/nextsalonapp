/* eslint-disable perfectionist/sort-imports */ 
import 'src/global.css'

// i18n
import 'src/locales/i18n';
// ----------------------------------------------------------------------

import ThemeProvider from 'src/theme'
import { primaryFont } from 'src/theme/typography'
import SnackbarProvider from 'src/components/snackbar/snackbar-provider';
import ProgressBar from 'src/components/progress-bar'
import { MotionLazy } from 'src/components/animate/motion-lazy'
import { SettingsDrawer, SettingsProvider } from 'src/components/settings'
import { LocalizationProvider } from 'src/locales';
import { AuthProvider } from 'src/auth/context/jwt'

// ----------------------------------------------------------------------
// This fix provided to fix the issue
// export const dynamic = 'force-dynamic'

export const viewport = {
  themeColor: '#000000',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1
}

export const metadata = {
  title: 'SMEEYE Admin portal',
  description: 'Modern portal for business management and administration',
  keywords: 'salon app, smeeye, admin portal',
  manifest: '/manifest.json',
  icons: [
    { rel: 'icon', url: '/favicon/favicon.ico' },
    {
      rel: 'icon',
      type: 'image/png',
      sizes: '16x16',
      url: '/favicon/favicon-16x16.png'
    },
    {
      rel: 'icon',
      type: 'image/png',
      sizes: '32x32',
      url: '/favicon/favicon-32x32.png'
    },
    {
      rel: 'apple-touch-icon',
      sizes: '180x180',
      url: '/favicon/apple-touch-icon.png'
    }
  ]
}

interface Props {
  children: React.ReactNode
}

export default function RootLayout ({ children }: Props) {
  return (
    <html lang="en" className={primaryFont.className}>
      <body>
        <AuthProvider>
          <LocalizationProvider>
            <SettingsProvider
              defaultSettings={{
                themeMode: 'light', // 'light' | 'dark'
                themeDirection: 'ltr', //  'rtl' | 'ltr'
                themeContrast: 'default', // 'default' | 'bold'
                themeLayout: 'vertical', // 'vertical' | 'horizontal' | 'mini'
                themeColorPresets: 'default', // 'default' | 'cyan' | 'purple' | 'blue' | 'orange' | 'red'
                themeStretch: false
              }}
            >
              <ThemeProvider>
                <MotionLazy>
                  <SnackbarProvider>
                    <SettingsDrawer />
                    <ProgressBar />
                    {children}
                  </SnackbarProvider>
                </MotionLazy>
              </ThemeProvider>
            </SettingsProvider>
          </LocalizationProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
