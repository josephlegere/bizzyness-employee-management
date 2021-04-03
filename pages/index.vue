<template>
    <v-row no-gutters="">
        <v-col>
            <v-card>
                <v-card-title>
                    <v-row no-gutters>
                        <v-col cols="12" md="6" class="pa-2">
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

                <client-only>
                    <v-data-table
                        class="mb-15"
                        v-model="selectAttendance"
                        :headers="headers"
                        :items="attendance"
                        :search="search"
                        item-key="index"
                        group-by="date"
                        :sort-by="['priority']"
                        :group-desc="true"
                        show-select
                        multi-sort
                        :item-class="itemRowBackground"
                        :items-per-page="50"
                    >
                        <!-- fixed-header -->
                        <!-- height="600" -->

                        <!-- <template v-slot:item="props">
                            <tr :active="props.selected">
                                <td>
                                    <v-checkbox
                                        v-model="selectAttendance"
                                    ></v-checkbox>
                                </td> -->
                                        <!-- :label="`Checkbox 1: ${checkbox1.toString()}`" -->
                                <!-- <td>{{ props.item.employee }}</td>
                                <td>
                                    <template v-for="timing in props.item.timings.day_min">
                                        <v-card>
                                            {{timing}}
                                        </v-card>
                                    </template>
                                </td>
                                <td>
                                    <template v-for="timing in props.item.timings.noon_min">
                                        <v-card>
                                            {{timing}}
                                        </v-card>
                                    </template>
                                </td>
                                <td>{{ props.item.otstart }}</td>
                                <td>{{ props.item.otend }}</td>
                                <td>{{ props.item.othours }}</td>
                                <td>{{ props.item.location }}</td>
                                <td>
                                    <v-chip
                                        :color="statusColorCoding(props.item.status)"
                                        dark
                                    >
                                        {{ props.item.status }}
                                    </v-chip>
                                </td>
                            </tr> 
                        </template> -->

                        <template v-slot:item.day="{ item }">
                            <template v-for="timing in item.timings.day_min">
                                <v-card>
                                    <v-card-text class=text-center>
                                        {{timing}}
                                    </v-card-text>
                                </v-card>
                            </template>
                        </template>

                        <template v-slot:item.night="{ item }">
                            <template v-for="timing in item.timings.noon_min">
                                <v-card class="my-2">
                                    <v-card-text class=text-center>
                                        {{timing}}
                                    </v-card-text>
                                </v-card>
                            </template>
                        </template>

                        <template v-slot:item.ottimings="{ item }">
                            <!-- <v-card v-if="item.ottimings !== ''" class="my-2">
                                <v-card-text class=text-center>
                                    {{item.ottimings}}
                                </v-card-text>
                            </v-card> -->
                            <template v-for="timing in item.ottimings">
                                <v-card class="my-2">
                                    <v-card-text class=text-center>
                                        {{timing}}
                                    </v-card-text>
                                </v-card>
                            </template>
                        </template>

                        <template v-slot:item.status="{ item }">
                            <v-chip
                                :color="statusColorCoding(item.status)"
                                dark
                                small
                            >
                                {{ item.status }}
                            </v-chip>
                        </template>

                        <template v-slot:group.header="{items, isOpen, toggle}">
                            <th colspan="8">
                                <v-row no-gutters>
                                    <v-icon @click="toggle">
                                        {{ isOpen ? 'mdi-minus' : 'mdi-plus' }}
                                    </v-icon>
                                    <v-chip color="secondary">
                                        {{ items[0].date | moment("MMMM Do YYYY, dddd") }}
                                    </v-chip>
                                    <v-chip color="secondary">
                                        {{ `Timed In (${items.filter(item => item.status !== 'PEND').length})` }}
                                    </v-chip>

                                    <v-spacer></v-spacer>

                                    <v-btn rounded small @click="selectAttendance = items.filter(item => item.isSelectable)"><v-icon>mdi-check-box-multiple-outline</v-icon></v-btn>
                                </v-row>
                            </th>
                        </template>

                        <!-- <template slot="body.append">
                            <tr>
                                <th class="d-flex justify-space-between align-center">TOTAL <span class="d-sm-none">{{total}}</span></th>
                                <th colspan="2" class="pa-0"></th>
                                <th class="d-none d-sm-block align-center">{{total.toFixed(2)}}</th> 
                                <th colspan="2" class="pa-0"></th>
                            </tr>
                        </template> -->
                    </v-data-table>
                </client-only>
                
                <v-row
                    class="toolbar-container"
                    no-gutters
                >
                    <v-col
                        md="5"
                        class="ml-md-auto"
                    >
                        <v-sheet
                            dark
                            class="form-toolbar">
                            <v-toolbar
                                flat
                                height="60">
                                
                                <v-btn
                                    outlined
                                    @click="confirmReject = true"
                                >
                                    Reject
                                    <v-icon right>mdi-close-circle-outline</v-icon>
                                </v-btn>

                                <v-spacer></v-spacer>

                                <v-btn
                                    outlined
                                    @click="printView = true"
                                >
                                    <v-icon>mdi-printer-search</v-icon>
                                </v-btn>
                                
                                <v-btn
                                    outlined
                                    @click="confirmPrint = true"
                                >
                                    Confirm
                                    <v-icon right>mdi-send-circle-outline</v-icon>
                                </v-btn>
                                
                                <!-- Print View -->
                                <v-dialog v-model="printView" fullscreen hide-overlay transition="dialog-bottom-transition">
                                    <v-card dark>
                                        <v-toolbar dark color="primary">
                                            <v-btn icon dark @click="printView = false; toPrint = false">
                                                <v-icon>mdi-close</v-icon>
                                            </v-btn>
                                            <v-toolbar-title>Attendance</v-toolbar-title>
                                        </v-toolbar>
                                        <div v-if="printView">
                                            <AttendanceView :attendance="attendance_packaged" :key="viewerKey" :toPrint="toPrint" :supervisor="loggeduser" />
                                        </div>

                                    </v-card>
                                </v-dialog>

                                <!-- Submit Confirm -->
                                <v-dialog
                                    v-model="confirmPrint"
                                    max-width="290"
                                >
                                    <v-card>
                                        <v-card-title class="headline">Confirm Attendance</v-card-title>

                                        <v-card-text>
                                            Are you sure you want to confirm? Check all the details of the attendance before submission.
                                        </v-card-text>

                                        <v-card-actions>
                                            <v-spacer></v-spacer>

                                            <v-btn
                                                color="red darken-1"
                                                text
                                                @click="confirmPrint = false"
                                            >
                                                Cancel
                                            </v-btn>

                                            <v-btn
                                                color="primary"
                                                text
                                                @click="confirmAttendance"
                                            >
                                                Confirm
                                            </v-btn>
                                        </v-card-actions>
                                    </v-card>
                                </v-dialog>

                                <!-- Reject -->
                                <v-dialog
                                    v-model="confirmReject"
                                    max-width="290"
                                >
                                    <v-card>
                                        <v-card-title class="headline">Reject Attendance</v-card-title>

                                        <v-card-text>
                                            Are you sure you want to reject? Check all the details of the attendance before rejecting.
                                        </v-card-text>

                                        <v-card-actions>
                                            <v-spacer></v-spacer>

                                            <v-btn
                                                color="red darken-1"
                                                text
                                                @click="confirmReject = false"
                                            >
                                                Cancel
                                            </v-btn>

                                            <v-btn
                                                color="primary"
                                                text
                                                @click="rejectAttendance"
                                            >
                                                Reject
                                            </v-btn>
                                        </v-card-actions>
                                    </v-card>
                                </v-dialog>

                            </v-toolbar>
                        </v-sheet>
                    </v-col>
                </v-row>
            </v-card>
        </v-col>
    </v-row>
</template>

<script>
    import DateRange from '~/components/DateRange';
    import AttendanceView from '~/components/AttendanceView';
    import { mapState } from 'vuex';
    import moment from 'moment';
    import _ from 'lodash';

	export default {
		name: 'Attendance-Checker',
		data () {
			return {
				datefilter: [],
				suggests: [],
				search: '',
				selectAttendance: [],
				headers: [
					{
						text: 'Employee',
						value: 'employee',
						align: 'start',
						sortable: false
					},
					{
                        text: 'Morning',
                        value: 'day',
                        // width: '30%'
                    },
					{
                        text: 'Afternoon',
                        value: 'night',
                        // width: '30%'
                    },
					{ text: 'OT Timings', value: 'ottimings' },
					{ text: 'OT Hours', value: 'othours' },
					{ text: 'Locations', value: 'locations', width: '10%' },
					{ text: 'Status', value: 'status' }
                ],
                confirmReject: false,
                confirmPrint: false,
                printView: false,
                toPrint: false,
                supervisor: null
			}
		},
		methods: {
			updateDateFilter(range) {
				this.datefilter = range;
				this.filterData();
			},
			filterData() {
				// this.$store.dispatch('invoices/get', { dates: this.datefilter, tenant: this.tenant });
			},
			statusColorCoding (status) {
				if (status == 'REG') return 'green'
				else if (status == 'OT') return 'blue'
				else if (status == 'PEND') return 'grey'
				else return 'red'
            },
            extractLayout (list) {
                let _layout = [];

                list.forEach(elem => {
                    let { employee, othours, locations, status, timings, otitmings } = elem;
                    
                    _layout.push({
                        employee,
                        othours,
                        locations,
                        status
                    });
                });

                return _layout;
            },
            async confirmAttendance () {
                this.confirmPrint = false;
                this.toPrint = true;
                this.printView = true;
                console.log('confirm');
                await this.$store.dispatch('attendance/confirmChecker', { tenant: this.$store.state.auth.loggeduser, list: this.selectAttendance });
                this.selectAttendance = [];
            },
            async rejectAttendance () {
                this.confirmReject = false; 
                console.log('reject');
                await this.$store.dispatch('attendance/rejectChecker', { tenant: this.$store.state.auth.loggeduser, list: this.selectAttendance });
                this.selectAttendance = [];
            },
            itemRowBackground: function (item) {
                return parseInt(item.priority) >= 3 ? 'checker-row-style-minor' : '';
            }
		},
		computed: {
            ...mapState({
                attendance: state => state.attendance.checker_list,
                loggeduser: state => state.auth.loggeduser
            }),
			total: function() {
				return 0
				// return this.invoices.reduce(function(a, c) { return a + Number((c.total) || 0) }, 0);
            },
            attendance_packaged() {
                let _attendance = _.cloneDeep(this.selectAttendance);

                return {
                    layout: _attendance
                }
            },
            viewerKey () { //initially to enable rerender of component, now mainly triggers a function (but still need to return a date)
                return Date.now(); //opened
            }
			// tenant() {
			// 	return this.loggeduser.tenantid;
			// },
			// ...mapState({
			// 	invoices: state => state.invoices.list,
			// 	loggeduser: state => state.auth.loggeduser
			// })
        },
        async created () {
            this.supervisor = this.$store.state.auth.loggeduser;
            await this.$store.dispatch('attendance/getChecker', { tenant: this.$store.state.auth.loggeduser });
            // console.log(this.attendance);
        },
        async asyncData({store}) {
            // console.log(store.state.auth.loggeduser);
            // this should load on the server before client loads
            // but its not retrieving any data and won't load sync on client
            // await store.dispatch('attendance/getChecker', {tenant: store.state.auth.loggeduser});
        },
		components: {
            DateRange,
            AttendanceView
		}
	}
</script>

<style scoped>
    .toolbar-container {
        width:                  100%;
        position:               fixed;
        z-index:                4;
        bottom:                 35px;
        right:                  0;
    }
    .toolbar-container .col {
        width:                  100%;
    }
    .form-toolbar {
        width:                  100%;
        border-radius:          15px 15px 0 0;
        /* Don't know why border-radius should be repeated for it to work */
        /* Maybe toolbar has a default border-radius of 0, need to override to work */
    }
    .form-toolbar .v-toolbar {
        border-radius:          15px 15px 0 0;
    }
</style>