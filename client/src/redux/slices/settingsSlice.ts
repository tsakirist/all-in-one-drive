import { createSlice } from '@reduxjs/toolkit';
import { SettingsState } from '../types';
import { ThemeMode } from '../../shared/types/types';

const initialState: SettingsState = {
	themeMode: (localStorage.getItem('theme') as ThemeMode) ?? 'light',
};

const settingsSlice = createSlice({
	name: 'settings',
	initialState,
	reducers: {
		toggleTheme: (state: SettingsState) => {
			state.themeMode = state.themeMode === 'light' ? 'dark' : 'light';
		},
	},
});

export const { toggleTheme } = settingsSlice.actions;
export default settingsSlice.reducer;
