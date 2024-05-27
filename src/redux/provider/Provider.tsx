'use client';
import { Provider } from "react-redux";
import { setupStore } from "../store";
import { ReactNode } from 'react';

const store = setupStore();

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return <Provider store={store}>{children}</Provider>;
}