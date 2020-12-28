import moment from 'moment';

export const state = () => ({
	list: []
});

export const actions = {
    async get({ commit }, { date, tenant }) {
        let _list = [];

        const response = await this.$axios.get(`${process.env.BASE_URL}${process.env.ATTENDANCE_URL}`);
        _list = response.data.data;

		commit("setList", _list);
    }
}

export const mutations = {
    setList: (state, attendance) => (state.list = attendance)
};