<template>
    <div>
        <!-- address inputs -->
        <b-input-group>

            <b-input-group-prepend>
                <b-button @click="geoLocate" size="lg">
                    <font-awesome-icon icon="crosshairs" />
                </b-button>
            </b-input-group-prepend>

            <b-form-input v-model="address" :placeholder="placeholder"></b-form-input>

            <b-input-group-append>
                <b-button variant="info" @click="locateAddress">Set</b-button>
            </b-input-group-append>

        </b-input-group>
    </div>
</template>

<script>
export default {
    props: {
        placeholder: {
            type: String,
            required: false,
            default() {
                return 'Address'
            }
        }
    },
    data() {
        return {
            address: null,
            geoLoc: [],
            options: {
                enableHighAccuracy: true,
                timeout: 5000,
                maximumAge: 0
            }
        }
    },
    watch: {
        geoLoc: function() {
            this.$emit('coords', this.geoLoc);
        }
    },
    methods: {
        // HTML5 GeoLocation
        geoLocate: function() {
            navigator.geolocation.getCurrentPosition(this.onSuccess, this.onError, this.options);
        },
        onSuccess: function(pos) {
            let coords = pos.coords;
            this.geoLoc = [coords.latitude, coords.longitude]
        },
        onError: function(err) {
            console.error(err);
        },
        // input address resolve
        locateAddress: async function() {
            let addressEncoded = encodeURI(this.address);
            let resp = await fetch(`https://nominatim.openstreetmap.org/search?q=${addressEncoded}&format=json&polygon=1&addressdetails=1`);
            let data = await resp.json();

            this.geoLoc = [data[0].lat, data[0].lon];
        }
    }
}
</script>