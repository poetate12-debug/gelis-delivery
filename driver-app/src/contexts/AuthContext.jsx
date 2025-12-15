import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { authService, firestoreService } from '../../../shared/firebaseServices.js';
import { userRoles, driverStatus } from '../../../shared/config.js';

const AuthContext = createContext();

// Auth state reducer
const authReducer = (state, action) => {
  switch (action.type) {
    case 'AUTH_STATE_CHANGED':
      return {
        ...state,
        user: action.payload.user,
        driver: action.payload.driver,
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
    case 'UPDATE_DRIVER_STATUS':
      return {
        ...state,
        driver: {
          ...state.driver,
          status: action.payload
        }
      };
    case 'SIGN_OUT':
      return {
        ...state,
        user: null,
        driver: null,
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
  driver: null,
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

          // Check if user is driver
          if (userData?.role !== userRoles.DRIVER) {
            dispatch({
              type: 'SIGN_OUT'
            });
            await authService.signOut();
            alert('Akses ditolak. Halaman ini hanya untuk Driver.');
            window.location.href = '/customer-app/login';
            return;
          }

          // Get driver data
          const driverData = await firestoreService.queryDocuments(
            'drivers',
            [['userId', '==', user.uid]]
          );

          const driver = driverData.length > 0 ? driverData[0] : null;

          // Update driver status to online if it was offline
          if (driver && driver.status === driverStatus.OFFLINE) {
            await firestoreService.updateDocument('drivers', driver.id, {
              status: driverStatus.AVAILABLE,
              lastSeen: new Date()
            });
            driver.status = driverStatus.AVAILABLE;
          }

          dispatch({
            type: 'AUTH_STATE_CHANGED',
            payload: {
              user: { ...user, ...userData },
              driver
            }
          });
        } catch (error) {
          console.error('Error fetching user data:', error);
          dispatch({
            type: 'AUTH_STATE_CHANGED',
            payload: {
              user: user,
              driver: null
            }
          });
        }
      } else {
        dispatch({
          type: 'AUTH_STATE_CHANGED',
          payload: {
            user: null,
            driver: null
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

      // Check if user exists as driver
      const userData = await firestoreService.getDocument('users', user.uid);
      if (!userData || userData.role !== userRoles.DRIVER) {
        dispatch({ type: 'SET_ERROR', payload: 'Akun tidak ditemukan atau bukan driver' });
        await authService.signOut();
        return;
      }

      dispatch({ type: 'SET_LOADING', payload: false });
      return user;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      throw error;
    }
  };

  // Update driver status
  const updateDriverStatus = async (status) => {
    if (!state.driver) return;

    try {
      await firestoreService.updateDocument('drivers', state.driver.id, {
        status,
        lastSeen: new Date()
      });

      dispatch({
        type: 'UPDATE_DRIVER_STATUS',
        payload: status
      });
    } catch (error) {
      console.error('Error updating driver status:', error);
    }
  };

  // Go offline
  const goOffline = async () => {
    await updateDriverStatus(driverStatus.OFFLINE);
  };

  // Sign out
  const signOut = async () => {
    try {
      // Set driver status to offline before signing out
      if (state.driver) {
        await updateDriverStatus(driverStatus.OFFLINE);
      }
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
    updateDriverStatus,
    goOffline,
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