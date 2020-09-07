<template>
    <div>
        <WaitingSplash v-if="rideData === null || status === 'pending'" :context="context"></WaitingSplash>
        <Details v-else :ride="rideData" :context="context"></Details>
    </div>
</template>

<script>
import WaitingSplash from '../ActiveRide/WaitingSplash.vue';
import Details from '../ActiveRide/Details.vue';

export default {
    props: {
        context2: {
            type: String,
            required: false
        }
    },
    data() {
        return {
            context: 'driver', // rider or driver
            status: 'pending',
            rideData: null
        }
    },
    watch: {
        "ws.isConnected": function() {
            if(this.ws.isConnected) {
                this.subscribeToUpdates();
            }
        }
    },
    methods: {
        onClaim: function(data) {
            console.log('ActiveRide.vue', 'claimed');
            this.status = "claimed";
            console.log(data);
            this.updateRideData();
        },
        updateRideData: async function() {
            let resp = await fetch(`${this.store_temp.api_url}/v1/rides/${this.$route.params.id}`);
            let data = await resp.json()

            console.log(data)

            if(data.success) {
                this.rideData = data.data;
                this.status = data.data.status;
            }
        },
        subscribeToUpdates: function() {
            // subscribe to updates
            this.ws.send('pub_subscribe', {
                id: this.$route.params.id
            });
            console.log('sent subscribe request', this.$route.params.id);
        }
    },
    mounted() {
        this.ws.on('claimed', this.onClaim.bind(this));

        this.context = this.store_temp.context;

        this.updateRideData();

        if(this.ws.isConnected) {
            this.subscribeToUpdates();
        }
    },
    components: {
        WaitingSplash,
        Details
    }
}
</script>