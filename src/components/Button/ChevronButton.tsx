/** @jsxImportSource theme-ui */

// Components
import Chevron from '../icons/Chevron';
import Button, { ButtonProps } from '.';

const ChevronButton = <T extends 'link' | 'button'>({
  children,
  buttonType,
  styles = {},
  ...rest
}: ButtonProps<T>) => {
  return (
    <Button
      buttonType={buttonType ?? 'button'}
      styles={{
        ':hover': {
          svg: { transform: 'translateX(5px)', transition: '0.5s ease' },
          path: { fill: 'whiteLight' },
        },
        ...styles,
      }}
      {...rest}
    >
      {children}{' '}
      <Chevron
        styles={{
          transition: '0.5s ease',
        }}
      />
    </Button>
  );
};

export default ChevronButton;
