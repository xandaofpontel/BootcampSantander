import { GoogleGenAI } from '@google/genai'

interface GeminiResponse {
  output_text?: string
  error?: {
    message?: string
  }
}

export interface InsightData {
  feasibility: {
    status: 'viable' | 'needs_adjustment' | 'unfeasible'
    content: string
  }
  diagnosis: {
    content: string
  }
  suggestions: {
    items: string[]
  }
  extraIncome: {
    items: string[]
  }
  investment: {
    items: string[]
  }
  motivation: {
    content: string
  }
}

const API_KEY = String(import.meta.env.VITE_GEMINI_API_KEY)
const MODEL_NAME = import.meta.env.VITE_GEMINI_MODEL || 'gemini-3.6-flash'
const MAX_RETRIES = 2

const wait = (milliseconds: number) =>
  new Promise((resolve) => setTimeout(resolve, milliseconds))

const callGeminiAPI = async (prompt: string) => {
  if (!import.meta.env.VITE_GEMINI_API_KEY) {
    throw new Error('A chave da API do Gemini não foi configurada.')
  }

  const client = new GoogleGenAI({ apiKey: API_KEY })

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt += 1) {
    try {
      const response = await client.interactions.create({
        model: MODEL_NAME,
        input: prompt,
        generation_config: {
          thinking_level: 'low',
          max_output_tokens: 1200,
        },
        response_format: {
          type: 'text',
          mime_type: 'application/json',
        },
        store: false,
      })

      return response as GeminiResponse
    } catch (error) {
      const status =
        typeof error === 'object' && error !== null && 'status' in error
          ? Number(error.status)
          : 0
      if (status === 429) {
        throw new Error(
          'Limite diário da API do Gemini atingido. Aguarde a renovação da cota ou use uma chave com outro plano.',
        )
      }

      const isTemporaryError = status >= 500

      if (!isTemporaryError || attempt === MAX_RETRIES) {
        throw new Error(
          error instanceof Error
            ? error.message
            : 'Erro ao consultar a API do Gemini.',
        )
      }

      await wait(1000 * 2 ** attempt)
    }
  }

  throw new Error('Não foi possível obter uma resposta da API do Gemini.')
}

export const getInsight = async (prompt: string) => {
  const response = await callGeminiAPI(prompt)
  const text = response.output_text

  if (!text) {
    throw new Error('A API não retornou um diagnóstico válido.')
  }

  try {
    return JSON.parse(text) as InsightData
  } catch {
    throw new Error('A API retornou um diagnóstico em formato inválido.')
  }
}
