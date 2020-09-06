<template>
    <b-row>
        <b-col>
            <b-form-input v-model.number="radius" type="range" min="0" max="5" step="1"></b-form-input>
        </b-col>
    </b-row>
</template>

<script>
export default {
    data() {
        return {
            radius: 15
        }
    },
    watch: {
        radius: function() {
            this.$emit('radius', this.radius)
        }
    }
}
</script>