import { gql } from '@apollo/client';

export const GET_AUTH = gql`
  query oAuth2Application($domainName: String) {
    oAuth2Application(domainName: $domainName) {
      clientId
      clientSecret
    }
  }
`;

export const GET_All_SUBJECTS = gql`
  query subjects(
    $committeeId: Long
    $page: Int
    $pageSize: Int
    $searchValue: String
    $sort: String
    $deadline: Boolean
  ) {
    subjects(
      page: $page
      pageSize: $pageSize
      searchValue: $searchValue
      sort: $sort
      committeeId: $committeeId
      deadline: $deadline
    ) {
      items {
        attachFileIds
        committeeId
        committeeName
        createrName
        dateOfCreation
        description
        draft
        subjectCategoryId
        subjectCategoryName
        subjectId
        subjectTitle
        userId
        subjectStatus
      }
      pageSize
      pageSize
      totalCount
    }
  }
`;

export const GET_All_SUBJECTS_CATEGORY = gql`
  query subjectCategories(
    $page: Int
    $pageSize: Int
    $searchValue: String
    $sort: String
  ) {
    subjectCategories(
      page: $page
      pageSize: $pageSize
      searchValue: $searchValue
      sort: $sort
    ) {
      items {
        categoryTitle
        createBy
        description
        id
        isDisable
        modifiedBy
      }
    }
  }
`;
export const GET_SUBJECTS_CATEGORY_BY_ID = gql`
  query subjectCategory($id: long) {
    subjectCategory(id: $id) {
      categoryTitle
      createBy
      description
      id
      isDisable
      modifiedBy
      status
    }
  }
`;
export const GET_SUBJECT_BY_ID = gql`
  query subject($subjectId: Long) {
    subject(subjectId: $subjectId) {
      attachFileIds
      committeeId
      committeeName
      createrName
      dateOfCreation
      description
      draft
      subjectCategoryId
      subjectCategoryName
      subjectId
      subjectTitle
      userId
      subjectStatus
    }
  }
`;
