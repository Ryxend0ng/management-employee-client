<template>

    <!-- start popup form thêm, sửa nhân viên-->
    <div v-if="isSeenPopup" class="show-popup">
        <div class="d-popup-main">
            <div class="d-popup-content">
                <div class="d-header-popup-employee">
                    <div class="d-name-popup">Thông tin nhân viên</div>
                    <div class="d-icon-form">
                        <div class="d-icon-question"></div>
                        <el-tooltip content="Đóng" placement="bottom" effect="dark">
                            <div @click.prevent="btnClose(typeClose.ADD)" class="d-icon-close cancel"></div>
                        </el-tooltip>
                    </div>

                    <div class="d-popup-checkbox">
                        <input class="d-check" type="checkbox" name="isCustomer"><span>Là khách hàng</span>
                        <input class="d-check" type="checkbox" name="isProducter"><span>Là nhà cung cấp</span>
                    </div>
                </div>
                <div class="d-content-emp">
                    <div class="d-content-top-employee d-flex-row d-flex-space-between ">
                        <div class="d-content-top-left  ">
                            <div class="d-flex ">
                                <div class="d-ht1">
                                    <label for="maNv">Mã <span class="d-red">*</span></label> <br>
                                    <el-tooltip :disabled="!isValidEmpCode" content="Mã nhân viên không được để trống"
                                        placement="bottom" effect="dark">
                                        <input @focus="removeBorder('empCode')" :class="{ border_red: isValidEmpCode }"
                                            v-model="employeeSelected.EmployeeCode" id="txtEmployeeCode" type="text"
                                            name="maNv">
                                    </el-tooltip>
                                </div>
                                <div class="d-ht">
                                    <label for="maNv">Tên <span class="d-red">*</span></label> <br>
                                    <el-tooltip :disabled="!isValidEmpName" content="Tên không được để trống"
                                        placement="bottom" effect="dark">
                                        <input @focus="removeBorder('empName')" :class="{ border_red: isValidEmpName }"
                                            v-model="employeeSelected.EmployeeName" id="txtEmployeeName" type="text">
                                    </el-tooltip>
                                </div>

                            </div>
                            <div class="d-flex-column ">
                                <label for="maNv">Đơn vị <span class="d-red">*</span></label>
                                <el-tooltip :disabled="!isValidEmpName" content="Đơn vị không được để trống"
                                    placement="bottom" effect="dark">
                                    <el-select  @focus="removeBorder('empDepart')" :class="{ border_red : isValidEmpDepart }" loading-text="Đang load"
                                        class="d-depart " filterable v-model="employeeSelected.DepartmentId"
                                        placeholder="Chọn đơn vị">

                                        <el-option :value="-1"> 
                                            <div  class="el-select-dropdown__item" style="background-color:#E5E5E5;
                                            height:inherit;
                                            font-weight:700;
                                            position:absolute;
                                            width:358px;
                                            z-index:1000;
                                            left:0px;">
                                                <span style="float:left;
                                           
                                            color:black;
                                            padding:0px;
                                            ">Mã đơn vị</span>
                                                <span style="
                                           margin-left: 20px;
                                            color: black;
                                            padding:0px 5px;
                                            font-size: 13px;">Tên đơn vị</span>
                                            </div></el-option>
                                        <el-option v-for="(item) in listDepaerment" :key="item.DepartmentId"
                                            :label="item.DepartmentName" :value=" item.DepartmentId">
                                        
                                            <span style="float: left">{{ item.DepartmentCode }}</span>
                                            <span style="
                                           margin-left: 60px;
                                            
                                            font-size: 13px;
                                            ">{{ item.DepartmentName }}</span>
                                        </el-option>
                                    </el-select>
                                </el-tooltip>
                                <label for="maNv">Chức danh </label>
                                <input v-model="employeeSelected.EmployeePosition" type="text" name="maNv">
                            </div>
                        </div>
                        <div class="d-content-top-right">
                            <div class="d-flex ">
                                <div>
                                    <label for="maNv">Ngày sinh </label> <br>
                                    <date-picker v-model:value="employeeSelected.DateOfBirth" value-type="format"
                                        placeholder="DD/MM/YYYY" format="DD/MM/YYYY"></date-picker>
                                </div>
                                <div>
                                    <label for="maNv">Giới tính </label> <br>
                                    <div class="btn-group-checkbox">
                                        <div class="btn-check">
                                            <input :value="1" v-model="employeeSelected.Gender" propName="f-option"
                                                type="radio" id="f-option" class="d-circle" name="selector" checked>
                                            <label for="f-option">Nam</label>
                                            <div class="outer-circle"></div>
                                        </div>
                                        <div class="btn-check">
                                            <input :value="0" v-model="employeeSelected.Gender" propName="f-option"
                                                type="radio" id="f-option-n" class="d-circle" name="selector"> <label
                                                for="f-option-n">Nữ</label>
                                            <div class="outer-circle"></div>
                                        </div>
                                        <div class="btn-check">
                                            <input :value="3" v-model="employeeSelected.Gender" propName="f-option"
                                                type="radio" id="f-option-k" class="d-circle" name="selector"> <label
                                                for="f-option-k">Khác</label>
                                            <div class="outer-circle"></div>
                                        </div>

                                    </div>
                                </div>

                            </div>
                            <div class="d-flex-column">
                                <div class="d-flex">
                                    <div class="d-cmnd ">
                                        <label for="maNv">Số CMND</label> <br>
                                        <input @focus="removeBorder('empCMND')" :class="{ border_red: isValidEmpCMND }"
                                            v-model="employeeSelected.IdentityNumber" propName="IdentityNumber"
                                            type="text" id="txtIdentifier">
                                    </div>
                                    <div class="d-Date">
                                        <label for="maNv">Ngày Cấp</label> <br>
                                        <!-- <input placeholder="dd-mm-yyyy" v-model="employeeSelected.IdentityDate"
                                            type="date" id="txtDateRange"> -->
                                        <date-picker v-model:value="employeeSelected.IdentityDate"
                                            value-type="DD/MM/YYYY" format="DD/MM/YYYY" placeholder="DD/MM/YYYY">
                                        </date-picker>
                                    </div>
                                </div>
                                <label for="maNv">Nơi cấp</label>
                                <input v-model="employeeSelected.IdentityPlace" propName="IdentityPlace" type="text"
                                    id="txtPlace">
                            </div>
                        </div>
                    </div>
                    <div class="d-content-botom-employee">
                        <div class="d-row">
                            <label for="maNv">Địa chỉ </label> <br>
                            <input v-model="employeeSelected.Address" propName="Address" type="text" id="txtAddress">
                        </div>
                        <div>
                            <div class="d-flex d-row-1 ">
                                <div>
                                    <label for="maNv">ĐT di động </label> <br>
                                    <input v-model="employeeSelected.PhoneNumber" propName="PhoneNumber" type="text"
                                        id="txtMobilePhone">
                                </div>
                                <div>

                                    <label for="maNv">ĐT cố định </label> <br>
                                    <input v-model="employeeSelected.TelephoneNumber" propName="TelephoneNumber"
                                        type="text" id="txtPhoneRelative">
                                </div>
                                <div>
                                    <label for="maNv">Email </label> <br>
                                    <el-tooltip :disabled="!isValidEmpEmail" content="Email không đúng định dạng"
                                    placement="bottom" effect="dark">
                                    <input @focus="removeBorder('empEmail')" :class="{ border_red: isValidEmpEmail }"
                                        v-model="employeeSelected.Email" propName="Email" type="text" id="txtEmail">
                                    </el-tooltip>
                                </div>

                            </div>
                            <div>
                                <div class="d-flex d-row-2">
                                    <div>
                                        <label for="maNv">Tài khoản ngân hàng </label> <br>
                                        <input v-model="employeeSelected.BankAccountNumber" propName="BankAccountNumber"
                                            type="text" id="txtBankCount">
                                    </div>
                                    <div class="d-ht">
                                        <label for="maNv">Tên ngân hàng </label> <br>
                                        <input v-model="employeeSelected.BankName" propName="BankName" type="text"
                                            id="txtBankName">
                                    </div>
                                    <div>
                                        <label for="maNv">Chi nhánh </label> <br>
                                        <input v-model="employeeSelected.BranchName" propName="BranchName"
                                            type="text" id="txtBankBranchName">
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="btn-group ">
                    <button @click.prevent="btnClose(typeClose.ADD)"
                        class="d-button-no-icon d-ffffff d-bbbbbb d-border-black cancel" id="delete">Hủy</button>
                    <div class="d-flex">
                        <button @click.prevent="btnSaveEmployee(formMode)"
                            class=" d-button-no-icon d-ffffff d-bbbbbb d-border-black ">Cất</button>
                        <button @click.prevent="btnAddOrSaveEmployee()" id="btn-add-submit" class="d-button-no-icon">Cất
                            và thêm</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <!-- end popup thêm, sửa nhân viên-->
    <DialogWarning />
    <!-- dialog thông báo thành công-->
    <DialogSucess />
    <!--end dialog thông báo thành công-->

</template>

<script>
import DatePicker from 'vue-datepicker-next';
import axios from 'axios';
import console from 'console';
import { mapActions, mapState } from 'vuex';
import DialogSucess from '../dialogs/DialogSucess.vue';
import DialogWarning from '../dialogs/DialogWarning.vue';
var port = "8085";

export default {
    emits: ['btnClose'],
    components: {
        DialogWarning,
        DialogSucess,
        DatePicker
    },
    props: {
        isFocus: {
            type: Boolean
        }


    },
    computed: {
        ...mapState({
            isSeenPopup: state => state.employee.isShowFormEmployee,
            formMode: state => state.employee.formMode,
            employeeSelected: state => state.employee.employeeSelected,
            MISAEnum: state => state.employee.MISAEnum,
            dialog: state => state.employee.dialog,
            employeeNewCode: state => state.employee.employeeNewCode,
            loading: state => state.employee.loading
        })
    },
    watch: {
        employeeNewCode: function () {
            this.setEmployeeSelected();
        }
    },
    data() {
        return {
            visible: false,
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
            inputEmpCode: "",
            isValidEmpCode: false,
            isValidEmpName: false,
            isValidEmpDepart: false,
            isValidEmpDateOfBirth: false,
            isValidEmpEmail: false,
            isValidEmpCMND: false,
            listDepaerment: [],
            isHiden: false

        }
    },
    methods: {
        ...mapActions('employee',
            ['setEmployeeSelected', 'btnShowFormEmployee', 'setMessageDialogSucess',
                'toggleShowFormEmployee', 'setMessageDialogWarning', 'getListEmployee',
                'getNewEmployeeCode', 'changeFormMode', 'changeLoading','setMessageDialogWarning'
            ]),

        removeBorder(type) {
            if (type === "empCode") {
                this.isValidEmpCode = false;
            }
            if (type === "empName") {
                this.isValidEmpName = false;
            }
            if (type === "empDepart") {
                this.isValidEmpDepart = false;
            }
            if (type === "empDoB") {
                this.isValidEmpDateOfBirth = false;
            }
            if (type === "empCMND") {
                this.isValidEmpCMND = false;
            }
            if (type === "empEmail") {
                this.isValidEmpEmail = false;
            }
        },
        /*
           Descript func: hàm validate form chi tiết nhân viên
           cho việc thêm và sửa
           author: Nguyễn văn Đông 
           Date: 20/6/2022
       */
        validateForm() {
            let me = this;
            let isValid = true;
            try {
                let employee = this.employeeSelected;
                console.log(employee)
                console.log("em valid:")

                //1. các thông tin bắt buộc nhập
                this.errMsg.length = 0;

                if (!employee["EmployeeCode"]) {
                    this.errMsg.push(" Mã nhân viên không được phép trống!");
                    isValid = false;
                    this.isValidEmpCode = true;

                }else if(employee["EmployeeCode"]){
                    var empCode=employee["EmployeeCode"].substring(0,3);
                    console.log(empCode);
                    if((empCode==="NV-")===false){
                        console.log("check empcode");
                        isValid = false;
                        this.isValidEmpCode = true;
                        this.errMsg.push(" Mã nhân viên phải bắt đầu bằng NV-");
                    }
                } else {
                    const regex = new RegExp("^[a-zA-Z-_.]+[0-9]+$");
                    if (regex.test(employee["EmployeeCode"]) === false) {
                        isValid = false;
                        this.isValidEmpCode = true;
                        this.errMsg.push(" Mã nhân viên phải  kết thúc bằng số!");
                    }
                }

                if (!employee["EmployeeName"]) {
                    this.errMsg.push(" Họ tên nhân viên không được phép trống!");
                    isValid = false;
                    this.isValidEmpName = true;
                }

                if (!employee["DepartmentId"]) {
                    this.errMsg.push(" Thông tin đơn vị không được phép trống !");
                    isValid = false;
                    this.isValidEmpDepart = true;
                }

                if (employee["IdentityNumber"]) {
                    const regex = new RegExp("^[0-9]{12}$");
                    if (regex.test(employee["IdentityNumber"]) === false) {
                        isValid = false;
                        this.isValidEmpCMND = true;
                        this.errMsg.push(" Số CMND phải là số và bao gồm 12 số");
                    }
                }

                if (employee["PhoneNumber"]) {
                    const regex = new RegExp("^[0-9]*$");
                    if (regex.test(employee["PhoneNumber"]) === false) {
                        isValid = false;
                        this.errMsg.push(" Số điện thoại di động phải là số");
                    }
                }

                if (employee["Email"]) {
                    const regex = new RegExp("^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:.[a-zA-Z0-9-]+)*$");
                    if (regex.test(employee["Email"]) === false) {
                        isValid = false;
                        this.isValidEmpEmail = true;
                        this.errMsg.push("Email không đúng định dạng");
                    }
                }

                if (employee["BankAccountNumber"]) {
                    const regex = new RegExp("^[0-9]*$");
                    if (regex.test(employee["BankAccountNumber"]) === false) {
                        isValid = false;
                        this.errMsg.push("Tài khoản ngân hàng phải là số");
                    }
                }

                if (employee["TelephoneNumber"]) {
                    const regex = new RegExp("^[0-9]*$");
                    if (regex.test(employee["TelephoneNumber"]) === false) {
                        isValid = false;
                        this.errMsg.push("Số điện thoại cố định phải là số");
                    }
                }

                if (employee["DateOfBirth"]) {
                    if (employee.DateOfBirth != null) {
                        let dobArr = employee.DateOfBirth.split('/');
                        employee.DateOfBirth = dobArr[2] + '-' + dobArr[1] + '-' + (dobArr[0]);
                    }
                    let ngaySinh = employee["DateOfBirth"];

                    ngaySinh = new Date(ngaySinh);

                    if (employee["DateOfBirth"] && (ngaySinh instanceof Date && !isNaN(ngaySinh.valueOf()))) {
                        //lấy ra năm
                        let yearBirth = ngaySinh.getFullYear();
                        if (yearBirth >= new Date().getFullYear()) {
                            this.errMsg.push(" Năm sinh không đươc vượt quá năm hiện tại!");
                            this.isValidEmpDateOfBirth = true;
                            isValid = false;
                        } else if (yearBirth < 1950) {
                            this.errMsg.push(" Năm sinh không đươc nhỏ hơn năm 1950 !");
                            this.isValidEmpDateOfBirth = true;
                            isValid = false;
                        }

                    } else {
                        this.errMsg.push(" Thông tin ngày sinh không hợp lệ !");
                        isValid = false;
                    }
                }
                if (employee["IdentityDate"]) {
                    if (employee.IdentityDate != null) {
                        let iDenArr = employee.IdentityDate.split('/');
                        employee.IdentityDate = iDenArr[2] + '-' + iDenArr[1] + '-' + (iDenArr[0]);
                    }
                    let ngaySinh = employee["IdentityDate"];
                    ngaySinh = new Date(ngaySinh);
                    if (employee["IdentityDate"] && (ngaySinh instanceof Date && !isNaN(ngaySinh.valueOf()))) {
                        // xử lý hiển thị ngày ngaySinh
                        //định dạng dữ liệu ngày tháng=> ngày/tháng/năm: 20/02/2022
                        //lấy ra năm
                        let yearBirth = ngaySinh.getFullYear();
                        if (yearBirth >= new Date().getFullYear()) {
                            this.errMsg.push(" Ngày cấp không đươc vượt quá năm hiện tại!");
                            isValid = false;
                        } else if (yearBirth < 1900) {
                            this.errMsg.push(" Ngày cấp không đươc nhỏ hơn năm 1950 !");
                            isValid = false;
                        }

                    } else {
                        this.errMsg.push(" Thông tin Ngày cấp không hợp lệ !");
                        isValid = false;
                    }
                }


                //2. kiếm tra thông tin liên quan ngày tháng

                //3.Kiểm tra dữ liệu có đúng định dạng không

                //4. Kiểm tra thông tin có đúng hay không

                //kiểm tra xem có lỗi validate không
                if (!isValid) {
                    console.log(isValid);
                    // hiển thị thông báo lỗi
                    // gửi dữ liệu lên compont cha để hiển thị validate
                    this.setMessageDialogWarning({
                        message: me.errMsg,
                        type: "isSeenMatchEmployee",
                        employeeCode: ""
                    })
                }
                //5. Theo nghiệp vụ đặc thụ bài toán

            } catch (error) {
                console.log(error)
            }
            return isValid;
        },
        /*
           Descript func: hàm lấy danh sách đơn vị và gán vào combox 
           trong form chi tiết nhân viên
           author: Nguyễn văn Đông 
           Date: 20/6/2022
       */
        getListDepartment() {
            try {
                let me = this;
                axios.get(`http://localhost:${port}/api/v1/Departments`)
                    .then(function (response) {
                        me.listDepaerment = response.data;
                        console.log(response)
                    })
                    .catch(function (error) {
                        console.log(error)
                    })
            } catch (e) {
                console.log(e);
            }
        },
        /*
           Descript func: hàm thực hiện chức năng cất và thêm nhân viên
           author: Nguyễn văn Đông 
           Date: 20/6/2022
       */
        btnAddOrSaveEmployee() {

            let employee = this.employeeSelected;
            console.log("emplo add");
            console.log(employee);
            // lưu biến con trỏ this
            let me = this;
            let isValid = me.validateForm();
            // kiểm tra formMode , Nếu là thêm thì thực hiện thêm , không thì thực hiện sửa
            if (this.formMode === this.MISAEnum.FormMode.ADD && isValid) {

                // chuyển đối tượng về dạng JSON để gửi dữ liệu                  
                let dataSend = JSON.stringify(employee);
                console.log(dataSend)

                axios.post(`http://localhost:${port}/api/v1/Employees/insert`,
                    dataSend, {
                    headers: {
                        'Content-Type': 'application/json',
                    }
                })
                    .then(function (response) {
                        if(response.data===true){
                            me.getNewEmployeeCode();
                            me.getListEmployee();
                            me.setEmployeeSelected();
                            // hiển thị thông báo thành công và tự động ẩn sau 2 s
                            me.setMessageDialogSucess({
                                message: "Bạn đã thêm thành công",
                                employee: employee,
                                type: "isSeenAddSucess",
                            })
                            setTimeout(function () {
                                me.setMessageDialogSucess({
                                    message: "",
                                    employee: {},
                                    type: "",
                                })
                            }, 2000)
                            // me.loadData();
                        }else{
                            //setMessageDialogWarning
                            // hiển thị thông báo thành công và tự động ẩn sau 2 s
                           // hiển thị thông báo thành công và tự động ẩn sau 2 s
                           me.errMsg.push("Mã nhân viên trùng")

                           me.setMessageDialogWarning({
                                message: me.errMsg,
                                employee: employee,
                                type: "isSeenMatchEmployee",
                            })
                           me.isValidEmpCode = true;
                        }
                    

                    })
                    .catch(function (error) {
                        console.log(error)
                        // gán dữ liệu và lỗi khi trả về từ response
                       // const statusCode = error.response.status;
                        const errMsg = error.response.data.devMsg;
                        console.log("err" + errMsg)
                      
                    })

            } else if (isValid) {

                console.log("edit");
                console.log(employee)
                employee.DateOfBirth = new Date(employee.DateOfBirth);
                employee.IdentityDate = new Date(employee.IdentityDate);
                let dataSend = JSON.stringify(employee);
                console.log(dataSend)
                axios.put(`http://localhost:${port}/api/v1/Employees/update`,
                    dataSend, { headers: { 'Content-Type': 'application/json' } })
                    .then(function () {
                        me.getListEmployee();
                        me.changeFormMode(me.MISAEnum.FormMode.ADD);
                        me.setEmployeeSelected();
                        // hiển thị thông báo thành công và tự động ẩn sau 2 s
                        me.setMessageDialogSucess({
                            message: "Bạn đã sửa thành công",
                            employee: employee,
                            type: "isSeenEditSucess",
                        })
                        setTimeout(function () {
                            me.setMessageDialogSucess({
                                message: "",
                                employee: {},
                                type: "",
                            })
                        }, 2000)


                    })
                    .catch(function (error) {
                        console.log(error)
                    })
            }
        },
        /*
           Descript func: hàm thực hiện thêm hoặc sửa nhân viên theo type formMode
           author: Nguyễn văn Đông 
           Date: 20/6/2022
       */
        btnSaveEmployee() {
            // lưu giá trị employee khi đc map với input
            let employee = this.employeeSelected;
            console.log(employee)
            console.log("emplo add");

            // lưu biến con trỏ this
            let me = this;
            let isValid = me.validateForm();
            // kiểm tra formMode , Nếu là thêm thì thực hiện thêm , không thì thực hiện sửa
            if (this.formMode === this.MISAEnum.FormMode.ADD && isValid) {

                // chuyển đối tượng về dạng JSON để gửi dữ liệu                  
                let dataSend = JSON.stringify(employee);
                console.log(dataSend)

                axios.post(`http://localhost:${port}/api/v1/Employees/insert`,
                    dataSend, {
                    headers: {
                        'Content-Type': 'application/json',
                    }
                })
                    .then(function () {
                        console.log("add thành công");
                        me.toggleShowFormEmployee();
                        // hiển thị thông báo thành công và tự động ẩn sau 2 s
                        me.setMessageDialogSucess({
                            message: "Bạn đã thêm thành công",
                            employee: employee,
                            type: "isSeenAddSucess",
                        })
                        setTimeout(function () {
                            me.setMessageDialogSucess({
                                message: "",
                                employee: {},
                                type: "",
                            })
                        }, 2000)
                        me.getListEmployee();

                    })
                    .catch(function (error) {
                        console.log(error)
                        // gán dữ liệu và lỗi khi trả về từ response
                       
                    })

            } else if (isValid) {

                console.log("edit");
                console.log(employee)
                employee.DateOfBirth = new Date(employee.DateOfBirth);
                employee.IdentityDate = new Date(employee.IdentityDate);
                let dataSend = JSON.stringify(employee);
                console.log(dataSend)

                axios.put(`http://localhost:${port}/api/v1/Employees`,
                    dataSend, { headers: { 'Content-Type': 'application/json' } })
                    .then(function () {
                        me.getListEmployee();
                        console.log("edit thành công");
                        me.toggleShowFormEmployee();
                        // hiển thị thông báo thành công và tự động ẩn sau 2 s
                        me.setMessageDialogSucess({
                            message: "Bạn đã sửa thành công",
                            employee: employee,
                            type: "isSeenEditSucess",
                        })
                        setTimeout(function () {
                            me.setMessageDialogSucess({
                                message: "",
                                employee: {},
                                type: "",
                            })
                        }, 2000)

                    })
                    .catch(function (error) {
                        console.log(error)
                    })
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
            this.isValidEmpCode= false
            this.isValidEmpName= false
            this.isValidEmpDepart= false
            this.isValidEmpDateOfBirth= false
            this.isValidEmpEmail= false
            this.isValidEmpCMND=false
        }

        },

    },
    beforeCreate() {

    },
    created() {
        let me = this;
        //load combox đơn vị
        me.getListDepartment();
        //this.value='142cb08f-7c31-21fa-8e90-67245e8b283e';
    },
    beforeMount() {

    },
    mounted() {


    },
    beforeUpdate() {

    },
    updated() {
        //    this.valueDate=this.employeeSelected.DateOfBirth;

    },
    beforeUnmount() {

    },
    unmounted() {

    }

}
</script>
<style >
@import 'vue-datepicker-next/index.css';

.mx-input {
    display: inline-block;
    box-sizing: border-box;
    width: 100%;
    height: 32px !important;
    padding: 6px 30px;
    padding-left: 10px;
    font-size: 14px;
    line-height: 1.4;
    color: #555;
    background-color: #fff;
    border: 1px solid #ccc;
    border-radius: 4px;
    box-shadow: inset 0 1px 1px rgb(0 0 0 / 8%);
}

.mx-datepicker {
    position: relative;
    display: inline-block;
    width: 160px;
}

.el-select {
    border:1px solid #c3c1c1 !important;
    border-radius: 2px !important;
    --el-select-input-focus-border-color: none;
}
.el-select::-moz-focus-outer{
    border:1px solid #2FBE8E !important;
}
.el-select-dropdown__item.selected {
    color: white;
    font-weight: 0 !important;
    background-color: #2FBE8E;
    font-family: Misa Font Medium !important;
}

.el-select .el-input__wrapper {
    display: inline-flex;
    flex-grow: 1;
    align-items: center;
    justify-content: center;
    padding: 1px 11px;
    background-color: var(--el-input-bg-color, var(--el-fill-color-blank));
    background-image: none;
    border-radius: 3px;
    transition: var(--el-transition-box-shadow);
    box-shadow: none !important;
}

.el-input__inner {
    color: #000000;
}

.el-select input:focus {
    outline: none !important;
    height: 32px !important;
}

.el-select input[type="text"] {
    --el-input-inner-height: calc(var(--el-input-height, 32px) - 2px);
    width: 100%;
    flex-grow: 1;
    -webkit-appearance: none;
    color: var(--el-input-text-color, var(--el-text-color-regular));
    font-size: inherit;
    height: var(--el-input-inner-height) !important;
    line-height: var(--el-input-inner-height);
    padding: 0 !important;
    outline: 0;
    border: none !important;
    background: 0 0;
    box-sizing: border-box;
}

.el-select-dropdown__item.hover,
.el-select-dropdown__item:hover {
    background-color: #9be4cc;
    color: #ffffff;
}

.el-select-dropdown__item.selected {
    color: white;
    font-weight: 0 !important;
    background-color: #2FBE8E !important;
    font-family: Misa Font Medium !important;
}
</style>