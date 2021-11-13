import React from 'react';
import { render } from 'react-dom';
import theme from '../../styles/theme';

// Contexts
import { WalletContextProvider } from '../../contexts/walletContext';
import { SettingsContextProvider } from '../../contexts/settingsContext';
import { ThemeProvider } from 'theme-ui';

// Components
import Popup from '../../components/Popup';

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <SettingsContextProvider>
        <WalletContextProvider>
          <Popup />
        </WalletContextProvider>
      </SettingsContextProvider>
    </ThemeProvider>
  );
};

render(<App />, window.document.querySelector('#app-container'));

if ((module as any).hot) (module as any).hot.accept();
