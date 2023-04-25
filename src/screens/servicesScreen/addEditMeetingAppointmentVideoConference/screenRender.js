import AddMeetingDateAndTime from '../meetings/addEditDateAndTime/AddEditDateAndTime';
import AddMeetingLocation from '../meetings/addEditLocation/AddEditLocation';
import AddMeetingSubjects from '../meetings/addEditSubjects/AddEditSubjects';
import AddMeetingUser from '../meetings/addEditUser/AddEditUser';
import AddEditGeneralScreen from '../meetings/addEditGeneral/AddEditGeneralScreen';
import { IconName } from '../../../component';

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

export const selectColorAndIcon = (type) => {
  switch (type) {
    case 1:
      return (data = {
        darkColor: '#658EB4',
        lightColor: 'rgba(101, 142, 180, 0.1)',
        tickIcon: IconName.CorrectIcon_Blue
      });
      break;

    case 2:
      return (data = {
        darkColor: '#AB9EC8',
        lightColor: 'rgba(171, 158, 200, 0.1)',
        tickIcon: IconName.CorrectIcon_Purple
      });

      break;

    case 3:
      return (data = {
        darkColor: '#E79D73',
        lightColor: 'rgba(231, 157, 115, 0.1)',
        tickIcon: IconName.CorrectIcon_Orange
      });

      break;

    case 4:
      return (data = {
        darkColor: '#DD7878',
        lightColor: 'rgba(221, 120, 120, 0.1)',
        tickIcon: IconName.CorrectIcon_Red
      });

      break;
  }
};
