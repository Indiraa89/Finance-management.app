import { createGlobalStyle } from 'styled-components';
import { colors, fonts } from './theme';

export const GlobalStyle = createGlobalStyle`
  *, *::before, *::after { box-sizing: border-box; }

  html, body, #root { height: 100%; }

  body {
    margin: 0;
    font-family: ${fonts.main};
    color: ${colors.dark};
    background: ${colors.canvas};
    -webkit-font-smoothing: antialiased;
    -webkit-tap-highlight-color: transparent;
  }

  h1, h2, h3, h4, p { margin: 0; }

  button, input, select, textarea { font: inherit; color: inherit; }

  button { cursor: pointer; border: none; background: none; padding: 0; }

  a { color: inherit; text-decoration: none; }

  ::-webkit-scrollbar { width: 0; height: 0; }

  :focus-visible { outline: 2px solid ${colors.oceanBlue}; outline-offset: 2px; }
`;
