<template>
    <div>
        <div class="text-center mb-2" style="font-size: 2.4rem;">Claim Ride</div>

        <!-- Driver Address (Replace default) -->
        <b-form-input v-model.trim="driverBCHAddress" class="mb-3" type="text" placeholder="Payment BCH Address"></b-form-input>

        <!-- Geo locate options -->
        <GeoLocOptions class="d-inline" @coords="driverPos = $event" :placeholder="'Current Address'" ></GeoLocOptions>

        <b-row class="mt-3">
            <!-- Radius -->
            <b-col>
                <b-form-select v-model="radius" :options="radiusOptions" class="d-inline-block" style="width: 120px"></b-form-select>
            </b-col>

            <!-- view buttons -->
            <b-col class="text-right">
                <b-button-group size="lg">
                    <b-button @click="view = 'list'" :pressed="view === 'list'">
                        <font-awesome-icon icon="list"></font-awesome-icon>
                    </b-button>
                    <b-button @click="view = 'map'" :pressed="view === 'map'">
                        <font-awesome-icon icon="map-marked-alt"></font-awesome-icon>
                    </b-button>
                </b-button-group>
            </b-col>
        </b-row>

        <!-- List -->
        <b-list-group v-show="view === 'list'" class="mt-3">
            <b-list-group-item v-for="(ride, i) in rides" :key="ride.id">
                <b-row>
                    <b-col>
                        <font-awesome-icon icon="map-marker-alt" class=""></font-awesome-icon>
                        <span class="fixed-width-label">Pickup:</span> {{ ride.pickup.join(', ') }}<br />
                        <font-awesome-icon icon="map-marker" class=""></font-awesome-icon>
                        <span class="fixed-width-label">Dropoff:</span> {{ ride.dropoff.join(', ') }}
                    </b-col>

                    <b-col class="text-left">
                        <span class="fixed-width-label">Price:</span> {{ ride.bounty.toFixed(6) }} BCH (${{ ride.bounty * store_temp.bch_usd_price }})<br />
                    </b-col>

                    <b-col class="text-right">
                        <b-button @click="claim(i)" :disabled="driverBCHAddress === null || driverBCHAddress.length < 25" variant="success" size="lg" block>
                            Claim Ride
                        </b-button>
                    </b-col>
                </b-row>
            </b-list-group-item>
        </b-list-group>

        <h4 v-if="rides.length === 0">No Rides to Claim</h4>

        <!-- Map -->
        <PickupMap v-if="view === 'map'" :rides="rides" @rideSelected="showRide($event)" class="mt-3" style="height: 65vh;"></PickupMap>

        <!-- Ride Details Modal -->
        <ModalRideDetails :ride="selectedRide"></ModalRideDetails>
    </div>
</template>

<style>
    .fixed-width-label {
        display: inline-block;
        width: 100px;
        font-weight: bold;
    }
</style>

<script>
import PickupMap from '../Claim/PickupMap.vue';
import GeoLocOptions from '../common/GeoLocOptions.vue';
import ModalRideDetails from '../Claim/ModalRideDetails.vue';

export default {
    data() {
        return {
            view: 'list', // list or map
            rides: [],
            driverPos: null,
            driverBCHAddress: null,
            selectedRide: null, // selected from map
            radius: 5,
            radiusOptions: [
                {
                    text: '5 miles',
                    value: 5
                },
                {
                    text: '10 miles',
                    value: 10
                },
                {
                    text: '15 miles',
                    value: 15
                },
                {
                    text: '20 miles',
                    value: 25
                },
                {
                    text: '30 miles',
                    value: 30
                },
                {
                    text: '50 miles',
                    value: 50
                }
            ]
        }
    },
    methods: {
        getRides: async function() {
            let resp = await fetch(`${this.store_temp.api_url}/v1/rides`);
            let data = await resp.json();

            this.rides = data;
        },
        showRide: function(index) {
            this.selectedRide = this.rides[index];
            this.$bvModal.show('modal-ride-details'); // show modal
        },
        claim: function(index) {
            this.ws.send('pub_claim_ride', {
                id: this.rides[index].id,
                bch_address: this.driverBCHAddress
            });
        },
        onRedirect: function(data) {
            this.$router.push({ path: `/ride/${data.id}` })
        }
    },
    mounted() {
        this.getRides();

        this.ws.on('redirect', this.onRedirect.bind(this));


        // user contexy
        this.store_temp.context = 'driver';

    },
    components: {
        PickupMap,
        GeoLocOptions,
        ModalRideDetails
    }
}
</script>