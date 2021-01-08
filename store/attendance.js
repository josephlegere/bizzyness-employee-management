import moment from 'moment';

export const state = () => ({
    checker_list: [],
	monitor_list: []
});

export const actions = {
    async getChecker({ commit }, { date, tenant }) {
        let _list = [];

        const response = await this.$axios.post(`${process.env.BASE_URL}${process.env.ATTENDANCE_URL}`,
        {
            st: "for confirmation",
            dt: "current"
        });
        _list = response.data.data;

		commit("setChecker", _list);
    },
    async getMonitor({ commit }, { date, tenant }) {
        let _list = [];

        const response = await this.$axios.post(`${process.env.BASE_URL}${process.env.ATTENDANCE_URL}`,
        {
            st: "confirmed",
            dt: "current"
        });
        _list = response.data.data;

		commit("setMonitor", _list);
    },
    async confirm({}, list) {
        const response = await this.$axios.post(`${process.env.BASE_URL}${process.env.ATTENDANCE_URL_CONFIRM}`, { list });
        console.log(response)
    },
    async reject() {

    }
}

export const mutations = {
    setChecker: (state, attendance) => (state.checker_list = attendance),
    setMonitor: (state, attendance) => (state.monitor_list = attendance)
};