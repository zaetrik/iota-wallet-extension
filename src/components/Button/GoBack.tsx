/** @jsxImportSource theme-ui */

import { ThemeUICSSObject } from '@theme-ui/css';

// Components
import Button from '.';
import Close from '../icons/Close';

const buttonStyles: ThemeUICSSObject = {
  p: 0,
  width: 'min-content',
  backgroundColor: 'transparent',
  ':hover': {
    svg: { transform: 'translateX(-3px)', transition: '0.5s ease' },
  },
  svg: { transition: '0.5s ease' },
};

const GoBack = ({
  onClick,
  styles = {},
}: {
  onClick: () => void;
  styles?: ThemeUICSSObject;
}) => {
  return (
    <Button styles={{ ...buttonStyles, ...styles }} onClick={onClick}>
      <Close styles={{ path: { stroke: 'primary' } }} />
    </Button>
  );
};

export default GoBack;
