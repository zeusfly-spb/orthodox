import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

// Auth Views
import Login from '@/views/auth/Login.vue'
// import Register from '@/views/auth/Register.vue'
// import ForgotPassword from '@/views/auth/ForgotPassword.vue'
// import ResetPassword from '@/views/auth/ResetPassword.vue'

// Dashboard Views
// import Dashboard from '@/views/dashboard/Dashboard.vue'
// import TourList from '@/views/dashboard/views/tours/TourList.vue'
// import CustomerList from '@/views/dashboard/views/customers/CustomerList.vue'
// import BookingList from '@/views/dashboard/views/bookings/BookingList.vue'

const routes = [
  {
    path: '/auth',
    name: 'auth',
    component: () => import('@/views/auth/AuthLayout.vue'),
    meta: { guestOnly: true },
    children: [
      {
        path: '/login',
        name: 'login',
        component: Login,
        meta: { guestOnly: true },
      },
      {
        path: '/register',
        name: 'register',
        component: () => import('@/views/auth/Register.vue'),
        meta: { guestOnly: true },
      },
    ]
  },
  {
    path: '/forgot-password',
    name: 'forgot-password',
    component: () => import('@/views/auth/ForgotPassword.vue'),
    meta: { guestOnly: true },
  },
  {
    path: '/reset-password',
    name: 'reset-password',
    component: () => import('@/views/auth/ResetPassword.vue'),
    meta: { guestOnly: true },
  },
  {
    path: '/email/verify/code',
    name: 'email-verify-code',
    component: () => import('@/views/auth/VerificationCode.vue'),
    meta: { requiresAuth: false },
  },
  {
    path: '/email/verify/:id/:hash',
    name: 'email-verify',
    component: () => import('@/views/auth/EmailVerification.vue'),
    props: (route) => ({
      id: route.params.id,
      hash: route.params.hash,
      signature: route.query.signature,
      expires: route.query.expires,
    }),
    meta: { requiresAuth: false },
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: () => import('@/views/dashboard/MainLayout.vue'),
    meta: { requiresAuth: true },
    children: [
      {
        path: '/',
        name: 'home',
        component: () => import('@/views/dashboard/views/operator/Profile.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: 'tours',
        name: 'tours-list',
        component: () => import('@/views/dashboard/views/tours/TourList.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: 'tours/new',
        name: 'tour-create',
        component: () => import('@/views/dashboard/views/tours/TourFormPage/index.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: 'tours/:id/edit',
        name: 'tour-edit',
        component: () => import('@/views/dashboard/views/tours/TourFormPage/index.vue'),
        meta: { requiresAuth: true },
        props: true,
      },
      {
        path: 'bookings',
        name: 'tours-bookings-list',
        component: () => import('@/views/dashboard/views/bookings/BookingList.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: 'customers',
        name: 'customers-list',
        component: () => import('@/views/dashboard/views/customers/CustomerList.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: 'partners',
        name: 'partners-list',
        component: () => import('@/views/dashboard/views/partners/PartnerList.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: 'operator',
        name: 'operator-view',
        component: () => import('@/views/dashboard/views/operator/Profile.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: 'orders',
        name: 'orders',
        component: () => import('@/views/dashboard/views/orders/Orders.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: 'orders/edit/:id',
        name: 'order-edit',
        component: () => import('@/views/dashboard/views/orders/EditOrder.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: 'entities',
        name: 'entities-view',
        component: () => import('@/views/dashboard/views/entities/EntityList.vue'),
        meta: { requiresAuth: true },
      },
    ],
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('@/views/errors/NotFound.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior() {
    return { top: 0 };
  },
  routes,
})

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()

  if (authStore.accessToken && !authStore.isInitialized) {
    try {
      await authStore.initializeAuth()
    } catch (error) {
      console.error('Failed to initialize auth:', error)
    }
  }

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next({ name: 'login' })
  } else if (to.meta.requiresAuth && authStore.isAuthenticated && !authStore.isEmailVerified) {
    next({ name: 'email-verify-code' })
  } else if (to.meta.guestOnly && authStore.isAuthenticated) {
    next({ name: 'dashboard-home' })
  } else {
    next()
  }
})

export default router
