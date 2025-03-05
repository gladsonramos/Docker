import React from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClient, QueryClientProvider } from 'react-query';
import App from './App';
import ChatApp from './ChatApp';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';

const queryClient = new QueryClient();
const theme = createTheme();

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <QueryClientProvider client={queryClient}>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                <ChatApp />
                <App />
            </ThemeProvider>
        </QueryClientProvider>
    </React.StrictMode>
);