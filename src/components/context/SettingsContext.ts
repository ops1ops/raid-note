import { createContext, Dispatch, SetStateAction } from 'react';

export interface Settings {
  isSmartAnalyzing: boolean;
  isSpellsPresetEnabled: boolean;
}

interface SettingsContextType {
  settings: Settings;
  setSettings: Dispatch<SetStateAction<Settings>>;
}

export const DEFAULT_SETTINGS: Settings = {
  isSmartAnalyzing: false,
  isSpellsPresetEnabled: true,
};

const defaultContext = {
  settings: DEFAULT_SETTINGS,
  setSettings: () => null,
};

export const SettingsContext = createContext<SettingsContextType>(defaultContext);
