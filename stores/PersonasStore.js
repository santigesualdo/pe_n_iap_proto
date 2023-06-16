import { defineStore } from 'pinia'

export const usePersonasStore = defineStore( "PersonasStore", {
    state: () => {
        return {
            personas: []
            // Para empezar con datos cargados y no morir ingresando datos todo el tiempo
           /*  personas: [
                {
                    name: 'San',
                    gastos: [
                        {
                            que: 'Coca',
                            importe: 1250
                        }
                    ]
                },
                {
                    name: 'Sofi',
                    gastos: [
                        {
                            que: 'Pancho',
                            importe: 2751
                        }
                    ]
                }
            ] */
        }
    }
})