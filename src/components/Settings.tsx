import { useContext } from 'react';

import Checkbox from './Checkbox';
import { SettingsContext } from './context/SettingsContext';

const Settings = () => {
  const { settings, setSettings } = useContext(SettingsContext);

  const handleSettingsChange = (value: boolean, id: string) => {
    setSettings((prevSettings) => ({
      ...prevSettings,
      [id]: value,
    }));
  };

  return (
    <div>
      <Checkbox
        id="isSpellsPresetEnabled"
        title="Spells presets"
        value={settings.isSpellsPresetEnabled}
        onChange={handleSettingsChange}
      />
      <Checkbox
        id="isSmartAnalyzing"
        title="Smart MRT note (Beta)"
        value={settings.isSmartAnalyzing}
        onChange={handleSettingsChange}
      />
    </div>
  );
};

export default Settings;
