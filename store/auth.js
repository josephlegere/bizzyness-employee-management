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
			let { email, uid, displayName } = await this.$fire.auth.currentUser;// displayName is for testing purposes
			let _details = null;

			await this.$fire.firestore
				.collection('users')
				.doc(uid)
				.get()
				.then(doc => {
                    let _user = doc.data();
                    
					_details = {
						id: `users/${uid}`,
                        name: _user.name,
						account: _user.tenant_group.account,
                        tenantid: _user.tenant_group.tenantid,
                        system_config: _user.tenant_group.system_config
					}
				})
				.catch(err => {
					console.log("Error getting documents", err);
				});

			let { id, name, account, tenantid, system_config } = _details;

			//Set the user locally
			commit("setUser", { email, uid, name, id, account, tenantid, system_config });
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