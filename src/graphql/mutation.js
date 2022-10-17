import { gql } from '@apollo/client';

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
