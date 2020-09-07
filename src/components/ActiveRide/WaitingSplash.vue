<template>
    <b-row class="h-100 align-items-center">
        <b-col class="text-center">
            <font-awesome-layers style="font-size: 120px;">
                <font-awesome-icon icon="spinner" pulse></font-awesome-icon>
                <font-awesome-icon :icon="context === 'rider' ? 'car' : 'male'" transform="shrink-9" />
            </font-awesome-layers>
            <h4 class="mt-3">{{ message }}</h4>
        </b-col>
    </b-row>
</template>

<script>
export default {
    props: {
        context: {
            type: String,
            required: true
        }
    },
    computed: {
        message: function() {
            return this.context === 'rider' ? 'Finding Driver' : 'Confirming Ride';
        }
    }
}
</script>