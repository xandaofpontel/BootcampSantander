import {
  type SimulationFormData,
  type SimulationRecord,
} from '../data/simulation'

const LOCAL_STORAGE_KEY = 'simulation-data'

const readSavedData = (): SimulationRecord[] => {
  const storage = localStorage.getItem(LOCAL_STORAGE_KEY)

  if (!storage) {
    return []
  }

  try {
    const savedData: unknown = JSON.parse(storage)
    return Array.isArray(savedData) ? (savedData as SimulationRecord[]) : []
  } catch {
    return []
  }
}

export const useSimulationStorage = () => {
  const saveFormData = (formData: SimulationFormData) => {
    const id = crypto.randomUUID()
    const record: SimulationRecord = { ...formData, id }
    const savedData = readSavedData()

    localStorage.setItem(
      LOCAL_STORAGE_KEY,
      JSON.stringify([...savedData, record]),
    )

    return id
  }

  const getAllFormData = () => readSavedData()

  const getFormData = (id: string) => {
    return readSavedData().find((record) => record.id === id) || null
  }

  const updateSimulation = (id: string, data: SimulationRecord) => {
    const savedData = readSavedData()

    const updated = savedData.map((record) =>
      record.id === id ? { ...data } : record,
    )

    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated))
  }

  return { saveFormData, getAllFormData, getFormData, updateSimulation }
}
