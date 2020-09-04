<template>
    <div class="mt-5">
        <div style="width: 100%; height: 60vh;">
            <l-map :center="center" :zoom="zoom">
                <l-tile-layer :url="url" />
            </l-map>
        </div>
    </div>
</template>

<script>


export default {
    data() {
        return {
            zoom: 13,
            center: [47.41322, -1.219482],
            url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        }
    },
}
</script>