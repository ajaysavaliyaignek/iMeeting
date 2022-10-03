import { createContext } from 'react';

export const CredentialContext = createContext({
  storeCredentials: {},
  setStoreCredentials: () => {}
});
