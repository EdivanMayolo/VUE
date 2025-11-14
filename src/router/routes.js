const routes = [
  {
    path: '/',
    component: () => import('pages/LoginPage.vue'),
  },
  {
    path: '/redefinir-senha',
    component: () => import('pages/ResetPasswordPage.vue')
  },
  {
    path: '/home',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/IndexPage.vue') },
               //{ path: 'login2', component: () => import('pages/LoginPage.vue') },
               { path: '/redefinir-senha', component: () => import('pages/ResetPasswordPage.vue')},
               { path: '/dashboard', component: () => import('pages/DashboardPage.vue') },
               { path: '/apartamento',component: () => import('pages/CadastroApartamentoPage.vue')},
    ],
  },
  
  // {
  //   path: '/home',
  //   component: () => import('layouts/MainLayout.vue'),
  //   children:[
  //     { path: '/cadastros',component: () => import('pages/CadastroMenuPage.vue')}
  //   ]
  // },

  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
]

export default routes
