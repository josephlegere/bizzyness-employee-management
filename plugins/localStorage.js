// vuex persistence state, so store data remains even after refresh

import createPersistedState from "vuex-persistedstate";

export default ({ store }) => {
    window.onNuxtReady(() => {
        createPersistedState({
            key: "vuex"
        })(store);
    });
};
