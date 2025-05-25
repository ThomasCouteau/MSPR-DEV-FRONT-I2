import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '@/views/LoginView.vue'
import SignUpView from '@/views/SignUpView.vue'
import QRSetupView from '@/views/QRSetupView.vue'
import DashboardView from '@/views/DashboardView.vue'
import RenewView from '@/views/RenewView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'login',
      component: LoginView,
    },
    {
      path: '/signup',
      name: 'signup',
      component: SignUpView,
    },
    {
      path: '/qr-setup',
      name: 'qr-setup',
      component: QRSetupView,
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: DashboardView,
      meta: { requiresAuth: true }
    },
    {
      path: '/renew',
      name: 'renew',
      component: RenewView,
    }
  ],
})

// Guard pour les routes protégées (à implémenter plus tard avec votre auth)
router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth) {
    // TODO: Vérifier si l'utilisateur est connecté
    // Pour l'instant, on laisse passer
    next()
  } else {
    next()
  }
})

export default router
