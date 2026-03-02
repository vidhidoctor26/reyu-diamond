export const ENDPOINTS = { 
  
  AUTH: {
    REGISTER: "/auth/register",
    VERIFY_EMAIL: "/auth/verify-email",
    RESEND_OTP: "/auth/resend-otp",
    LOGIN: "/auth/login",
    FORGOT_PASSWORD: "/auth/forgot-password",
    RESET_PASSWORD: "/auth/reset-password",
    LOGOUT: "/auth/logout",
  },

  USER: {
    PROFILE: "/user/profile",
    UPDATE_PROFILE: "/user/update",
  },

KYC: {
    SUBMIT: "/kyc/submit-kyc",
    
  },

REQUIREMENTS: {
    LIST: "/requirements",
    CREATE: "/requirements",
    GET_ONE: (id: string) => `/requirements/${id}`,
    UPDATE: (id: string) => `/requirements/${id}`,
    DELETE: (id: string) => `/requirements/${id}`,
  },

   INVENTORY: {
    LIST: "/inventory",
    CREATE: "/inventory",
    GET_ONE: (id: string) => `/inventory/${id}`,
    UPDATE: (id: string) => `/inventory/${id}`,
    DELETE: (id: string) => `/inventory/${id}`,

    // Media endpoints
    ADD_MEDIA: (id: string) => `/inventory/${id}/media`,
    REPLACE_MEDIA: (id: string) => `/inventory/${id}/media`,
    REMOVE_MEDIA: (id: string) => `/inventory/${id}/media`,
  },

  AUCTIONS: {
  LIST: "/auctions",
  CREATE: "/auctions",
  GET_ONE: (id: string) => `/auctions/${id}`,
  UPDATE: (id: string) => `/auctions/${id}`,
  DELETE: (id: string) => `/auctions/${id}`,
  UPDATE_STATUS: (id: string) => `/auctions/${id}/status`,
  AUTO_CLOSE: (id: string) => `/auctions/${id}/auto-close`,
},

  LISTINGS: {
    LIST_ALL: "/listings",              // Marketplace
    LIST_MY: "/listings/my",            // MyListings
    CREATE: "/listings",
    GET_ONE: (id: string) => `/listings/${id}`,
    UPDATE: (id: string) => `/listings/${id}`,
    DELETE: (id: string) => `/listings/${id}`,
    UPDATE_STATUS: (id: string) => `/listings/${id}/status`,
  },

};


