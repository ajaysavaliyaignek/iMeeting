import { createContext, useState } from 'react';

export const CredentialContext = createContext({
  storeCredentials: {},
  setStoreCredentials: () => {}
});

// export const ModalContext = createContext({
//   editModal: false,
//   setEditModal: () => {}
// });

export const UserContext = createContext();

export const AppProvider = ({ children }) => {
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [editModal, setEditModal] = useState(false);
  const [committee, setCommittee] = useState(null);
  const [required, setRequired] = useState([]);
  return (
    <UserContext.Provider
      value={{
        selectedUsers,
        setSelectedUsers,
        editModal,
        setEditModal,
        selectedSubjects,
        setSelectedSubjects,
        committee,
        setCommittee,
        required,
        setRequired
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
