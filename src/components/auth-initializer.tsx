"use client";

import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { loadUserFromStorage } from '@/store/slices/authSlice';
import { AppDispatch } from '@/store';

export function AuthInitializer({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    // Try to load user from localStorage on app start
    dispatch(loadUserFromStorage());
  }, [dispatch]);

  return <>{children}</>;
}