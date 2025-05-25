<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { ref, onMounted } from 'vue'
import { useToast } from 'vue-toast-notification'
import QRCode from 'qrcode'

const route = useRoute()
const router = useRouter()
const toast = useToast()

// Données mockées pour le développement frontend
const mockCredentials = {
  username: 'john.doe',
  password: 'Abc123!@#XyzQwerty789$%^&*',
  totpSecret: 'JBSWY3DPEHPK3PXP', // Secret TOTP en Base32
  issuer: 'COFRAP'
}

const qrData = ref({
  username: '',
  passwordQR: '',
  totpQR: '',
  generatedPassword: '',
  isLoading: true
})

const showPassword = ref(false)
const step = ref(1) // 1: Password QR, 2: 2FA QR, 3: Instructions

// Générer les QR codes
const generateQRCodes = async (username: string, password: string, totpSecret: string) => {
  try {
    // QR code pour le mot de passe (simple texte)
    const passwordQR = await QRCode.toDataURL(password, {
      width: 256,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      }
    })

    // QR code pour TOTP (format URI standard)
    const totpUri = `otpauth://totp/${encodeURIComponent(mockCredentials.issuer)}:${encodeURIComponent(username)}?secret=${totpSecret}&issuer=${encodeURIComponent(mockCredentials.issuer)}&algorithm=SHA1&digits=6&period=30`

    const totpQR = await QRCode.toDataURL(totpUri, {
      width: 256,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      }
    })

    return { passwordQR, totpQR }
  } catch (error) {
    console.error('Erreur génération QR codes:', error)
    throw error
  }
}

onMounted(async () => {
  try {
    // En production, récupérer les données des props de route ou API
    const username = (route.query.username as string) || mockCredentials.username
    const isRenewal = route.query.renewed === 'true'

    if (isRenewal) {
      toast.info('Renouvellement des identifiants - Données simulées', {
        position: 'top-right',
        duration: 3000,
      })
    }

    // Générer les QR codes
    const { passwordQR, totpQR } = await generateQRCodes(
      username,
      mockCredentials.password,
      mockCredentials.totpSecret
    )

    qrData.value = {
      username,
      passwordQR,
      totpQR,
      generatedPassword: mockCredentials.password,
      isLoading: false
    }

    if (!route.query.username) {
      toast.info('Mode développement - QR codes générés localement', {
        position: 'top-right',
        duration: 3000,
      })
    }

  } catch (error) {
    console.error('Erreur lors de l\'initialisation:', error)
    toast.error('Erreur lors de la génération des QR codes', {
      position: 'top-right',
      duration: 4000,
    })
    qrData.value.isLoading = false
  }
})

const nextStep = () => {
  if (step.value < 3) {
    step.value++
  }
}

const prevStep = () => {
  if (step.value > 1) {
    step.value--
  }
}

const completeSetup = () => {
  toast.success('Account setup completed! Please login with your credentials.', {
    position: 'top-right',
    duration: 4000,
  })

  router.push({ name: 'login' })
}

const regenerateCredentials = async () => {
  try {
    qrData.value.isLoading = true
    toast.info('Génération de nouveaux QR codes...', {
      position: 'top-right',
      duration: 2000,
    })

    // Simuler une nouvelle génération (en attendant les fonctions OpenFaaS)
    await new Promise(resolve => setTimeout(resolve, 1500))

    // Générer de nouveaux QR codes
    const newPassword = 'NewPass123!@#XyzAbc789$%^&*'
    const newTotpSecret = 'KBZXE4LGNFRWQZDI' // Nouveau secret TOTP

    const { passwordQR, totpQR } = await generateQRCodes(
      qrData.value.username,
      newPassword,
      newTotpSecret
    )

    qrData.value.passwordQR = passwordQR
    qrData.value.totpQR = totpQR
    qrData.value.generatedPassword = newPassword
    qrData.value.isLoading = false

    // Reset à l'étape 1
    step.value = 1

    toast.success('Nouveaux QR codes générés avec succès!', {
      position: 'top-right',
      duration: 3000,
    })

  } catch (error) {
    console.error('Erreur régénération:', error)
    toast.error('Erreur lors de la régénération', {
      position: 'top-right',
      duration: 3000,
    })
    qrData.value.isLoading = false
  }
}
</script>

<template>
  <div class="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-2xl">
      <img
        class="mx-auto h-10 w-auto"
        src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=600"
        alt="COFRAP"
      />
      <h2 class="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900">
        Account Setup Complete
      </h2>
      <p class="mt-2 text-center text-sm text-gray-600">
        Welcome <span class="font-medium text-indigo-600">{{ qrData.username }}</span>!
        Please scan the QR codes below to complete your setup.
      </p>
    </div>

    <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-2xl">
      <!-- Loading State -->
      <div v-if="qrData.isLoading" class="text-center py-12">
        <div class="inline-flex items-center px-4 py-2 font-semibold leading-6 text-sm shadow rounded-md text-white bg-indigo-500">
          <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Generating QR Codes...
        </div>
      </div>

      <!-- QR Setup Content -->
      <div v-else>
      <!-- Progress indicator -->
      <div class="mb-8">
        <div class="flex items-center justify-between text-sm font-medium text-gray-500">
          <span :class="step >= 1 ? 'text-indigo-600' : ''">Password</span>
          <span :class="step >= 2 ? 'text-indigo-600' : ''">2FA Setup</span>
          <span :class="step >= 3 ? 'text-indigo-600' : ''">Complete</span>
        </div>
        <div class="mt-2 h-2 bg-gray-200 rounded-full">
          <div
            class="h-2 bg-indigo-600 rounded-full transition-all duration-300"
            :style="{ width: `${(step / 3) * 100}%` }"
          ></div>
        </div>
      </div>

      <!-- Step 1: Password QR -->
      <div v-if="step === 1" class="space-y-6">
        <div class="text-center">
          <h3 class="text-lg font-medium text-gray-900 mb-4">Step 1: Save Your Password</h3>

          <!-- Password QR Code -->
          <div class="bg-white p-6 rounded-lg border-2 border-dashed border-gray-300 mb-6">
            <img
              :src="qrData.passwordQR"
              alt="Password QR Code"
              class="mx-auto w-48 h-48 bg-gray-100 rounded"
            />
            <p class="mt-2 text-sm text-gray-500">Scan this QR code to save your password</p>
          </div>

          <!-- Generated Password (optional display) -->
          <div class="bg-gray-50 p-4 rounded-lg mb-6">
            <div class="flex items-center justify-between">
              <span class="text-sm font-medium text-gray-700">Generated Password:</span>
              <button
                @click="showPassword = !showPassword"
                class="text-sm text-indigo-600 hover:text-indigo-500"
              >
                {{ showPassword ? 'Hide' : 'Show' }}
              </button>
            </div>
            <div class="mt-2 font-mono text-sm break-all">
              {{ showPassword ? qrData.generatedPassword : '••••••••••••••••••••••••' }}
            </div>
          </div>

          <button
            @click="nextStep"
            class="w-full flex justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-indigo-500"
          >
            I've Saved My Password - Continue
          </button>
        </div>
      </div>

      <!-- Step 2: 2FA QR -->
      <div v-if="step === 2" class="space-y-6">
        <div class="text-center">
          <h3 class="text-lg font-medium text-gray-900 mb-4">Step 2: Setup Two-Factor Authentication</h3>

          <!-- 2FA QR Code -->
          <div class="bg-white p-6 rounded-lg border-2 border-dashed border-gray-300 mb-6">
            <img
              :src="qrData.totpQR"
              alt="2FA QR Code"
              class="mx-auto w-48 h-48 bg-gray-100 rounded"
            />
            <p class="mt-2 text-sm text-gray-500">Scan with Google Authenticator or similar app</p>
          </div>

          <!-- Instructions -->
          <div class="bg-blue-50 p-4 rounded-lg mb-6 text-left">
            <h4 class="font-medium text-blue-900 mb-2">Instructions:</h4>
            <ol class="list-decimal list-inside text-sm text-blue-800 space-y-1">
              <li>Install Google Authenticator or similar TOTP app</li>
              <li>Scan the QR code above</li>
              <li>Your app will generate 6-digit codes every 30 seconds</li>
              <li>Use these codes for login authentication</li>
            </ol>
          </div>

          <div class="flex space-x-3">
            <button
              @click="prevStep"
              class="flex-1 rounded-md bg-gray-200 px-3 py-1.5 text-sm font-semibold text-gray-700 hover:bg-gray-300"
            >
              Back
            </button>
            <button
              @click="nextStep"
              class="flex-1 rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-indigo-500"
            >
              I've Setup 2FA - Continue
            </button>
          </div>
        </div>
      </div>

      <!-- Step 3: Complete -->
      <div v-if="step === 3" class="space-y-6">
        <div class="text-center">
          <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
            <svg class="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>

          <h3 class="text-lg font-medium text-gray-900 mb-4">Setup Complete!</h3>

          <div class="bg-green-50 p-4 rounded-lg mb-6">
            <p class="text-sm text-green-800">
              Your COFRAP account is now ready. You can now sign in using:
            </p>
            <ul class="mt-2 text-sm text-green-700 space-y-1">
              <li>• Username: <span class="font-medium">{{ qrData.username }}</span></li>
              <li>• Your saved password</li>
              <li>• 6-digit code from your authenticator app</li>
            </ul>
          </div>

          <div class="space-y-3">
            <button
              @click="completeSetup"
              class="w-full flex justify-center rounded-md bg-green-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-green-500"
            >
              Go to Login
            </button>

            <button
              @click="regenerateCredentials"
              class="w-full flex justify-center rounded-md bg-gray-200 px-3 py-1.5 text-sm font-semibold text-gray-700 hover:bg-gray-300"
            >
              Regenerate Credentials
            </button>
          </div>
        </div>
              </div>
      </div>
    </div>
  </div>
</template>
