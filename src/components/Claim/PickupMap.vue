<template>
    <l-map :center="center" :zoom="zoom">
        <l-tile-layer :url="url" />
        <!-- Pickup Markers -->
        <l-marker 
            v-for="(ride, i) in rides"
            :key="ride.id"
            :lat-lng="ride.pickup"
            @click="$emit('rideSelected', i)"
        >
        </l-marker>
    </l-map>
</template>

<script>
export default {
    props: {
        rides: {
            type: Array,
            required: true,
        }
    },
    data() {
        return {
            center: [33.945301, -118.401939],
            zoom: 14,
            url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        }
    },
    watch: {
        rides: function() {
            this.center = this.rides[0].pickup;
        }
    },
}
</script>