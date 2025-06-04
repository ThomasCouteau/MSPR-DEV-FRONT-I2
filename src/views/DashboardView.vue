<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toast-notification'

const router = useRouter()
const toast = useToast()

const logout = () => {
  toast.success('Logged out successfully', {
    position: 'top-right',
    duration: 3000,
  })
  router.push({ name: 'login' })
}

const renewCredentials = () => {
  router.push({ name: 'renew' })
}
</script>

<template>
  <div class="min-h-screen bg-gray-100">
    <!-- Navigation -->
    <nav class="bg-indigo-600 shadow">
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div class="flex h-16 justify-between">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <img
                class="h-8 w-8"
                src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=white"
                alt="COFRAP"
              />
            </div>
            <div class="ml-4">
              <h1 class="text-xl font-semibold text-white">COFRAP Dashboard</h1>
            </div>
          </div>
          <div class="flex items-center space-x-4">
            <button
              @click="renewCredentials"
              class="rounded-md bg-indigo-500 px-3 py-2 text-sm font-medium text-white hover:bg-indigo-400"
            >
              Renew Credentials
            </button>
            <button
              @click="logout"
              class="rounded-md bg-red-600 px-3 py-2 text-sm font-medium text-white hover:bg-red-500"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>

    <!-- Main content -->
    <main class="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
      <div class="px-4 py-6 sm:px-0">
        <div class="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <!-- Welcome Card -->
          <div class="lg:col-span-2">
            <div class="overflow-hidden rounded-lg bg-white shadow">
              <div class="px-4 py-5 sm:p-6">
                <h3 class="text-lg font-medium leading-6 text-gray-900">
                  Welcome to COFRAP
                </h3>
                <div class="mt-2 max-w-xl text-sm text-gray-500">
                  <p>
                    You have successfully logged in to your COFRAP account. Your credentials are secure and up to date.
                  </p>
                </div>
                <div class="mt-5">
                  <div class="rounded-md bg-green-50 p-4">
                    <div class="flex">
                      <div class="flex-shrink-0">
                        <svg class="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                        </svg>
                      </div>
                      <div class="ml-3">
                        <h3 class="text-sm font-medium text-green-800">
                          Security Status: Active
                        </h3>
                        <div class="mt-2 text-sm text-green-700">
                          <p>Your 2FA is enabled and your credentials are current.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Security Info Card -->
          <div>
            <div class="overflow-hidden rounded-lg bg-white shadow">
              <div class="px-4 py-5 sm:p-6">
                <h3 class="text-lg font-medium leading-6 text-gray-900">
                  Security Information
                </h3>
                <div class="mt-4 space-y-4">
                  <div class="flex items-center justify-between">
                    <span class="text-sm text-gray-500">Password Strength</span>
                    <span class="text-sm font-medium text-green-600">Strong (24 chars)</span>
                  </div>
                  <div class="flex items-center justify-between">
                    <span class="text-sm text-gray-500">2FA Status</span>
                    <span class="text-sm font-medium text-green-600">Enabled</span>
                  </div>
                  <div class="flex items-center justify-between">
                    <span class="text-sm text-gray-500">Last Login</span>
                    <span class="text-sm font-medium text-gray-900">Just now</span>
                  </div>
                  <div class="flex items-center justify-between">
                    <span class="text-sm text-gray-500">Next Renewal</span>
                    <span class="text-sm font-medium text-orange-600">In 6 months</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Quick Actions -->
          <div class="lg:col-span-3">
            <div class="overflow-hidden rounded-lg bg-white shadow">
              <div class="px-4 py-5 sm:p-6">
                <h3 class="text-lg font-medium leading-6 text-gray-900">
                  Quick Actions
                </h3>
                <div class="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  <button
                    @click="renewCredentials"
                    class="relative rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  >
                    <div class="flex items-center space-x-3">
                      <div class="flex-shrink-0">
                        <svg class="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                      </div>
                      <div class="min-w-0 flex-1">
                        <p class="text-sm font-medium text-gray-900">Renew Credentials</p>
                        <p class="text-sm text-gray-500">Update password & 2FA</p>
                      </div>
                    </div>
                  </button>

                  <div class="relative rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm">
                    <div class="flex items-center space-x-3">
                      <div class="flex-shrink-0">
                        <svg class="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div class="min-w-0 flex-1">
                        <p class="text-sm font-medium text-gray-900">Account Status</p>
                        <p class="text-sm text-gray-500">Active & Secure</p>
                      </div>
                    </div>
                  </div>

                  <div class="relative rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm">
                    <div class="flex items-center space-x-3">
                      <div class="flex-shrink-0">
                        <svg class="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                      </div>
                      <div class="min-w-0 flex-1">
                        <p class="text-sm font-medium text-gray-900">Security Score</p>
                        <p class="text-sm text-gray-500">98/100</p>
                      </div>
                    </div>
                  </div>

                  <div class="relative rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm">
                    <div class="flex items-center space-x-3">
                      <div class="flex-shrink-0">
                        <svg class="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div class="min-w-0 flex-1">
                        <p class="text-sm font-medium text-gray-900">Help & Support</p>
                        <p class="text-sm text-gray-500">Get assistance</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>
