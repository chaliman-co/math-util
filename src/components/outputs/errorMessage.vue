<template lang="pug">
span Error: 
    span.message {{ error.message.replace(/^.*Error:/, "") }}
</template>

<style scoped>
.message {
    color: red;
}
</style>

<script>
export default {
    props: ["error"]
}
</script>

