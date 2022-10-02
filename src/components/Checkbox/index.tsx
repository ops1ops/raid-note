/* eslint-disable react/jsx-props-no-spreading */
import React, { FC } from 'react';

import './styles.scss';

interface CheckboxPropsType {
  id: string;
  value: boolean;
  onChange: (newValue: boolean, id: string) => void;
  title: string;
}

const Checkbox: FC<CheckboxPropsType> = ({ id, title, value, onChange }) => {
  const formattedId = id.toString();

  const handleChange = () => {
    onChange(!value, id);
  };

  return (
    <div className="checkbox">
      <input type="checkbox" id={formattedId} checked={value} onChange={handleChange} />
      <label htmlFor={formattedId}>{title}</label>
    </div>
  );
};

export default Checkbox;
