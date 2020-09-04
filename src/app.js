import Vue from 'vue';
import Vuex from 'vuex';
import VueRouter from 'vue-router';
import { BootstrapVue } from 'bootstrap-vue';
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon, FontAwesomeLayers } from '@fortawesome/vue-fontawesome'

Vue.use(Vuex);
Vue.use(VueRouter);
Vue.use(BootstrapVue);

// font-awesome 
import { faBitcoin } from '@fortawesome/free-brands-svg-icons';
import { faHandHolding, faCarSide, faBars, faCarAlt, faStreetView, faMale } from '@fortawesome/free-solid-svg-icons'
library.add(faBitcoin, faHandHolding, faCarSide, faBars, faCarAlt, faStreetView, faMale)
Vue.component('font-awesome-icon', FontAwesomeIcon)
Vue.component('font-awesome-layers', FontAwesomeLayers)

// leaflet 
import { LMap, LTileLayer, LMarker } from 'vue2-leaflet';
import 'leaflet/dist/leaflet.css';

Vue.component('l-map', LMap);
Vue.component('l-tile-layer', LTileLayer);
Vue.component('l-marker', LMarker);

// vender css
import '@forevolve/bootstrap-dark/dist/css/toggle-bootstrap-dark.min.css'; // dark theme
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';

// views
import App from './App.vue';
import Home from './components/views/Home.vue';
import ScheduleRide from './components/views/ScheduleRide.vue';
import Claim from './components/views/Claim.vue';

// vuex
import store from './js/store.js';
const vuexStore = new Vuex.Store(store);

// vue router
const routes = [
    { path: '/', redirect: '/home' },
    { path: '/home', component: Home },
    { path: '/schedule', component: ScheduleRide },
    { path: '/claim', component: Claim }
]

const router = new VueRouter({
    routes
});

// Vue Instance
new Vue({
    el: '#app',
    vuexStore,
    data() {
        return {
            test: 'hello world'
        }
    },
    router,
    render: h => h(App),
});