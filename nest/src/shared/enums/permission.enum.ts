export enum Permission {
  // Project permissions
  MANAGE_ALL_PROJECTS = 'manage_all_projects',
  MANAGE_ASSIGNED_PROJECTS = 'manage_assigned_projects',
  VIEW_OWN_PROJECTS = 'view_own_projects',
  VIEW_ASSIGNED_PROJECTS = 'view_assigned_projects',
  CREATE_PROJECTS = 'create_projects',
  UPDATE_OWN_PROJECTS = 'update_own_projects',
  DELETE_OWN_PROJECTS = 'delete_own_projects',
  DELETE_PROJECTS = 'delete_projects',

  // Task permissions
  MANAGE_ALL_TASKS = 'manage_all_tasks',
  MANAGE_PROJECT_TASKS = 'manage_project_tasks',
  VIEW_ASSIGNED_TASKS = 'view_assigned_tasks',
  CREATE_TASKS = 'create_tasks',
  UPDATE_TASK_STATUS = 'update_task_status',
  DELETE_TASKS = 'delete_tasks',

  // Chat permissions
  MANAGE_ALL_CHATS = 'manage_all_chats',
  VIEW_PROJECT_CHATS = 'view_project_chats',
  SEND_MESSAGES = 'send_messages',
  DELETE_MESSAGES = 'delete_messages',
  CREATE_CHATS = 'create_chats',
  UPDATE_CHATS = 'update_chats',

  // Media permissions
  VIEW_ALL_MEDIA = 'view_all_media',
  UPLOAD_MEDIA = 'upload_media',
  DELETE_ANY_MEDIA = 'delete_any_media',
  DELETE_OWN_MEDIA = 'delete_own_media',

  // Content plan permissions
  MANAGE_ALL_CONTENT_PLANS = 'manage_all_content_plans',
  CREATE_CONTENT_PLANS = 'create_content_plans',
  VIEW_PROJECT_CONTENT_PLANS = 'view_project_content_plans',
  SCHEDULE_CONTENT = 'schedule_content',
  APPROVE_CONTENT = 'approve_content',

  // Storybook permissions
  MANAGE_ALL_STORYBOOKS = 'manage_all_storybooks',
  CREATE_STORYBOOKS = 'create_storybooks',
  VIEW_PROJECT_STORYBOOKS = 'view_project_storybooks',
  ACTIVATE_STORIES = 'activate_stories',

  // Social account permissions
  MANAGE_SOCIAL_ACCOUNTS = 'manage_social_accounts',
  CONNECT_SOCIAL_ACCOUNTS = 'connect_social_accounts',
  VIEW_SOCIAL_ACCOUNTS = 'view_social_accounts',
  DISCONNECT_SOCIAL_ACCOUNTS = 'disconnect_social_accounts',

  // Report permissions
  VIEW_ALL_REPORTS = 'view_all_reports',
  VIEW_PROJECT_REPORTS = 'view_project_reports',
  GENERATE_REPORTS = 'generate_reports',
  ADD_MANUAL_METRICS = 'add_manual_metrics',
  VIEW_ANALYTICS_DASHBOARD = 'view_analytics_dashboard',

  // User permissions
  MANAGE_USERS = 'manage_users',
  VIEW_USER_PROFILES = 'view_user_profiles',

  // Invitation permissions
  MANAGE_ALL_PROJECT_INVITATIONS = 'manage_all_project_invitations',
  SEND_PROJECT_INVITATIONS = 'send_project_invitations',
  VIEW_PROJECT_INVITATIONS = 'view_project_invitations',
}
