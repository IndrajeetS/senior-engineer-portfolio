import type { PayloadAction } from "@reduxjs/toolkit";
import { configureStore, createSlice } from "@reduxjs/toolkit";

interface UIState {
  activeSection: string;
  isMenuOpen: boolean;
  siteInfo: Record<string, unknown> | null;
}

const initialState: UIState = {
  activeSection: "hero",
  isMenuOpen: false,
  siteInfo: null,
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    setActiveSection: (state, action: PayloadAction<string>) => {
      state.activeSection = action.payload;
    },
    toggleMenu: (state) => {
      state.isMenuOpen = !state.isMenuOpen;
    },
    setSiteInfo: (state, action: PayloadAction<any>) => {
      state.siteInfo = action.payload;
    },
  },
});

export const { setActiveSection, toggleMenu, setSiteInfo } = uiSlice.actions;
export const store = configureStore({ reducer: { ui: uiSlice.reducer } });

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
