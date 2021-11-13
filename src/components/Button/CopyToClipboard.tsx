/** @jsxImportSource theme-ui */
import { ThemeUICSSObject } from '@theme-ui/css';
import { useState } from 'react';

// Components
import Button from '.';
import Checkmark from '../icons/Checkmark';
import Copy from '../icons/Copy';

const CopyToClipBoard = ({
  text,
  styles = {},
}: {
  text: string;
  styles?: ThemeUICSSObject;
}) => {
  const [copiedToClipboard, setCopiedToClipboard] = useState(false);

  return (
    <Button
      disabled={copiedToClipboard}
      styles={{
        p: 0,
        backgroundColor: 'transparent',
        path: { fill: 'black' },
        ...(copiedToClipboard ? { ':hover': {}, cursor: 'default' } : {}),
        ...styles,
      }}
      onClick={() => {
        if (!copiedToClipboard) {
          setCopiedToClipboard(true);
          navigator.clipboard.writeText(text);

          setTimeout(() => setCopiedToClipboard(false), 2000);
        }
      }}
    >
      {copiedToClipboard ? <Checkmark /> : <Copy />}
    </Button>
  );
};

export default CopyToClipBoard;
