<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toast-notification'

const router = useRouter()
const toast = useToast()

// Données utilisateur mockées pour le développement
const user = ref({
  username: 'john.doe',
  email: 'john.doe@cofrap.com',
  createdAt: '2024-01-15',
  lastLogin: '2024-05-25',
  credentialsExpiry: '2024-07-15',
  isExpiringSoon: false
})

const stats = ref([
  { name: 'Account Status', value: 'Active', icon: '✅' },
  { name: 'Days Until Expiry', value: '51', icon: '⏰' },
  { name: 'Last Login', value: 'Today', icon: '🔐' },
  { name: 'Security Level', value: 'High', icon: '🛡️' }
])

onMounted(() => {
  // Calculer si les identifiants expirent bientôt (< 30 jours)
  const expiryDate = new Date(user.value.credentialsExpiry)
  const today = new Date()
  const daysUntilExpiry = Math.ceil((expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))

  user.value.isExpiringSoon = daysUntilExpiry <= 30
  stats.value[1].value = daysUntilExpiry.toString()

  if (user.value.isExpiringSoon) {
    toast.warning(`Your credentials will expire in ${daysUntilExpiry} days`, {
      position: 'top-right',
      duration: 5000,
    })
  }
})

const logout = () => {
  toast.success('Logged out successfully', {
    position: 'top-right',
    duration: 2000,
  })

  // TODO: Nettoyer le state d'authentification
  router.push({ name: 'login' })
}

const renewCredentials = () => {
  router.push({ name: 'renew' })
}

const viewProfile = () => {
  toast.info('Profile page coming soon', {
    position: 'top-right',
    duration: 2000,
  })
}
</script>

<template>
  <div class="min-h-full">
    <!-- Main Content -->
    <main class="py-10">
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <!-- Welcome Section -->
        <div class="mb-8">
          <h1 class="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p class="mt-1 text-sm text-gray-600">
            Manage your COFRAP account and security settings
          </p>
        </div>

        <!-- Alert for expiring credentials -->
        <div v-if="user.isExpiringSoon" class="mb-6 rounded-md bg-yellow-50 p-4">
          <div class="flex">
            <div class="flex-shrink-0">
              <svg class="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
              </svg>
            </div>
            <div class="ml-3">
              <h3 class="text-sm font-medium text-yellow-800">
                Action Required: Credentials Expiring Soon
              </h3>
              <div class="mt-2 text-sm text-yellow-700">
                <p>Your password and 2FA will expire on {{ user.credentialsExpiry }}. Please renew them to maintain access.</p>
              </div>
              <div class="mt-4">
                <button
                  @click="renewCredentials"
                  class="bg-yellow-100 px-2 py-1 text-sm font-medium text-yellow-800 rounded hover:bg-yellow-200"
                >
                  Renew Now
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Stats Grid -->
        <div class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          <div
            v-for="stat in stats"
            :key="stat.name"
            class="bg-white overflow-hidden shadow rounded-lg"
          >
            <div class="p-5">
              <div class="flex items-center">
                <div class="flex-shrink-0">
                  <span class="text-2xl">{{ stat.icon }}</span>
                </div>
                <div class="ml-5 w-0 flex-1">
                  <dl>
                    <dt class="text-sm font-medium text-gray-500 truncate">{{ stat.name }}</dt>
                    <dd class="text-lg font-medium text-gray-900">{{ stat.value }}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Account Information -->
        <div class="bg-white shadow rounded-lg">
          <div class="px-4 py-5 sm:p-6">
            <h3 class="text-lg font-medium text-gray-900 mb-4">Account Information</h3>

            <dl class="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
              <div>
                <dt class="text-sm font-medium text-gray-500">Username</dt>
                <dd class="mt-1 text-sm text-gray-900">{{ user.username }}</dd>
              </div>

              <div>
                <dt class="text-sm font-medium text-gray-500">Email</dt>
                <dd class="mt-1 text-sm text-gray-900">{{ user.email }}</dd>
              </div>

              <div>
                <dt class="text-sm font-medium text-gray-500">Account Created</dt>
                <dd class="mt-1 text-sm text-gray-900">{{ user.createdAt }}</dd>
              </div>

              <div>
                <dt class="text-sm font-medium text-gray-500">Last Login</dt>
                <dd class="mt-1 text-sm text-gray-900">{{ user.lastLogin }}</dd>
              </div>

              <div>
                <dt class="text-sm font-medium text-gray-500">Credentials Expiry</dt>
                <dd class="mt-1 text-sm" :class="user.isExpiringSoon ? 'text-yellow-600 font-medium' : 'text-gray-900'">
                  {{ user.credentialsExpiry }}
                </dd>
              </div>
            </dl>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="mt-8 flex flex-col sm:flex-row gap-4">
          <button
            @click="renewCredentials"
            class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <svg class="-ml-1 mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Renew Credentials
          </button>

          <button
            @click="viewProfile"
            class="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <svg class="-ml-1 mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            View Profile
          </button>
        </div>
      </div>
    </main>
  </div>
</template>
