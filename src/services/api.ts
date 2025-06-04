const API_BASE_URL = import.meta.env.DEV ? '/function' : 'https://mspr-openfaas.hiboukstore.com/function'

export const generatePassword = async (user: string) => {
  const response = await fetch(`${API_BASE_URL}/gen-password`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username: user })
  });

  if (!response.ok) {
    throw new Error("Erreur lors de la génération du mot de passe")
  }

  const responseText = await response.text()

  // Essayer de parser comme JSON d'abord
  try {
    const jsonResponse = JSON.parse(responseText)

    // Normaliser la réponse pour avoir toujours qrcode_base64
    if (jsonResponse.qrcode && !jsonResponse.qrcode_base64) {
      // Si on a qrcode mais pas qrcode_base64, formatter correctement
      const qrData = jsonResponse.qrcode.startsWith('data:')
        ? jsonResponse.qrcode
        : `data:image/png;base64,${jsonResponse.qrcode}`

      return {
        ...jsonResponse,
        qrcode_base64: qrData
      }
    }

    return jsonResponse
  } catch {
    // Si c'est du base64 direct
    if (responseText.startsWith('iVBORw0KGgo')) {
      return {
        qrcode_base64: `data:image/png;base64,${responseText}`,
        password: 'Generated password'
      }
    }
    return { message: responseText }
  }
}

export const generate2FA = async (user: string) => {
  const response = await fetch(`${API_BASE_URL}/generate2fa`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username: user })
  });

  if (!response.ok) {
    throw new Error("Erreur lors de la génération 2FA")
  }

  const responseText = await response.text()

  // Essayer de parser comme JSON d'abord
  try {
    const jsonResponse = JSON.parse(responseText)

    // Normaliser la réponse pour avoir toujours qrcode_base64
    if (jsonResponse.qrcode && !jsonResponse.qrcode_base64) {
      // Si on a qrcode mais pas qrcode_base64, formatter correctement
      const qrData = jsonResponse.qrcode.startsWith('data:')
        ? jsonResponse.qrcode
        : `data:image/png;base64,${jsonResponse.qrcode}`

      return {
        ...jsonResponse,
        qrcode_base64: qrData
      }
    }

    return jsonResponse
  } catch {
    // Si c'est du base64 direct
    if (responseText.startsWith('iVBORw0KGgo')) {
      return {
        qrcode_base64: `data:image/png;base64,${responseText}`,
        secret: 'Generated 2FA secret'
      }
    }
    return { message: responseText }
  }
}

export const authenticateUser = async (username: string, password: string, otp: string) => {
  const response = await fetch(`${API_BASE_URL}/authuser`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      username,
      password,
      otp
    })
  });

  if (!response.ok) {
    throw new Error("Erreur lors de l'authentification")
  }

  const responseText = await response.text()

  // Essayer de parser comme JSON
  try {
    return JSON.parse(responseText)
  } catch {
    return {
      success: !responseText.includes('Missing credentials') && !responseText.includes('error'),
      message: responseText
    }
  }
}
