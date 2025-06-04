const API_BASE_URL = import.meta.env.DEV ? '/api' : 'https://mspr-openfaas.hiboukstore.com/function'

export interface User {
  username: string
  password: string
  otp: string
}

export interface ApiResponse {
  success: boolean
  message?: string
  data?: any
  qrcode?: string
}

export interface GeneratePasswordResponse {
  success: boolean
  qrcode_base64: string
  password: string
}

export interface Generate2FAResponse {
  success: boolean
  qrcode_base64: string
  secret: string
}

export interface AuthResponse {
  success: boolean
  message: string
  expired?: boolean
}

class ApiService {
  private async makeRequest(endpoint: string, data: any): Promise<any> {
    try {
      const response = await fetch(`${API_BASE_URL}/${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'origin': 'http://82.66.185.206:16651'
        },
        body: JSON.stringify(data)
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const responseText = await response.text()

      // Vérifier si la réponse est une image base64 (QR code)
      if (responseText.startsWith('iVBORw0KGgo') || responseText.startsWith('data:image')) {
        return {
          success: true,
          qrcode_base64: responseText.startsWith('data:') ? responseText : `data:image/png;base64,${responseText}`
        }
      }

      // Essayer de parser comme JSON
      try {
        return JSON.parse(responseText)
      } catch {
        // Si ce n'est pas du JSON, retourner le texte brut
        return {
          success: responseText !== 'Missing credentials',
          message: responseText,
          data: responseText
        }
      }

    } catch (error) {
      console.error(`Error calling ${endpoint}:`, error)
      throw error
    }
  }

  /**
   * Génère un mot de passe sécurisé et retourne un QR code
   */
  async generatePassword(username: string): Promise<GeneratePasswordResponse> {
    const response = await this.makeRequest('gen-password', { username })

    return {
      success: response.success || (response.qrcode_base64 ? true : false),
      qrcode_base64: response.qrcode_base64,
      password: response.password || 'Generated password (see QR code)'
    }
  }

  /**
   * Génère un secret 2FA et retourne un QR code
   */
  async generate2FA(username: string): Promise<Generate2FAResponse> {
    const response = await this.makeRequest('generate2fa', { username })

    return {
      success: response.success,
      qrcode_base64: response.qrcode_base64,
      secret: response.secret || 'Generated 2FA secret (see QR code)'
    }
  }

  /**
   * Authentifie un utilisateur avec username, password et code OTP
   */
  async authenticateUser(username: string, password: string, otp: string): Promise<AuthResponse> {
    const response = await this.makeRequest('authuser', {
      username,
      password,
      otp
    })

    // Gérer les différents cas de réponse
    if (response.message === 'Missing credentials') {
      return {
        success: false,
        message: 'Veuillez fournir tous les identifiants requis'
      }
    }

    if (response.message && response.message.includes('expired')) {
      return {
        success: false,
        message: 'Vos identifiants ont expiré. Veuillez les renouveler.',
        expired: true
      }
    }

    if (response.message && response.message.includes('success')) {
      return {
        success: true,
        message: 'Authentification réussie'
      }
    }

    return {
      success: response.success || false,
      message: response.message || 'Erreur d\'authentification'
    }
  }
}

export const apiService = new ApiService()
