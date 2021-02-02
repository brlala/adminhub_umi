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
    name: 'list.question-list',
    icon: 'table',
    path: '/questions',
    component: './QuestionList',
  },
  {
    name: 'list.flow-list',
    icon: 'ApartmentOutlined',
    path: '/flows',
    component: './FlowList',
  },
  {
    name: 'form.new-flow',
    icon: 'ApartmentOutlined',
    path: '/flows/new',
    component: './FlowList/Update',
  },
  // {
  //   name: 'list.broadcast-list',
  //   icon: 'NotificationOutlined',
  //   path: '/broadcast',
  //   component: './BroadcastList',
  // },
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
        component: './broadcast/BroadcastTemplateList/components/NewBroadcast',
      },
      {
        name: 'broadcast-history',
        icon: 'NotificationOutlined',
        path: '/broadcasts/history',
        component: './broadcast/BroadcastHistory',
      }
    ],
  },
  {
    path: '/',
    redirect: '/welcome',
  },
  {
    component: './404',
  },
];
