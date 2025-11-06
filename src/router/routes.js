const routes = [
  {
    path: '/login',
    component: () => import('pages/LoginPage.vue'),
  },
  // {
  //   path: '/redefinir-senha',
  //   component: () => import('pages/ResetPasswordPage.vue')
  // },
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/IndexPage.vue') },
               { path: 'login2', component: () => import('pages/LoginPage.vue') },
               { path: '/redefinir-senha', component: () => import('pages/ResetPasswordPage.vue')},
    ],
  },
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
]

export default routes


// const routes = [
//   { path: '/', redirect: '/login' },

//   { path: '/login', component: () => import('pages/LoginPage.vue') },

//   { path: '/redefinir-senha', component: () => import('pages/ResetPasswordPage.vue') },

//   // quando tiver seu dashboard real, ajuste aqui
//   { path: '/dashboard', component: () => import('pages/IndexPage.vue') },

//   { path: '/:catchAll(.*)*', component: () => import('pages/ErrorNotFound.vue') }
// ]

// export default routes
