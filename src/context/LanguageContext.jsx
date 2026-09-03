import { createContext, useContext } from 'react';
import { translations } from '../data/translations';

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const t = (path) => {
    const keys = path.split('.');
    let value = translations.en;
    for (const key of keys) {
      value = value?.[key];
    }
    return value || path;
  };

  return (
    <LanguageContext.Provider value={{ t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
