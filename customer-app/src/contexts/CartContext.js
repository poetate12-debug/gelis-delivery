import React, { createContext, useContext, useReducer, useEffect } from 'react';

const CartContext = createContext();

// Cart state reducer
const cartReducer = (state, action) => {
  switch (action.type) {
    case 'LOAD_CART':
      return {
        ...state,
        items: action.payload || [],
        loading: false
      };
    case 'ADD_TO_CART':
      const existingItem = state.items.find(item =>
        item.id === action.payload.id &&
        item.selectedOptions === action.payload.selectedOptions
      );

      if (existingItem) {
        return {
          ...state,
          items: state.items.map(item =>
            item.id === action.payload.id &&
            item.selectedOptions === action.payload.selectedOptions
              ? { ...item, quantity: item.quantity + action.payload.quantity }
              : item
          )
        };
      } else {
        return {
          ...state,
          items: [...state.items, action.payload]
        };
      }
    case 'UPDATE_QUANTITY':
      return {
        ...state,
        items: state.items.map(item =>
          item.id === action.payload.id &&
          item.selectedOptions === action.payload.selectedOptions
            ? { ...item, quantity: action.payload.quantity }
            : item
        )
      };
    case 'REMOVE_FROM_CART':
      return {
        ...state,
        items: state.items.filter(item =>
          !(item.id === action.payload.id &&
            item.selectedOptions === action.payload.selectedOptions)
        )
      };
    case 'CLEAR_CART':
      return {
        ...state,
        items: []
      };
    default:
      return state;
  }
};

// Initial state
const initialState = {
  items: [],
  loading: true
};

// Calculate cart total
export const calculateCartTotal = (items) => {
  return items.reduce((total, item) => total + (item.price * item.quantity), 0);
};

// Provider component
export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  // Load cart from localStorage
  useEffect(() => {
    const savedCart = localStorage.getItem('gelis-cart');
    if (savedCart) {
      try {
        const cartData = JSON.parse(savedCart);
        dispatch({ type: 'LOAD_CART', payload: cartData });
      } catch (error) {
        console.error('Error loading cart:', error);
      }
    } else {
      dispatch({ type: 'LOAD_CART', payload: [] });
    }
  }, []);

  // Save cart to localStorage
  useEffect(() => {
    if (!state.loading) {
      localStorage.setItem('gelis-cart', JSON.stringify(state.items));
    }
  }, [state.items, state.loading]);

  // Add item to cart
  const addToCart = (product, quantity = 1, selectedOptions = '') => {
    dispatch({
      type: 'ADD_TO_CART',
      payload: {
        ...product,
        quantity,
        selectedOptions
      }
    });
  };

  // Update item quantity
  const updateQuantity = (itemId, quantity, selectedOptions = '') => {
    if (quantity <= 0) {
      removeFromCart(itemId, selectedOptions);
    } else {
      dispatch({
        type: 'UPDATE_QUANTITY',
        payload: { id: itemId, quantity, selectedOptions }
      });
    }
  };

  // Remove item from cart
  const removeFromCart = (itemId, selectedOptions = '') => {
    dispatch({
      type: 'REMOVE_FROM_CART',
      payload: { id: itemId, selectedOptions }
    });
  };

  // Clear entire cart
  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  // Get cart total
  const getTotal = () => {
    return calculateCartTotal(state.items);
  };

  // Get cart items count
  const getItemCount = () => {
    return state.items.reduce((count, item) => count + item.quantity, 0);
  };

  const value = {
    ...state,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    getTotal,
    getItemCount
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

// Hook to use cart context
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export default CartContext;