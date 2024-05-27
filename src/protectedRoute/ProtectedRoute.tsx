// components/AuthProvider.js
"use client";

import { useEffect, useState, ReactNode } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import { setUser, AuthState } from '@/redux/slices/authSlice';
import Loader from '../components/Loader/Loader';

const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthChecked, setIsAuthChecked] = useState(false);
  const { isUserAuth } = useSelector((state: { authSlice: AuthState }) => state.authSlice);
  const dispatch = useDispatch();
  const router = useRouter();

  useEffect(() => {
    const autoLogin = async () => {
      const name = localStorage.getItem('username');
      const password = localStorage.getItem('password');

      if (name && password) {
        try {
          const response = await fetch('http://localhost:5000/api/login', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, password }),
          });

          if (!response.ok) {
            localStorage.removeItem('username');
            localStorage.removeItem('password');
            throw new Error('Failed to auto-login');
          }

          const data = await response.json();
          dispatch(setUser(data));

          router.push('/');
        } catch (error) {
          console.error('Auto-login failed', error);
        }
      }

      setIsAuthChecked(true);
    };

    autoLogin();
  }, [dispatch]);

  useEffect(() => {
    if (!isUserAuth && isAuthChecked) {
      router.push('/login');
    }
  }, [isUserAuth, isAuthChecked, router]);

  if (!isAuthChecked) {
    return <Loader />;
  }

  return <>{children}</>;
};

export default AuthProvider;
