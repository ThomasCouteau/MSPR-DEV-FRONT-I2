<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router'
import { ref, onMounted } from 'vue'
import { useToast } from 'vue-toast-notification'
import { generatePassword, generate2FA } from '@/services/api'

const router = useRouter()
const route = useRoute()
const toast = useToast()

const user = ref({
  username: ''
})

const isLoading = ref(false)

// Pré-remplir le username si fourni via query params
onMounted(() => {
  if (route.query.username) {
    user.value.username = route.query.username as string
  }
})

const handleSubmit = async () => {
  if (!user.value.username.trim()) {
    toast.error('Please enter your username', {
      position: 'top-right',
      duration: 3000,
    })
    return
  }

  if (user.value.username.length < 3) {
    toast.error('Username must be at least 3 characters long', {
      position: 'top-right',
      duration: 3000,
    })
    return
  }

  isLoading.value = true

  try {
    // Étape 1: Générer un nouveau mot de passe
    toast.info('Génération d\'un nouveau mot de passe...', {
      position: 'top-right',
      duration: 2000,
    })

    const passwordResponse = await generatePassword(user.value.username)

    // Étape 2: Générer un nouveau secret 2FA
    toast.info('Génération d\'un nouveau secret 2FA...', {
      position: 'top-right',
      duration: 2000,
    })

    const totpResponse = await generate2FA(user.value.username)

    toast.success('Credentials renewed successfully! Please scan your new QR codes.', {
      position: 'top-right',
      duration: 5000,
    })

    // Rediriger vers QR Setup avec nouvelles données
    router.push({
      name: 'qr-setup',
      query: {
        username: user.value.username,
        passwordQR: passwordResponse.qrcode_base64 || passwordResponse.qrcode,
        totpQR: totpResponse.qrcode_base64 || totpResponse.qrcode,
        password: passwordResponse.password || 'Generated password',
        renewed: 'true'
      }
    })

  } catch (error) {
    console.error('Error renewing credentials:', error)
    toast.error('Failed to renew credentials. Please try again.', {
      position: 'top-right',
      duration: 4000,
    })
  } finally {
    isLoading.value = false
  }
}

const goBack = () => {
  router.go(-1)
}
</script>

<template>
  <div class="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-sm">
      <img
        class="mx-auto h-10 w-auto"
        src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=600"
        alt="COFRAP"
      />
      <h2 class="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900">
        Renew Your Credentials
      </h2>
      <p class="mt-2 text-center text-sm text-gray-600">
        Your current credentials have expired or will expire soon
      </p>
    </div>

    <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
      <!-- Warning Alert -->
      <div class="mb-6 rounded-md bg-yellow-50 p-4">
        <div class="flex">
          <div class="flex-shrink-0">
            <svg class="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
            </svg>
          </div>
          <div class="ml-3">
            <h3 class="text-sm font-medium text-yellow-800">
              Credential Renewal Required
            </h3>
            <div class="mt-2 text-sm text-yellow-700">
              <p>Your password and 2FA credentials are older than 6 months and need to be renewed for security purposes.</p>
            </div>
          </div>
        </div>
      </div>

      <form class="space-y-6" @submit.prevent="handleSubmit">
        <div>
          <label for="username" class="block text-sm/6 font-medium text-gray-900">
            Username <span class="text-red-500">*</span>
          </label>
          <div class="mt-2">
            <input
              v-model="user.username"
              type="text"
              name="username"
              id="username"
              autocomplete="username"
              required
              :disabled="isLoading"
              placeholder="Enter your username"
              class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6 disabled:bg-gray-50 disabled:text-gray-500"
            />
          </div>
          <p class="mt-1 text-xs text-gray-500">
            Enter the username for which you want to renew credentials
          </p>
        </div>

        <!-- Information about renewal process -->
        <div class="rounded-md bg-blue-50 p-4">
          <div class="flex">
            <div class="flex-shrink-0">
              <svg class="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
              </svg>
            </div>
            <div class="ml-3">
              <h3 class="text-sm font-medium text-blue-800">
                Renewal Process
              </h3>
              <div class="mt-2 text-sm text-blue-700">
                <p>After renewal, you will receive:</p>
                <ul class="list-disc list-inside mt-1">
                  <li>A new secure password (24 characters)</li>
                  <li>A new 2FA secret</li>
                  <li>New QR codes for easy setup</li>
                  <li>Extended validity for 6 more months</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div class="flex space-x-3">
          <button
            type="button"
            @click="goBack"
            :disabled="isLoading"
            class="flex-1 rounded-md bg-gray-200 px-3 py-1.5 text-sm/6 font-semibold text-gray-700 hover:bg-gray-300 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed"
          >
            Cancel
          </button>

          <button
            type="submit"
            :disabled="isLoading || !user.username.trim()"
            class="flex-1 rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white hover:bg-indigo-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            <span v-if="isLoading" class="flex items-center justify-center">
              <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Renewing...
            </span>
            <span v-else>Renew Credentials</span>
          </button>
        </div>
      </form>

      <p class="mt-10 text-center text-sm/6 text-gray-500">
        Need help?
        {{ ' ' }}
        <a href="#" class="font-semibold text-indigo-600 hover:text-indigo-500">
          Contact Support
        </a>
      </p>
    </div>
  </div>
</template>
