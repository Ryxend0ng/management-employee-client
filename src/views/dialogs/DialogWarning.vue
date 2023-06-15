<template>
    <!-- thông báo xác nhận xóa-->
    <div v-if="dialogWarning.type" id="d-notify-delete" class="show-popup">
        <div class="d-notify">
            <div class="d-notify-title">
                <div class="d-icon-wanring"></div>
                <div>
                    <div v-for="(msg, index) in dialogWarning.message" :key="index">
                        <p> {{ msg }}</p>
                    </div>
                </div>

            </div>
            <div v-if="checkDelete === 'isSeenDelete'" class="d-btn-group">
                <!-- @click="$emit('btnClose',typeClose.Delete)" -->
               
                    <div @click="btnClose()" class="d-button d-cancel">Không</div>
                    <div @click="deleteEmloyee({
                        employee: dialogWarning.employee,
                        isDelete: true
                    })" id="d-accept-delete" class="d-button d-accept">Có</div>
               
                <!-- @click="deleteEmloyee({
                    employee: dialog.employee,
                    isDelete: true
                    })" -->
            </div>
            <div class="d-btn-group" v-if="checkDelete !== 'isSeenDelete'">
                <div></div>
                <div @click="btnClose()" id="d-match-accept" class="d-button d-accept">Ok
                </div>
            </div>

        </div>
    </div>
    <!-- end thông báo xác nhận xóa-->
</template>

<script>
import { mapActions, mapState } from 'vuex';

export default {
    name: 'DialogWarning',
    data() {
        return {
            isSeenDelete: true,
            isSeenValidate: true,
            isSeenDataChange: true,
            isSeenMatchEmployee: true,
            checkDelete: ""
        }
    },
    computed: mapState({
        dialogWarning: state => state.employee.dialogWarning,
    }),
    methods: {
        ...mapActions('employee', [
            "deleteEmloyee", "setMessageDialogWarning"
        ]),
        btnClose() {
            this.setMessageDialogWarning({
                message: [],
                type: "",
                employeeCode: ""
            })
        },
    },
    created() {

    },
    updated() {
        this.checkDelete = this.dialogWarning.type;
    },
}
</script>
<style>
</style>
