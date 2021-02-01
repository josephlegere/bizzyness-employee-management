export const actions = {

    async nuxtServerInit({commit}, { req }) {
        const vuexKey = 'vuex';
        try {
            const cookies = this.$cookies.getAll();
            console.log(cookies);
            if (!!cookies[vuexKey+'_auth']) commit('auth/setUser', cookies[vuexKey+'_auth'].loggeduser);
            // if (!!cookies[vuexKey+'_module2']) commit('cart-items/setItems', cookies[vuexKey+'_module2'].items);
            
            // another stuff ...

        } catch (e) {
            // commit("something", []);
            console.log("STATE ERROR: ", e);
        }
    }
};