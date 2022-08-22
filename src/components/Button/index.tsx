import React, { ButtonHTMLAttributes, FC } from 'react';

import './styles.scss';

const Button: FC<ButtonHTMLAttributes<HTMLButtonElement>> = ({ children, ...rest }) => (
  // eslint-disable-next-line react/jsx-props-no-spreading
  <button className="button" type="button" {...rest}>
    {children}
  </button>
);

export default Button;
