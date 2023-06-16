
<script setup>
    import { usePersonasStore } from '@/stores/PersonasStore'
    import { nextTick, onMounted } from 'vue'

    const { personas } = usePersonasStore()

    onMounted(() => {
        gastoTotal.value = calculoTotal(personas);
    })

    const gastoTotal = ref(0)
    const personasTotal = ref(0)


    const currentStep = ref(1);

    const currentPersona = ref('')
    const currentPersonaId = ref('');
    const currentGasto = ref('')
    const currentGastoId = ref('');
    const currentGastoImporte = ref('');

    const currentGastoInput = ref([]);

    const showNewGastoInput = ref(false);
    const showEditGastoInput = ref(false);

    const gastoPersona = (persona) => persona.gastos.reduce((a, b) => a+Number(b.importe), 0)
    const getPersona= (id) => personas.filter(_persona => _persona.id === id)[0]
    const getGasto= (persona, idGasto) => persona.gastos.filter(_gasto=>_gasto.id === idGasto)[0]

    const limpiarEstados = () => {
        currentPersonaId.value = '';
        currentGastoImporte.value = '';
        currentGasto.value = '';
        showNewGastoInput.value = false;
        showEditGastoInput.value = false;
    }

    const newPersona = ()=>{
        // TODO: 1 - si alguna validacion se ejecuta y se accede al return, mostrar mensaje

        /* Si 'currentPersona' no tiene valor exit */
        if (!currentPersona.value) return;

        /* Si 'currentPersona' ya existe exit */
        if (personas.some(el => el.name === currentPersona.value)) return;

        personas.push(
            {
                id: `p-${crypto.randomUUID()}`,
                name: currentPersona.value,
                gastos: []
            }
        )
        currentPersona.value = ''
    }

    const newGasto = (persona) => {
        showNewGastoInput.value = true;
        currentPersonaId.value = persona.id;
        const index = currentGastoInput.value.length - 1;
        nextTick(() => currentGastoInput.value[index].focus());
    }

    const calculoTotal = (personas) => {
        let gastoTot = 0;
        personas.map(item=>{
           const gastoPersona = item.gastos.reduce((ptotal, g)=> ptotal+Number(g.importe),0)
           gastoTot+=gastoPersona;
        })
        return gastoTot;
    }
    const confirmarGasto = (persona) => {
        persona.gastos.push(
            {
                id: `pg-${crypto.randomUUID()}`,
                importe: currentGastoImporte.value,
                que: currentGasto.value
            }
        )

        gastoTotal.value = calculoTotal(personas);

        limpiarEstados();
    }

    const confirmarEdicionGasto = (persona, gasto)=> {
        const pe = getPersona(persona.id);
        const g = getGasto(pe,gasto.id);
        g.importe = currentGastoImporte.value;
        g.que = currentGasto.value

        limpiarEstados();
    }

    const editarGasto = (persona, gasto) => {
        limpiarEstados();
        currentPersonaId.value = persona.id;
        currentGastoId.value = gasto.id;

        currentGasto.value = gasto.que
        currentGastoImporte.value = gasto.importe

        showEditGastoInput.value = true;
    }

    const eliminarGasto = (persona, gasto) => {
        const selectedPersona = getPersona(persona.id)
        selectedPersona.gastos = [...selectedPersona.gastos.filter(_gasto=>_gasto.id !== gasto.id)]
        limpiarEstados()
    }

    const copiarResultados= () => {

        const total = resultadosFinales(personas);

        const mensajeClipboard = getMensajeClipboard(total);

        //navigator.clipboard.writeText(mensajeClipboard);
    }

    const resultadosFinales = (per) => {
        const resultados = []
        const importePersonaSinGasto = (gastoTotal.value / personasTotal.value ).toFixed(2);
        let totalPersonasSinGasto = [...per.map(persona=> persona.gastos)].length;

        resultados.push(
            `Las ${totalPersonasSinGasto} sin gasto deben pagar ${importePersonaSinGasto}`
        )

        per.forEach(persona=>{
            if (!persona.gastos) return false;

            const gasto = gastoPersona(persona);
            if (gasto> importePersonaSinGasto){
                resultados.push(`${persona.name} debe recuperar ${Math.abs(gasto-importePersonaSinGasto)}`)
            }else{
                resultados.push(gasto===importePersonaSinGasto ? `${persona.name} no debe pagar ni recuperar, todo listo.` : `${persona.name} debe pagar ${Math.abs(gasto-importePersonaSinGasto)}`)
            }
        })
        return resultados
    }

    const getMensajeClipboard = (total) => {
        console.log(total)
    }

</script>

<template>
    <main class="w-96 flex flex-col mx-auto my-16 h-auto m-10 text-default space-y-4">
        <template v-if="currentStep === 1">
            <!-- Agregar Persona -->
            <section class="w-full h-auto bg-secondary py-2 px-4 rounded-xl ">
                <h1 class="text-xl">Agregar personas con Gasto</h1>
                <div class="my-4 space-y-4">
                    <div class="flex justify-between items-center bg-white rounded-xl px-4 py-2">
                        <input autofocus type="text" class="outline-none bg-inherit placeholder:text-xl placeholder:opacity-50" v-model="currentPersona" placeholder="(nombre)">
                        <svg fill="none" viewBox="0 0 24 24" stroke-width="1" class="w-10 h-10 stroke-default" @click="newPersona">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                </div>
                <div class="w-full flex-col justify-center items-center text-xl font-bold">
                    <h1> Total Gastado: ${{ gastoTotal }} </h1>
                </div>
            </section>
            <!-- Lista Personas Existentes -->
            <section class="w-full h-auto bg-secondary py-2 px-4 rounded-xl">
                <h1 class="text-left text-xl">Personas Existentes ({{ personas.length }})</h1>
                <div v-if="personas.length>0" class="my-4 space-y-4">
                    <div v-for="(persona,i) in personas" :id='`personaEntry_${i}`' class="flex flex-col bg-white rounded-xl p-4">
                        <div class="flex justify-between items-center">
                            <h2 class="font-semibold text-2xl">{{ persona.name }}</h2>
                            <h2 class="font-bold text-right">Total: ${{ gastoPersona(persona) }}</h2>
                        </div>
                        <!-- Persona encabezado  -->
                        <div class="flex justify-between items-center ">
                            <h2 class="">gastos ({{persona.gastos.length}})</h2>
                            <svg fill="none" viewBox="0 0 24 24" stroke-width="1" class="w-10 h-10 stroke-default" @click="newGasto(persona)">
                                <path d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <!-- Nuevo gasto inputs -->
                        <div v-show="showNewGastoInput && currentPersonaId === persona.id" :class="`${persona.id}`" class="flex justify-between items-center px-5 py-2 border rounded-full border-indigo-200">
                            <input ref="currentGastoInput" type="text" class="min-w-[30%] border-default outline-none bg-inherit placeholder:text-xs placeholder:opacity-50 focus:border-b-1 focus:border-b-indigo-500" v-model="currentGasto" placeholder="(que?)">
                            <input v-model.number="number" type="text" class="border-l-2 min-w-[30%] border-default outline-none bg-inherit pl-4  placeholder:text-xs placeholder:opacity-50 placeholder:pl-4 placeholder:text-left focus:border-b-1 focus:border-b-indigo-500" v-model="currentGastoImporte" placeholder="(importe)">
                            <div class="flex justify-center items-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" class="w-6 h-6 stroke-default" @click="confirmarGasto(persona)">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" class="w-6 h-6 stroke-default" @click="limpiarEstados">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                        </div>
                        <!-- Persona gastos list -->
                        <ul v-if="persona.gastos.length > 0" class='flex flex-col space-y-2 my-2'>
                            <li v-for="(gasto,i) in persona.gastos" >
                                <!-- Editando Gasto -->
                                <div v-if="showEditGastoInput && currentGastoId === gasto.id" class="flex justify-between items-center px-5 py-2  border rounded-full border-indigo-200">
                                    <input type="text" class="min-w-[30%] border-default outline-none bg-inherit placeholder:text-xs placeholder:opacity-50 focus:border-b-1 focus:border-b-indigo-500" v-model="currentGasto" placeholder="(que?)">
                                    <input v-model.number="number" type="text" class="min-w-[30%] border-default outline-none bg-inherit placeholder:text-xs placeholder:opacity-50 focus:border-b-1 focus:border-b-indigo-500" v-model="currentGastoImporte" placeholder="(importe)">
                                    <div class="flex justify-center items-center gap-2">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" class="w-6 h-6 stroke-default" @click="confirmarEdicionGasto(persona, gasto)">
                                            <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" class="w-6 h-6 stroke-default" @click="limpiarEstados">
                                            <path stroke-linecap="round" stroke-linejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                </div>
                                <!-- Mostrando Gasto -->
                                <div v-else class="flex justify-between items-center px-5 py-2 border rounded-full border-indigo-200">
                                    <h2 >{{ gasto.que }}: ${{ gasto.importe }}</h2>
                                    <div class="flex justify-center items-center gap-2">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" class="w-6 h-6 stroke-default" @click="editarGasto(persona,gasto)">
                                            <path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                                        </svg>
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" class="w-6 h-6 stroke-default" @click="eliminarGasto(persona,gasto)">
                                            <path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                        </svg>
                                    </div>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            </section>
            <!-- Finalizar carga -->
            <buttonNextStep text="Finalizar carga de gastos" @click="()=> { currentStep++; personasTotal = personas.length } " :disabled="personas.length<2"/>
        </template>
        <template v-if="currentStep === 2">
            <section class="w-full h-auto bg-secondary py-2 px-4 rounded-xl space-y-2">
                <h1 class="text-xl">Agregar el total de personas</h1>
                <input class="w-full" type="range"  :min="personas.length+1" max="50" step="1" v-model="personasTotal">
                <p class="flex justify-center text-2xl font-semibold">{{ personasTotal }}</p>
            </section>
            <buttonNextStep text="Finalizar carga de personas" @click="currentStep++"/>
        </template>
        <template v-if="currentStep === 3">
            <section class="w-full h-auto bg-secondary py-2 px-4 rounded-xl space-y-2">
                <h1 class="text-xl">Totales</h1>
                <p id="totales">{{ JSON.stringify(personas) }}</p>
            </section>
            <buttonNextStep class="text-center" text="Copiar Resultados" @click="copiarResultados"/>
        </template>
    </main>
</template>
