<template>
    <v-row no-gutters>
        <v-col>
            <v-btn @click="addSpecialDates">Add Special Dates</v-btn>
        </v-col>
    </v-row>
</template>

<script>
import { mapState } from 'vuex';

export default {
    methods: {
        addSpecialDates() {
            this.$store.dispatch('specialdates/insert', this.tenant);
        }
    },
    computed: {
        ...mapState({
            loggeduser: state => state.auth.loggeduser
        }),
        tenant() {
            return this.loggeduser.tenantid.split('/')[1];
        }
    }
}
</script>

<style>

</style>