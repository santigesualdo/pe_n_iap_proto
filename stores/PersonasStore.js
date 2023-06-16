import { defineStore } from 'pinia'

export const usePersonasStore = defineStore( "PersonasStore", {
    state: () => {
        return {
            personas: []
        }
    }
})