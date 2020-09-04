<template>
    <div class="bar">
        <Logo class="ml-2"></Logo>

        <b-button class="float-right" variant="transparent" v-b-toggle.sidebar>
            <font-awesome-icon icon="bars" size="2x" />
        </b-button>
    </div>
</template>

<style>
.bar {
    position: absolute;
    width: 100%;
    top: 0;
    left: 0;
}
</style>

<script>
import Logo from './Logo.vue';

export default {
    components: {
        Logo
    }
}
</script>