<script setup>
    const currentPersona = ref('');
</script>
<template>
    <h1 class="text-xl">Agregar personas con Gasto</h1>
    <div class="my-4 space-y-4">
        <div class="flex justify-between items-center bg-white rounded-xl px-4 py-2">
            <input autofocus type="text" class="flex-auto outline-none bg-inherit placeholder:text-xl placeholder:opacity-50" v-model="currentPersona" placeholder="(nombre)">
            <svg fill="none" viewBox="0 0 24 24" stroke-width="1" class="w-10 h-10 stroke-default" @click="newPersona(currentPersona), currentPersona = ''">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        </div>
    </div>
</template>