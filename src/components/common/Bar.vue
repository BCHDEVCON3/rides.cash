<template>
    <div class="bar">

        <b-button variant="transparent" v-b-toggle.sidebar>
            <font-awesome-icon icon="bars" size="2x" />
        </b-button>

        <b-button variant="transparent" to="/" class="d-inline ml-1 align-middle" style="font-size: 2rem; line-height: 46px;">
            <span>rides</span><span class="text-success">.cash</span>
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

export default {
    components: {
    }
}
</script>