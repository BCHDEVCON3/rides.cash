import Vue from 'vue';
import Vuex from 'vuex';
import VueRouter from 'vue-router';
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon, FontAwesomeLayers } from '@fortawesome/vue-fontawesome'

Vue.use(Vuex);
Vue.use(VueRouter);

// BoostrapVue
import { LayoutPlugin, CardPlugin, ButtonPlugin, InputGroupPlugin, FormInputPlugin, LinkPlugin, SidebarPlugin, ButtonGroupPlugin, FormSelectPlugin, ListGroupPlugin, ModalPlugin } from 'bootstrap-vue';
Vue.use(LayoutPlugin);
Vue.use(CardPlugin);
Vue.use(ButtonPlugin);
Vue.use(InputGroupPlugin);
Vue.use(FormInputPlugin);
Vue.use(LinkPlugin);
Vue.use(SidebarPlugin);
Vue.use(ButtonGroupPlugin);
Vue.use(FormSelectPlugin);
Vue.use(ListGroupPlugin);
Vue.use(ModalPlugin);

// font-awesome 
import { faBitcoin } from '@fortawesome/free-brands-svg-icons';
import { faBars, faCar, faCarAlt, faStreetView, faMale, faCrosshairs, faMapMarkedAlt, faList, faMapMarkerAlt, faMapMarker, faSpinner } from '@fortawesome/free-solid-svg-icons'
library.add(faBitcoin, faBars, faCar, faCarAlt, faStreetView, faMale, faCrosshairs, faMapMarkedAlt, faList, faMapMarkerAlt, faMapMarker, faSpinner)
Vue.component('font-awesome-icon', FontAwesomeIcon)
Vue.component('font-awesome-layers', FontAwesomeLayers)

// leaflet 
import { LMap, LTileLayer, LMarker, LTooltip } from 'vue2-leaflet';
import 'leaflet/dist/leaflet.css';

// start fix (https://github.com/PaulLeCam/react-leaflet/issues/255)
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});
// end fix

Vue.component('l-map', LMap);
Vue.component('l-tile-layer', LTileLayer);
Vue.component('l-marker', LMarker);
Vue.component('l-tooltip', LTooltip);

// vender css
//import '@forevolve/bootstrap-dark/dist/css/toggle-bootstrap-dark.min.css'; // dark theme
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';

// views
import App from './App.vue';
import Home from './components/views/Home.vue';
import ScheduleRide from './components/views/ScheduleRide.vue';
import Claim from './components/views/Claim.vue';
import ActiveRide from './components/views/ActiveRide.vue';

// vuex
import store from './js/store.js';
const vuexStore = new Vuex.Store(store);

// vue router
const routes = [
    { path: '/', redirect: '/home' },
    { path: '/home', component: Home },
    { path: '/schedule', component: ScheduleRide },
    { path: '/claim', component: Claim },
    { path: '/ride/:id', component: ActiveRide }
]

const router = new VueRouter({
    routes
});

let store_temp = {
    'context': 'rider',
    'websocket_url': MODE == 'production' ? 'ws://api.rides.cash/ws' : 'ws://localhost:8080/ws',
    'api_url': MODE == 'production' ? 'http://api.rides.cash' : 'http://localhost:8080',
    'bch_usd_price': 0
}

// mixin 
import WSConnection from './js/WSConnection.js';
const ws = new WSConnection();
ws.connect(store_temp.websocket_url);

Vue.mixin({
    data() {
        return {
            ws,
            store_temp,
        }
    }
})

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