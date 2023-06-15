<template>
    <div class="d-record-table">
        <el-table v-loading="loading" border :header-row-style="
        {
            textAlign: 'center',
            color: 'black', fontSize: '14x'
        }" show-header highlight-current-row :data="employees" style="width: 1000px" max-height="376">
            <el-table-column ref="element" v-for="(column, index) in columns" :key="index" :label="column.label"
                :prop="column.prop" :width="column.width" :type="index === 0 ? 'selection' : ''"
                :fixed="index === 0 || index === 1 ? 'left' : index === 10 ? 'right' : false" :formatter="formatter">
                <template v-if="index === 10" #default="scope">
                    <div class="d-btn-edit-form">
                        <span @click="btnShowFormEmployee(scope.row)" class="d-btn-edit">Sửa</span>
                        <el-popover  :placement="scope.$index===6||scope.$index===9?'top':'bottom'"   transition="el-fade-in-linear" trigger="click" >
                            <template #reference>
                                <div class="d-fixed-icon">
                                    <div class=" d-icon-arrdow-blue">
                                    </div>
                                </div>
                            </template>               
                            <div class="d-sub-menu" :style="styleSubmenu">
                                <ul>
                                    <li @click="copyEmployee(scope.row)">Nhân bản</li>
                                    <li @click="deleteEmloyee({
                                        employee: scope.row,
                                        isDelete: false
                                    })" class="btn-delete-emp">Xóa</li>
                                    <li>Ngừng sửu dụng</li>
                                </ul>
                            </div>
                        </el-popover>
                    </div>
                </template>
            </el-table-column>
        </el-table>

    </div>

    <!-- -->
    <!-- thông báo xác nhận xóa -->
    <DialogWarning />
    <!-- end thông báo xác nhận xóa-->

    <!-- thông báo xác nhận xóa thành công-->
    <DialogSucess />
    <!-- end thông báo xác nhận sửa thành công-->
    <!--
        submenu -->

    <div @click="offSubmenu" v-if="isShowSubmenu"
        style="position: absolute;top:0px;left:0;z-index: 1000;height:100vh;width:100%;"></div>
</template>

<script>
import axios from 'axios';
import { Table, TableColumn } from "element-plus";
import { mapActions, mapState } from 'vuex';
import DialogSucess from '../dialogs/DialogSucess.vue';
import DialogWarning from '../dialogs/DialogWarning.vue';
export default {
    setup() {
        // const element = ref('');
        // onMounted(() => {
        //    var elementArray=element.value;
        //    console.log(markRaw(toRaw(elementArray)));
        //    elementArray.forEach(function(value){
        //         console.log((toRaw(value)))
        //    })
        // });
        // return { element }
    },
    data() {
        return {
            styleSubmenu: {},
            isShowSubmenu: false,
            columns: [
                {
                    
                    label: '',
                    prop: '',
                    width: 40
                },
                {
                    label: 'Mã nhân viên',
                    prop: 'EmployeeCode',
                    width: 140
                },
                {
                    label: 'Tên nhân viên',
                    prop: 'EmployeeName',
                    width: 240
                },
                {
                    label: 'Giới tính',
                    prop: 'Gender',
                    width: 130
                },
                {
                    label: 'Ngày sinh',
                    prop: 'DateOfBirth',
                    width: 200
                },
                {
                    label: 'Số CMND',
                    prop: 'IdentityNumber',
                    width: 130
                },
                {
                    label: 'Ngày cấp',
                    prop: 'IdentityDate',
                    width: 115
                },
                {
                    label: 'Tên đơn vị',
                    prop: 'DepartmentName',
                    width: 160
                },
                {
                    label: 'Số tài khoản',
                    prop: 'BankAccountNumber',
                    width: 140
                },
                {
                    label: 'Tên ngân hàng',
                    prop: 'BankName',
                    width: 140
                },
                {
                    label: 'Chức năng',
                    prop: '',
                    width: 120
                }
            ],
            employeeSelectedDelete: {}
        }
    },
    watch: {


    },
    components: {
        "el-table": Table,
        "el-table-column": TableColumn,
        DialogWarning,
        DialogSucess,

    },
    computed: mapState({
        employeeNewCode:state=> state.employee.employeeNewCode,
        employees: state => state.employee.employees,
        dialog: state => state.employee.dialog,
        employeeSelected: state => state.employee.employeeSelected,
        loading: state => state.employee.loading,
        port: state => state.employee.port
    }),
    methods: {


        ...mapActions('employee', [
            'toggleShowDialogSucess', 'setMessageDialogSucess',
            'deleteEmloyee', 'toggleShowFormEmployee', 'changeFormMode'
            , 'setEmployeeSelected', 'btnShowFormEmployee','getNewEmployeeCode','getListEmployee'
        ]),
        getAbsPosition(element) {
            var rect = element.getBoundingClientRect();
            return { x: rect.left, y: rect.top }
        },
        logRef() {
            // var elementArray = (this.$refs.element);
            // console.log(elementArray)
            // elementArray.forEach(function (element, index) {

            // })

        },
        /*
           Descript func: hàm chỉnh sửa để hiển thị ngày sinh theo chuẩn
           dd/mm/yyyy
           author: Nguyễn văn Đông 
           Date: 20/6/2022
        */
        formatDate(dob) {
            let ngaySinh = new Date(dob);
            if (dob && (ngaySinh instanceof Date && !isNaN(ngaySinh.valueOf()))) {
                // xử lý hiển thị ngày ngaySinh
                //định dạng dữ liệu ngày tháng=> ngày/tháng/năm: 20/02/2022
                //lấy ra ngày
                let day = ngaySinh.getDate();
                day = day < 10 ? `0${day}` : day;
                //lấy ra tháng
                let month = ngaySinh.getMonth() + 1;
                month = month < 10 ? `0${month}` : month;
                //lấy ra năm
                let year = ngaySinh.getFullYear();
                // chuẩn này sinh chuẩn
                ngaySinh = `${day}/${month}/${year}`;
                return ngaySinh;
            } else {
                return "";
            }
        },
        /*
           Descript func: hàm nhân bản. giữ nguyên giá trị của employee đc nhân bản 
                           chỉ thay đổi mã nhân viên.
           author: Nguyễn văn Đông 
           Date: 20/6/2022
        */
        copyEmployee(employee) {
            let me = this;
            // let employeeCode = employee.EmployeeCode;

            // /** Xử lý khi nhân bản nhân viên */
            // // dùng regex lọc ra gía trị số của mã nhân viên
            // var r = /\d+/;
            // let empNumber = (employeeCode.match(r));
            // // dùng regex lọc ra chữ của mã nhân viên
            // r = /[a-zA-Z-_]+/;
            // let empString = (employeeCode.match(r));
            // // thực hiện tạo mã nhân viên mới , lấy ngẫu nhiên 1 số từ 0 - 1000 -
            // // và cộng với giá trị trong mã nhân viên hiện tại
            // let empNumberNew = Number(Math.floor(Math.random() * 1000) + 1) + Number(empNumber);
            // let employeeCodeNew = empString + empNumberNew;
            // employee.EmployeeCode = employeeCodeNew;
            // /** kết thúc Xử lý khi nhân bản nhân viên */
            console.log("copy")
          
            employee.EmployeeCode=me.employeeNewCode;
            employee.Id=""
            let dataSend = JSON.stringify(employee);
            console.log(dataSend);
            axios.post(`http://localhost:8085/api/v1/Employees/insert`,
                    dataSend, {
                    headers: {
                        'Content-Type': 'application/json',
                    }
                })
                    .then(function () {
                        me.getListEmployee();
                        // hiển thị thông báo thành công và tự động ẩn sau 2 s
                        me.setMessageDialogSucess({
                            message: "Bạn đã nhân bản thành công",
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

                    })
                    .catch(function (error) {
                        console.log(error)
                       
                        
                    })

            // gửi dữ liệu lên component cha để hiển thị thông báo
            me.$emit('handleDialog', {
                type: "copyEmployee",
                message: employee
            })


        },
        renderClickSubmenu(event, employee) {
            var eleArr = document.querySelectorAll('.d-fixed-icon');
            eleArr.forEach(function (value) {
                value.classList.remove("borderBlue")
            })
            this.setEmployeeSelected(employee)
            console.log(employee)
            var rect = event.target.getBoundingClientRect();
            var left = rect.left - 105;
            var top = rect.top + 30;
            event.target.classList.add("borderBlue");
            if (top > 500) {
                top = rect.top - 100;
            }
            var bottom = rect.bottom;
            this.isShowSubmenu = !this.isShowSubmenu;
            this.styleSubmenu = { bottom: `${bottom}px`, left: `${left}px`, right: `1199.84375px`, top: `${top}px` };

        },
        formatter(row, column, cellValue) {
            if (column.property === "DateOfBirth") {
                cellValue = this.formatDate(cellValue);

            }
            if (column.property === "IdentityDate") {
                cellValue = this.formatDate(cellValue)
            }
            if (column.property === "Gender") {
                if(row.Gender==1){
                    cellValue = "Nữ"
                }else{
                    cellValue = "Nam"
                }
            }
            
            //console.log(column, cellValue)
            return cellValue;
        },
        offSubmenu() {
            this.isShowSubmenu = false;
            var eleArr = document.querySelectorAll('.d-fixed-icon');
            eleArr.forEach(function (value) {
                value.classList.remove("borderBlue")
            })
        }
    },
    beforeCreate() {

    },
    created() {

    },
    beforeMount() {

    },
    mounted() {

    },
    beforeUpdate() {

    },
    updated() {
        // this.renderClickSubmenu();
        // var eleArr = document.querySelectorAll('.d-fixed-icon');
        // var submenu = document.querySelector('.d-sub-menu')
        // eleArr.forEach(function (value) {         
        //     console.log( value.getAttribute("data-empCurrent"))
        //     var rect = value.getBoundingClientRect();
        //     console.log(rect)
        //     var left=rect.left-105;
        //     var top=rect.top+30;
        //     var bottom=rect.bottom;
        //     value.addEventListener("click", function () {//1087 258
        //         submenu.style.cssText = `display: block;bottom: ${bottom}px;left: ${left}px;right: 1199.84375px;top: ${top}px;`
        //     })
        // value.addEventListener("click", function (event) {
        //     submenu.style.display = "none"
        // })

        //})
    },
    beforeUnmount() {

    },
    unmounted() {

    }
}
</script>
<style >
.dCenter {
    text-align: center;
}

.el-table {
    --el-table-border-color: var(--el-border-color-lighter);
    --el-table-border: 1px solid var(--el-table-border-color);
    --el-table-text-color: var(--el-text-color-regular);
    --el-table-header-text-color: var(--el-text-color-secondary);
    --el-table-row-hover-bg-color: #f0f5f8 !important;
    --el-table-current-row-bg-color: #e5f3ff !important;
    --el-table-header-bg-color: #e5e8ec;
    --el-table-fixed-box-shadow: var(--el-box-shadow-light);
    --el-table-bg-color: var(--el-fill-color-blank);
    --el-table-tr-bg-color: var(--el-fill-color-blank);
    --el-table-expanded-cell-bg-color: var(--el-fill-color-blank);
    --el-table-fixed-left-column: inset 10px 0 10px -10px rgba(0, 0, 0, 0.15);
    --el-table-fixed-right-column: inset -10px 0 10px -10px rgba(0, 0, 0, 0.15);
}

.el-checkbox__inner {
    display: inline-block;
    position: relative;
    border: 1px solid #afafaf;
    border-radius: var(--el-checkbox-border-radius);
    box-sizing: border-box;
    width: 18px;
    height: 18px;
    background-color: var(--el-checkbox-bg-color);
    z-index: var(--el-index-normal);
    transition: border-color .25s cubic-bezier(.71, -.46, .29, 1.46), background-color .25s cubic-bezier(.71, -.46, .29, 1.46), outline .25s cubic-bezier(.71, -.46, .29, 1.46);
}

.el-checkbox__input.is-checked .el-checkbox__inner {
    background-color: #2FBE8E;
    border-color: #2FBE8E;
}

.el-checkbox {
    justify-content: flex-start;
    display: flex;
    --el-checkbox-font-size: 14px;
    --el-checkbox-font-weight: var(--el-font-weight-primary);
    --el-checkbox-text-color: var(--el-text-color-regular);
    --el-checkbox-input-height: 18px;
    --el-checkbox-input-width: 18px;
    --el-checkbox-border-radius: var(--el-border-radius-small);
    --el-checkbox-bg-color: var(--el-fill-color-blank);
    --el-checkbox-input-border: var(--el-border);
    --el-checkbox-disabled-border-color: var(--el-border-color);
    --el-checkbox-disabled-input-fill: var(--el-fill-color-light);
    --el-checkbox-disabled-icon-color: var(--el-text-color-placeholder);
    --el-checkbox-disabled-checked-input-fill: var(--el-border-color-extra-light);
    --el-checkbox-disabled-checked-input-border-color: var(--el-border-color);
    --el-checkbox-disabled-checked-icon-color: var(--el-text-color-placeholder);
    --el-checkbox-checked-text-color: var(--el-color-primary);
    --el-checkbox-checked-input-border-color: var(--el-color-primary);
    --el-checkbox-checked-bg-color: var(--el-color-primary);
    --el-checkbox-checked-icon-color: var(--el-color-white);
    --el-checkbox-input-border-color-hover: var(--el-color-primary);
}

.el-checkbox__input.is-indeterminate .el-checkbox__inner {
    background-color: #2FBE8E;
    border-color: #2FBE8E;
}

.el-checkbox__inner::after {
    box-sizing: content-box;
    content: "";
    border: 1px solid var(--el-checkbox-checked-icon-color);
    border-left: 0;
    border-top: 0;
    height: 10px;
    left: 6px;
    position: absolute;
    top: 1px;
    transform: rotate(-90deg);
    width: 3px;
    transition: all .15s ease-in 50ms;
    transform-origin: center;
}

.el-table__row {
    z-index: 1;
}
.el-popover.el-popper {
    background: var(--el-popover-bg-color);
    width: 130px !important;
    min-width: 130px !important;
    border-radius: var(--el-popover-border-radius);
    border: 1px solid var(--el-popover-border-color);
    padding: var(--el-popover-padding);
    z-index: var(--el-index-popper);
    color: var(--el-text-color-regular);
    line-height: 1.4;
    text-align: justify;
    font-size: var(--el-popover-font-size);
    box-shadow: var(--el-box-shadow-light);
    word-break: break-all;
}
.el-popover {
    --el-popover-bg-color: var(--el-bg-color-overlay);
    --el-popover-font-size: var(--el-font-size-base);
    --el-popover-border-color: var(--el-border-color-lighter);
    --el-popover-padding: 0px;
    --el-popover-padding-large: 18px 20px;
    --el-popover-title-font-size: 16px;
    --el-popover-title-text-color: var(--el-text-color-primary);
    --el-popover-border-radius: 4px;
}
</style>