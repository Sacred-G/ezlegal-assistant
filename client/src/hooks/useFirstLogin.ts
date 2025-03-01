import { useState, useEffect } from 'react';
import { useAuthContext } from './AuthContext';

/**
 * Hook to detect if a user is logging in for the first time
 * @returns {boolean} Whether this is the user's first login
 */
export const useFirstLogin = (): { isFirstLogin: boolean; setFirstLoginComplete: () => void } => {
  const { user } = useAuthContext();
  const [isFirstLogin, setIsFirstLogin] = useState(false);

  useEffect(() => {
    if (!user) return;

    // Check if we've already shown the welcome popup to this user
    const welcomeShownKey = `welcome_shown_${user.id}`;
    const welcomeShown = localStorage.getItem(welcomeShownKey);

    if (!welcomeShown) {
      setIsFirstLogin(true);
    }
  }, [user]);

  const setFirstLoginComplete = () => {
    if (!user) return;
    
    // Mark that we've shown the welcome popup to this user
    const welcomeShownKey = `welcome_shown_${user.id}`;
    localStorage.setItem(welcomeShownKey, 'true');
    setIsFirstLogin(false);
  };

  return { isFirstLogin, setFirstLoginComplete };
};
