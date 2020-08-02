<template>
    <div v-if="showFly">
        <el-card class="box-card" v-drag>
            <div slot="header" class="clearfix">
                <span :class="icon" style="font-size: 16px;">{{title}}</span>
                <span style="float: right; padding: 3px 0" @click="close">X</span>
            </div>

            <slot name="content"></slot>
            
        </el-card>
    </div>
</template>

<script>
export default {
    data(){
        return {
            showFly: false
        }
    },
    props: {
        title: String,
        icon: String
    },
    methods:{
        open(){
            this.showFly = true;
        },
        close(){
            // this.$emit('closeMap', true)
            this.showFly = false;
        }
    }
}
</script>

<style>
    .box-card{
        position: absolute;
        top: 50px;
        right: 20px;
        width: 358px;
    }
    .clearfix:before,
    .clearfix:after {
        display: table;
        content: "";
    }
    .clearfix:after {
        clear: both
    }
    .el-card{
        background-color: transparent;
        border: 1px solid rgba(32,160,255,.6);
        border-radius: 5px!important;
        box-shadow: 1px 1px 5px rgba(0,0,0,.2);
    }
    .el-card__header{
        background: rgba(30,36,50,.6);
        color: #fff;
        border-bottom: 1px solid rgba(32,160,255,.6);
    }
    .el-card__body{
        padding: 0px;
        background: rgba(30,36,50,.6);
        color: #fff;
    }
</style>