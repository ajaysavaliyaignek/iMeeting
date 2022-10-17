import { createContext } from 'react';

export const CredentialContext = createContext({
  storeCredentials: {},
  setStoreCredentials: () => {}
});

export const ModalContext = createContext({
  editModal: false,
  setEditModal: () => {}
});
