export default function({store, route, redirect}) {
    const loggeduser = store.state.auth.loggeduser;
    const blockedRoute = /^\/(?!login)/g; // \/*
    const loginRoute = '/login';

    if (!loggeduser && route.path.match(blockedRoute)) {
        redirect('/login');
    }
    
    if (loggeduser && route.path === loginRoute)
        redirect('/');
}