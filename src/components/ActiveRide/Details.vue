<template>
    <b-row>
        <b-col>
            <div class="text-center mb-4" style="font-size: 2.4rem;">Current Ride</div>

            <div class="mb-4">
                <font-awesome-icon icon="map-marker-alt" class=""></font-awesome-icon>
                <span class="fixed-width-label">Pickup:</span> {{ ride.pickup.join(', ') }}<br />
                <font-awesome-icon icon="map-marker" class=""></font-awesome-icon>
                <span class="fixed-width-label">Dropoff:</span> {{ ride.pickup.join(', ') }}<br /><br />
                <span class="fixed-width-label">Price:</span> {{ ride.bounty.toFixed(6) }} BCH (${{ ride.bounty * store_temp.bch_usd_price }})<br />
                <span><b>Driver Address:</b></span> {{ ride.driver.bch_address }}<br /><br />
            </div>

            <b-button v-if="context === 'rider'" @click="payInvoice" variant="success" block>
                Pay Invoice
            </b-button>

            <b-button v-if="context !== 'rider'" @click="navigateTo" variant="primary" block>
                Open Navigation
            </b-button>
        </b-col>
    </b-row>
</template>

<script>
export default {
    props: {
        ride: {
            type: Object,
            required: true
        },
        context: {
            type: String,
            required: true
        }
    },
    data() {
        return {

        }
    },
    methods: {
        payInvoice: function() {
            window.open(this.ride.bip70_invoice, "_blank");
        },
        navigateTo: function() {
            window.open(`http://maps.google.com/maps?daddr=${this.ride.pickup.join(',')}`, "_blank")
        }
    }
}
</script>