const routes = [
  {
    path: '/login',
    component: () => import('pages/LoginPage.vue'),
  },
  
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/IndexPage.vue') },
               { path: 'login2', component: () => import('pages/LoginPage.vue') },
    ],
  },
  {
    path: '/paginaTeste',
    component: () => import('pages/novaPageCliente.vue'),
  },
  
  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
]

export default routes
