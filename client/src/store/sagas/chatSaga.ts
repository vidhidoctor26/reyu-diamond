import { call, put, takeLatest } from "redux-saga/effects";
import { chatActions } from "../slices/chatSlice";
import {
  getConversationsAPI,
  getMessagesAPI,
  initiateConversationAPI,
  markConversationAsReadAPI,  // ✅ now imported
} from "@/services/chat.service";

function* fetchConversationsSaga(): any {
  try {
    const res = yield call(getConversationsAPI);
    yield put(chatActions.fetchConversationsSuccess(res.data.data));
  } catch (err: any) {
    yield put(chatActions.fetchConversationsFailure(err?.response?.data?.message || err.message));
  }
}

function* fetchMessagesSaga(action: any): any {
  try {
    const res = yield call(getMessagesAPI, action.payload);
    yield put(chatActions.fetchMessagesSuccess({
      conversationId: action.payload,
      messages: res.data.data,
    }));

    // ✅ Persist mark-as-read to DB right after messages load
    yield call(markConversationAsReadAPI, action.payload);

  } catch (err: any) {
    yield put(chatActions.fetchMessagesFailure(err?.response?.data?.message || err.message));
  }
}

function* initiateConversationSaga(action: any): any {
  try {
    const { onSuccess, onError, ...payload } = action.payload;
    const res = yield call(initiateConversationAPI, payload);
    const conversation = res.data.data;
    yield put(chatActions.initiateConversationSuccess(conversation));
    if (onSuccess) onSuccess(conversation._id);
  } catch (err: any) {
    const msg = err?.response?.data?.message || err.message;
    yield put(chatActions.initiateConversationFailure(msg));
    if (action.payload.onError) action.payload.onError(msg);
  }
}

export default function* chatSaga() {
  yield takeLatest(chatActions.fetchConversationsRequest.type, fetchConversationsSaga);
  yield takeLatest(chatActions.fetchMessagesRequest.type, fetchMessagesSaga);
  yield takeLatest(chatActions.initiateConversationRequest.type, initiateConversationSaga);
}