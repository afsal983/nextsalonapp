'use client'

// Import the library
import { useMemo, useEffect, useReducer, useCallback } from 'react'

import axios, { endpoints } from 'src/utils/axios'

import { useAuthContext } from 'src/auth/hooks';

import { AuthContext } from './auth-context'
import { setSession, isValidToken } from './utils'
import { type AuthUserType, type ActionMapType, type AuthStateType } from '../../types'

// ----------------------------------------------------------------------
/**
 * NOTE:
 * We only build demo at basic level.
 * Customer will need to do some extra handling yourself if you want to extend the logic and other features...
 */
// ----------------------------------------------------------------------

enum Types {
  INITIAL = 'INITIAL',
  LOGIN = 'LOGIN',
  REGISTER = 'REGISTER',
  LOGOUT = 'LOGOUT',
}

interface Payload {
  [Types.INITIAL]: {
    user: AuthUserType
  }
  [Types.LOGIN]: {
    user: AuthUserType
  }
  [Types.REGISTER]: {
    user: AuthUserType
  }
  [Types.LOGOUT]: undefined
}

type ActionsType = ActionMapType<Payload>[keyof ActionMapType<Payload>]

// ----------------------------------------------------------------------

const initialState: AuthStateType = {
  user: null,
  loading: true
}

const reducer = (state: AuthStateType, action: ActionsType) => {
  if (action.type === Types.INITIAL) {
    return {
      loading: false,
      user: action.payload.user
    }
  }
  if (action.type === Types.LOGIN) {
    return {
      ...state,
      user: action.payload.user
    }
  }
  if (action.type === Types.REGISTER) {
    return {
      ...state,
      user: action.payload.user
    }
  }
  if (action.type === Types.LOGOUT) {
    return {
      ...state,
      user: null
    }
  }
  return state
}

// ----------------------------------------------------------------------

const STORAGE_KEY = 'token'

interface Props {
  children: React.ReactNode
}

export function AuthProvider ({ children }: Props) {
  const [state, dispatch] = useReducer(reducer, initialState)

  const currentuser  = useAuthContext();
  
  const initialize = useCallback(async () => {
    try {
      const token = sessionStorage.getItem(STORAGE_KEY)

   
      if (token && isValidToken(token)) {
        setSession(token)


        // /const res = await axios.get(endpoints.auth.me)

        

        dispatch({
          type: Types.INITIAL,
          payload: {
            user: {
              ...currentuser.user,
              token
            }
          }
        })
      } else {
        dispatch({
          type: Types.INITIAL,
          payload: {
            user: null
          }
        })
      }
    } catch (error) {
      dispatch({
        type: Types.INITIAL,
        payload: {
          user: null
        }
      })
    }
  }, [currentuser])

  useEffect(() => {
    initialize()
  }, [initialize])

  // LOGIN
  const login = useCallback(async (username: string, password: string) => {

    setSession("")
    // const res = await axios.post(endpoints.auth.login, data)
    const res = await fetch('/api/login', {
      method: 'POST',
      headers: {
          'Content-type': 'application/json',
      },
      body: JSON.stringify({ "email": username, "password": password }),
    })

    const logindata = await res.json()

    console.log(logindata)

    const {
      firstname,
      lastname,
      email,
      telephone,
      id,
      roleid,
      domain_id,
      orgroleid,
      branch_id,
      token,
      refresh_token
    } = logindata

    // setSession(token)

    dispatch({
      type: Types.LOGIN,
      payload: {
        user: {
          firstname,
          lastname,
          email,
          telephone,
          id,
          roleid,
          domain_id,
          orgroleid,
          branch_id,
          token,
          refresh_token
        }
      }
    })
  }, [])

  // REGISTER
  const register = useCallback(
    async (
      email: string,
      password: string,
      firstName: string,
      lastName: string
    ) => {
      const data = {
        email,
        password,
        firstName,
        lastName
      }

      const res = await axios.post(endpoints.auth.register, data)

      const { token, user } = res.data

      sessionStorage.setItem(STORAGE_KEY, token)

      dispatch({
        type: Types.REGISTER,
        payload: {
          user: {
            ...user,
            token
          }
        }
      })
    },
    []
  )

  // LOGOUT
  const logout = useCallback(async () => {
    setSession(null)
    dispatch({
      type: Types.LOGOUT
    })
  }, [])

  // ----------------------------------------------------------------------

  const checkAuthenticated = state.user ? 'authenticated' : 'unauthenticated'

  const status = state.loading ? 'loading' : checkAuthenticated

  const memoizedValue = useMemo(
    () => ({
      user: state.user,
      method: 'jwt',
      loading: status === 'loading',
      authenticated: status === 'authenticated',
      unauthenticated: status === 'unauthenticated',
      //
      login,
      register,
      logout,
    }),
    [login, logout, register, state.user, status]
  )

  return (
    <AuthContext.Provider value={memoizedValue}>
      {children}
    </AuthContext.Provider>
  )
}
