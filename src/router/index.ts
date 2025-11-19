import { ROUTES_E } from '@/types/routes-enums'
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: ROUTES_E.HOME,
      component: () => import('../pages/game-page.vue'),
    },
  ],
})

export default router
