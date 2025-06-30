// Utilisez UNIQUEMENT le proxy local - pas d'URL externe
const API_BASE_URL = '/function'

export const generatePassword = async (user: string) => {
  console.log('Making request to:', `${API_BASE_URL}/gen-password`);
  
  const response = await fetch(`${API_BASE_URL}/gen-password`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username: user })
  });

  console.log('Response status:', response.status);

  if (!response.ok) {
    throw new Error("Erreur lors de la génération du mot de passe")
  }

  const responseText = await response.text()

  try {
    const jsonResponse = JSON.parse(responseText)
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

  try {
    const jsonResponse = JSON.parse(responseText)
    return jsonResponse
  } catch {
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

  try {
    return JSON.parse(responseText)
  } catch {
    return {
      success: !responseText.includes('Missing credentials') && !responseText.includes('error'),
      message: responseText
    }
  }
}