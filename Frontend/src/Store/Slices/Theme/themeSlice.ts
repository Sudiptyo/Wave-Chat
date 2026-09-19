import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export type Theme = "light" | "dark";

interface ThemeState {
    theme: Theme;
}

const getInitialTheme = (): Theme => {
    const savedTheme = localStorage.getItem("theme");

    if (savedTheme === "dark" || savedTheme === "light") {
        return savedTheme;
    }

    return "dark";
}


const initialState: ThemeState = {
    theme: getInitialTheme(),
};

const themeSlice = createSlice({
    name: "theme",
    initialState,
    reducers: {
        toggleTheme: (state) => {
            state.theme = state.theme === "dark" ? "light" : "dark";
        },
        setTheme: (state, action: PayloadAction<Theme>) => {
            state.theme = action.payload;
        },
    },
});

export const { toggleTheme, setTheme } = themeSlice.actions;
export default themeSlice.reducer;