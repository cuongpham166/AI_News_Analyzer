import { useContext } from 'react';
import { GlobalIntervalContext } from '@/shared/contexts/GlobalIntervalContext';

export const useGlobalInterval = () => {
  const context = useContext(GlobalIntervalContext);
  if (!context) {
    throw new Error(
      'useGlobalInterval must be used within a GlobalPulseProvider',
    );
  }
  return context;
};
