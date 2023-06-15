import {createStore} from "vuex";
import app from './modules/app'
import employee from './modules/employee'
const store=createStore({
    modules: {
        app,
        employee
    }
})
export default store;