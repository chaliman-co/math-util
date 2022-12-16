<template lang="pug">
span {{message}}
    <br>
    span.first .
    span.second .
    span.third .
</template>

<script>
export default {
    props: ["message"]
}
</script>

<style>
@keyframes blink {
    0% {
        opacity: .2;
    }

    20% {
        opacity: 1;
    }

    100% {
        opacity: .2;
    }
}

.first,
.second,
.third {
    font-size: 1.5em;
    animation-name: blink;
    animation-duration: 1.4s;
    animation-iteration-count: infinite;
    animation-fill-mode: both;
}

.second {
    animation-delay: .2s;
}

.third {
    animation-delay: .4s;
}
</style>
