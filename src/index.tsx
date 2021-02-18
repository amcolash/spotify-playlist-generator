import React from 'react';
import ReactDOM from 'react-dom';
import { cssRule } from 'typestyle';
import App from './App';

cssRule('body', {
  margin: 0,
  background: '#151515',
  color: '#eee',
  fontFamily: "'Montserrat', sans-serif",
  fontSize: 20,
  scrollbarColor: '#454a4d #202324',
});

cssRule('button', {
  fontSize: 16,
  fontWeight: 'bold',
  minWidth: 100,
  padding: 10,
  borderRadius: 500,
  background: '#179433',
  border: 'none',
  color: '#eee',
  textTransform: 'uppercase',
  transition: 'all 0.25s',
  cursor: 'pointer',

  $nest: {
    '&:hover': {
      background: '#18AC4D',
    },
  },
});

cssRule('::-webkit-scrollbar', {
  backgroundColor: '#202324',
});

cssRule('::-webkit-scrollbar-thumb', {
  backgroundColor: '#454a4d',
});

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);
