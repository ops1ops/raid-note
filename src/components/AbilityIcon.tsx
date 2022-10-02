import React, { FC } from 'react';

import { getIconUrl } from '../utils/urls';

interface AbilityIconProps {
  name: string;
  title?: string;
}

const AbilityIcon: FC<AbilityIconProps> = ({ name, title }) => (
  <img className="ability-icon" src={getIconUrl(name)} alt={name} width={24} height={24} title={title} />
);

export default AbilityIcon;
