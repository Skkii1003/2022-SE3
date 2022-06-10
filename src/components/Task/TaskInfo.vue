<template>
    <div class="ui container" :class="bottom" id="body">
        <!-- header -->
        <div class="ui top attached segment">
            <div class="ui middle aligned one column grid">
                <div class="column center aligned">
                    <h2 class="ui black header">任务详情</h2>
                </div>
            </div>
        </div>
        <!-- introduction -->
        <div class="ui attached segment">
            <div class="ui vertical segment">
                <div class="ui grid">
                    <div class="ui six wide column">
                        <h3 class="ui header">{{taskInfo.taskName}}</h3>
                        <p class="text">发包方：{{taskInfo.ownerName}}</p>
                        <p class="text">报名详情：{{taskInfo.hiredPerson}} / {{taskInfo.requiredPerson}}</p>
                    </div>
                    <div class="ui five wide column">
                        <p class="text">类型：{{taskInfo.testType}}</p>
                        <p class="text">难度：{{taskInfo.difficulty}}</p>
                        <p class="text">设备类型：{{taskInfo.device}}</p>
                    </div>
                    <div class="ui five wide column">
                        <p class="text">开始时间：{{taskInfo.startTime}}</p>
                        <p class="text">截止时间：{{taskInfo.deadLine}}</p>
                        <div class="center aligned">
                            <button v-show="buttonShow" class="ui button" @click="join">{{text}}</button>
                        </div>
                    </div>
                </div>
            </div>

            <div class="ui vertical segment" id="profile">
                <div class="ui text container center aligned">
                    <h3>简介</h3>
                </div>
                <div class="ui divider"></div>
                <div class="ui text container">
                    <p>{{taskInfo.introduction}}</p>
                </div>
                <br/><br/>
            </div>
        </div>

        <div v-show="isJoin" class="ui attached segment">
            <div class="ui container">
                <button class="ui left button" @click="downloadDoc">下载测试文档</button>
                <button class="ui right floated button" @click="downloadApp">下载测试应用</button>
            </div>
        </div>

        <!-- read report -->
        <div v-if="isJoin" class="ui attached segment">
            <ReportList :taskId="taskInfo.taskId"></ReportList>
        </div>

        <div v-if="userInfo.role === '1'" class="ui attached segment">
            <ReportCluster :taskId="taskInfo.taskId"></ReportCluster>
        </div>

        <!-- submit -->
        <div v-if="submitReport" class="ui attached segment">
            <ReportSubmit :topButton="true"></ReportSubmit>
        </div>
    </div>
</template>

<script>
import ReportSubmit from '../Report/ReportSubmit.vue'
import axios from 'axios'
import ReportList from '../Report/ReportList.vue'
import ReportCluster from '../Report/ReportCluster.vue'
export default {
    name:'TaskInfo',
    components:{
        ReportSubmit,
        ReportList,
        ReportCluster
    },
    data(){
        return {
            userInfo:{
                username : window.sessionStorage.getItem('username'),
                role : window.sessionStorage.getItem('role'),
            },
            taskInfo:{
                taskId : '',
                taskName:'空',
                ownerName:'',
                requiredPerson: '0',
                hiredPerson : '0',
                testType: '',
                startTime: '',
                deadLine:'',
                introduction: '',
                docPath: '',
                appPath: '',
                difficulty : 0,
                device: '',
            },
            isJoin : false, //初始值待修改
            bottom : 'before',
            text : '立即加入',
            buttonShow : true,
            submitReport: false,
            from:false,
        }
    },
    created(){
        if(window.sessionStorage.getItem('taskInfo') != null){
            this.taskInfo = JSON.parse(window.sessionStorage.getItem('taskInfo'))
            this.from = window.sessionStorage.getItem('from')
        }
    },
    methods: {
        downloadDoc(){
			window.location.href = this.taskInfo.docPath
		},
		downloadApp(){
			window.location.href = this.taskInfo.appPath
		},
        join(){
            if(this.userInfo.role === '1' && this.text==="结束任务"){
                axios.post(this.url.ip+this.url.finishTask,{tid:this.taskInfo.taskId})
                .then((res)=>{
                    if(res.data.code===1){
                        alert(res.data.msg)
                    }
                    else{
                        alert("结束任务失败")
                    }
                })
                return
            }
            if(this.isJoin){
                this.bottom = 'after'
                this.text = "已加入"
                alert("已加入，请勿重复操作")
                return
            }
            axios.post(this.url.ip+this.url.join,{
                userInfo:this.userInfo,
                taskId:this.taskInfo.taskId,
                isFind:0
            }).then((res)=>{
                if(res.data.code === 1){
                    this.isJoin = true
                    this.bottom = 'after'
                    this.text = "已加入"
                    this.submitReport=true
                }
                else if(res.data.code === 0){
                    this.bottom = 'after'
                    this.text = "已加入"
                    alert("已加入，请勿重复操作")
                }
                else if(res.data.code === 2){
                    alert("名额已满，无法加入")
                }
            })
        },
    },
    mounted(){
        if(this.userInfo.role === '0'){
            this.buttonShow = false
            this.isJoin = false
            this.submitReport = false
            this.bottom = 'before'
        }
        else if(this.userInfo.role === '1'){
            this.buttonShow = false
            this.isJoin = false
            this.submitReport = false
            if(this.from === "true"){
                this.buttonShow = true
                this.text = "结束任务"
                this.bottom = 'after'
                this.isJoin = true
            }
        }
        else{
            if(this.from === "true"){
                this.bottom = 'after'
                this.isJoin = true
                this.text = "已加入"
                this.submitReport = true
            }
            else{
                axios.post(this.url.ip+this.url.join,{
                    userInfo : this.userInfo,
                    taskId: this.taskInfo.taskId,
                    isFind: 1
                })
                .then((res)=>{
                    if(res.data.code === 3){
                        this.isJoin = true
                        this.bottom = 'after'
                        this.text = "已加入"
                        this.submitReport = true
                    }
                    else{
                        this.isJoin = false
                        this.buttom = 'before'
                        this.text="立即加入"
                        this.submitReport = false
                    }
                })
            }
            
        }
        
    },

}
</script>

<style scoped>
#body{
    margin-top:50px;
    border-radius:5px;
}
.before{
    margin-bottom:400px;
}
.after{
    margin-bottom:50px
}
#profile{
    margin-top:10px;
    margin-bottom:70px;
}
</style>