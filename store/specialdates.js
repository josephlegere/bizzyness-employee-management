import moment from 'moment';

export const state = () => ({
	list: []
});

export const actions = {
    async get({ commit }, { tenant, colors }) {
        try {
            let _specialDates = [];
            let { tenantid } = tenant;
            let tenant_id_only = tenantid.split('/')[1]; //not a reference, without the "tenant/" prefix

            let specialDatesSnap = await this.$fire.firestore.collection('tenant_special_dates').doc(tenant_id_only).collection('special_dates').orderBy('date').get();
            specialDatesSnap.forEach(doc => {
                let { name, date, type, hours, rate } = doc.data();
                _specialDates.push({
                    name,
                    start: date.toDate(),
                    color: colors[type === 'specialtiming' ? 0 : 1]
                });
            });

            commit("setList", _specialDates);
        }
        catch (err) {
			console.log(err);
			throw err;
        }
    },
    async insert({ commit }, { tenant, specialdate, colors }) {
        try {
            let { tenantid, uid, id, name: user_name } = tenant;
            let { name, start, end, type, specialdatevalue } = specialdate;
            let tenant_id_only = tenantid.split('/')[1];
            let dates = [];

            for (let i = 0; i <= moment(end, 'YYYY-MM-DD').diff(moment(start, 'YYYY-MM-DD'), 'days'); i++) {
                dates.push({ date: moment(start, 'YYYY-MM-DD').add(i, 'days').format('YYYY-MM-DD'), name, set_by: { id, name: user_name }, type, specialdatevalue });
            }
            console.log(dates);

            const response = await this.$axios.post(`${process.env.BASE_URL}${process.env.SPECIALDATES_URL}/${process.env.CLIENT_TYPE}/${tenant_id_only}/${uid}`, {
                dates
            });
            console.log(response.data);

            let formatted_dates = dates.map(elem => {
                let { name, date, type } = elem;
                return { name, start: moment(date).toDate(), color: colors[type === 'specialtiming' ? 0 : 1] };
            });

            commit('insert', formatted_dates);

            // dates = [
                // { created: this.$fireModule.firestore.FieldValue.serverTimestamp(), date: this.$fireModule.firestore.Timestamp.fromDate(moment('2021-05-13').toDate()), name: 'Eid al-Fitr', rate: 1.5, set_by: {}, type: 'holiday' },
                // { created: this.$fireModule.firestore.FieldValue.serverTimestamp(), date: this.$fireModule.firestore.Timestamp.fromDate(moment('2021-05-14').toDate()), name: 'Eid al-Fitr', rate: 1.5, set_by: {}, type: 'holiday' },
                // { created: this.$fireModule.firestore.FieldValue.serverTimestamp(), date: this.$fireModule.firestore.Timestamp.fromDate(moment('2021-05-15').toDate()), name: 'Eid al-Fitr', rate: 1.5, set_by: {}, type: 'holiday' }
            // ];

            // let db = this.$fire.firestore;
            // let batch = this.$fire.firestore.batch();

            // dates.forEach(_date => {
            //     console.log(_date);
            //     let ref = this.$fire.firestore.collection('tenant_special_dates').doc(tenant).collection('special_dates').doc();
            //     console.log(ref);
            //     batch.set(ref, _date);
            //     console.log('add to batch');
            // });

            // batch.commit();
        }
        catch (err) {
			console.log(err);
			throw err;
        }
    }
}

export const mutations = {
    setList: (state, specialdates) => (state.list = specialdates),
	insert: (state, newDates) => (state.list = [ ...state.list, ...newDates ])
}