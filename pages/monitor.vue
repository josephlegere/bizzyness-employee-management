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
                    :items="attendance_formatted"
                    :search="search"
                    item-key="index"
					group-by="date"
                    show-select
					show-group-by
                >
					<!-- item-key="index" -->
					<!-- show-select -->

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
						>
							{{ item.status }}
						</v-chip>
					</template>

					<template v-slot:group.header="{items, isOpen, toggle}">
						<th colspan="8">
                            <v-icon @click="toggle">
                                {{ isOpen ? 'mdi-minus' : 'mdi-plus' }}
                            </v-icon>
                            <v-chip color="secondary">
                                {{ items[0].date | moment("dddd, MMMM Do YYYY") }}
                            </v-chip>
                            <v-chip color="secondary">
                                {{ `Timed In (${items.length})` }}
                            </v-chip>
                        </th>
                        <!-- <th>
                            <v-menu offset-y>
                                <template v-slot:activator="{ on, attrs }">
                                    <v-btn
                                        color="secondary"
                                        dark
                                        v-bind="attrs"
                                        v-on="on"
                                    >
                                        Awaiting Entries
                                    </v-btn>
                                </template>
                                <v-list>
                                    <v-list-item
                                        v-for="(item, index) in 5"
                                        :key="index"
                                    >
                                        <v-list-item-title>Item {{ item }}</v-list-item-title>
                                    </v-list-item>
                                </v-list>
                            </v-menu>
                        </th> -->
					</template>

                    <template slot="body.append">
                        <tr>
                            <th class="d-flex justify-space-between align-center">TOTAL <span class="d-sm-none">{{total}}</span></th>
                            <th colspan="2" class="pa-0"></th>
                            <th class="d-none d-sm-block align-center">{{total.toFixed(2)}}</th> 
                            <th colspan="2" class="pa-0"></th>
                        </tr>
                    </template>
                </v-data-table>
                
				<v-sheet
                    dark
                    class="form-toolbar">
                    <v-toolbar
                        flat
                        height="60">
                        
                        <v-btn
							outlined
                        >
							Reject
                            <v-icon right>mdi-close-circle-outline</v-icon>
                        </v-btn>
						
                        <v-btn
                            outlined
                        >
							Submit
                            <v-icon right>mdi-send-circle-outline</v-icon>
                        </v-btn>

                        <!-- Preview -->
                        <!-- <v-dialog v-model="preview" fullscreen hide-overlay transition="dialog-bottom-transition">
                            <v-card dark>
                                <v-toolbar dark color="primary">
                                    <v-btn icon dark @click="preview = false">
                                        <v-icon>mdi-close</v-icon>
                                    </v-btn>
                                    <v-toolbar-title>Invoice</v-toolbar-title>
                                </v-toolbar>
                                <div v-if="preview">
                                    <InvoiceView :invoice="invoice" :key="viewerwKey" :toPrint=false />
                                </div>

                            </v-card>
                        </v-dialog> -->
                        
                        <!-- Print -->
                        <!-- <v-dialog v-model="print" fullscreen hide-overlay transition="dialog-bottom-transition">
                            <v-card dark>
                                <v-toolbar dark color="primary">
                                    <v-btn icon dark @click="onSubmit">
                                        <v-icon>mdi-close</v-icon>
                                    </v-btn>
                                    <v-toolbar-title>Invoice</v-toolbar-title>
                                </v-toolbar>
                                <div v-if="print">
                                    <InvoiceView :invoice="invoice" :key="viewerwKey" />
                                </div>
                            </v-card>
                        </v-dialog>

                        <v-dialog
                            v-model="confirmPrint"
                            max-width="290"
                        >
                            <v-card>
                                <v-card-title class="headline">Confirm Submit</v-card-title>

                                <v-card-text>
                                    Are you sure you want to submit? Check all the details of the invoice before submission.
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
                                        @click="confirmPrint = false; print = true"
                                    >
                                        Confirm
                                    </v-btn>
                                </v-card-actions>
                            </v-card>
                        </v-dialog> -->

                    </v-toolbar>
                </v-sheet>
            </v-card>
        </v-col>
    </v-row>
</template>

<script>
    import DateRange from '~/components/DateRange';
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
				]
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
				if (status == 'REGULAR') return 'green'
				else if (status == 'OVERTIME') return 'blue'
				else return 'red'
			}
		},
		computed: {
            ...mapState({
                attendance: state => state.attendance.monitor_list
            }),
			total: function() {
				return 0
				// return this.invoices.reduce(function(a, c) { return a + Number((c.total) || 0) }, 0);
            },
            attendance_formatted() {
                let local_index = 1;

                return this.attendance.map((elem) => {
                    let _obj = {};
                    // index: 2,
					// 	uniqueid: '1002',
					// 	employee: 'Lecenio Trillo',
					// 	dayin: '05:30 AM',
					// 	dayout: '12:00 AM',
					// 	nightin: '04:00 PM',
					// 	nightout: '06:00 PM',
					// 	otstart: '05:30 PM',
					// 	otend: '06:00 PM',
					// 	ottotal: '0.5',
					// 	locations: 'FFC',
					// 	status: 'OVERTIME',
                    // 	date: '20-10-27'
                    
                    // segregate day and night timings, create sets / sessions of working hours
                    // if set is not divisible by 2 then it means worktime is performed around 12 PM
                    // then we split the worktime that is around 12, split it into 2, morning and afternoon set
                    // e.g. 11:30:00 - 12:00:00, 12:00:00 - 13:00:00
                    // finally list down all work sites

                    // console.log(elem.timings)

                    // elem.timings.forEach((timing, count) => {
                    //     let _set = {};// temporary store for partial sets
                    //     let _time = timing.input.substr(11);
                    //     console.log(_time)

                    //     if (moment(_time, 'h:mma').isBefore(moment('12:00pm', 'h:mma'))) {
                    //         _set[(timing.type === 0 ? 'in' : 'out')] = _time;
                    //         // }
                    //         // else {
                    //         //     if (moment(_time, 'h:mma').isAfter(moment('12:00pm', 'h:mma'))) {// current is greater / after the previous timing
                    //         //         _set[(timing.type === 0 ? 'in' : 'out')] = _time;
                    //         //     }
                    //         //     // pair = 1;
                    //         // }
                    //     }
                    //     else {
                            
                    //     }
                    // });
                    let timings = _.cloneDeep(elem.timings);
                    let _len = 3;
                    let timing_sets = {
                        day: [],
                        noon: [],
                        day_min: [],// min => minimum
                        noon_min: []
                    };
                    let locations = '';
                    let _set = {};// temporary store for partial sets
                    let _set_location = { in: '', out: '' };
                    let count = 0;
                    
                    do {
                    // for (let i = 0; i < _len; i++) {
                        let timing = timings[count];
                        let _time = timing.input.substr(11);
                        let _loc_regex = new RegExp(timing.place.replace(/[^a-zA-Z ]/g, ''), 'i');
                        // .replace(/[^a-zA-Z ]/g, '') <- this code now enables comparison of strings even with special char
                        // it removes special char from string, which made it not compare strings because it messes up with the regex
                        // i.e. "(example) string" can't be compared, so avoiding repeated texts wouldn't work
                        
                        // console.log(_time)
                        // console.log(timing)

                        if (Object.keys(_set).length === 0) {
                            _set[(timing.type === 0 ? 'in' : 'out')] = timing.input;

                            if ((locations.replace(/[^a-zA-Z ]/g, '')).search(_loc_regex) === -1)
                                _set_location[(timing.type === 0 ? 'in' : 'out')] = (timing.place.replace(/\s/g, '') !== '' ? timing.place : '');

                            // reset variables
                            timings.splice(0, 1);
                            count = 0;
                        }
                        else if (Object.keys(_set)[0] !== (timing.type === 0 ? 'in' : 'out')) {// assuming the length of "set" is 1
                            _set[(timing.type === 0 ? 'in' : 'out')] = timing.input;

                            if ((locations.replace(/[^a-zA-Z ]/g, '')).search(_loc_regex) === -1 && (Object.values(_set_location)[0].replace(/[^a-zA-Z ]/g, '')).search(_loc_regex) === -1)
                                _set_location[(timing.type === 0 ? 'in' : 'out')] = (timing.place.replace(/\s/g, '') !== '' ? timing.place : '');

                            // input the work locations
                            _set.location = `${_set_location.in}${(_set_location.in !== '' && _set_location.out !== '' ? ', ' : '')}${_set_location.out}`;

                            // reset variables
                            timings.splice(0, 1);
                            count = 0;
                        }
                        else {
                            count++;
                        }

                        // before continuing the set should have the requirments
                        // "in" & "out" variables or else it moves on to the next loop
                        if (Object.keys(_set).length < 2) continue;
                        
                        // console.log(_set)
                        let _set_collection = [];

                        // checks if "in" is morning and "out" is afternoon
                        if (moment(_set.in.substr(11), 'h:mma').isBefore(moment('12:00pm', 'h:mma')) && moment(_set.out.substr(11), 'h:mma').isAfter(moment('12:00pm', 'h:mma'))) {
                            _set_collection.push({
                                in: _set.in,
                                out: `${_set.in.substr(0, 10)} 12:00:00.00`,
                                location: _set.location
                            });
                            _set_collection.push({
                                in: `${_set.out.substr(0, 10)} 12:00:00.00`,
                                out: _set.out,
                                location: ''
                            });
                        }
                        else {
                            _set_collection.push({
                                in: _set.in,
                                out: _set.out,
                                location: _set.location
                            });
                        }

                        // Timing formats: 05:30 PM => h:mma, 17:00:00 => HH:mm:ss
                        _set_collection.forEach(_set_item => {
                            // if (moment(_time, 'h:mma').isBefore(moment('12:00pm', 'h:mma')) || (moment(_time, 'h:mma').isSame(moment('12:00pm', 'h:mma')) && timing.type === 1)) {
                            if (moment(_set_item.in.substr(11), 'h:mma').isBefore(moment('12:00pm', 'h:mma'))) {// day schedule

                                timing_sets.day.push(_set_item);
                                timing_sets.day_min.push(`${moment(_set_item.in).format('h:mma')} - ${moment(_set_item.out).format('h:mma')}`);
                                
                                locations += (_set_item.location.replace(/\s/g, '') !== '' ? (locations !== '' ? ', ' : '') + _set_item.location : '');
                                
                                // console.log('day');
                            }
                            else {// noon schedule

                                timing_sets.noon.push(_set_item);
                                timing_sets.noon_min.push(`${moment(_set_item.in).format('h:mma')} - ${moment(_set_item.out).format('h:mma')}`);
                                
                                locations += (_set_item.location.replace(/\s/g, '') !== '' ? (locations !== '' ? ', ' : '') + _set_item.location : '');

                                // console.log('noon');
                            }
                            // console.log(timing_sets);
                        });

                        // reset variables
                        _set = {};
                        _set_location = { in: '', out: '' };
                        
                        // console.log(timings.length);

                    } while(timings.length > 0);
                    // console.log(timing_sets)
                    // console.log(locations);

                    // calculate overtime
                    // console.log(timing_sets)
                    let workHours = 8;
                    let hrTotal = 0;
                    let overtime_init = false;// if overtime was already triggered / it was already indicated that there was overtime
                    let overtime_timings = { in: '', out: '' };
                    overtime_timings.list = [];
                    
                    // DON'T INCLUDE ANY CONDITION IF TIMING LIST HAS LENGTH GREATER THAN 0
                    // loop through each sets then accumulate the work hours to a "variable" to determine attendance status
                    // check if overtime starts here in "morning"
                    timing_sets.day.forEach(timing => {
                        // console.log(moment(timing.out).diff(moment(timing.in), 'hours', true))
                        let hrs_to_complete_work = workHours - hrTotal;
                        hrTotal += moment(timing.out).diff(moment(timing.in), 'hours', true);

                        if (hrTotal > workHours) {// try to figure out which part the OT started
                            let _in = moment(timing.in).format('hh:mm A');
                            let _out = moment(timing.out).format('hh:mm A');

                            if (!overtime_init) {// goes here only once, when overtime_init is still false
                                overtime_init = true;
                                _in = moment(timing.in).add(hrs_to_complete_work, 'hours').format('hh:mm A');
                                overtime_timings.in = _in;

                                // determines if noon has timings,
                                // if not it already assumes that last timing in "day" is overtime out
                                if (timing_sets.noon.length > 0) {
                                    overtime_timings.out = moment(timing_sets.noon[timing_sets.noon.length - 1].out).format('h:mma');
                                }
                                else {
                                    overtime_timings.out = moment(timing_sets.day[timing_sets.day.length - 1].out).format('h:mma');
                                }
                            }

                            // Collection of all Overtime Entry
                            overtime_timings.list.push(`${_in} - ${_out}`);

                        }
                    });

                    // check if overtime starts here in "noon"
                    timing_sets.noon.forEach(timing => {
                        // console.log(moment(timing.out).diff(moment(timing.in), 'hours', true))
                        let hrs_to_complete_work = workHours - hrTotal;
                        hrTotal += moment(timing.out).diff(moment(timing.in), 'hours', true);

                        if (hrTotal > workHours) {// try to figure out which part the OT started
                            let _in = moment(timing.in).format('hh:mm A');
                            let _out = moment(timing.out).format('hh:mm A');
                        
                            if (!overtime_init) {// goes here only once, when overtime_init is still false
                                overtime_init = true;
                                _in = moment(timing.in).add(hrs_to_complete_work, 'hours').format('hh:mm A');
                                overtime_timings.in = _in;

                                overtime_timings.out = moment(timing_sets.noon[timing_sets.noon.length - 1].out).format('hh:mm A');
                            }

                            // Collection of all Overtime Entry
                            overtime_timings.list.push(`${_in} - ${_out}`);
                            
                        }
                    });

                    // console.log(overtime_timings);

                    _obj['index'] = local_index;
                    _obj['uniqueid'] = elem.employee.id;
                    _obj['employee'] = elem.employee.name;

                    _obj['timings'] = timing_sets;

                    // _obj['ottimings'] = `${overtime_timings.in}${(overtime_timings.in !== '' && overtime_timings.out !== '' ? ' - ' : '')}${overtime_timings.out}`;
                    _obj['ottimings'] = overtime_timings.list;
                    _obj['othours'] = (hrTotal <= workHours ? '' : hrTotal - workHours);

                    _obj['locations'] = locations;
                    _obj['status'] = (hrTotal >= workHours ? ( hrTotal > workHours ? 'OVERTIME' : 'REGULAR') : 'UNDERTIME');// specify attendance status: 'OVERTIME', 'REGULAR', 'UNDERTIME'

                    _obj['date'] = (elem.timings[0].input).substr(0, 10);

                    local_index++;
                    // console.log(_obj)

                    return _obj;
                })
            },
			// tenant() {
			// 	return this.loggeduser.tenantid;
			// },
			// ...mapState({
			// 	invoices: state => state.invoices.list,
			// 	loggeduser: state => state.auth.loggeduser
			// })
        },
        async asyncData({store}) {
            await store.dispatch('attendance/getMonitor', {date: 'date', tenant: 'tenant'});
        },
		components: {
			DateRange
		}
	}
</script>

<style scoped>
    .form-toolbar {
        position:               fixed;
        z-index:                4;
        bottom:                 35px;
        right:                  0;
    }
</style>