import { takeLatest, call, put, select } from "redux-saga/effects";
import type { PayloadAction } from "@reduxjs/toolkit";

import { kycActions } from "../slices/kycSlice";
import { authActions } from "../slices/authSlice";

import {
  submitKyc as submitKycApi,
} from "@/services/kyc.service";

/* =========================
   TYPES
========================= */

interface SubmitKycPayload {
  aadhaarFile: File;
  panFile: File;
  selfieFile?: File | null;
  aadhaarNumber: string;
  panNumber: string;
  navigate: (path: string) => void;
}

/* =========================
   SELECTORS
========================= */

const selectPersonalDetails = (state: any) =>
  state.kyc.personalDetails;

/* =========================
   SUBMIT KYC WORKER
========================= */

function* submitKycWorker(
  action: PayloadAction<SubmitKycPayload>
): Generator<any, any, any> {
  try {
    const {
      aadhaarFile,
      panFile,
      selfieFile,
      aadhaarNumber,
      panNumber,
      
    } = action.payload;

    const personalDetails = yield select(selectPersonalDetails);

    const formData = new FormData();

    // Files
    formData.append("aadhaar", aadhaarFile);
    formData.append("pan", panFile);

    if (selfieFile) {
      formData.append("selfie", selfieFile);
    }

    // Document numbers
    formData.append("aadhaarNo", aadhaarNumber);
    formData.append("panNo", panNumber);

    // Personal details
    formData.append("firstName", personalDetails.firstName);
    formData.append("middleName", personalDetails.middleName || "");
    formData.append("lastName", personalDetails.lastName);
    formData.append("dob", personalDetails.dob);
    formData.append("phone", personalDetails.phone);

    formData.append("residentialAddress", personalDetails.address);
    formData.append("city", personalDetails.city);
    formData.append("state", personalDetails.state);
    formData.append("pincode", personalDetails.pincode);
    formData.append("country", personalDetails.country);

    const response = yield call(submitKycApi, formData);

    const status =
      response?.data?.data?.status?.toUpperCase() || "PENDING";

    // 🔥 Update compliance inside auth slice
yield put(
  authActions.setCompliance({
    kycStatus: status,
  })
);

// 🔥 tell UI submission finished
yield put(
  kycActions.submitKycSuccess({
    status,
  })
);

// 🔥 redirect user
yield call(action.payload.navigate, "/user");

  } catch (error: any) {
    yield put(
      kycActions.submitKycFailure(
        error?.response?.data?.message ||
          "KYC submission failed"
      )
    );
  }
}

/* =========================
   FETCH STATUS WORKER
========================= */

// function* fetchKycStatusWorker(): Generator<any, any, any> {
//   try {
//     const response = yield call(getKycStatusApi);

//     const status =
//       response?.data?.data?.status?.toUpperCase() || "NOT_STARTED";

//     // 🔥 Compliance goes to auth slice
//     yield put(
//       authActions.setCompliance({
//         kycStatus: status,
//       })
//     );
//   } catch (error) {
//     // If API fails, treat as NOT_STARTED
//     yield put(
//       authActions.setCompliance({
//         kycStatus: "NOT_STARTED",
//       })
//     );
//   }
// }

/* =========================
   ROOT SAGA
========================= */

export default function* kycSaga() {
  yield takeLatest(
    kycActions.submitKycRequest.type,
    submitKycWorker
  );
}
