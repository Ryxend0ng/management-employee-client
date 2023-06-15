<template>
    <div class="d-page">
        <div class="d-header-page">
            <div class="d-title"> nhân viên</div>
            <button class="d-button " id="btn-add-emp" @click="btnShowFormEmployee()">Thêm mới
                nhân viên</button>

            <div class="d-table-page">
                <div class="d-control-function-table">
                    <div class="d-search-filter">
                        <div class="d-search">
                            <div class="d-icon-search"></div>
                        </div>
                        
                            <input title="load dữ liệu" v-on:keypress="searchEmployee()" v-model="txtSearch"
                                class="d-input-search " type="text" placeholder="Tìm kiếm theo Mã, Tên">
                       
                    </div>
                    <el-tooltip content="Lấy lại dữ liệu" placement="bottom" effect="dark">
                        <div  @click="loadData()" class="d-restart  d-icon d-icon-restart">
                        </div>
                    </el-tooltip>
                    <el-tooltip content="Xuất ra Excel" placement="bottom" effect="dark">
                        <a @click="exportExcel()" class="d-excel">
                            <div class="d-icon-excel"></div>
                        </a>
                    </el-tooltip>
                </div>
                <TableEmployee />

                <PageNavigation />
            </div>
        </div>
    </div>

    <!-- start popup form thêm, sửa nhân viên-->
    <FormEmployee @btnClose="btnClose" :isFocus="isFocus" />
    <!-- end popup thêm, sửa nhân viên-->

</template>
<style>
</style>
<script>
import { saveAs } from 'file-saver';
import axios from 'axios';
import console from 'console';
import PageNavigation from './PageNavigation.vue';
import TableEmployee from './PageEmployeeTable.vue';
import FormEmployee from './PageEmployeeFormDetails.vue';
import { mapActions, mapState } from 'vuex';
export default {

    components: {
        PageNavigation,
        TableEmployee,
        FormEmployee,

    },

    data() {
        return {
            typeClose: {
                ADD: "Add",
                AddSucess: "AddSucess",
                Delete: "Delete",
                EditSucess: "EditSucess",
                Validate: "Validate",
                MatchEmployee: "MatchEmployee"
            },
            errMsg: [],
            errMatchEmp: "",
            isFocus: false,
            isSeenAddSucess: false,
            isSeenDelete: false,
            isSeenDeleteSucess: false,
            isSeenEditSucess: false,
            isSeenValidate: false,
            isSeenDataChange: false,
            isSeenMatchEmployee: false,
            txtSearch: "",
            handel: {},
            employeeSelected: {},
            employeeChange: {},
            listDepaerment: [],
        }
    },
    watch: {
        txtSearch: function () {
            this.changeTxtSearch(this.txtSearch);
        }
    },
    computed: {
        ...mapState({
            port: state => state.employee.port,
            base: state => state.employee.base,
            pageSize: state => state.employee.pageSize,
            pageNumber: state => state.employee.pageNumber
        })
    },
    methods: {
        ...mapActions('employee', [
            "getListEmployee", "changePageSizeAndPageNumber"
            , "changeTxtSearch", "setEmployeeSelected", "toggleShowFormEmployee",
            "btnShowFormEmployee"
        ]),
        /*
           Descript func: hàm thực hiện hiển thị form khi click vào nút
           thêm nhân viên hoặc nút sửa trong table. Có gán giá trị vào input khi
           click nút sửa. 
           Khi click và0 nút thêm nhân viên thì input mã nhân viên được thêm tự động.
           author: Nguyễn văn Đông 
           Date: 20/6/2022
       */
        // btnShowFormEmployee(employee) {
        //     this.toggleShowFormEmployee();
        //     if (employee != null) {
        //         this.changeFormMode( this.MISAEnum.FormMode.EDIT)
        //         this.employeeSelected = employee;
        //         this.employeeSelected.Gender = employee.Gender;
        //         this.employeeSelected.DateOfBirth = employee.DateOfBirth != null ? employee.DateOfBirth.toString().substring(0, 10) : "";
        //         this.employeeSelected.IdentityDate = employee.IdentityDate != null ? employee.IdentityDate.toString().substring(0, 10) : "";
        //     } else {
        //         this.changeFormMode( this.MISAEnum.FormMode.ADD)
        //         this.employeeSelected = {};
        //         this.getNewEmployeeCode();
        //     }
        // },
        /*
           Descript func: hàm lấy mã nhân viên mới và gán vào ô input mã nhân viên
           author: Nguyễn văn Đông 
           Date: 20/6/2022
       */
        getNewEmployeeCode() {
            let me = this;

            axios.get(`http://localhost:5072/api/v1/Employees/NewEmployeeCode`,
                { headers: { 'Content-Type': 'application/json' } })
                .then(function (response) {
                    console.log("emp code" + response.data)
                    me.employeeSelected.EmployeeCode = response.data;
                    me.isFocus = true;
                })
                .catch(function (error) {
                    console.log(error)
                })

        },


        /*
           Descript func: hàm thực hiện hiển thị thông báo gửi từ component con
           tùy thuộc vào đối tượng handle :{
               type:
               message:
           }
           author: Nguyễn văn Đông 
           Date: 20/6/2022
       */
        handleDialog(handle) {
            let me = this;
            this.handel = handle;
            console.log("handle" + handle);
            if (handle.type === "edit") {
                // đóng popup form nhân viên
                this.toggleShowFormEmployee();
                // hiển thị thông báo thành công và tự động ẩn sau 2 s
                me.isSeenEditSucess = true;
                setTimeout(function () {
                    me.isSeenEditSucess = false;
                }, 2000);
                me.loadData();
            }
            if (handle.type === "copyEmployee") {

                // hiển thị thông báo thành công và tự động ẩn sau 2 s
                me.employeeSelected = handle.message;
                me.btnShowFormEmployee(me.employeeSelected)
            }
            if (handle.type === "editNoCloseFrom") {
                me.employeeSelected = {};
                me.getNewEmployeeCode();
                // hiển thị thông báo thành công và tự động ẩn sau 2 s
                me.isSeenEditSucess = true;
                setTimeout(function () {
                    me.isSeenEditSucess = false;
                }, 2000);
                me.loadData();
            }
            if (handle.type === "validate") {
                this.isSeenValidate = true;
                this.errMsg = handle.message;

            }
            if (handle.type === "add") {
                // đóng popup form nhân viên
                this.toggleShowFormEmployee();
                // hiển thị thông báo thành công và tự động ẩn sau 2 s
                me.isSeenAddSucess = true;
                setTimeout(function () {
                    me.isSeenAddSucess = false;
                }, 2000);
                me.loadData();
            }
            if (handle.type === "addNoCloseForm") {

                me.employeeSelected = {};
                me.getNewEmployeeCode();
                // hiển thị thông báo thành công và tự động ẩn sau 2 s
                me.isSeenAddSucess = true;
                setTimeout(function () {
                    me.isSeenAddSucess = false;
                }, 2000);
                me.loadData();
            }

            if (handle.type === "match") {
                // đóng popup form nhân viên
                me.isSeenMatchEmployee = true;
                me.isSeen = true;
                me.errMatchEmp = handle.message;
            }
            if (handle.type === "clickNumberPage") {
                console.log("cha");
                console.log(handle.message)
                me.employees = handle.message;
            }

        },
        /*
           Descript func: hàm đóng form hoặc đóng cảnh báo tùy thuộc và type
           được truyền vào
           author: Nguyễn văn Đông 
           Date: 20/6/2022
       */
        btnClose(type) {

            // thực hiện đóng thông báo hoặc form theo type
            if (type === "Add") {

                this.toggleShowFormEmployee();
                
            }

        },
        /*
           Descript func: hàm tìm kiếm nhân viên theo mã hoặc tên, sdt
           author: Nguyễn văn Đông 
           Date: 20/6/2022
       */
        searchEmployee() {
            // lấy giá trị từ input tìm kiếm
            let employeeFilter = this.txtSearch;
            //console.log(employeeFilter);
            this.changePageSizeAndPageNumber({
                pageSize: this.pageSize,
                pageNumber: 1,
                employeeFilter: employeeFilter,
                valueSelectCombox: this.pageSize
            })
            this.getListEmployee();
        },

        /*
           Descript func: hàm load lại dữ liệu và mặc định
           author: Nguyễn văn Đông 
           Date: 20/6/2022
       */
        loadData() {
            // thực hiện load lại dữ liệu 
            this.changePageSizeAndPageNumber({
                pageSize: 10,
                pageNumber: 1,
                employeeFilter: "",
                valueSelectCombox: 10,
            })
            this.getListEmployee();
            this.txtSearch = "";

        },
        exportExcel() {
            axios.get(`http://localhost:${this.port}/api/v1/Employees/exportExcel?pageSize=${this.pageSize}&pageNumber=${this.pageNumber}&employeeFilter=${this.txtSearch}`,
            {responseType: 'blob'})
                
                .then(function (response) {
                    console.log(response)
                    const url = window.URL.createObjectURL(new Blob([response.data],
                        { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }));
                    // console.log(url);
                     saveAs(url, "Danhsachnhanvien.xls");
                    // const link = document.createElement("a");
                    // link.href = url;
                    // link.setAttribute("download", "Danhsachnhanvien.xlsx");
                    // document.body.appendChild(link);
                    // link.click();

                })
                .catch(function (error) {
                    console.log(error)
                })

        }

    },
    beforeCreate() {

    },
    created() {
        let me = this;
        //load dữ liệu
        me.loadData();
        //load combox đơn vị
        //me.getListDepartment();



    },
    beforeMount() {

    },
    mounted() {

    },
    beforeUpdate() {

    },
    updated() {

    },
    beforeUnmount() {

    },
    unmounted() {

    }

}
</script>