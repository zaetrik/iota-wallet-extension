import { EitherAsync } from 'purify-ts';
import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';

type Settings = { node: string };

type SettingsContextType = {
  setNode: (url: string) => void;
  error?: string;
} & Settings;

const baseNode = 'https://chrysalis-nodes.iota.org';

const getSettings = () => {
  return EitherAsync<string, { settings: Settings }>(
    () =>
      chrome?.storage.sync.get('settings') as Promise<{ settings: Settings }>
  )
    .map(
      (result) =>
        (result.settings ?? {
          node: baseNode,
        }) as Settings
    )
    .mapLeft(
      () => 'Could not fetch settings from storage. Using default data.'
    );
};

const SettingsContext = createContext<SettingsContextType>({
  node: baseNode,
  setNode: () => {},
  error: undefined,
});

export const SettingsContextProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [settings, setSettings] = useState<Settings>({ node: baseNode });
  const [error, setError] = useState<string | undefined>(undefined);

  useEffect(() => {
    getSettings().ifRight(setSettings).ifLeft(setError).run();
  }, []);

  const setNode = async (newNode: string) => {
    setSettings({ ...settings, node: newNode });
    await chrome?.storage.sync.set({
      settings: { ...settings, node: newNode },
    });
  };

  return (
    <SettingsContext.Provider
      value={{
        ...settings,
        setNode,
        error,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettingsContext = (): SettingsContextType => {
  const ctx = useContext(SettingsContext);

  if (!ctx) {
    throw new Error(
      'useSettingsContext has to be used within the SettingsContextProvider'
    );
  }

  return ctx;
};
