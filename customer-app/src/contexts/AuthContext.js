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
        role: action.payload.role,
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
        role: null,
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
  role: null,
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
          const role = userData?.role || userRoles.CUSTOMER;

          dispatch({
            type: 'AUTH_STATE_CHANGED',
            payload: {
              user: { ...user, ...userData },
              role
            }
          });
        } catch (error) {
          dispatch({
            type: 'AUTH_STATE_CHANGED',
            payload: {
              user: user,
              role: userRoles.CUSTOMER
            }
          });
        }
      } else {
        dispatch({
          type: 'AUTH_STATE_CHANGED',
          payload: {
            user: null,
            role: null
          }
        });
      }
    });

    return unsubscribe;
  }, []);

  // Sign in with phone
  const signInWithPhone = async (phoneNumber) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const appVerifier = new RecaptchaVerifier('recaptcha-container', {
        'size': 'normal',
        'callback': (response) => {
          // reCAPTCHA solved, allow signInWithPhoneNumber.
        }
      }, auth);

      const confirmationResult = await authService.signInWithPhone(phoneNumber, appVerifier);
      dispatch({ type: 'SET_LOADING', payload: false });
      return confirmationResult;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      throw error;
    }
  };

  // Verify OTP
  const verifyOTP = async (confirmationResult, code) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const user = await authService.verifyOTP(confirmationResult, code);

      // Create/update user document in Firestore
      await firestoreService.setDocument('users', user.uid, {
        uid: user.uid,
        phoneNumber: user.phoneNumber,
        role: userRoles.CUSTOMER,
        isVerified: false,
        createdAt: new Date().toISOString()
      });

      dispatch({ type: 'SET_LOADING', payload: false });
      return user;
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
    signInWithPhone,
    verifyOTP,
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