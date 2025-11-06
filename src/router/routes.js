const routes = [
  {
    path: '/login',
    component: () => import('pages/LoginPage.vue'),
  },  
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/IndexPage.vue') },
               { path: 'login2', component: () => import('pages/LoginPage.vue') }
               //{ path: 'paginaTeste',  component: () => import('pages/novaPageCliente.vue'),},
    ],
  },
  {
    path: '/paginaTeste',
    component: () => import('pages/novaPageCliente.vue'),
  },
  {
    path: '/dashboard',
    component: () => import('pages/DashboardPage.vue'),
  },
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
]

export default routes
