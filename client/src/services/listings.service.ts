// import api from "@/lib/api";
// import { ENDPOINTS } from "@/services/endpoints";

// export const listingsService = {

//   // 🔹 Get my listings
//   getMyListings: async () => {
//     const response = await api.get(ENDPOINTS.LISTINGS.LIST_MY);
//     return response.data;
//   },

//   // 🔹 Get marketplace listings (active)
//   getAllListings: async (params?: any) => {
//     const response = await api.get(ENDPOINTS.LISTINGS.LIST_ALL, {
//       params,
//     });
//     return response.data;
//   },

//   // 🔹 Create listing
//   createListing: async (payload: any) => {
//     const response = await api.post(
//       ENDPOINTS.LISTINGS.CREATE,
//       payload
//     );
//     return response.data;
//   },

//   // 🔹 Update listing
//   updateListing: async (id: string, payload: any) => {
//     const response = await api.put(
//       ENDPOINTS.LISTINGS.UPDATE(id),
//       payload
//     );
//     return response.data;
//   },

//   // 🔹 Delete listing
//   deleteListing: async (id: string) => {
//     const response = await api.delete(
//       ENDPOINTS.LISTINGS.DELETE(id)
//     );
//     return response.data;
//   },

//   // 🔹 Update listing status
//   updateListingStatus: async (id: string, status: string) => {
//     const response = await api.patch(
//       ENDPOINTS.LISTINGS.UPDATE_STATUS(id),
//       { status }
//     );
//     return response.data;
//   },

// };