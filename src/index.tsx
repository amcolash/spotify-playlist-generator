import React from 'react';
import ReactDOM from 'react-dom';
import { cssRule, keyframes } from 'typestyle';
import App from './App';
import { Colors } from './util';

cssRule('body', {
  margin: 0,
  background: Colors.Black,
  color: Colors.White,
  fontFamily: "'Montserrat', sans-serif",
  fontSize: 20,
  scrollbarColor: '#454a4d #202324',

  $nest: {
    '&.modal-open': {
      overflowY: 'hidden',
    },
  },
});

cssRule('button', {
  fontSize: 16,
  fontWeight: 'bold',
  minWidth: 100,
  padding: 10,
  borderRadius: 500,
  background: Colors.Green,
  border: 'none',
  color: Colors.White,
  textTransform: 'uppercase',
  transition: 'background 0.25s, filter 0.25s',

  $nest: {
    '&:not(.noButton):enabled:hover': {
      background: Colors.GreenHover,
      cursor: 'pointer',
    },
    '&:disabled': {
      filter: 'grayscale(1)',
    },

    '&.noButton': {
      background: 'none',
      padding: 0,
      minWidth: 42,
      fontSize: 0,
      borderRadius: 0,
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

if (window.screen && window.screen.orientation && window.screen.orientation.lock) {
  try {
    window.screen.orientation.lock('portrait');
  } catch (err) {
    console.error(err);
  }
}

ReactDOM.render(
  <React.StrictMode>
    <div style={{ opacity: 0, animation: fadeIn, animationDelay: '0.5s', animationDuration: '0.25s', animationFillMode: 'forwards' }}>
      <App />
    </div>
  </React.StrictMode>,
  document.getElementById('root')
);
