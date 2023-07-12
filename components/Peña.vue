
<script setup>
    const props = defineProps({
        step:{
            type: Number,
            default: 1
        }
    })
    const personas = getPersonas();
    const mensajesCopiados = ref(false)
</script>
<template>
    <main class="w-96 flex flex-col mx-auto my-16 h-auto m-10 text-default space-y-4">
        <h1 class="text-2xl text-center">Peñapp Prototipo</h1>
        <template v-if="step === 1">
            <section class="w-full h-auto bg-secondary py-2 px-4 rounded-xl ">
                <AgregarPersona/>
                <Totales/>
            </section>
            <!-- Lista Personas Existentes -->
            <section class="w-full h-auto bg-secondary py-2 px-4 rounded-xl">
                <h1 class="text-left text-xl">Personas Existentes ({{ personas.length }})</h1>
                <div v-if="personas.length>0" class="my-4 space-y-4">
                    <div v-for="(p,i) in personas" :id='`personaEntry_${i}`' class="flex flex-col bg-white rounded-xl p-4">
                        <GastoPersona :persona="p" />
                    </div>
                </div>
            </section>
            <!-- Finalizar carga -->
            <buttonNextStep text="Finalizar carga de gastos" @click="()=> { step++; personasTotal = personas.length } " :disabled="personas.length<2"/>
        </template>
        <template v-if="step === 2">
            <section class="w-full h-auto bg-secondary py-2 px-4 rounded-xl space-y-2">
                <h1 class="text-xl">Agregar el total de personas</h1>
                <input class="w-full" type="range"  :min="personas.length+1" max="50" step="1" v-model="personasTotal">
                <p class="flex justify-center text-2xl font-semibold">{{ personasTotal }}</p>
            </section>
            <buttonNextStep text="Finalizar carga de personas" @click="() => { currentStep++; resultadosFinales(personas)}"/>
        </template>
        <template v-if="step === 3">
            <section class="w-full h-auto bg-secondary py-2 px-4 rounded-xl space-y-2 font-semibold">
                <h1>Resultados finales:</h1>
                <h2> Total: ${{  gastoTotal }}</h2>
                <h2 v-for="line in refTotal">- {{ line }}</h2>
                <h2 v-show="mensajesCopiados" class="font-bold">Mensajes copiados al portapapeles.</h2>
            </section>
            <buttonNextStep text="Copiar Resultados" @click="() => { copiarResultados(refTotal)} "/>
        </template>
    </main>
</template>