<template>

    <div class="d-footer">
        <div class="d-page-navigation">
            <div class="d-count-record">Tổng số <span id="total-record">{{ totalRecord }}</span> bản ghi
            </div>
            <div class="d-control-right-filter">
                <div class="d-combox-filter">
                    <el-select class="cus-border-select" @change="filterCombox" v-model="value"  placeholder="Chọn">
                        <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
                    </el-select>
                </div>
                <div  :class="{ disabledNextprev : numberCurent == 1 }"  @click="nextPrevPage(changCount(count--))" class="d-control-first">Trước</div>
                <div class="d-number-page">
                    <template v-for="(number, index) in numbers">
                        <template v-if="numbers <= 8">
                            <div :class="{ borderBlack: numberCurent == number }"
                                @click="clickNumberPage(number, empSearch)" :key="index" class="d-number"> {{ (number)
                                }}
                            </div>
                        </template>
                        <template v-else-if="numbers > 8">
                            <div :class="{ borderBlack: numberCurent == number }"
                                @click="clickNumberPage(number, empSearch)" v-if="number <= 3" :key="index"
                                class="d-number">
                                {{ number }}</div>
                            <div class="d-number" v-if="(number > 3 && number <= numbers - 3) && numberCurent == number"
                                :key="index">
                                ..<span v-if="(numberCurent == number)" class="d-number"
                                    :class="{ borderBlack: numberCurent == number }"> {{ number }}</span>..
                            </div>
                            <div class="d-number" v-if="(isDotted && number == 4)" :key="index">...
                            </div>
                            <div :class="{ borderBlack: numberCurent == number }"
                                @click="clickNumberPage(number, empSearch)"
                                v-if="number >= numbers - 2 && number <= numbers" :key="index" class="d-number"> {{
                                        (number)
                                }}</div>
                        </template>
                    </template>
                </div>
                <div :class="{ disabledNextprev : numberCurent == numbers }" @click="nextPrevPage(changCount(count++))" class="d-control-last">Sau</div>
            </div>
        </div>
    </div>

</template>

<script>
import { ref } from 'vue'
import { mapActions, mapState } from 'vuex';
export default {

    computed: {
        ...mapState({
            totalRecord: state => state.employee.totalRecord,
            valueSelectCombox: state => state.employee.valueSelectCombox,
            empSearch: state => state.employee.empSearch,
            pageNumber: state => state.employee.pageNumber,
        })
    },
    data() {
        return {
            value: ref(''),
            valuePageChange: 10,
            numbers: 0,
            count: 1,
            checkNumber: false,
            valueSelect: 10,
            numberCurent: 1,
            isDotted: true,
            options: [
                {
                    value: 10,
                    label: '10 bản ghi trên trang',
                },
                {
                    value: 20,
                    label: '20 bản ghi trên trang',
                },
                {
                    value: 30,
                    label: '30 bản ghi trên trang',
                },
                {
                    value: 50,
                    label: '50 bản ghi trên trang',
                },
                {
                    value: 100,
                    label: '100 bản ghi trên trang',
                },
            ]
        }
    },
    watch: {
        valueSelectCombox: function () {
            this.value = this.valueSelectCombox;
        },
        count: function () {
            this.numberCurent = this.count;
            if (this.count > 3 && this.count <= this.numbers - 3) {
                this.isDotted = false;
            }
            if (this.count == this.numbers - 2 || this.count < 4) {
                this.isDotted = true;
            }
        },
        pageNumber: function () {
            this.count = this.pageNumber;
        }
    },
    methods: {
        ...mapActions('employee', [
            "getListEmployee", "changePageSizeAndPageNumber"
        ]),

        /*
            Descript func: hàm thay đổi biến count khi clik vào trước , sau
            author: Nguyễn văn Đông 
            Date: 20/6/2022
        */
        changCount() {
            const countPage = Math.ceil(this.totalRecord / Number(this.value));
            if (this.count < 1) this.count = 1;
            if (this.count > countPage) {
                this.count = countPage
            }
            return this.count;
        },

        /*
          Descript func: hàm thực hiện thay đổi dữ liệu khi clik 1 số trên thanh pagenavition
          author: Nguyễn văn Đông 
          Date: 20/6/2022
      */
        clickNumberPage(number, employeeFilter) {
            let me = this;
            this.count = number;
            this.changePageSizeAndPageNumber({
                pageSize: Number(me.value),
                pageNumber: number,
                employeeFilter: employeeFilter,
                valueSelectCombox: Number(me.value)
            })
            this.getListEmployee();
        },
        /*
          Descript func: hàm thực hiện thay đổi dữ liệu khi thay đổi 
          // giá trị trong thẻ select
          author: Nguyễn văn Đông 
          Date: 20/6/2022
      */
        filterCombox() {
            try {
                let me = this;

                //let employeeFilter = document.getElementById('txtSearch').value;
                //xử lý dữ liệu để load lại number page
                this.changePageSizeAndPageNumber({
                    pageSize: Number(me.value),
                    pageNumber: 1,
                    employeeFilter: this.empSearch,
                    valueSelectCombox: Number(me.value)
                })
                this.getListEmployee();
            } catch (e) {
                console.log(e);
            }
        },
        /*
           Descript func: hàm thực hiện thay đổi dữ liệu khi clik vào trước , sau
           author: Nguyễn văn Đông 
           Date: 20/6/2022
       */
        nextPrevPage(pageNumber) {
            try {
                let me = this;

                // tính toán tổng số page
                const countPage = Math.ceil(this.totalRecord / Number(me.value));
                // mỗi lần click biến count sẽ tăng hoặc giảm.
                if (pageNumber < 1) {
                    pageNumber = 1;
                } else if (pageNumber > countPage) {
                    pageNumber = countPage;
                }

                // xử lý dữ liệu khi click next, prev
                this.changePageSizeAndPageNumber({
                    pageSize: Number(this.value),
                    pageNumber: pageNumber,
                    employeeFilter: this.empSearch,
                    valueSelectCombox: Number(this.value)
                })
                this.getListEmployee();

            } catch (e) {
                console.log(e);
            }
        }
    },

    beforeCreate() {

    },
    created() {
        this.value = this.valueSelectCombox;
        this.numbers = Math.ceil(this.totalRecord / Number(this.value));
    },
    beforeMount() {

    },
    mounted() {

    },
    beforeUpdate() {

    },
    updated() {
        this.numbers = Math.ceil(this.totalRecord / Number(this.value));
    },
    beforeUnmount() {

    },
    unmounted() {

    }


}
</script>
<style >
.el-select {
    border-color: #000000 !important;
    border-radius:5px !important;
    --el-select-input-focus-border-color:#2FBE8E;
} 
.el-select-dropdown__item.selected {
    color: white;
    font-weight:0 !important;
    background-color:#2FBE8E;
    font-family: Misa Font Medium !important;
}
.el-input__wrapper {
    display: inline-flex;
    flex-grow: 1;
    align-items: center;
    justify-content: center;
    padding: 1px 11px;
    background-color: var(--el-input-bg-color,var(--el-fill-color-blank));
    background-image: none;
    border-radius:3px;
    transition: var(--el-transition-box-shadow);  
    box-shadow: 0 0 0 0.5px #BBBBBB inset !important;
}
.el-input__inner {
    color: #000000;
}

</style>