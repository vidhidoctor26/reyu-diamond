// redux/slices/profile.slice.ts
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface ProfileState {
  profile: any;
  loading: boolean;
  error: string | null;
  updating: boolean;
}

const initialState: ProfileState = {
  profile: null,
  loading: false,
  error: null,
  updating: false,
};

const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    // FETCH PROFILE
    fetchProfileRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchProfileSuccess: (state, action: PayloadAction<any>) => {
      state.loading = false;
      state.profile = action.payload;
    },
    fetchProfileFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },

    // UPDATE PROFILE
    updateProfileRequest: (state, _action: PayloadAction<any>) => {
      state.updating = true;
    },
    updateProfileSuccess: (state, action: PayloadAction<any>) => {
      state.updating = false;
      state.profile = action.payload;
    },
    updateProfileFailure: (state, action: PayloadAction<string>) => {
      state.updating = false;
      state.error = action.payload;
    },
  },
});

export const {
  fetchProfileRequest,
  fetchProfileSuccess,
  fetchProfileFailure,
  updateProfileRequest,
  updateProfileSuccess,
  updateProfileFailure,
} = profileSlice.actions;

export default profileSlice.reducer;