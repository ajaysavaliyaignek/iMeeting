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
  const [companyUrl, setCompanyUrl] = useState(null);
  const [meetingsData, setMeetingsData] = useState(null);
  const [appointmentsData, setAppointmentsData] = useState(null);
  const [user, setUser] = useState([]);
  const [data, setData] = useState({
    attachFiles: [],
    committee: null,
    title: '',
    discription: '',
    users: [],
    userRequired: [],
    userDetails: [],
    startDate: '',
    endDate: '',
    startTime: '',
    endTime: '',
    TimeZone: null,
    Repeat: null,
    platform: '',
    location: null,
    videoConference: null,
    subjects: []
  });

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
        setRequired,
        companyUrl,
        setCompanyUrl,
        meetingsData,
        setMeetingsData,
        appointmentsData,
        setAppointmentsData,
        data,
        setData,
        user,
        setUser
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
