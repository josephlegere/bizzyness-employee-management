<template>
    <v-row no-gutters>
        <v-col>
            <v-sheet
                tile
                height="54"
                class="d-flex"
            >
                <v-btn
                    icon
                    class="ma-2"
                    @click="$refs.calendar.prev()"
                >
                    <v-icon>mdi-chevron-left</v-icon>
                </v-btn>
                <v-select
                    v-model="type"
                    :items="types"
                    dense
                    outlined
                    hide-details
                    class="ma-2"
                    label="type"
                ></v-select>
                <v-select
                    v-model="mode"
                    :items="modes"
                    dense
                    outlined
                    hide-details
                    label="event-overlap-mode"
                    class="ma-2"
                ></v-select>
                <v-select
                    v-model="weekday"
                    :items="weekdays"
                    dense
                    outlined
                    hide-details
                    label="weekdays"
                    class="ma-2"
                ></v-select>
                <v-spacer></v-spacer>
                <v-btn
                    icon
                    class="ma-2"
                    @click="$refs.calendar.next()"
                >
                    <v-icon>mdi-chevron-right</v-icon>
                </v-btn>
            </v-sheet>
            <v-sheet>
                <v-calendar
                    ref="calendar"
                    v-model="value"
                    :weekdays="weekday"
                    :type="type"
                    :events="events"
                    :event-overlap-mode="mode"
                    :event-overlap-threshold="30"
                    :event-color="getEventColor"
                ></v-calendar>
            </v-sheet>

            <v-row
                class="toolbar-container"
                no-gutters
            >
                <v-col
                    md="3"
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
                                @click="openSpecialDates"
                            >
                                Add Special Dates
                                <v-icon>mdi-calendar</v-icon>
                            </v-btn>
                            
                            <v-bottom-sheet v-model="specialDatesForm" scrollable transition="dialog-bottom-transition">
                                <v-card class="rounded-t-xl">
                                    <v-toolbar dark dense class="rounded-t-xl">
                                        <v-btn icon dark @click="specialDatesForm = false">
                                            <v-icon>mdi-close</v-icon>
                                        </v-btn>
                                        <v-toolbar-title>Special Dates</v-toolbar-title>
                                    </v-toolbar>
                                    <v-card-text class="my-md-16">
                                        <v-container>
                                            <v-form ref="form" v-model="validate">
                                                <v-row>
                                                    <v-col
                                                        cols="12"
                                                        md="6"
                                                        offset-md="3"
                                                    >
                                                        <v-text-field
                                                            v-model="specialdatename"
                                                            label="Special Date Name *"
                                                            :rules="[v => !!v || 'Special Date Name is required']"
                                                        ></v-text-field>
                                                    </v-col>
                                                    <v-col
                                                        cols="12"
                                                        md="6"
                                                        offset-md="3"
                                                    >
                                                        <v-dialog
                                                            ref="dateStartModal"
                                                            v-model="dateStartModal"
                                                            :return-value.sync="dateStart"
                                                            persistent
                                                            width="290px"
                                                        >
                                                            <template v-slot:activator="{ on, attrs }">
                                                            <v-text-field
                                                                v-model="dateStart"
                                                                label="Start Date *"
                                                                prepend-icon="mdi-calendar"
                                                                readonly
                                                                v-bind="attrs"
                                                                v-on="on"
                                                                :rules="[v => !!v || 'Start Date is required']"
                                                            ></v-text-field>
                                                            </template>
                                                            <v-date-picker
                                                                v-model="dateStart"
                                                                scrollable
                                                            >
                                                                <v-spacer></v-spacer>
                                                                <v-btn
                                                                    text
                                                                    color="primary"
                                                                    @click="dateStartModal = false"
                                                                >
                                                                    Cancel
                                                                </v-btn>
                                                                <v-btn
                                                                    text
                                                                    color="primary"
                                                                    @click="$refs.dateStartModal.save(dateStart)"
                                                                >
                                                                    OK
                                                                </v-btn>
                                                            </v-date-picker>
                                                        </v-dialog>
                                                    </v-col>
                                                    <v-col
                                                        cols="12"
                                                        md="6"
                                                        offset-md="3"
                                                    >
                                                        <v-dialog
                                                            ref="dateEndModal"
                                                            v-model="dateEndModal"
                                                            :return-value.sync="dateEnd"
                                                            persistent
                                                            width="290px"
                                                        >
                                                            <template v-slot:activator="{ on, attrs }">
                                                            <v-text-field
                                                                v-model="dateEnd"
                                                                label="End Date *"
                                                                prepend-icon="mdi-calendar"
                                                                readonly
                                                                v-bind="attrs"
                                                                v-on="on"
                                                                :rules="[v => !!v || 'End Date is required']"
                                                            ></v-text-field>
                                                            </template>
                                                            <v-date-picker
                                                                v-model="dateEnd"
                                                                scrollable
                                                            >
                                                                <v-spacer></v-spacer>
                                                                <v-btn
                                                                    text
                                                                    color="primary"
                                                                    @click="dateEndModal = false"
                                                                >
                                                                    Cancel
                                                                </v-btn>
                                                                <v-btn
                                                                    text
                                                                    color="primary"
                                                                    @click="$refs.dateEndModal.save(dateEnd)"
                                                                >
                                                                    OK
                                                                </v-btn>
                                                            </v-date-picker>
                                                        </v-dialog>
                                                    </v-col>
                                                    <v-col
                                                        cols="12"
                                                        md="6"
                                                        offset-md="3"
                                                    >
                                                        <v-autocomplete
                                                            v-model="specialDateType"
                                                            :items="specialDateTypes"
                                                            label="Special Date Type *"
                                                            :rules="[v => !!v || 'Special Date Type is required']"
                                                        ></v-autocomplete>
                                                    </v-col>
                                                    <v-col
                                                        cols="12"
                                                        md="6"
                                                        offset-md="3"
                                                    >
                                                        <v-text-field
                                                            v-model="specialdatevalue"
                                                            label="Special Date Value (rate/hours) *"
                                                            :rules="[v => !!v || 'Special Date Value is required']"
                                                        ></v-text-field>
                                                    </v-col>
                                                    <v-col
                                                        cols="12"
                                                        md="6"
                                                        offset-md="3"
                                                        class="d-flex flex-row-reverse"
                                                    >
                                                        <v-btn
                                                            dark
                                                            :loading="submittingForm"
                                                            :disabled="submittingForm"
                                                            @click="addSpecialDates"
                                                        >Submit</v-btn>
                                                    </v-col>
                                                    <v-col
                                                        cols="12"
                                                        md="6"
                                                        offset-md="3"
                                                    >
                                                        <small>* indicates required field</small>
                                                    </v-col>
                                                </v-row>
                                            </v-form>
                                        </v-container>
                                    </v-card-text>
                                </v-card>
                            </v-bottom-sheet>

                        </v-toolbar>
                    </v-sheet>
                </v-col>
            </v-row>
        </v-col>
    </v-row>
</template>

<script>
import { mapState } from 'vuex';
import moment from 'moment';

export default {
    data: () => ({
        type: 'month',
        types: ['month', 'week', 'day', '4day'],
        mode: 'stack',
        modes: ['stack', 'column'],
        weekday: [0, 1, 2, 3, 4, 5, 6],
        weekdays: [
            { text: 'Sun - Sat', value: [0, 1, 2, 3, 4, 5, 6] },
            { text: 'Mon - Sun', value: [1, 2, 3, 4, 5, 6, 0] },
            { text: 'Mon - Fri', value: [1, 2, 3, 4, 5] },
            { text: 'Mon, Wed, Fri', value: [1, 3, 5] },
        ],
        value: '',
        colors: ['blue', 'indigo', 'deep-purple', 'cyan', 'green', 'orange', 'grey darken-1'],
        names: ['Meeting', 'Holiday', 'PTO', 'Travel', 'Event', 'Birthday', 'Conference', 'Party'],
        specialdatename: '',
        specialDatesForm: false,
        dateStart: moment().format('YYYY-MM-DD'),
        dateStartModal: false,
        dateEnd: moment().format('YYYY-MM-DD'),
        dateEndModal: false,
        specialDateType: '',
        specialDateTypes: [{ text: 'Special Timing', value: 'specialtiming' }, { text: 'Holiday', value: 'holiday' }],
        specialdatevalue: '',
        validate: false,
        submittingForm: false
    }),
    methods: {
        addSpecialDates() {
            this.$refs.form.validate();

            if (this.validate) {
                let specialdate = {
                    name: this.specialdatename,
                    start: this.dateStart,
                    end: this.dateEnd,
                    type: this.specialDateType,
                    specialdatevalue: this.specialdatevalue
                };
                this.$store.dispatch('specialdates/insert', { tenant: this.loggeduser, specialdate });
            }
        },
        getEventColor (event) {
            return event.color
        },
        openSpecialDates() {
            this.specialDatesForm = true;
        }
    },
    computed: {
        ...mapState({
            loggeduser: state => state.auth.loggeduser,
            events: state => state.specialdates.list
        }),
        tenant() {
            return this.loggeduser.tenantid.split('/')[1];
        }
    },
    watch: {
        specialDatesForm (val) { // For resetting Form
            !val && this.$refs.form.reset()
        }
    },
    created() {
        // this.loading = true;
        this.$store.dispatch('specialdates/get', {tenant: this.$store.state.auth.loggeduser, colors: this.colors})
            .catch(err => {
                this.errors = err;
            })
            .finally(() => {
                // this.loading = false;
            });
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