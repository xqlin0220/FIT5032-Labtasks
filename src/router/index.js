import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import AboutView from '@/views/AboutView.vue'
import FirebaseRegisterView from '@/views/FirebaseRegisterView.vue'
import FirebaseSigninView from '@/views/FirebaseSigninView.vue'
import AddBookView from '@/views/AddBookView.vue'
import GetBookCountView from '@/views/GetBookCountView.vue'

import { isAuthenticated, currentUserRole, waitUntilAuthReady } from '@/stores/firebaseAuth'

const routes = [
  { path: '/', name: 'Home', component: HomeView },
  {
    path: '/about',
    name: 'About',
    component: AboutView,
    meta: { requiresAuth: true, roles: ['admin'] } 
  },
  { path: '/signin', name: 'Signin', component: FirebaseSigninView,   meta: { guestOnly: true } },
  { path: '/signup', name: 'Signup', component: FirebaseRegisterView, meta: { guestOnly: true } },
  {
    path: '/books/add',
    name: 'AddBook',
    component: () => import('@/views/AddBookView.vue'),
    meta: { requiresAuth: true, roles: ['admin', 'user'] } 
  },
  { path: '/GetBookCount', name: 'GetBookCount', component: GetBookCountView }
]

const router = createRouter({ history: createWebHistory(), routes })

router.beforeEach(async (to) => {
  await waitUntilAuthReady()
  console.log('[Guard]', {
    to: to.fullPath,
    requiresAuth: to.meta?.requiresAuth,
    roles: to.meta?.roles,
    isAuthenticated: isAuthenticated.value,
    role: currentUserRole.value,
  })

  if (to.meta?.guestOnly && isAuthenticated.value) {
    return { name: currentUserRole.value === 'admin' ? 'About' : 'Home' }
  }

  if (to.meta?.requiresAuth && !isAuthenticated.value) {
    return { name: 'Signin', query: { redirect: to.fullPath } }
  }

  if (to.meta?.roles?.length) {
    const role = currentUserRole.value
    if (!role || !to.meta.roles.includes(role)) {
      return { name: 'Home', query: { reason: 'forbidden' } }
    }
  }

  return true
})

export default router