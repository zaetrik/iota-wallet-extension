/** @jsxImportSource theme-ui */
import { ThemeUICSSObject } from '@theme-ui/css';
import FontFace from '../styles/font';
import { useWalletContext } from '../contexts/walletContext';
import useLoadable from '../utils/useLoadable';
import { userAcceptedWarning } from '../utils/storage';
import { fold3 } from '@devexperts/remote-data-ts';

// Components
import AccountView from './AccountView';
import LoginScreen from './LoginScreen';
import Error from './Error';
import WarningScreen from './WarningScreen';

const wrapperStyles: ThemeUICSSObject = {
  px: 4,
  pb: 4,
  pt: 2,
  borderRadius: 20,
  minWidth: 375,
  display: 'flex',
  flexFlow: 'column',
  position: 'relative',
};

const Popup = () => {
  const { mnemonic } = useWalletContext();
  const [userAcceptedWarningMessage, fetchStatus] =
    useLoadable(userAcceptedWarning);

  return (
    <div sx={wrapperStyles}>
      <FontFace />
      {fold3(
        () => <p>Loading...</p>,
        () => <Error error={'Something went wrong...'} />,
        (accepted) => {
          if (accepted) {
            return (
              <>
                {mnemonic ? (
                  <AccountView mnemonic={mnemonic} />
                ) : (
                  <LoginScreen />
                )}
              </>
            );
          } else {
            return <WarningScreen onAccepted={fetchStatus} />;
          }
        }
      )(userAcceptedWarningMessage)}
    </div>
  );
};

export default Popup;
