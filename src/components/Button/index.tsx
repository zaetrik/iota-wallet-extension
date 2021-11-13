/** @jsxImportSource theme-ui */
import { ThemeUICSSObject } from '@theme-ui/css';
import { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react';

const buttonStyles: ThemeUICSSObject = {
  display: 'flex',
  alignItems: 'center',
  backgroundColor: 'primary',
  transition: '0.3s ease',
  path: { transition: '0.3s ease', fill: 'white' },
  ':hover': {
    transition: '0.3s ease',
    color: 'whiteLight',
    path: { fill: 'blackLight', transition: '0.3s ease' },
  },
};

export type ButtonProps<T extends 'button' | 'link'> = {
  buttonType?: T;
  children: ReactNode;
  styles?: ThemeUICSSObject;
} & (T extends 'link'
  ? AnchorHTMLAttributes<HTMLAnchorElement>
  : ButtonHTMLAttributes<HTMLButtonElement>);

const Button = <T extends 'button' | 'link'>({
  buttonType,
  ...props
}: ButtonProps<T>) => {
  if (buttonType === 'link') {
    const { children, styles = {}, ...rest } = props as ButtonProps<'link'>;

    return (
      <a
        sx={{
          all: 'unset',
          variant: 'text.subheading',
          textAlign: 'left',
          border: 'none',
          cursor: 'pointer',
          color: 'white',
          p: 4,
          ...buttonStyles,
          ...styles,
        }}
        {...rest}
      >
        {children}
      </a>
    );
  }

  const { children, styles = {}, ...rest } = props as ButtonProps<'button'>;

  return (
    <button
      sx={{
        ...buttonStyles,
        ...styles,
      }}
      {...rest}
    >
      {children}
    </button>
  );
};

export default Button;
