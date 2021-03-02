import { isNull } from "lodash";

export default ({store, $axios}) => {

    let loggeduser = store.state.auth.loggeduser;

    if (!isNull(loggeduser)) {
        
        let { system_config } = loggeduser;
        
        if (system_config.server_type.type === 'hybrid_lamp_fire') {
            $axios.setHeader('external_api', system_config.server_host.api);
        }
        $axios.setHeader('server_type', system_config.server_type.type);
        
    }
}