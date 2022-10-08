import React, { FC } from 'react';

import { getIconUrl } from '../utils/urls';

interface AbilityIconProps {
  icon: string;
  name?: string;
}

const AbilityIcon: FC<AbilityIconProps> = ({ icon, name }) => (
  <img className="ability-icon" src={getIconUrl(icon)} alt={icon} width={24} height={24} title={name} />
);

export default AbilityIcon;
