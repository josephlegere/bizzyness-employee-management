import moment from 'moment';

export const actions = {
    insert({}, tenant) {
        let dates = [
            // { created: this.$fireModule.firestore.FieldValue.serverTimestamp(), date: this.$fireModule.firestore.Timestamp.fromDate(moment('2021-05-13').toDate()), name: 'Eid al-Fitr', rate: 1.5, set_by: {}, type: 'holiday' },
            // { created: this.$fireModule.firestore.FieldValue.serverTimestamp(), date: this.$fireModule.firestore.Timestamp.fromDate(moment('2021-05-14').toDate()), name: 'Eid al-Fitr', rate: 1.5, set_by: {}, type: 'holiday' },
            // { created: this.$fireModule.firestore.FieldValue.serverTimestamp(), date: this.$fireModule.firestore.Timestamp.fromDate(moment('2021-05-15').toDate()), name: 'Eid al-Fitr', rate: 1.5, set_by: {}, type: 'holiday' }
        ];

        // let db = this.$fire.firestore;
        let batch = this.$fire.firestore.batch();

        dates.forEach(_date => {
            console.log(_date);
            let ref = this.$fire.firestore.collection('tenant_special_dates').doc(tenant).collection('special_dates').doc();
            console.log(ref);
            batch.set(ref, _date);
            console.log('add to batch');
        });

        batch.commit();
    }
}