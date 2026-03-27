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


    PLACE_BID: (id: string) => `/auctions/${id}/bid`,
    BID_HISTORY: (id: string) => `/auctions/${id}/bids`,
  },
  BIDS: {
    CREATE: "/bids", // POST
    UPDATE_STATUS: (bidId: string) => `/bids/${bidId}/status`, // PATCH
    GET_ALL_MY_BIDS: "/bids/my",
    GET_BIDS_RECEIVED: "/bids/received",
    GET_BY_AUCTION: (auctionId: string) => `/bids/auction/${auctionId}`, // seller/admin
    GET_HIGHEST: (auctionId: string) => `/bids/auction/${auctionId}/highest`, // public
    GET_MY_BID: (auctionId: string) => `/bids/my/${auctionId}`, // buyer
  },

  DEALS: {
    LIST: "/deals",
    GET_ONE: (id: string) => `/deals/${id}`,
    SHIP: (id: string) => `/deals/${id}/ship`,
    DELIVER: (id: string) => `/deals/${id}/deliver`,
    CANCEL: (id: string) => `/deals/${id}/cancel`,
    DISPUTE: (id: string) => `/deals/${id}/dispute`,
    GENERATE_PDF: (id: string) => `/deals/${id}/pdf`,
  },

  ESCROW: {
  CREATE_PAYMENT: "/escrow/create-payment",
  RELEASE: (dealId: string) => `/escrow/${dealId}/release`,
},

 CHAT: {
  LIST: "/chats",
  INITIATE: "/chats/initiate",
  GET_MESSAGES: (conversationId: string) => `/chats/${conversationId}`,
  MARK_READ: (conversationId: string) => `/chats/${conversationId}`,
},

NOTIFICATIONS: {
  LIST: "/notifications",
  UNREAD_COUNT: "/notifications/unread-count",
  MARK_AS_READ: (id: string) => `/notifications/read/${id}`,
  MARK_ALL_AS_READ: "/notifications/read-all",
},

};