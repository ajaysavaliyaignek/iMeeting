import { gql } from '@apollo/client';

export const GET_MAP_COMMITTEES = gql`
  query mapCommittees($type: Int) {
    mapCommittees(type: $type) {
      items {
        committeeTitle
        children
        committeeId
        isDisable
        userIds
        userNames
      }
    }
  }
`;

export const GET_NOTIFICATION_COUNT = gql`
  query {
    notificationsCount {
      count
    }
  }
`;
export const GET_ALL_NOTIFICATIONS = gql`
  query notifications {
    notifications {
      items {
        archived
        notificationText
        url
        userNotificationEventId
      }
    }
  }
`;

export const GET_STATISTICS = gql`
  query statistics(
    $type: Int
    $graphType: Int
    $committeeIds: String
    $attendanceStatusIds: String
    $startDate: String
    $endDate: String
    $statusIds: String
    $userIds: String
  ) {
    statistics(
      type: $type
      graphType: $graphType
      committeeIds: $committeeIds
      attendanceStatusIds: $attendanceStatusIds
      startDate: $startDate
      endDate: $endDate
      statusIds: $statusIds
      userIds: $userIds
    ) {
      statisticContent
      statisticStatus
      statisticCommittees
      statisticColors
    }
  }
`;

export const GET_EVENT_COUNTS = gql`
  query counts {
    counts {
      meetingCounts
      appointmentCounts
      subjectCounts
      taskCounts
      videoConferenceCounts
    }
  }
`;

export const GET_ALL_DELEGATIONS = gql`
  query delegations(
    $startDate: String
    $endDate: String
    $page: Int
    $pageSize: Int
    $searchValue: String
    $sort: String
    $committeeIds: String
  ) {
    delegations(
      startDate: $startDate
      endDate: $endDate
      page: $page
      pageSize: $pageSize
      searchValue: $searchValue
      sort: $sort
      committeeIds: $committeeIds
    ) {
      items {
        committeeId
        committeeName
        creatorId
        creatorName
        delegationId
        endDate
        isDisable
        startDate
        transferredUserId
        transferredUserName
        types
      }
    }
  }
`;

export const GET_DELEGATION_BY_ID = gql`
  query delegation($id: Long) {
    delegation(id: $id) {
      committeeId
      committeeName
      creatorId
      creatorName
      delegationId
      endDate
      isDisable
      startDate
      status {
        entitys
        statusCode
        statusMessage
      }
      transferredUserId
      transferredUserName
    }
  }
`;
export const GET_ALL_VIDEO_CONFERENCES = gql`
  query videoConferences(
    $date: String
    $page: Int
    $pageSize: Int
    $searchValue: String
    $sort: String
  ) {
    videoConferences(
      date: $date
      page: $page
      pageSize: $pageSize
      searchValue: $searchValue
      sort: $sort
    ) {
      items {
        committeeId
        committeeName
        creatorId
        creatorName
        endDate
        endTime
        isDisable
        platformId
        platformName
        platformlink
        repeat
        repeatName
        setDate
        setTime
        timeZone
        status {
          entitys
          statusCode
          statusMessage
        }
        videoConferenceDescription
        videoConferenceId
        videoConferenceTitle
        yourRoleId
        yourRoleName
        attachFileIds
        answers
        required
        userDetails {
          answer
          appointmentId
          duration
          email
          isAvailable
          isRequired
          isSpeaker
          meetingId
          roleId
          roleName
          speakingDuration

          suggestedTime
          userId
          userName
          videoConferenceId
        }
        userIds
        yourRole
      }
    }
  }
`;

export const GET_ALL_VIDEO_CONFERENCES_BY_ID = gql`
  query videoConference($id: Long) {
    videoConference(id: $id) {
      committeeId
      committeeName
      creatorId
      creatorName
      endDate
      endTime
      isDisable
      platformId
      platformName
      platformlink
      repeat
      repeatName
      setDate
      setTime
      timeZone
      videoConferenceDescription
      videoConferenceId
      videoConferenceTitle
      yourRoleId
      yourRoleName
      attachFileIds
      answers
      required
      status {
        entitys
        statusCode
        statusMessage
      }
      userDetails {
        answer
        appointmentId
        duration
        email
        isAvailable
        isRequired
        isSpeaker
        meetingId
        roleId
        roleName
        speakingDuration

        suggestedTime
        userId
        userName
        videoConferenceId
      }
      userIds
      yourRole
    }
  }
`;

export const GET_CALENDER_EVENTS = gql`
  query calendarEventsMobile(
    $startDate: String
    $endDate: String
    $meeting: Boolean
    $appointment: Boolean
    $videoConferences: Boolean
    $tasks: Boolean
  ) {
    calendarEventsMobile(
      startDate: $startDate
      endDate: $endDate
      meeting: $meeting
      appointment: $appointment
      videoConferences: $videoConferences
      tasks: $tasks
    ) {
      events
    }
  }
`;

export const GET_TASK_SECRETARY_PERMISSION = gql`
  query taskSecretaryPermission($committeeId: Long) {
    taskSecretaryPermission(committeeId: $committeeId) {
      committeeId
      userRole
      allTaskTypesApproveByHead
      isMinutesofMeetingApproval
      isSubjectApproval
    }
  }
`;

export const GET_VOTING_HISTORY = gql`
  query votingHistory($votingId: Long) {
    votingHistory(votingId: $votingId) {
      items {
        createDate
        userId
        userName
        votingId
        answers
      }
    }
  }
`;

export const GET_MEETING_STATUS = gql`
  query meetingStatus {
    meetingStatus {
      items {
        meetingStatusId
        meetingStatusTitle
      }
    }
  }
`;

export const GET_ALL_DECISION_BY_ID = gql`
  query decision($decision: Long) {
    decision(decisionId: $decision) {
      decisionId
      meetingId
      committeeId
      committeeName
      dateOfCreation
      subjectId
      subjectTitle
      statusId
      statusTitle
      description
      attachFileIds
    }
  }
`;

export const GET_ALL_DECISIONS = gql`
  query decisions(
    $subjectId: Long
    $page: Int
    $pageSize: Int
    $meetingId: Long
    $momDecision: Boolean
  ) {
    decisions(
      subjectId: $subjectId
      page: $page
      pageSize: $pageSize
      meetingId: $meetingId
      momDecision: $momDecision
    ) {
      items {
        decisionId
        committeeId
        createrName
        committeeName
        dateOfCreation
        subjectId
        subjectTitle
        statusId
        statusTitle
        description
        attachFileIds
      }
    }
  }
`;

export const GET_LIVE_MEETING_TAB_COUNT = gql`
  query referencesCounts($id: Long, $type: Int) {
    referencesCounts(id: $id, type: $type) {
      referencesCounts
    }
  }
`;

export const GET_ALL_CHATS = gql`
  query meetingChat($meetingId: Long) {
    meetingChat(meetingId: $meetingId) {
      items {
        chatId
        createDate
        isOwner
        meetingId
        message
        profilePicture

        status {
          entitys
          statusCode
          statusMessage
        }
        userId
        userName
        fileUploads {
          contentUrl
          downloadUrl
          fileEnteryId
          groupId
          name
          size
          type
        }
      }
    }
  }
`;

export const GET_TASK_BY_ID = gql`
  query task($id: Long) {
    task(id: $id) {
      taskId
      attachFiles
      committeeId
      committeeName
      userName
      createBy
      deadlineDate
      description
      executorId
      executorName
      meetingId
      priority
      priorityId
      subjectId
      taskStatusId
      taskStatus
      taskType
      taskTypeId
      isHead
      isExecutor
      isTaskApproval
      isMeetingApproval
      isSubjectApproval
      title
      userId
    }
  }
`;
export const GET_TASK_PRIORITY = gql`
  query taskPriority {
    taskPriority {
      items {
        id
        name
      }
    }
  }
`;

export const GET_TASK_EXECUTORS = gql`
  query taskExecutor {
    taskExecutor {
      executorIds
      executorNames
    }
  }
`;

export const GET_VOTING_DETAILS = gql`
  query votingDetails(
    $meetingId: Long
    $subjectId: Long
    $type: Int
    $searchValue: String
  ) {
    votingDetails(
      meetingId: $meetingId
      subjectId: $subjectId
      type: $type
      searchValue: $searchValue
    ) {
      items {
        isMultipleSelect
        isPrivate
        meetingId
        subjectId
        subjectName
        type
        votingId
        votingTitle
        userSelectedId
        answerIds
        answers
        optionCounts
        optionPercentages
      }
    }
  }
`;

export const GET_LIVE_MEETING_USERS = gql`
  query liveMeetingUsers($meetingId: Long, $isSpeaker: Boolean) {
    liveMeetingUsers(meetingId: $meetingId, isSpeaker: $isSpeaker) {
      userDetails {
        duration
        email
        isSpeaker
        roleId
        roleName
subjectId
isPublished
        status
        userId
        userName
        speakingDuration
      }
    }
  }
`;

export const GET_ANSWER = gql`
  query answer($id: Long, $userId: Long, $type: Int) {
    answer(id: $id, userId: $userId, type: $type) {
      userId
      suggestionTime
      answer
    }
  }
`;
export const GET_USER_PAYLOAD = gql`
  query userPayload {
    userPayload {
      userId
      userName
      userCommitteesDetail
    }
  }
`;

export const GET_TASK_STATUS = gql`
  query taskStatus {
    taskStatus {
      items {
        id
        name
      }
    }
  }
`;

export const GET_TASK_TYPES = gql`
  query taskType {
    taskType {
      items {
        id
        name
      }
    }
  }
`;

export const GET_ALL_TASKS = gql`
  query tasks(
    $onlyMyTask: Boolean
    $page: Int
    $pageSize: Int
    $searchValue: String
    $sort: String
    $taskStatusIds: String
    $taskTypeIds: String
    $date: String
    $subjectId: Long
    $meetingId: Long
  ) {
    tasks(
      onlyMyTask: $onlyMyTask
      page: $page
      pageSize: $pageSize
      searchValue: $searchValue
      sort: $sort
      taskStatusIds: $taskStatusIds
      taskTypeIds: $taskTypeIds
      date: $date
      subjectId: $subjectId
      meetingId: $meetingId
    ) {
      items {
        taskId
        attachFiles
        committeeId
        committeeName
        createBy
        deadlineDate
        description
        executorId
        executorName
        meetingId
        priority
        priorityId
        subjectId
        taskStatusId
        taskStatus
        taskType
        taskTypeId
        title
        userId
        isHead
        isExecutor
        isTaskApproval
        isMeetingApproval
        isSubjectApproval
        userName
        dateOfCreation
        commentThreadId

        status {
          entitys
          statusCode
          statusMessage
        }
      }
      totalCount
      pageSize
    }
  }
`;

export const GET_TIMELINE_REVIEW = gql`
  query timeReviewMobile(
    $startTime: String
    $endTime: String
    $date: String
    $requiredUserIds: String
    $optionalUserIds: String
    $timeStart: String
    $timeEnd: String
  ) {
    timeReviewMobile(
      startTime: $startTime
      endTime: $endTime
      date: $date
      requiredUserIds: $requiredUserIds
      optionalUserIds: $optionalUserIds
      timeStart: $timeStart
      timeEnd: $timeEnd
    ) {
      userEvents
    }
  }
`;

export const GET_ALL_SUBJECTS_STATUS = gql`
  query subjectStatus(
    $decision: Boolean
    $approveDecision: Boolean
    $momDecision: Boolean
    $subject: Boolean
  ) {
    subjectStatus(
      decision: $decision
      approveDecision: $approveDecision
      momDecision: $momDecision
      subject: $subject
    ) {
      items {
        statusId
        statusTitle
      }
    }
  }
`;

export const GET_TIMEZONE = gql`
  query timeZone {
    timeZone {
      items {
        timeZone
        timeZoneId
      }
    }
  }
`;

export const GET_APPOINTMENT_BY_ID = gql`
  query appointment($id: Long) {
    appointment(id: $id) {
      appointmentDescription
      appointmentId
      appointmentTitle
      attachFileIds
      committeeId
      committeeName
      yourRoleId
      yourRoleName
      creatorName
      endDate
      endTime
      locationName
      setDate
      setTime
      platformlink
      platformName
      locationId
      repeat
      repeatName
      timeZone
      userDetails {
        answer
        email
        roleId
        roleName
        userName
        isAvailable
        isRequired
        userId
        suggestedTime
      }
    }
  }
`;

export const GET_All_APPOINTMENT = gql`
  query appointments(
    $page: Int
    $pageSize: Int
    $searchValue: String
    $sort: String
  ) {
    appointments(
      page: $page
      pageSize: $pageSize
      searchValue: $searchValue
      sort: $sort
    ) {
      items {
        appointmentId
        appointmentTitle
        committeeName
        creatorName
        yourRoleName
        locationName
        setDate
        isDisable
        answers
        setTime
        attachFileIds
      }
      page
      totalCount
      pageSize
    }
  }
`;

export const GET_All_USERS = gql`
  query committeeMembersList(
    $page: Int
    $pageSize: Int
    $roleFilterIds: String
    $searchValue: String
    $sort: String
    $externalUser: Boolean
    $organizationIds: String
    $isDeleted: Boolean
    $type: Int
  ) {
    committeeMembersList(
      page: $page
      pageSize: $pageSize
      roleFilterIds: $roleFilterIds
      searchValue: $searchValue
      sort: $sort
      externalUser: $externalUser
      organizationIds: $organizationIds
      isDeleted: $isDeleted
      type: $type
    ) {
      items {
        userId
        firstName
        secondName
        familyName
        emails
        phoneNumber
        isDisable
        roles
        organizations
        privateDetails
        externalUser
        organizationIds

        status {
          entitys
          statusCode
          statusMessage
        }
      }
      page
      pageSize
      totalCount
    }
  }
`;

export const GET_USER_BY_ID = gql`
  query committeeMemberById($userId: Long) {
    committeeMemberById(userId: $userId) {
      title
      attachFiles
      emails
      externalUser
      familyName
      firstName
      googleCalendarSync
      organizations
      outlookCalendarSync
      phoneNumber
      privateDetails
      profilePicture
      roles
      secondName
      sendSMS
      thirdName
      userId
    }
  }
`;

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
    $committeeIds: String
    $page: Int
    $pageSize: Int
    $searchValue: String
    $sort: String
    $isDraft: Boolean
    $screen: Int
    $meetingId: Long
  ) {
    subjects(
      page: $page
      pageSize: $pageSize
      searchValue: $searchValue
      sort: $sort
      committeeIds: $committeeIds
      isDraft: $isDraft
      screen: $screen
      meetingId: $meetingId
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
        statusTitle
        statusId
        meetingId
        commentThreadId
        status {
          entitys
          statusCode
          statusMessage
        }
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

      status {
        entitys
        statusCode
        statusMessage
      }
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
      statusTitle
      commentThreadId

      status {
        entitys
        statusCode
        statusMessage
      }
    }
  }
`;

export const GET_FILE = gql`
  query uploadedFile($fileEntryId: Long) {
    uploadedFile(fileEntryId: $fileEntryId) {
      contentUrl
      downloadUrl
      fileEnteryId
      groupId
      name
      size
      type
    }
  }
`;

export const GET_All_COMMITTEE = gql`
  query committees(
    $page: Int
    $pageSize: Int
    $searchValue: String
    $sort: String
    $isDeleted: Boolean
  ) {
    committees(
      page: $page
      pageSize: $pageSize
      searchValue: $searchValue
      sort: $sort
      isDeleted: $isDeleted
    ) {
      items {
        attachDocumentIds
        committeeId
        committeeCategoryId
        committeeTitle
        description
        expirationDate
        organizationId
        parentCommitteeId
        isDisable
        setUpDate
        userIds

        status {
          entitys
          statusCode
          statusMessage
        }
        categoryTitle
        roleIds
      }
      pageSize
      pageSize
      totalCount
    }
  }
`;

export const GET_COMMITTEE_BY_ID = gql`
  query committee($organizationId: Long) {
    committee(organizationId: $organizationId) {
      attachDocumentIds
      categoryTitle
      committeeCategoryId
      committeeId
      committeeTitle
      description
      expirationDate
      organizationId
      parentCommitteeId
      roleIds
      setUpDate
      userIds
    }
  }
`;

export const GET_COMMITTEE_MEMBER_BY_ID = gql`
  query committeeMemberById($userId: Long) {
    committeeMemberById(userId: $userId) {
      title
      attachFiles
      emails
      externalUser
      familyName
      firstName
      googleCalendarSync
      organizations
      outlookCalendarSync
      phoneNumber
      privateDetails
      profilePicture
      roles
      secondName
      sendSMS
      thirdName
      userId
    }
  }
`;

export const GET_COMMITTEES_BY_ROLE = gql`
  query committeesByRole(
    $head: Boolean
    $member: Boolean
    $secretary: Boolean
    $type: Int
  ) {
    committeesByRole(
      head: $head
      member: $member
      secretary: $secretary
      type: $type
    ) {
      items {
        categoryTitle
        children
        committeeId
        committeeTitle
        createBy
        description
        expirationDate
        isDisable
        organizationId
        parentCommitteeId
        setUpDate
        status {
          entitys
          statusCode
          statusMessage
        }
        title
        userIds
        attachDocumentIds
      }
    }
  }
`;

export const GET_All_COMMENTS_THREAD = gql`
  query comments($commentCategoryId: Long, $sort: String) {
    comments(commentCategoryId: $commentCategoryId, sort: $sort) {
      items {
        childComment
        comment
        commentId
        userId
        userName
        commentDate
        parentCommentId
        profilePicture
      }
      page
      totalCount
    }
  }
`;

export const GET_ZIP_PDF_DOWNLOAD = gql`
  query report(
    $attachFile: Boolean
    $comments: Boolean
    $format: String
    $id: Int
    $type: Int
  ) {
    report(
      attachFile: $attachFile
      comments: $comments
      format: $format
      id: $id
      type: $type
    ) {
      fileData
    }
  }
`;

export const GET_All_MEETING = gql`
  query meetings(
    $committeeIds: String
    $date: String
    $onlyMyMeeting: Boolean
    $page: Int
    $pageSize: Int
    $searchValue: String
    $sort: String
    $screen: Int
  ) {
    meetings(
      committeeIds: $committeeIds
      date: $date
      onlyMyMeeting: $onlyMyMeeting
      page: $page
      pageSize: $pageSize
      searchValue: $searchValue
      sort: $sort
      screen: $screen
    ) {
      items {
        attachFileIds
        attendanceFeedback
        attendanceFeedbackDate
        committeeId
        committeeTitle
        creatorName
        description
        endDate
        locationId
        locationName
        meetingId
        meetingStatusId
        meetingTitle
        platformlink
        platformId
        repeat
        subjectIds
        setDate
        setTime
        endTime
        status {
          entitys
          statusCode
          statusMessage
        }
        timeZone
        workHours
        answers
        meetingStatusTitle
        yourRoleName
        subjectSuggestion
        deadlineDate
        platformlink
        userDetails {
          answer
          appointmentId
          email
          isAvailable
          isRequired
          meetingId
          roleId
          roleName
          suggestedTime
          userId
          userName
          videoConferenceId
        }
      }
    }
  }
`;

export const GET_MEETING_BY_ID = gql`
  query meeting($meetingId: Long) {
    meeting(meetingId: $meetingId) {
      attachFileIds
      availableId
      committeeId
      committeeTitle
      attendanceFeedback
      attendanceFeedbackDate
      subjectSuggestion
      creatorName
      description
      endDate
      locationId
      meetingId
      meetingStatusId
      meetingTitle
      meetingStatusTitle
      organizationIds
      platformlink
      platformId
      repeat
      required
      setDate

      status {
        entitys
        statusCode
        statusMessage
      }
      subjectIds
      subjectStatusIds
      timeZone
      userIds
      setTime
      endTime
      workHours
      yourRoleName
      deadlineDate
      userDetails {
        answer
        email
        roleId
        roleName
        userName
        isAvailable
        isRequired
        userId
        suggestedTime
      }
    }
  }
`;

export const GET_ALL_LOCATION_BY_ID = gql`
  query location($locationId: Long) {
    location(locationId: $locationId) {
      building
      city
      floor
      locationId
      googleMapURL
      peopleCapacity
      room
      street
      title
    }
  }
`;

export const GET_ALL_LOCATION = gql`
  query locations($locationType: Int) {
    locations(locationType: $locationType) {
      items {
        title
        locationId
      }
    }
  }
`;

export const GET_PLATFORMLINK = gql`
  query videoConferencePlatformLink($platformId: Long) {
    videoConferencePlatformLink(platformId: $platformId) {
      platformlink
      platformId
    }
  }
`;

export const GET_ROLES = gql`
  query roleList($taskRole: Boolean) {
    roleList(taskRole: $taskRole) {
      roles
    }
  }
`;
