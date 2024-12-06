'use client';

import axios, { endpoints } from 'src/utils/axios';

import { AppSettings } from 'src/types/settings';

import { first } from '@tiptap/core/dist/packages/core/src/commands';
import { setSession } from './utils';
import { STORAGE_KEY } from './constant';

// ----------------------------------------------------------------------

export type SignInParams = {
  email: string;
  password: string;
};

export type SignUpParams = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
};

/** **************************************
 * Sign in
 *************************************** */
export const signInWithPassword = async ({ email, password }: SignInParams): Promise<void> => {
  try {
    const params = { email, password };

    const data = { username: params.email, password: params.password };

    const res = await axios.post(endpoints.auth.signIn, data);

    const logindata = res.data;

    const {
      firstname,
      lastname,
      email1,
      telephone,
      id,
      roleid,
      domain_id,
      orgroleid,
      branch_id,
      orgsettings,
    } = logindata;

    console.log(firstname);

    const currency = orgsettings.find(
      (settings: AppSettings) => settings.name === 'currency'
    )?.value;

    localStorage.setItem('___currency', currency);
  } catch (error) {
    console.error('Error during sign in:', error);
    throw error;
  }
};

/** **************************************
 * Sign up
 *************************************** */
export const signUp = async ({
  email,
  password,
  firstName,
  lastName,
}: SignUpParams): Promise<void> => {
  const params = {
    email,
    password,
    firstName,
    lastName,
  };

  try {
    const res = await axios.post(endpoints.auth.signUp, params);

    const { accessToken } = res.data;

    if (!accessToken) {
      throw new Error('Access token not found in response');
    }

    sessionStorage.setItem(STORAGE_KEY, accessToken);
  } catch (error) {
    console.error('Error during sign up:', error);
    throw error;
  }
};

/** **************************************
 * Sign out
 *************************************** */
export const signOut = async (): Promise<void> => {
  try {
    const response = await fetch('/api/logout', {
      method: 'DELETE',
    });
    if (response.ok) {
      console.log('Session cookie deleted');
      localStorage.removeItem('___currency');
    }

    await setSession(null);
  } catch (error) {
    console.error('Error during sign out:', error);
    throw error;
  }
};
