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
    name: 'New Flow',
    icon: 'ApartmentOutlined',
    path: '/flows/new',
    component: './FlowList/Update',
  },
  {
    path: '/',
    redirect: '/welcome',
  },
  {
    component: './404',
  },
];
