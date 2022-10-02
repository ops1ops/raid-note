import React, { FC, useMemo, useState } from 'react';

import { DEFAULT_SETTINGS, SettingsContext } from './SettingsContext';

const SettingsProvider: FC = ({ children }) => {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);

  const contextValue = useMemo(() => ({ settings, setSettings }), [settings, setSettings]);

  return <SettingsContext.Provider value={contextValue}>{children}</SettingsContext.Provider>;
};

export default SettingsProvider;
