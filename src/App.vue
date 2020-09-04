<template>
    <b-container class="h-100" fluid>
        <b-row class="h-100">

            <!-- Content -->
            <b-col class="h-100">
                <Bar></Bar>
                <router-view></router-view>
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
    components: {
        Bar,
        Menu
    }
}
</script>