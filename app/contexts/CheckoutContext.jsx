'use client'
import { createContext, useContext, useReducer, useEffect } from 'react'

const CheckoutContext = createContext()

// Checkout actions
const CHECKOUT_ACTIONS = {
  SET_SHIPPING_INFO: 'SET_SHIPPING_INFO',
  SET_PAYMENT_METHOD: 'SET_PAYMENT_METHOD',
  SET_BILLING_SAME_AS_SHIPPING: 'SET_BILLING_SAME_AS_SHIPPING',
  SET_BILLING_INFO: 'SET_BILLING_INFO',
  SET_ORDER_NOTES: 'SET_ORDER_NOTES',
  SET_STEP: 'SET_STEP',
  RESET_CHECKOUT: 'RESET_CHECKOUT'
}

// Initial state
const initialState = {
  currentStep: 1,
  shippingInfo: {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'Indonesia'
  },
  paymentMethod: 'credit_card',
  billingInfo: {
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'Indonesia'
  },
  billingIsSameAsShipping: true,
  orderNotes: '',
  isProcessing: false,
  errors: {}
}

// Checkout reducer
function checkoutReducer(state, action) {
  switch (action.type) {
    case CHECKOUT_ACTIONS.SET_SHIPPING_INFO:
      return {
        ...state,
        shippingInfo: { ...state.shippingInfo, ...action.payload },
        errors: { ...state.errors, shipping: null }
      }

    case CHECKOUT_ACTIONS.SET_PAYMENT_METHOD:
      return {
        ...state,
        paymentMethod: action.payload
      }

    case CHECKOUT_ACTIONS.SET_BILLING_SAME_AS_SHIPPING:
      return {
        ...state,
        billingIsSameAsShipping: action.payload,
        billingInfo: action.payload ? state.shippingInfo : state.billingInfo
      }

    case CHECKOUT_ACTIONS.SET_BILLING_INFO:
      return {
        ...state,
        billingInfo: { ...state.billingInfo, ...action.payload },
        errors: { ...state.errors, billing: null }
      }

    case CHECKOUT_ACTIONS.SET_ORDER_NOTES:
      return {
        ...state,
        orderNotes: action.payload
      }

    case CHECKOUT_ACTIONS.SET_STEP:
      return {
        ...state,
        currentStep: action.payload
      }

    case CHECKOUT_ACTIONS.RESET_CHECKOUT:
      return initialState

    default:
      return state
  }
}

// Checkout provider
export function CheckoutProvider({ children }) {
  const [state, dispatch] = useReducer(checkoutReducer, initialState)

  // Actions
  const setShippingInfo = (info) => {
    dispatch({ type: CHECKOUT_ACTIONS.SET_SHIPPING_INFO, payload: info })
  }

  const setPaymentMethod = (method) => {
    dispatch({ type: CHECKOUT_ACTIONS.SET_PAYMENT_METHOD, payload: method })
  }

  const setBillingInfo = (info) => {
    dispatch({ type: CHECKOUT_ACTIONS.SET_BILLING_INFO, payload: info })
  }

  const setBillingIsSameAsShipping = (isSame) => {
    dispatch({ type: CHECKOUT_ACTIONS.SET_BILLING_SAME_AS_SHIPPING, payload: isSame })
  }

  const setOrderNotes = (notes) => {
    dispatch({ type: CHECKOUT_ACTIONS.SET_ORDER_NOTES, payload: notes })
  }

  const setStep = (step) => {
    dispatch({ type: CHECKOUT_ACTIONS.SET_STEP, payload: step })
  }

  const resetCheckout = () => {
    dispatch({ type: CHECKOUT_ACTIONS.RESET_CHECKOUT })
  }

  // Validation
  const validateShippingInfo = () => {
    const errors = {}
    const required = ['firstName', 'lastName', 'email', 'phone', 'address', 'city', 'zipCode']
    
    required.forEach(field => {
      if (!state.shippingInfo[field]) {
        errors[field] = 'This field is required'
      }
    })

    // Email validation
    if (state.shippingInfo.email && !/\S+@\S+\.\S+/.test(state.shippingInfo.email)) {
      errors.email = 'Please enter a valid email'
    }

    return errors
  }

  const value = {
    ...state,
    setShippingInfo,
    setPaymentMethod,
    setBillingInfo,
    setBillingIsSameAsShipping,
    setOrderNotes,
    setStep,
    resetCheckout,
    validateShippingInfo
  }

  return (
    <CheckoutContext.Provider value={value}>
      {children}
    </CheckoutContext.Provider>
  )
}

export function useCheckout() {
  const context = useContext(CheckoutContext)
  if (!context) {
    throw new Error('useCheckout must be used within a CheckoutProvider')
  }
  return context
}