<script setup>
    import { nextTick } from 'vue'
    const props = defineProps({
        persona: {
            type: Object,
            default: {}
        }
    })
    const showNewGastoInput= ref(false),
        currentPersonaId= ref(''),
        currentGastoInput= ref([]),
        currentGastoImporte = ref(''),
        currentGasto = ref(''),
        currentGastoId = ref(''),
        showEditGastoInput = ref(false);

    const limpiarEstados = () => {
        currentPersonaId.value = '';
        currentGastoImporte.value = '';
        currentGasto.value = '';
        showNewGastoInput.value = false;
        showEditGastoInput.value = false;
    }
    const newGasto = (persona) => {
        showNewGastoInput.value = true;
        currentPersonaId.value = persona.id;
        nextTick(() => currentGastoInput.value.focus());
    }

    const aceptarGasto = () => {
        confirmarGasto(props.persona, currentGastoImporte.value, currentGasto.value )
        gastoTotal.value = calculoTotal()
        limpiarEstados();
    }
    const edicionGasto = (gasto) => {
        currentPersonaId.value = props.persona.id;
        currentGastoId.value = gasto.id;
        currentGasto.value = gasto.que
        currentGastoImporte.value = gasto.importe
        showEditGastoInput.value = true;
    }

    const borrarGasto = (gasto) => {
        eliminarGasto(props.persona.id, gasto)
        gastoTotal.value = calculoTotal()
        limpiarEstados()
    }
    const confirmarEdicion = (gastoId) => {
        confirmarEdicionGasto(props.persona, gastoId, currentGastoImporte.value, currentGasto.value);
        gastoTotal.value = calculoTotal()
        limpiarEstados();
    }
</script>

<template>
    <div class="flex justify-between items-center">
        <h2 class="font-semibold text-2xl">{{ props.persona.name }}</h2>
        <h2 class="font-bold text-right">Total: ${{ gastoPersona(props.persona) }}</h2>
    </div>
    <!-- Persona encabezado  -->
    <div class="flex justify-between items-center ">
        <h2 class="">gastos ({{props.persona.gastos.length}})</h2>
        <svg fill="none" viewBox="0 0 24 24" stroke-width="1" class="w-10 h-10 stroke-default" @click="newGasto(props.persona)">
            <path d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
    </div>
    <!-- Nuevo gasto inputs -->
    <div v-show="showNewGastoInput && currentPersonaId === props.persona.id" :class="`${props.persona.id}`" class="flex justify-between items-center px-5 py-2 border rounded-full border-indigo-200">
        <input v-model.number="number" ref="currentGastoInput" class="min-w-[30%] border-default outline-none bg-inherit placeholder:text-xs placeholder:opacity-50 focus:border-b-1 focus:border-b-indigo-500"  v-model="currentGastoImporte" placeholder="(importe)">
        <input type="text" class="border-l-2 min-w-[30%] border-default outline-none bg-inherit pl-4  placeholder:text-xs placeholder:opacity-50 placeholder:pl-4 placeholder:text-left focus:border-b-1 focus:border-b-indigo-500" v-model="currentGasto" placeholder="(que?)">
        <div class="flex justify-center items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" class="w-6 h-6 stroke-default" @click="aceptarGasto">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" class="w-6 h-6 stroke-default" @click="limpiarEstados">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        </div>
    </div>
    <!-- Persona gastos list -->
    <ul v-if="props.persona.gastos.length > 0" class='flex flex-col space-y-2 my-2'>
        <li v-for="(gasto,i) in props.persona.gastos" >
            <!-- Editando Gasto -->
            <div v-if="showEditGastoInput && currentGastoId === gasto.id" class="flex justify-between items-center px-5 py-2  border rounded-full border-indigo-200">
                <input type="text" class="min-w-[30%] border-default outline-none bg-inherit placeholder:text-xs placeholder:opacity-50 focus:border-b-1 focus:border-b-indigo-500" v-model="currentGasto" placeholder="(que?)">
                <input v-model.number="number" type="text" class="min-w-[30%] border-default outline-none bg-inherit placeholder:text-xs placeholder:opacity-50 focus:border-b-1 focus:border-b-indigo-500" v-model="currentGastoImporte" placeholder="(importe)">
                <div class="flex justify-center items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" class="w-6 h-6 stroke-default" @click="confirmarEdicion(gasto.id)">
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
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" class="w-6 h-6 stroke-default" @click="edicionGasto(gasto)">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                    </svg>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" class="w-6 h-6 stroke-default" @click="borrarGasto(props.persona,gasto)">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                    </svg>
                </div>
            </div>
        </li>
    </ul>
</template>

