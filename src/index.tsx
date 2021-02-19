import React from 'react';
import ReactDOM from 'react-dom';
import { cssRule, keyframes } from 'typestyle';
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
  transition: 'background 0.25s',
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

const fadeIn = keyframes({
  '0%': { opacity: 0 },
  '100%': { opacity: 1 },
});

if (window.screen && window.screen.orientation && window.screen.orientation.lock) window.screen.orientation.lock('portrait');

ReactDOM.render(
  <React.StrictMode>
    <div style={{ opacity: 0, animation: fadeIn, animationDelay: '0.5s', animationDuration: '0.25s', animationFillMode: 'forwards' }}>
      <App />
    </div>
  </React.StrictMode>,
  document.getElementById('root')
);
