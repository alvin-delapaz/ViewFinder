import React, { Component, useState, useEffect, useContext } from 'react'
import { ThemeOptions, ThemeProvider, createTheme } from '@mui/material/styles'
import { Provider } from 'react-redux'

import './App.css';
import store from './store/store'
import Explorer from './components/Explorer';

export const themeOptions: ThemeOptions = {
  palette: {
    mode: 'dark',
    primary: {
      main: '#ffffff',
      dark: '#10161A',
    },
    secondary: {
      main: '#626061',
    },
    text: {
      primary: '#e6e6e6',
    },
    background: {
      default: '#090909',
      paper: '#090909',
    },
  },
};

const theme = createTheme(themeOptions);

function App() {
  return (
    <div className="App">
      <ThemeProvider theme={theme}>
        <Provider store={store}>
          <Explorer />
        </Provider>
      </ThemeProvider>
    </div>
  );
}

export default App;
