<script setup lang="ts">
import { useRouter } from 'vue-router'
import { ref } from 'vue'
import { useToast } from 'vue-toast-notification'
import 'vue-toast-notification/dist/theme-sugar.css'

const router = useRouter()

const user = ref({
  username: ''
})

const toast = useToast()
const isLoading = ref(false)

const successToast = () => {
  toast.success('Account created successfully! Please scan your QR codes.', {
    position: 'top-right',
    duration: 5000,
    dismissible: true,
    pauseOnHover: true,
  })
}

const errorToast = (message: string) => {
  toast.error(message, {
    position: 'top-right',
    duration: 4000,
    dismissible: true,
  })
}

const handleSubmit = async () => {
  if (!user.value.username.trim()) {
    errorToast('Please enter a username')
    return
  }

  if (user.value.username.length < 3) {
    errorToast('Username must be at least 3 characters long')
    return
  }

  isLoading.value = true

  try {
    console.log('Creating account for:', user.value.username)

    // Étape 1: Générer le mot de passe
    //const passwordResponse = await generatePassword(user.value.username)

    // Étape 2: Générer le secret 2FA
    //const totpResponse = await generate2FA(user.value.username)

    //if (passwordResponse.success && totpResponse.success) {
      successToast()

      // Rediriger vers la page d'affichage des QR codes avec les données
      router.push({
        name: 'qr-setup',
        //query: {
        //   username: user.value.username,
        //   passwordQR: passwordResponse.qrcode_base64,
        //   totpQR: totpResponse.qrcode_base64
        // }
      })
    //} else {
      //throw new Error('Failed to generate credentials')
    //}

  } catch (error) {
    console.error('Error creating account:', error)
    errorToast('Failed to create account. Please try again.')
  } finally {
    isLoading.value = false
  }
}

// Fonctions pour appeler les API OpenFaaS
const generatePassword = async (username: string) => {
  try {
    const response = await fetch('/function/generate-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username })
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error('Error generating password:', error)
    throw error
  }
}

const generate2FA = async (username: string) => {
  try {
    const response = await fetch('/function/generate-2fa', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username })
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error('Error generating 2FA:', error)
    throw error
  }
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
        Create your COFRAP account
      </h2>
      <p class="mt-2 text-center text-sm text-gray-600">
        Your password and 2FA will be generated automatically for security
      </p>
    </div>

    <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
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
            Minimum 3 characters
          </p>
        </div>

        <!-- Information sur le processus automatique -->
        <div class="rounded-md bg-blue-50 p-4">
          <div class="flex">
            <div class="flex-shrink-0">
              <svg class="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
              </svg>
            </div>
            <div class="ml-3">
              <h3 class="text-sm font-medium text-blue-800">
                Automatic Security Setup
              </h3>
              <div class="mt-2 text-sm text-blue-700">
                <p>After creating your account, we will automatically:</p>
                <ul class="list-disc list-inside mt-1">
                  <li>Generate a secure 24-character password</li>
                  <li>Create a 2FA secret for enhanced security</li>
                  <li>Provide QR codes for easy setup</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div>
          <button
            type="submit"
            :disabled="isLoading || !user.username.trim()"
            class="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            <span v-if="isLoading" class="flex items-center">
              <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Creating Account...
            </span>
            <span v-else>Create Account</span>
          </button>
        </div>
      </form>

      <p class="mt-10 text-center text-sm/6 text-gray-500">
        Already have an account?
        {{ ' ' }}
        <a
          href="#"
          @click="router.push({ name: 'login' })"
          class="font-semibold text-indigo-600 hover:text-indigo-500"
        >
          Sign in
        </a>
      </p>
    </div>
  </div>
</template>
