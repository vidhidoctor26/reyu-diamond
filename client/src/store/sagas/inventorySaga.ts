import { call, put, takeLatest } from "redux-saga/effects";
import {
  fetchInventoryRequest,
  fetchInventorySuccess,
  fetchInventoryFailure,
  createInventoryRequest,
  createInventorySuccess,
  createInventoryFailure,
  fetchInventoryByIdRequest,
  fetchInventoryByIdSuccess,
  fetchInventoryByIdFailure,
  updateInventoryRequest,
  updateInventorySuccess,
  updateInventoryFailure,
  deleteInventoryRequest,
  deleteInventorySuccess,
  deleteInventoryFailure,
} from "../slices/inventorySlice";
import { InventoryService } from "@/services/inventory.service";

/* ================= LIST ================= */

function* fetchInventoryWorker(action: any): any {
  try {
    const response = yield call(InventoryService.list, action.payload);
    yield put(fetchInventorySuccess(response.data.data));
  } catch (error: any) {
    yield put(
      fetchInventoryFailure(
        error.response?.data?.message ||
          error.message ||
          "Failed to fetch inventory",
      ),
    );
  }
}

/* ================= CREATE ================= */

function* createInventoryWorker(action: any): any {
  const { data, media, onSuccess, onError } = action.payload;

  try {
    // Step 1: Create inventory with JSON data
    const createResponse = yield call(InventoryService.create, data);
    const createdInventory = createResponse.data.data;

    // Step 2: Upload media if provided
    if (media && (media.images?.length > 0 || media.video)) {
      const formData = new FormData();

      if (media.images) {
        media.images.forEach((file: File) => formData.append("media", file));
      }
      if (media.video) {
        formData.append("media", media.video);
      }

      const mediaResponse = yield call(
        InventoryService.addMedia,
        createdInventory._id,
        formData,
      );
      yield put(createInventorySuccess(mediaResponse.data.data));
    } else {
      yield put(createInventorySuccess(createdInventory));
    }

    // ✅ Trigger navigation callback — no useEffect needed
    if (onSuccess) yield call(onSuccess);
  } catch (error: any) {
    const message =
      error.response?.data?.message ||
      error.message ||
      "Failed to create inventory";

    yield put(createInventoryFailure(message));

    if (onError) yield call(onError, message);
  }
}

/* ================= GET BY ID ================= */

function* fetchInventoryByIdWorker(action: any): any {
  try {
    const response = yield call(InventoryService.getById, action.payload);
    yield put(fetchInventoryByIdSuccess(response.data.data));
  } catch (error: any) {
    yield put(
      fetchInventoryByIdFailure(
        error.response?.data?.message ||
          error.message ||
          "Failed to fetch inventory item",
      ),
    );
  }
}

/* ================= UPDATE ================= */

function* updateInventoryWorker(action: any): any {
  const { id, data, media, onSuccess, onError } = action.payload;

  try {
    // Step 1: Update inventory data (JSON)
    const updateResponse = yield call(InventoryService.update, id, data);
    let updatedInventory = updateResponse.data.data;

    // Step 2: Add new media if provided
    if (media && (media.newImages?.length > 0 || media.newVideo)) {
      const formData = new FormData();

      if (media.newImages) {
        media.newImages.forEach((file: File) =>
          formData.append("media", file),
        );
      }
      if (media.newVideo) {
        formData.append("media", media.newVideo);
      }

      const mediaResponse = yield call(
        InventoryService.addMedia,
        id,
        formData,
      );
      updatedInventory = mediaResponse.data.data;
    }

    // Step 3: Remove media if requested
    if (media && (media.removeAllImages || media.removeVideo)) {
      const removeResponse = yield call(InventoryService.removeMedia, id, {
        removeAllImages: media.removeAllImages,
        removeVideo: media.removeVideo,
      });
      updatedInventory = removeResponse.data.data;
    }

    yield put(updateInventorySuccess(updatedInventory));

    // ✅ Trigger navigation callback — no useEffect needed
    if (onSuccess) yield call(onSuccess);
  } catch (error: any) {
    const message =
      error.response?.data?.message ||
      error.message ||
      "Failed to update inventory";

    yield put(updateInventoryFailure(message));

    if (onError) yield call(onError, message);
  }
}

/* ================= DELETE ================= */

function* deleteInventoryWorker(action: any): any {
  const { id, onSuccess, onError } = action.payload;

  try {
    yield call(InventoryService.delete, id);
    yield put(deleteInventorySuccess(id));

    if (onSuccess) yield call(onSuccess);
  } catch (error: any) {
    const message =
      error.response?.data?.message ||
      error.message ||
      "Failed to delete inventory";

    yield put(deleteInventoryFailure(message));

    if (onError) yield call(onError, message);
  }
}

/* ================= ROOT ================= */

export function* inventorySaga() {
  yield takeLatest(fetchInventoryRequest.type, fetchInventoryWorker);
  yield takeLatest(createInventoryRequest.type, createInventoryWorker);
  yield takeLatest(fetchInventoryByIdRequest.type, fetchInventoryByIdWorker);
  yield takeLatest(updateInventoryRequest.type, updateInventoryWorker);
  yield takeLatest(deleteInventoryRequest.type, deleteInventoryWorker);
}