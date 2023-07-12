<script setup>
    onMounted(()=>{
        gastoTotal.value = calculoTotal()
    })
    watchEffect(()=> gastoTotal.value )
</script>
<template>
    <div class="w-full flex-col justify-center items-center text-xl font-bold">
        <h1> Total Gastado: ${{ gastoTotal }} </h1>
    </div>
</template>