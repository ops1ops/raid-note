import React, { FC } from 'react';

import { getIconUrl } from '../utils/urls';

interface AbilityIconProps {
  icon: string;
  size?: number;
  name?: string;
}

const AbilityIcon: FC<AbilityIconProps> = ({ icon, name, size = 24 }) => (
  <img className="ability-icon" src={getIconUrl(icon)} alt={icon} width={size} height={size} title={name} />
);

export default AbilityIcon;
