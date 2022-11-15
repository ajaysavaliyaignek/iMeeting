import { gql } from '@apollo/client';

export const UPDATE_SUBJECT_STATUS = gql`
  mutation updateSubjectStatus($subject: InputSubject!) {
    updateSubjectStatus(subject: $subject) {
      subjectId
      status
    }
  }
`;

export const UPDATE_APPOINTMENT = gql`
  mutation updateAppointment($appointment: InputAppointment!) {
    updateAppointment(appointment: $appointment) {
      status
      appointmentId
    }
  }
`;

export const DELETE_APPOINTMENT = gql`
  mutation deleteAppointment($id: Long!) {
    deleteAppointment(id: $id) {
      status
    }
  }
`;

export const UPDATE_ANSWER = gql`
  mutation updateAnswer($answer: InputAnswer!) {
    updateAnswer(answer: $answer) {
      status
    }
  }
`;

export const UPDATE_MEETING = gql`
  mutation updateMeeting($meeting: InputMeeting!) {
    updateMeeting(meeting: $meeting) {
      meetingId
      status
    }
  }
`;

export const DELETE_MEETING = gql`
  mutation deleteMeeting($meetingId: Long) {
    deleteMeeting(meetingId: $meetingId) {
      meetingId
      status
    }
  }
`;

export const UPDATE_LOCATION = gql`
  mutation updateLocation(
    $location: Inputcom_imeeting_portal_rest_dto_v1_0_Location!
  ) {
    updateLocation(location: $location) {
      status
      locationId
    }
  }
`;

export const UPDATE_COMMITTEE_USER = gql`
  mutation updateCommitteeMember($committeeMember: InputCommitteeMember!) {
    updateCommitteeMember(committeeMember: $committeeMember) {
      id
      status
    }
  }
`;

export const DELETE_USER = gql`
  mutation deleteCommitteeMember($userId: Long) {
    deleteCommitteeMember(userId: $userId) {
      status
    }
  }
`;

export const UPDATE_SUBJECT_CATEGORY = gql`
  mutation updateSubjectCategory($subjectCategory: InputSubjectCategory!) {
    updateSubjectCategory(subjectCategory: $subjectCategory) {
      id
      status
    }
  }
`;

export const UPDATE_SUBJECTS = gql`
  mutation updateSubject($subject: InputSubject!) {
    updateSubject(subject: $subject) {
      id
      status
    }
  }
`;
export const DELETE_SUBJECTS = gql`
  mutation deleteSubject($subjectId: Long) {
    deleteSubject(subjectId: $subjectId) {
      id
      status
    }
  }
`;

export const UPDATE_COMMENT = gql`
  mutation addComment(
    $comment: Inputcom_imeeting_portal_rest_dto_v1_0_Comment!
  ) {
    addComment(comment: $comment) {
      status
    }
  }
`;

export const DELETE_COMMENT_THREAD = gql`
  mutation removeComment($commentId: Long!) {
    removeComment(commentId: $commentId) {
      status
    }
  }
`;
