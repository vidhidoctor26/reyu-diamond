import api from "@/lib/api";
import { ENDPOINTS } from "./endpoints";


export const submitKyc = (formData: FormData) => {
  return api.post(ENDPOINTS.KYC.SUBMIT, formData);
};

 export const getKycStatus = () => {
  return api.get("/kyc/me");
};

