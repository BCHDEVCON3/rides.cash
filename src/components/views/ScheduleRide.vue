<template>
    <div class="">
        <div class="text-center" style="font-size: 2.4rem;">{{ context.title }}</div>

        <GeoLocOptions class="mt-2" @coords="updateJourneyPos(currentContext, $event, true)" />

        <b-row class="mt-4">
            <b-col order="1" order-md="0">
                <!-- Map -->
                <b-card style="height: 60vh;" no-body>
                    <l-map :center="center" :zoom="zoom">
                        <l-tile-layer :url="url" />
                        <!-- pickup marker -->
                        <l-marker v-if="this.journey[0] !== null" :lat-lng="this.journey[0]" :draggable="true" @drag="updateJourneyPos(0, [$event.latlng.lat, $event.latlng.lng])">
                            <l-tooltip :options="{ permanent: true, interactive: true }">
                                Pickup
                            </l-tooltip>
                        </l-marker>

                        <!-- dropoff marker -->
                        <l-marker v-if="this.journey[1] !== null" :lat-lng="this.journey[1]" :draggable="true" @drag="updateJourneyPos(1, [$event.latlng.lat, $event.latlng.lng])">
                            <l-tooltip :options="{ permanent: true, interactive: true }">
                                Dropoff
                            </l-tooltip>
                        </l-marker>
                    </l-map>
                </b-card>
            </b-col>

            <!-- Confirm Details (hidden start) -->
            <b-col sm="12" md="6" order="0" order-md="1" class="mb-4 mb-md-0" v-if="jDetails !== null">
                <b-card>
                    <h3 class="mb-2 text-center">Ride Details</h3>
                    <label><b>Pickup:</b></label>
                    {{ journey[0].map(x => parseFloat(x).toFixed(6)).join(', ') }}<br />
                    <label><b>Dropoff:</b></label>
                    {{ journey[1].map(x => parseFloat(x).toFixed(6)).join(', ') }}<br />
                    <label><b>Distance:</b></label>
                    {{ cost.miles }} miles

                    <div class="mt-3">
                        <label><b>Base Rate:</b></label>
                        ${{ cost.base }}<br />
                        <label><b>Per Mile:</b></label>
                        ${{ cost.milesCost }} <span class="text-muted">(${{ perMile }} per mi)</span><br />
                        <label><b>Total:</b></label>
                        {{ cost.bch_total.toFixed(6) }} BCH (${{ cost.total }})<br />
                    </div>
                </b-card>
            </b-col>
        </b-row>

        <b-button class="fixed-bottom" variant="primary" :disabled="!context.ready" @click="nextContext" squared block>
            {{ context.btnText }}
        </b-button>
    </div>
</template>

<style scoped>
    label {
        display: inline-block;
        width: 100px;
    }
</style>

<script>
import Utils from '../../js/Utils.js';
import GeoLocOptions from '../common/GeoLocOptions.vue';

export default {
    data() {
        return {
            currentContext: 0, // 0 = pickup, 1 = dropoff, 2 = confirmation
            zoom: 13,
            center: [47.41322, -1.219482],
            url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
            // journey
            journey: [
                null,
                null
            ],
            jDetails: null,
            // rates
            baseRate: 5.00,
            perMile: 1.00,

        }
    },
    computed: {
        context: function() {
            switch(this.currentContext) {
                case 0:
                    console.log('case 0', 'ready', this.journey[0] !== null)
                    return {
                        title: 'Pickup',
                        btnText: 'Set Pickup Location',
                        ready: this.journey[0] !== null
                    }
                case 1: 
                    return {
                        title: 'Dropoff',
                        btnText: 'Set Dropoff Location',
                        ready: this.journey[1] !== null
                    }
                case 2:
                    this.calcJourney(); // query or calc journey route details
                    return {
                        title: 'Confirmation',
                        btnText: 'Confirm & Schedule',
                        ready: true
                    }
                case 3:
                    // process ride
                    this.postRide();
                    this.currentContext--;
            }
        },
        cost: function(){
            let miles = this.convertMiles(this.jDetails.distance);
            let milesCost =  miles * this.perMile;
            return {
                base: this.baseRate.toFixed(2),
                miles: miles.toFixed(2),
                milesCost: milesCost.toFixed(2),
                total: (this.baseRate + milesCost).toFixed(2),
                bch_total: ((this.baseRate + milesCost) / this.store_temp.bch_usd_price)
            }
        }
    },
    methods: {
        updateJourneyPos: function(context, pos, updateCenter = false) {
            if(updateCenter) this.center = pos;
            this.journey.splice(context, 1, pos);
            this.zoom = 17;
        },
        nextContext: function() {
            this.currentContext++;
            this.zoom = 14;
        },
        calcJourney: async function() {
            let result;
            if(result = await Utils.calculateRoute(this.journey)) {
                console.log(result);
                this.jDetails = result;
            } else {
                // route request failes
                // crow flies calc
                this.jDetails = Utils.calculateRouteFallback(this.journey);
            }
        },
        convertMiles: function() {
            return Utils.metersToMiles(this.jDetails.distance);
        },
        postRide: async function() {
            let resp = await fetch(`${this.store_temp.api_url}/v1/rides`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    pickup: this.journey[0],
                    dropoff: this.journey[1],
                    bounty: this.cost.bch_total
                })
            });
            let data = await resp.json();

            // check success
            if(data.success) {
                this.$router.push({ path: `/ride/${data.data.id}` })
            }

            console.log(data);
        }
    },
    mounted() {
        this.store_temp.context = 'rider';
    },
    components: {
        GeoLocOptions
    }
}
</script>