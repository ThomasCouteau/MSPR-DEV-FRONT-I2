<script setup lang="ts">
import { useRouter } from 'vue-router'
import { computed, ref } from 'vue'
import { useToast } from 'vue-toast-notification'
import 'vue-toast-notification/dist/theme-sugar.css'
import TotpCode from '@/components/TotpCode.vue'
import { authenticateUser } from '@/services/api'

const router = useRouter()

const user = ref({
  email: '',
  password: '',
  totpCode: ''
})

const isLoading = ref(false)
const toast = useToast()

const successToast = () => {
  toast.success('Login successful!', {
    position: 'top-right',
    duration: 3000,
    dismissible: true,
    pauseOnHover: true,
  })
}

const formIsValid = computed(() => {
  return user.value.email.trim() !== '' && user.value.password.trim() !== '' && user.value.totpCode.length === 6
})

const handleTotpUpdate = (code: string) => {
  user.value.totpCode = code
}

const handleTotpComplete = (code: string) => {
  user.value.totpCode = code
  console.log('Code TOTP complet:', code)
}

const handleSubmit = async () => {
  if (!user.value.totpCode || user.value.totpCode.length !== 6) {
    toast.error('Veuillez saisir le code 2FA complet', {
      position: 'top-right',
      duration: 3000,
    })
    return
  }

  isLoading.value = true

  try {
    console.log('Tentative de connexion avec:', user.value.email)

    const response = await authenticateUser(
      user.value.email,
      user.value.password,
      user.value.totpCode
    )

    console.log('Réponse authentification:', response)

    // Adapter selon le format de votre réponse JSON
    if (response.success || response.message?.includes('success')) {
      successToast()
      router.push('/dashboard')
    } else {
      // Vérifier si les identifiants ont expiré
      if (response.message?.includes('expired')) {
        toast.error('Vos identifiants ont expiré. Veuillez les renouveler.', {
          position: 'top-right',
          duration: 5000,
        })
        router.push({
          name: 'renew',
          query: { username: user.value.email }
        })
      } else {
        toast.error(response.message || 'Erreur d\'authentification', {
          position: 'top-right',
          duration: 4000,
        })
      }
    }

  } catch (error) {
    console.error('Erreur de connexion:', error)
    toast.error('Erreur de connexion. Veuillez réessayer.', {
      position: 'top-right',
      duration: 3000,
    })
  } finally {
    isLoading.value = false
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
        Sign in to your account
      </h2>
    </div>

    <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
      <form class="space-y-6" action="#" method="POST" @submit.prevent="handleSubmit">
        <div>
          <label for="email" class="block text-sm/6 font-medium text-gray-900">Username</label>
          <div class="mt-2">
            <input
              v-model="user.email"
              type="text"
              name="email"
              id="email"
              autocomplete="username"
              required
              :disabled="isLoading"
              class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6 disabled:bg-gray-50"
            />
          </div>
        </div>

        <div>
          <div class="flex items-center justify-between">
            <label for="password" class="block text-sm/6 font-medium text-gray-900">Password</label>
            <div class="text-sm">
              <a href="#" class="font-semibold text-indigo-600 hover:text-indigo-500"
                >Forgot password?</a
              >
            </div>
          </div>
          <div class="mt-2">
            <input
              v-model="user.password"
              type="password"
              name="password"
              id="password"
              autocomplete="current-password"
              required
              :disabled="isLoading"
              class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6 disabled:bg-gray-50"
            />
          </div>
        </div>

        <div>
          <label class="block text-sm/6 font-medium text-gray-900 mb-2">Code d'authentification (2FA)</label>
          <TotpCode
            :model-value="user.totpCode"
            @update:model-value="handleTotpUpdate"
            @complete="handleTotpComplete"
          />
        </div>

        <div>
          <button
            :disabled="!formIsValid || isLoading"
            type="submit"
            class="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            <span v-if="isLoading" class="flex items-center">
              <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Connexion...
            </span>
            <span v-else>Sign in</span>
          </button>
        </div>
      </form>

      <p class="mt-10 text-center text-sm/6 text-gray-500">
        Not a member ?
        <a
          href="#"
          @click="router.push({ name: 'signup' })"
          class="font-semibold text-indigo-600 hover:text-indigo-500"
        >
          Create your account
        </a>
      </p>
    </div>
  </div>
</template>
