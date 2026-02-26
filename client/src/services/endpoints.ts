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

};


