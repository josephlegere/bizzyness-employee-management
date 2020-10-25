<template>
    <v-row no-gutters="">
        <v-col>
            <v-card>
                <v-card-title>
                    <v-row no-gutters>
                        <v-col cols="12"  md="6" class="pa-2">
                            <v-text-field
                                v-model="search"
                                append-icon="mdi-magnify"
                                label="Search"
                                single-line
                                hide-details
                            ></v-text-field>
                        </v-col>
                        <v-col cols="12" md="6" class="pa-2">
                            <!-- <date-range :suggests="suggests" @update-range="updateDateFilter" /> -->
                        </v-col>
                    </v-row>
                </v-card-title>
                <v-data-table
                    :headers="headers"
                    :items="attendance"
                    :search="search"
                >
                    <template slot="body.append">
                        <tr>
                            <th class="d-flex justify-space-between align-center">TOTAL <span class="d-sm-none">{{total}}</span></th>
                            <th colspan="2" class="pa-0"></th>
                            <th class="d-none d-sm-block align-center">{{total.toFixed(2)}}</th> 
                            <th colspan="2" class="pa-0"></th>
                        </tr>
                    </template>
                    <template v-slot:item="props">
                        <tr :active="props.selected" @click="toCheck(props.item)">
                            <td>{{ props.item.employee }}</td>
                            <td>{{ props.item.dayin }}</td>
                            <td>{{ props.item.dayout }}</td>
                            <td>{{ props.item.nightin }}</td>
                            <td>{{ props.item.nightout }}</td>
                            <td>{{ props.item.otstart }}</td>
                            <td>{{ props.item.otend }}</td>
                            <td>{{ props.item.ottotal }}</td>
                            <td>{{ props.item.location }}</td>
                            <td>{{ props.item.status }}</td>
                        </tr> 
                    </template>
                </v-data-table>
            </v-card>
        </v-col>
    </v-row>
</template>

<script>
    import DateRange from '~/components/DateRange';
    import { mapState } from 'vuex';

	export default {
		data () {
			return {
				datefilter: [],
				suggests: [],
				search: '',
				headers: [
					{
						text: 'Employee',
						align: 'start',
						sortable: false,
						value: 'employee',
					},
					{ text: 'Day In', value: 'dayin' },
					{ text: 'Day Out', value: 'dayout' },
					{ text: 'Night In', value: 'nightin' },
					{ text: 'Night Out', value: 'nightout' },
					{ text: 'OT Start', value: 'otstart' },
					{ text: 'OT End', value: 'otend' },
					{ text: 'OT Total', value: 'ottotal' },
					{ text: 'Locations', value: 'locations' },
					{ text: 'Status', value: 'status' }
				]
			}
		},
		methods: {
			updateDateFilter(range) {
				this.datefilter = range;
				this.filterData();
			},
			toCheck(status) {
			},
			filterData() {
				// this.$store.dispatch('invoices/get', { dates: this.datefilter, tenant: this.tenant });
			}
		},
		computed: {
			total: function() {
				return 0
				// return this.invoices.reduce(function(a, c) { return a + Number((c.total) || 0) }, 0);
			},
			// tenant() {
			// 	return this.loggeduser.tenantid;
			// },
			// ...mapState({
			// 	invoices: state => state.invoices.list,
			// 	loggeduser: state => state.auth.loggeduser
			// })
		},
		components: {
			DateRange
		}
	}
</script>
