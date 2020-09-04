<template>
    <div>
        <b-row class="h-100 align-items-center">
            <b-col class="p-md-5 text-center">
                <h1 class="display-4">Permissionless Ride Sharing</h1>
                <p style="font-size: 1.3rem;">
                    A rider and driver matching engine on the Bitcoin Cash blockchain. Pure web app for privacy, and trusted peer-to-peer payments for speed.
                </p>
                <b-button variant="primary" size="lg" class="mr-2" to="/schedule">Get a Ride</b-button>
                <b-button variant="outline-success" size="lg" to="/claim">Drive & Earn</b-button>
                <div class="mt-3 text-muted">
                    <b-link @click="scroll('learn')" class="text-muted">Learn More</b-link>
                </div>
            </b-col>
        </b-row>

        <b-row ref="learn" class="h-100 align-items-center">
            <b-col>
                <!-- Info Cards -->
                <b-card-group deck>
                    <b-card v-for="(card, i) in cards" :key="i" class="text-center">
                        <div>
                            <font-awesome-icon :icon="card.icon" :transform="card.transform" class="fa-4x" />
                        </div>
                        <h4 class="mt-3">{{ card.title }}</h4>
                        <p class="mt-3" style="font-size: 1.3rem;">
                            {{ card.text }}
                        </p>
                    </b-card>
                </b-card-group>

                <!-- Quotes -->
                <div class="mt-5 mx-md-5 px-md-5">
                    <b-card v-for="(quote, i) in quotes" :key="i" :class="{ 'text-right': i % 2 === 1 }" style="border: 0;">
                        <blockquote class="blockquote">
                            <p class="mb-0">{{ quote.text }}</p>
                            <footer class="blockquote-footer">{{ quote.author }} in <cite :title="quote.cite">{{ quote.cite }}</cite></footer>
                        </blockquote>
                    </b-card>
                </div>
                
            </b-col>
        </b-row>
    </div>
</template>

<script>
export default {
    data() {
        return {
            cards: [
                {
                    icon: ['fab', 'bitcoin'],
                    title: "Bitcoin Cash",
                    text: "Payments are 100% peer-to-peer that can be trusted and fast.",
                    transform: {
                        rotate: -30
                    }
                },
                {
                    icon: ['fas', 'street-view'],
                    title: "Rides From Your Community",
                    text: "Somewhere to go? Request a ride from drivers near you!"
                },
                {
                    icon: ['fas', 'car-alt'],
                    title: "Car? Earn!",
                    text: "Earn money with your vehicle in your community. No hoops to jump through, just get driving!",
                    transform: {}
                }
            ],
            quotes: [
                {
                    text: "Amazing service! Nice drivers.",
                    author: "Random Dude",
                    cite: "Twitter"
                },
                {
                    text: "Easiest side hustle with my car.",
                    author: "Adam Driver",
                    cite: "Twitter"
                }
            ]
        }
    },
    methods: {
        scroll: function(ref) {
            this.$refs[ref].scrollIntoView({behavior: 'smooth'});
        }
    }
}
</script>