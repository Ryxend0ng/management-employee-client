<template>
    <div v-if="dialogSucess.type" class="d-notify-sucess">
        <div class="d-notify-title-sucess">
            <span>{{ dialogSucess.message }} <span id="d-name-emp">{{ dialogSucess.employee.EmployeeCode }}</span> <br>
            </span>
            <div class="d-icon-sucess"></div>
        </div>
    </div>
</template>

<script>
import { mapState } from 'vuex';
export default {
    data() {
        return {
            isSeenAddSucess: true,         
            isSeenDeleteSucess: true,
            isSeenEditSucess: true,
        }
    },
    watch: {
        
    },
    computed: mapState({
        dialogSucess: state => state.employee.dialog,
    }),
    created(){
     
    },
    updated() {
    }
}
</script>
<style>
</style>
