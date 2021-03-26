export default [
  {
    path: '/user',
    layout: false,
    routes: [
      {
        path: '/user',
        routes: [
          {
            name: 'login',
            path: '/user/login',
            component: './User/login',
          },
        ],
      },
    ],
  },
  {
    path: '/welcome',
    name: 'welcome',
    icon: 'smile',
    component: './Welcome',
  },
  {
    path: '/admin',
    name: 'admin',
    icon: 'crown',
    access: 'canAdmin',
    component: './Admin',
    routes: [
      {
        path: '/admin/sub-page',
        name: 'sub-page',
        icon: 'smile',
        component: './Welcome',
      },
    ],
  },
  {
    name: 'dashboard',
    icon: 'DotChartOutlined',
    path: '/dashboard',
    component: './Dashboard',
  },
  {
    name: 'list.question-list',
    icon: 'QuestionOutlined',
    path: '/questions',
    component: './QuestionList',
  },
  {
    name: 'list.flow-list',
    icon: 'ApartmentOutlined',
    path: '/flows',
    hideInBreadcrumb: true,
    component: './FlowList',
  },
  {
    name: 'form.new-flow',
    icon: 'ApartmentOutlined',
    path: '/flows/new',
    component: './FlowList/Update',
    hideInMenu: true,
  },
  {
    name: 'form.update-flow',
    icon: 'ApartmentOutlined',
    path: '/flows/:flowId',
    component: './FlowList/Update',
    hideInMenu: true,
  },
  {
    path: '/broadcasts',
    name: 'list.broadcast',
    icon: 'NotificationOutlined',
    hideInBreadcrumb: true,
    routes: [
      {
        name: 'broadcast-list',
        icon: 'NotificationOutlined',
        path: '/broadcasts/broadcast-templates',
        component: './broadcast/BroadcastTemplateList',
      },
      {
        name: 'broadcast-list',
        icon: 'NotificationOutlined',
        hideInMenu: true,
        path: '/broadcasts/broadcast-templates/',
        component: './broadcast/BroadcastTemplateList',
      },
      {
        name: 'broadcast-new',
        icon: 'NotificationOutlined',
        hideInMenu: true,
        path: '/broadcasts/broadcast-templates/:templateId',
        component: './broadcast/NewBroadcast',
      },
      {
        name: 'broadcast-retarget',
        icon: 'NotificationOutlined',
        hideInMenu: true,
        path: '/broadcasts/history/:broadcastId',
        component: './broadcast/ReBroadcast',
      },
      {
        name: 'broadcast-history',
        icon: 'NotificationOutlined',
        path: '/broadcasts/history',
        component: './broadcast/BroadcastHistory',
      },
    ],
  },
  {
    name: 'list.conversation',
    icon: 'CommentOutlined',
    path: '/conversations',
    component: './ConversationList',
  },
  {
    name: 'list.grading-list',
    icon: 'EditOutlined',
    path: '/gradings',
    component: './GradingList',
  },
  {
    path: '/',
    redirect: '/welcome',
  },
  {
    component: './404',
  },
];
