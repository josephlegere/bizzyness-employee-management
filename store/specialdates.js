import moment from 'moment';

export const actions = {
    insert({}, tenant) {
        let dates = [
            
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