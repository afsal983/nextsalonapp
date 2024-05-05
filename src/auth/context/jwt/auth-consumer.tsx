'use client'

import { SplashScreen } from 'src/components/loading-screen'

import { AuthContext } from './auth-context'

// ----------------------------------------------------------------------

interface Props {
  children: React.ReactNode
}
// I changes props to any
  export function AuthConsumer ({ children }: any) {
    return (
      <AuthContext.Consumer>
        {async (auth) => (auth.loading ? <SplashScreen /> : children)}
      </AuthContext.Consumer>
    )
  }
