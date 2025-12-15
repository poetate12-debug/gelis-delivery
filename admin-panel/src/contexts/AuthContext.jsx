import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { authService, firestoreService } from '../../../shared/firebaseServices.js';
import { userRoles } from '../../../shared/config.js';

const AuthContext = createContext();

// Auth state reducer
const authReducer = (state, action) => {
  switch (action.type) {
    case 'AUTH_STATE_CHANGED':
      return {
        ...state,
        user: action.payload.user,
        isAuthenticated: !!action.payload.user,
        loading: false
      };
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload
      };
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
        loading: false
      };
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null
      };
    case 'SIGN_OUT':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        loading: false
      };
    default:
      return state;
  }
};

// Initial state
const initialState = {
  user: null,
  isAuthenticated: false,
  loading: true,
  error: null
};

// Provider component
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Monitor auth state changes
  useEffect(() => {
    const unsubscribe = authService.onAuthStateChanged(async (user) => {
      if (user) {
        try {
          // Get user data from Firestore
          const userData = await firestoreService.getDocument('users', user.uid);

          // Check if user is admin
          if (userData?.role !== userRoles.ADMIN) {
            dispatch({
              type: 'SIGN_OUT'
            });
            await authService.signOut();
            alert('Akses ditolak. Halaman ini hanya untuk Admin.');
            window.location.href = '/customer-app/login';
            return;
          }

          dispatch({
            type: 'AUTH_STATE_CHANGED',
            payload: {
              user: { ...user, ...userData }
            }
          });
        } catch (error) {
          console.error('Error fetching user data:', error);
          dispatch({
            type: 'AUTH_STATE_CHANGED',
            payload: {
              user: user
            }
          });
        }
      } else {
        dispatch({
          type: 'AUTH_STATE_CHANGED',
          payload: {
            user: null
          }
        });
      }
    });

    return unsubscribe;
  }, []);

  // Sign in with email and password (for admin)
  const signIn = async (email, password) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      // You can implement email/password login for admin
      // For now, we'll use phone verification like other apps
      const result = await authService.signInWithPhone(email, null);
      dispatch({ type: 'SET_LOADING', payload: false });
      return result;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      throw error;
    }
  };

  // Sign out
  const signOut = async () => {
    try {
      await authService.signOut();
      dispatch({ type: 'SIGN_OUT' });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      throw error;
    }
  };

  const value = {
    ...state,
    signIn,
    signOut,
    clearError: () => dispatch({ type: 'CLEAR_ERROR' })
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;