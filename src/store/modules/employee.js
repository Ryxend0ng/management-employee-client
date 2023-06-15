import axios from 'axios';
const namespaced = true;
var MISAEnum = {
    FormMode: {
        ADD: 1,
        EDIT: 2,
        DELETE: 3
    }

}
const state = {
    base: "http://localhost:8085/api/v1/",
    port: "8085",
    MISAEnum: {
        FormMode: {
            ADD: 1,
            EDIT: 2,
            DELETE: 3
        }

    },
    formMode: MISAEnum.FormMode.ADD,
    dialog: {
        message: "",
        employee: {},
        type: "",
    },
    dialogWarning: {
        message: [],
        type: "",
        employee: {}
    },
    employees: [],
    employeeSelected: {},
    employeeNewCode: "",
    totalPage: 0,
    totalRecord: 0,
    valueSelectCombox: 0,
    pageSize: 10,
    pageNumber: 1,
    employeeFilter: "",
    empSearch: "",
    isShowFormEmployee: false,
    loading: false
}
const mutations = {
    changeLoading(state) {
        state.loading = !state.loading;
    },
    changeTxtSearch(state, employeeSearch) {
        state.empSearch = employeeSearch
    },
    setMessageDialogSucess(state, payload) {
        state.dialog.message = payload.message,
            state.dialog.employee = payload.employee,
            state.dialog.type = payload.type

    },
    setMessageDialogWarning(state, payload) {
        state.dialogWarning.message = payload.message,
            state.dialogWarning.type = payload.type,
            state.dialogWarning.employee = payload.employee
    },
    getListEmployee(state, payload) {
        state.employees = payload.Data;
        state.totalRecord = payload.TotalRecord;
        state.totalPage = payload.TotalPage;
    },
    toggleShowFormEmployee(state) {
        state.isShowFormEmployee = !state.isShowFormEmployee;
    },
    changePageSizeAndPageNumber(state, payload) {
        state.pageSize = payload.pageSize;
        state.pageNumber = payload.pageNumber;
        state.employeeFilter = payload.employeeFilter;
        state.valueSelectCombox = payload.valueSelectCombox;
    },
    changeFormMode(state, payload) {
        state.formMode = payload;
    },
    setEmployeeSelected(state, employee) {

        if (employee != null) {

            state.formMode = (state.MISAEnum.FormMode.EDIT);
            state.employeeSelected = employee;
            state.employeeSelected.Gender = employee.Gender;
            state.employeeSelected.DateOfBirth = employee.DateOfBirth != null ? employee.DateOfBirth.toString().substring(0, 10) : "";
            state.employeeSelected.IdentityDate = employee.IdentityDate != null ? employee.IdentityDate.toString().substring(0, 10) : "";
        } else {
            state.formMode = (state.MISAEnum.FormMode.ADD);
            state.employeeSelected = {};
            state.employeeSelected.EmployeeCode = state.employeeNewCode;

        }
    },
    getNewEmployeeCode(state, empCode) {

        state.employeeNewCode = empCode;
    }
}
const actions = {
    changeLoading(context) {
        context.commit('changeLoading');
    },
    changeTxtSearch(context, empSearch) {
        context.commit('changeTxtSearch', empSearch)
    },
    setMessageDialogSucess(context, payload) {
        context.commit('setMessageDialogSucess', payload)
    },
    setMessageDialogWarning(context, payload) {
        context.commit('setMessageDialogWarning', payload)
    },
    getListEmployee(context) {
        context.dispatch('getNewEmployeeCode');
      
        context.dispatch('changeLoading')
        axios.get(`${state.base}Employees/filter?pageSize=${state.pageSize}
        &pageNumber=${state.pageNumber}&employeeFilter=${state.employeeFilter}`)
            .then(function (response) {
                console.log("respone")
                console.log(response)
                context.commit('getListEmployee', response.data)
                context.dispatch('changeLoading')
                
            })
            .catch(function (error) {
                console.log(error)
            })
    },
    toggleShowFormEmployee(context) {
        context.commit('toggleShowFormEmployee')
    },
    changePageSizeAndPageNumber(context, payload) {
        context.commit('changePageSizeAndPageNumber', payload)
    },
    changeFormMode(context, payload) {
        context.commit('changeFormMode', payload)
    },
    async deleteEmloyee(context, payload) {
        // xóa
        // end
        try {
            if (payload.isDelete) {
                context.dispatch("setMessageDialogWarning", {
                    message: [],
                    employee: payload.employee,
                    type: "",
                });

                await axios.delete(`${state.base}Employees/${payload.employee.Id}`);
                context.dispatch('getListEmployee')
                context.dispatch("setMessageDialogSucess", {
                    message: "Bạn đã xóa thành công",
                    employee: payload.employee,
                    type: "isSeenDeleteSucess",
                });
                setTimeout(() => {
                    context.dispatch("setMessageDialogSucess", {
                        message: [],
                        employee: {},
                        type: "",
                    });
                }, 2000)

            } else {

                context.dispatch("setMessageDialogWarning", {
                    message: [`Bạn có chắc muốn xóa ${payload.employee.EmployeeCode}`],
                    employee: payload.employee,
                    type: "isSeenDelete",
                });
            }
        } catch (error) {
            console.log(error);
        }
    },
    setEmployeeSelected(context, employee) {
        console.log(employee);
        if (employee != null) {
            if (employee.DateOfBirth != null && employee.DateOfBirth.includes("-")) {
                let dobArr = employee.DateOfBirth.split('-');
                employee.DateOfBirth = dobArr[2].substring(0, 2) + '/' + dobArr[1] + '/' + (dobArr[0]);
            }
            if (employee.IdentityDate != null && employee.IdentityDate.includes("-")) {
                let iDenArr = employee.IdentityDate.split('-');
                employee.IdentityDate = iDenArr[2].substring(0, 2) + '/' + iDenArr[1] + '/' + (iDenArr[0]);
            }
        }
        console.log(employee)
        context.commit('setEmployeeSelected', employee);
    },
    btnShowFormEmployee(context, employee) {
        context.dispatch('toggleShowFormEmployee');
        context.dispatch('setEmployeeSelected', employee);

    },
    async getNewEmployeeCode(context) {

        let res = await axios.get(`${state.base}Employees/NewEmployeeCode`);
        context.commit('getNewEmployeeCode', res.data);
    }

}
export default { state, mutations, actions, namespaced }