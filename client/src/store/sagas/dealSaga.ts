import { call, put, takeLatest } from "redux-saga/effects";
import { dealActions } from "../slices/dealSlice";
import {
    fetchDealsAPI,
    fetchDealByIdAPI,
    markShippedAPI,
    confirmDeliveredAPI,
    cancelDealAPI,
    raiseDisputeAPI,
    generatePdfAPI,
    createPaymentIntentAPI,
    releaseEscrowAPI,
} from "@/services/deal.service";

function* fetchDealsSaga(): any {
    try {
        const response = yield call(fetchDealsAPI);
        yield put(dealActions.fetchDealsSuccess(response.data.data));
    } catch (error: any) {
        yield put(dealActions.fetchDealsFailure(
            error?.response?.data?.message || error.message
        ));
    }
}

function* fetchDealByIdSaga(action: any): any {
    try {
        const response = yield call(fetchDealByIdAPI, action.payload);
        yield put(dealActions.fetchDealByIdSuccess(response.data.data));
    } catch (error: any) {
        yield put(dealActions.fetchDealByIdFailure(
            error?.response?.data?.message || error.message
        ));
    }
}

function* markShippedSaga(action: any): any {
    try {
        const { dealId, onSuccess, onError, ...data } = action.payload;
        const response = yield call(markShippedAPI, dealId, data);
        yield put(dealActions.markShippedSuccess(response.data.data));
        if (onSuccess) onSuccess();
    } catch (error: any) {
        const msg = error?.response?.data?.message || error.message;
        yield put(dealActions.markShippedFailure(msg));
        if (action.payload.onError) action.payload.onError(msg);
    }
}

function* confirmDeliveredSaga(action: any): any {
    try {
        const { dealId, onSuccess, onError, ...data } = action.payload;
        const response = yield call(confirmDeliveredAPI, dealId, data);
        yield put(dealActions.confirmDeliveredSuccess(response.data.data));
        if (onSuccess) onSuccess();
    } catch (error: any) {
        const msg = error?.response?.data?.message || error.message;
        yield put(dealActions.confirmDeliveredFailure(msg));
        if (action.payload.onError) action.payload.onError(msg);
    }
}

function* cancelDealSaga(action: any): any {
    try {
        const { dealId, onSuccess, onError, ...data } = action.payload;
        const response = yield call(cancelDealAPI, dealId, data);
        yield put(dealActions.cancelDealSuccess(response.data.data.deal));
        if (onSuccess) onSuccess();
    } catch (error: any) {
        const msg = error?.response?.data?.message || error.message;
        yield put(dealActions.cancelDealFailure(msg));
        if (action.payload.onError) action.payload.onError(msg);
    }
}

function* raiseDisputeSaga(action: any): any {
    try {
        const { dealId, onSuccess, onError, ...data } = action.payload;
        const response = yield call(raiseDisputeAPI, dealId, data);
        yield put(dealActions.raiseDisputeSuccess(response.data.data));
        if (onSuccess) onSuccess();
    } catch (error: any) {
        const msg = error?.response?.data?.message || error.message;
        yield put(dealActions.raiseDisputeFailure(msg));
        if (action.payload.onError) action.payload.onError(msg);
    }
}

function* generatePdfSaga(action: any): any {
    try {
        const { dealId, onSuccess } = action.payload;
        const response = yield call(generatePdfAPI, dealId);
        const pdfUrl = response.data.data.pdfUrl;
        yield put(dealActions.generatePdfSuccess({ pdfUrl, dealId }));
        if (onSuccess) onSuccess(pdfUrl);
    } catch (error: any) {
        const msg = error?.response?.data?.message || error.message;
        yield put(dealActions.generatePdfFailure(msg));
        if (action.payload.onError) action.payload.onError(msg);
    }
}

function* createPaymentIntentSaga(action: any): any {
  try {
    const { dealId, onSuccess } = action.payload;
    const response = yield call(createPaymentIntentAPI, dealId);
    const { clientSecret } = response.data.data;
    yield put(dealActions.createPaymentIntentSuccess({ clientSecret, dealId }));
    if (onSuccess) onSuccess(clientSecret);
  } catch (error: any) {
    const msg = error?.response?.data?.message || error.message;
    yield put(dealActions.createPaymentIntentFailure(msg));
    if (action.payload.onError) action.payload.onError(msg);
  }
}

function* releaseEscrowSaga(action: any): any {
  try {
    const { dealId, onSuccess } = action.payload;
    const response = yield call(releaseEscrowAPI, dealId);
    yield put(dealActions.releaseEscrowSuccess(response.data.data));
    if (onSuccess) onSuccess();
  } catch (error: any) {
    const msg = error?.response?.data?.message || error.message;
    yield put(dealActions.releaseEscrowFailure(msg));
    if (action.payload.onError) action.payload.onError(msg);
  }
}


export default function* dealSaga() {
    yield takeLatest(dealActions.fetchDealsRequest.type, fetchDealsSaga);
    yield takeLatest(dealActions.fetchDealByIdRequest.type, fetchDealByIdSaga);
    yield takeLatest(dealActions.markShippedRequest.type, markShippedSaga);
    yield takeLatest(dealActions.confirmDeliveredRequest.type, confirmDeliveredSaga);
    yield takeLatest(dealActions.cancelDealRequest.type, cancelDealSaga);
    yield takeLatest(dealActions.raiseDisputeRequest.type, raiseDisputeSaga);
    yield takeLatest(dealActions.generatePdfRequest.type, generatePdfSaga);
    yield takeLatest(dealActions.createPaymentIntentRequest.type, createPaymentIntentSaga);
    yield takeLatest(dealActions.releaseEscrowRequest.type, releaseEscrowSaga);
}