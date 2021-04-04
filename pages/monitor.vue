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
					class="mb-15"
					v-model="selectAttendance"
                    :headers="headers"
                    :items="attendance"
                    :search="search"
                    item-key="index"
					group-by="date"
                    :group-desc="true"
                    show-select
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

					<template v-slot:item.dayin="{ item }">
						<template v-for="timing in item.timings.day_min">
                            <v-card>
                                <v-card-text class=text-center>
                                    {{timing}}
                                </v-card-text>
                            </v-card>
                        </template>
					</template>

					<template v-slot:item.nightin="{ item }">
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
                                <!-- <div class="table-checkbox ml-md-3">
                                    <v-checkbox @click="selectGroup(items)"></v-checkbox>
                                </div> -->

                                <v-icon @click="toggle">
                                    {{ isOpen ? 'mdi-minus' : 'mdi-plus' }}
                                </v-icon>
                                <v-chip color="secondary">
                                    {{ items[0].date | moment("MMMM Do YYYY, dddd") }}
                                </v-chip>
                                <v-chip color="secondary">
                                    {{ `Timed In (${items.length})` }}
                                </v-chip>

                                <v-spacer></v-spacer>

                                <v-btn rounded small @click="selectAttendance = items.filter(item => item.isSelectable)"><v-icon>mdi-check-box-multiple-outline</v-icon></v-btn>
                                <v-btn rounded small @click="printGroup(items.filter(item => item.isSelectable))">Print</v-btn>
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
                
				<v-row
                    class="toolbar-container"
                    no-gutters
                >
                    <v-col
                        md="2"
                        class="ml-md-auto"
                    >
                        <v-sheet
                            color="transparent"
                            class="form-toolbar">
                            <v-toolbar
                                dark
                                height="60"
                                class="d-flex justify-center">

                                <v-btn
                                    outlined
                                    @click="printAttendance"
                                >
                                    Print
                                    <v-icon>mdi-printer-search</v-icon>
                                </v-btn>
                                
                                <!-- Print -->
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
		name: 'Monitor-Performance',
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
                        value: 'dayin',
                        // width: '30%'
                    },
					{
                        text: 'Afternoon',
                        value: 'nightin',
                        // width: '30%'
                    },
					{ text: 'OT Timings', value: 'ottimings' },
					{ text: 'OT Hours', value: 'othours' },
					{ text: 'Locations', value: 'locations', width: '10%' },
					{ text: 'Status', value: 'status' }
				],
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
				else return 'red'
            },
            printAttendance () {
                return new Promise((resolve, reject) => {
                    try {
                        this.toPrint = true;
                        this.printView = true;
                        console.log('print');
                        console.log(this.selectAttendance);
                        // this.selectAttendance = [];
                        resolve('Success');
                    }
                    catch (err) {
                        reject('Error');
                    }
                });
            },
            printGroup (items) {
                this.selectAttendance = items;
                this.printAttendance().then(() => {
                    this.selectAttendance = [];
                });;
            },
            selectGroup (items) {
                this.selectAttendance = (_.isEqual(this.selectAttendance, items) ? [] : items)
            }
		},
		computed: {
            ...mapState({
                attendance: state => state.attendance.monitor_list,
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
        async created() {
            this.supervisor = this.$store.state.auth.loggeduser;
            await this.$store.dispatch('attendance/getMonitor', {tenant: this.$store.state.auth.loggeduser});
        },
        async asyncData({store}) {
            // await store.dispatch('attendance/getMonitor', {date: 'date', tenant: 'tenant'});
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
    }
    .form-toolbar .v-toolbar {
        /* v-sheet default color is white, need to turn it transparent to remove for the border-radius apply its design */
        /* v-sheet need to contain the toolbar in order for the border radius to take effect */
        box-shadow:             0px -2px 4px -1px rgb(0 0 0 / 20%), 0px -2px 5px 0px rgb(0 0 0 / 14%);
        border-radius:          15px 15px 0 0;
    }
    .table-checkbox .v-input--checkbox { /* for custom checkboxes found in table */
        margin-top:             0;
    }
</style>