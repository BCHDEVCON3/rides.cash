<template>
    <b-container class="h-100" fluid>
        <b-row class="h-100">

            <!-- Content -->
            <b-col class="h-100">
                <Bar></Bar>
                <router-view style="padding-top: 50px;"></router-view>
            </b-col>
        </b-row>

        <!-- menu -->
        <b-sidebar id="sidebar" title="Menu" shadow>
            <Menu></Menu>
        </b-sidebar>
    </b-container>
</template>

<script>
import Bar from './components/common/Bar.vue';
import Menu from './components/common/Menu.vue';

export default {
    methods: {
        updateBCHPrice: async function() {
            let resp = await fetch('https://api.coingecko.com/api/v3/coins/bitcoin-cash?tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=false');
            let data = await resp.json();

            this.store_temp.bch_usd_price = data.market_data.current_price.usd;
        }
    },
    mounted() {
        this.updateBCHPrice();
    },
    components: {
        Bar,
        Menu
    }
}
</script>