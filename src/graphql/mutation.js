import { gql } from '@apollo/client';

export const DELETE_NOTIFICATIONS = gql`
  mutation deleteNotification($userNotificationEventId: Long) {
    deleteNotification(userNotificationEventId: $userNotificationEventId) {
      status {
        entitys
        statusCode
        statusMessage
      }
    }
  }
`;
export const UPDATE_NOTIFICATION = gql`
  mutation updateNotification($notification: InputNotification!) {
    updateNotification(notification: $notification) {
      status {
        entitys
        statusCode
        statusMessage
      }
    }
  }
`;

export const UPDATE_DELEGETION = gql`
  mutation updateDelegation($delegation: InputDelegation!) {
    updateDelegation(delegation: $delegation) {
      delegationId
      status {
        entitys
        statusCode
        statusMessage
      }
    }
  }
`;

export const DELETE_DELEGATION = gql`
  mutation deleteDelegation($id: Long) {
    deleteDelegation(id: $id) {
      delegationId
      status {
        entitys
        statusCode
        statusMessage
      }
    }
  }
`;

export const UPDATE_VIDEO_CONFERENCE = gql`
  mutation ($videoConference: InputVideoConference!) {
    updateVideoConference(videoConference: $videoConference) {
      videoConferenceId

      status {
        entitys
        statusCode
        statusMessage
      }
    }
  }
`;

export const DELETE_VIDEO_CONFERENCE = gql`
  mutation deleteVideoConference($id: Long) {
    deleteVideoConference(id: $id) {
      videoConferenceId
      status {
        entitys
        statusCode
        statusMessage
      }
    }
  }
`;

export const UPDATE_SECRETARY_PERMISSION = gql`
  mutation ($taskSecretaryPermission: InputTaskSecretaryPermission!) {
    updateTaskSecretaryPermission(
      taskSecretaryPermission: $taskSecretaryPermission
    ) {
      committeeId

      status {
        entitys
        statusCode
        statusMessage
      }
    }
  }
`;

export const UPDATE_MEETING_STATUS = gql`
  mutation ($meeting: InputMeeting!) {
    updateMeetingStatus(meeting: $meeting) {
      meetingId

      status {
        entitys
        statusCode
        statusMessage
      }
    }
  }
`;

export const UPDATE_DECISION = gql`
  mutation updateDecision($decision: InputSubject!) {
    updateDecision(subject: $decision) {
      id

      status {
        entitys
        statusCode
        statusMessage
      }
    }
  }
`;

export const UPDATE_CHAT = gql`
  mutation updateMeetingChat($meetingChat: InputMeetingChat!) {
    updateMeetingChat(meetingChat: $meetingChat) {
      chatId

      status {
        entitys
        statusCode
        statusMessage
      }
    }
  }
`;

export const DELETE_TASK = gql`
  mutation deleteTask($id: Long!) {
    deleteTask(id: $id) {
      status {
        entitys
        statusCode
        statusMessage
      }
    }
  }
`;

export const UPDATE_TASK = gql`
  mutation updateTask($task: InputTask!) {
    updateTask(task: $task) {
      taskId

      status {
        entitys
        statusCode
        statusMessage
      }
    }
  }
`;

export const UPDATE_USER_ANSWER = gql`
  mutation addUserAnswer($voting: InputVoting!) {
    addUserAnswer(voting: $voting) {
      status {
        entitys
        statusCode
        statusMessage
      }
    }
  }
`;
export const UPDATE_VOTING = gql`
  mutation addVotingQuestion($voting: InputVoting!) {
    addVotingQuestion(voting: $voting) {
      votingId

      status {
        entitys
        statusCode
        statusMessage
      }
    }
  }
`;

export const UPDATE_SPEAKER = gql`
  mutation updateSpeaker($userDetail: InputUserDetail!) {
    updateSpeaker(userDetail: $userDetail) {
      userId

      status
    }
  }
`;

export const UPDATE_SUBJECT_STATUS = gql`
  mutation updateSubjectStatus($subject: InputSubject!) {
    updateSubjectStatus(subject: $subject) {
      subjectId

      status {
        entitys
        statusCode
        statusMessage
      }
    }
  }
`;

export const UPDATE_APPOINTMENT = gql`
  mutation updateAppointment($appointment: InputAppointment!) {
    updateAppointment(appointment: $appointment) {
      status {
        entitys
        statusCode
        statusMessage
      }
      appointmentId
    }
  }
`;

export const DELETE_APPOINTMENT = gql`
  mutation deleteAppointment($id: Long!) {
    deleteAppointment(id: $id) {
      status {
        entitys
        statusCode
        statusMessage
      }
    }
  }
`;

export const UPDATE_ANSWER = gql`
  mutation updateAnswer($answer: InputAnswer!) {
    updateAnswer(answer: $answer) {
      status {
        entitys
        statusCode
        statusMessage
      }
    }
  }
`;

export const UPDATE_MEETING = gql`
  mutation updateMeeting($meeting: InputMeeting!) {
    updateMeeting(meeting: $meeting) {
      meetingId

      status {
        entitys
        statusCode
        statusMessage
      }
    }
  }
`;

export const DELETE_MEETING = gql`
  mutation deleteMeeting($meetingId: Long) {
    deleteMeeting(meetingId: $meetingId) {
      meetingId

      status {
        entitys
        statusCode
        statusMessage
      }
    }
  }
`;

export const UPDATE_LOCATION = gql`
  mutation updateLocation(
    $location: Inputcom_imeeting_portal_rest_dto_v1_0_Location!
  ) {
    updateLocation(location: $location) {
      status {
        entitys
        statusCode
        statusMessage
      }
      locationId
    }
  }
`;

export const UPDATE_COMMITTEE_USER = gql`
  mutation updateCommitteeMember($committeeMember: InputCommitteeMember!) {
    updateCommitteeMember(committeeMember: $committeeMember) {
      id

      status {
        entitys
        statusCode
        statusMessage
      }
    }
  }
`;

export const DELETE_USER = gql`
  mutation deleteCommitteeMember($userId: Long) {
    deleteCommitteeMember(userId: $userId) {
      status {
        entitys
        statusCode
        statusMessage
      }
    }
  }
`;

export const UPDATE_SUBJECT_CATEGORY = gql`
  mutation updateSubjectCategory($subjectCategory: InputSubjectCategory!) {
    updateSubjectCategory(subjectCategory: $subjectCategory) {
      id

      status {
        entitys
        statusCode
        statusMessage
      }
    }
  }
`;

export const UPDATE_SUBJECTS = gql`
  mutation updateSubject($subject: InputSubject!) {
    updateSubject(subject: $subject) {
      id

      status {
        entitys
        statusCode
        statusMessage
      }
    }
  }
`;
export const DELETE_SUBJECTS = gql`
  mutation deleteSubject($subjectId: Long) {
    deleteSubject(subjectId: $subjectId) {
      id

      status {
        entitys
        statusCode
        statusMessage
      }
    }
  }
`;

export const UPDATE_COMMENT = gql`
  mutation addComment(
    $comment: Inputcom_imeeting_portal_rest_dto_v1_0_Comment!
  ) {
    addComment(comment: $comment) {
      status {
        entitys
        statusCode
        statusMessage
      }
    }
  }
`;

export const DELETE_COMMENT_THREAD = gql`
  mutation removeComment($commentId: Long!) {
    removeComment(commentId: $commentId) {
      status {
        entitys
        statusCode
        statusMessage
      }
    }
  }
`;
