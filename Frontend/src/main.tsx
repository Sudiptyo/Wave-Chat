import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Provider } from "react-redux";
import { store } from "./Store/store.ts";
import { ToastContainer } from "react-toastify";
import ThemeProvider from "./Components/Provider/ThemeProvider.tsx";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools initialIsOpen={false} />
      <Provider store={store}>
        <ThemeProvider>
          <ToastContainer
            position="top-right"
            autoClose={3000}
            pauseOnHover
            newestOnTop
            closeOnClick
            theme="dark"
          />
          <App />
        </ThemeProvider>
      </Provider>
    </QueryClientProvider>
  </StrictMode>,
);
