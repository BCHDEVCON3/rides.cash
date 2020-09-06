<template>
    <b-modal id="modal-ride-details" title="Selected Ride">
        <p class="my-4">{{ ride }}</p>
    </b-modal>
</template>

<script>
export default {
    props: {
        ride: {
            type: Object,
            required: false,
            default() {
                return null
            }
        }
    }
}
</script>