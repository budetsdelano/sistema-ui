export const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/views/HomeView.vue')
  },
  {
    path: '/form',
    name: 'form',
    component: () => import('@/views/FormView.vue')
  },
  // {
  //   path: '/form/:id',
  //   name: 'form-detail',
  //   component: () => import('@/views/FormDetailView.vue')
  // }
];
