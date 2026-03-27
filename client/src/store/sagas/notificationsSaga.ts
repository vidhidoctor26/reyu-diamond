import { call, put, takeLatest, all } from "redux-saga/effects";
import {
  fetchNotificationsRequest,
  fetchNotificationsSuccess,
  fetchNotificationsFailure,
  fetchUnreadCount,
  fetchUnreadCountSuccess,
  markAsRead,
  markAsReadSuccess,
  markAllAsRead,
  markAllAsReadSuccess,
} from "../slices/notificationsSlice";
import { NotificationService } from "@/services/notification.service";

const transformNotification = (n: any) => ({
  id: n._id,
  type: n.type,
  title: n.title,
  body: n.body,
  read: n.isRead,           
  createdAt: new Date(n.createdAt),
  link: n.data?.link || "",
});

function* fetchNotificationsWorker(): any {
  try {
    const response = yield call(NotificationService.getAll); 
    const notifications = response.data.data.notifications.map(transformNotification); 
    yield put(fetchNotificationsSuccess(notifications));
  } catch (error: any) {
    yield put(fetchNotificationsFailure(error.message || "Failed to fetch notifications"));
  }
}

function* fetchUnreadCountWorker(): any {
  try {
    const response = yield call(NotificationService.getUnreadCount);
    yield put(fetchUnreadCountSuccess(response.data.data.count)); // ✅ was response.data.count
  } catch (error: any) {
    console.error("Failed to fetch unread count", error);
  }
}

function* markAsReadWorker(action: { payload: string }): any {
  try {
    yield call(NotificationService.markAsRead, action.payload);
    yield put(markAsReadSuccess(action.payload));
  } catch (error: any) {
    console.error("Failed to mark notification as read", error);
  }
}

function* markAllAsReadWorker(): any {
  try {
    yield call(NotificationService.markAllAsRead);
    yield put(markAllAsReadSuccess());
  } catch (error: any) {
    console.error("Failed to mark all as read", error);
  }
}

export default function* notificationsSaga() {
  yield all([
    takeLatest(fetchNotificationsRequest.type, fetchNotificationsWorker),
    takeLatest(fetchUnreadCount.type, fetchUnreadCountWorker),
    takeLatest(markAsRead.type, markAsReadWorker),
    takeLatest(markAllAsRead.type, markAllAsReadWorker),
  ]);
}