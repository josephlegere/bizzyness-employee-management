export const state = () => ({
	loggeduser: null
});

export const actions = {
	async signInWithEmail({ commit }, access) {
		console.log(access);
		try {
			//Login the user
			let user_auth = await this.$fire.auth.signInWithEmailAndPassword(
				access.email,
				access.password
            );
            console.log(user_auth);

			//Get JWT from Firebase
            // const token = await this.$fireAuth.currentUser.getIdToken();
            // displayName is null when signInWithEmailAndPassword firebase function is used
            // use other signIn function e.g. Google SignIn
			let { email, uid, displayName } = await this.$fire.auth.currentUser;// displayName is for testing purposes, is used by other signIn options

			let doc = await this.$fire.firestore
				.collection('users')
				.doc(uid)
				.get();

			let { name, employee_code, tenant_group } = doc.data();
			let { account, tenantid, system_config, daysoff } = tenant_group;
			
			let _user = {
				uid,
				id: `users/${uid}`,
				email,
				name,
				account,
				tenantid,
				system_config,
				daysoff
			};

			if (employee_code) _user.employee_code = employee_code;

			if (system_config.server_type.type === 'hybrid_lamp_fire')
				this.$axios.setHeader('external-api', system_config.server_host.api);

        	this.$axios.setHeader('server-type', system_config.server_type.type);

			//Set the user locally
			commit("setUser", _user);
		} catch (err) {
			console.error(err.message);
			throw err;
		}
	},

	async signOut({ commit }) {
		console.log("Log Out");
		await this.$fire.auth.signOut();
		commit("setUser", null);
	}
};

export const mutations = {
	setUser(state, account) {
		state.loggeduser = account;
	}
};