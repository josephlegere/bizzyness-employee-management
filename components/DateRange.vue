<template>
    <v-row no-gutters>
        <v-col cols="12">
            <v-dialog
                ref="dialog"
                v-model="datepicker"
                :return-value.sync="dates"
                persistent
                width="290px"
            >
                <template v-slot:activator="{ on }">
                    <v-combobox
                        v-model="dateRange"
                        :loading="isLoading"
                        multiple
                        chips
                        small-chips
                        hide-details
                        append-icon="mdi-calendar"
                        placeholder="Date"
                        readonly
                        v-on="on"
                    ></v-combobox>
                </template>
                <v-date-picker v-model="dates" range scrollable>
                    <v-spacer></v-spacer>
                    <v-btn text color="primary" @click="datepicker = false">Cancel</v-btn>
                    <v-btn text color="primary" @click="updateRange($refs)">OK</v-btn>
                </v-date-picker>
            </v-dialog>
        </v-col>
        <v-col cols="12" class="mt-1 d-flex justify-end">
            <v-chip
                v-for="(item, i) in presuggests"
                :key="'pre' + i"
                @click="setSuggested(item)"
                :class="i > 0 ? 'ml-2' : ''"
                small
            >
                {{item.value}}
            </v-chip>
            <v-chip
                v-for="(item, i) in suggests"
                :key="i"
                @click="setSuggested(item)"
                class="ml-2"
                small
            >
                {{item.value}}
            </v-chip>
        </v-col>
    </v-row>
</template>

<script>
import moment from 'moment';

export default {
    data () {
        return {
            datepicker: false,
            dates: [],
            presuggests: [
                { value: 'Weekly', dates: [moment().startOf('week').format('YYYY-MM-DD'), moment().endOf('week').format('YYYY-MM-DD')] },
                { value: 'Monthly', dates: [moment().startOf('month').format('YYYY-MM-DD'), moment().endOf('month').format('YYYY-MM-DD')] }
            ],
            isLoading: false
        }
    },
    props: {
        suggests: {
            type: Array
        }
    },
    methods: {
        setDefault() {
            this.dates = this.presuggests[0].dates;
            this.$emit('update-range', this.dates);
        },
        setSuggested(action) {
            console.log(action.value)
            this.dates = action.dates;
            this.$emit('update-range', this.dates);
        },
        updateRange() {
            this.$refs.dialog.save(this.dates);
            this.$emit('update-range', this.dates);
        }
    },
    computed: {
        dateRange: function() {
            let _range = [];

            if (this.dates.length > 0) {
                _range = [this.dates[0]];

                if (this.dates.length > 1) {
                    if ((new Date(_range[0])).getTime() < (new Date(this.dates[this.dates.length - 1])).getTime())
                        _range.push(this.dates[this.dates.length - 1]);
                    else
                        _range.unshift(this.dates[this.dates.length - 1]);
                }
            }
            this.dates = _range;
            return _range;
        }
    },
    created() {
        this.setDefault();
    }
}
</script>

<style>

</style>