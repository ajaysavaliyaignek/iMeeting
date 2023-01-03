import AddMeetingDateAndTime from '../meetings/addEditDateAndTime/AddEditDateAndTime';
import AddMeetingLocation from '../meetings/addEditLocation/AddEditLocation';
import AddMeetingSubjects from '../meetings/addEditSubjects/AddEditSubjects';
import AddMeetingUser from '../meetings/addEditUser/AddEditUser';
import AddEditGeneralScreen from '../meetings/addEditGeneral/AddEditGeneralScreen';

export const screenRender = (
  screen,
  generaldData,
  setGeneralData,
  details,
  visibleIndex,
  setVisibleIndex,
  fileResponse,
  setFileResponse,
  screenName
) => {
  switch (screen) {
    case 'general':
      return (
        <AddEditGeneralScreen
          generaldData={generaldData}
          setGeneralData={setGeneralData}
          details={details}
          fileResponse={fileResponse}
          setFileResponse={setFileResponse}
        />
      );
      break;

    case 'users':
      return (
        <AddMeetingUser
          generaldData={generaldData}
          setGeneralData={setGeneralData}
        />
      );

      break;

    case 'dateandtime':
      return (
        <AddMeetingDateAndTime
          generaldData={generaldData}
          setGeneralData={setGeneralData}
          details={details}
        />
      );
      break;

    case 'location':
      return (
        <AddMeetingLocation
          generaldData={generaldData}
          setGeneralData={setGeneralData}
          screenName={screenName}
        />
      );
      break;

    case 'subjects':
      return (
        <AddMeetingSubjects
          generaldData={generaldData}
          setGeneralData={setGeneralData}
          details={details}
          visibleIndex={visibleIndex}
          setVisibleIndex={setVisibleIndex}
        />
      );
      break;
  }
};
