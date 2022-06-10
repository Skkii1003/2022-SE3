<template>
    <div class="ui container" id="body">
        <!-- header -->
        <div class="ui top attached segment">
            <div class="ui middle aligned two column grid">
                <div class="column">
                    <h3 class="ui black header">正在招募的任务</h3>
                </div>
                
            </div>
        </div>
        <!-- 渲染列表 -->
        <div class="ui attached segment" v-for="(task,index) of showList" :key="index">
            <div class="ui vertical segment">
                <div class="ui grid">
                    <div class="ui four wide column">
                        <h3 class="ui header">{{task.taskName}}</h3>
                        <p class="text">发包方：{{task.ownerName}}</p>
                        <p class="text">报名详情：{{task.hiredPerson}} / {{task.requiredPerson}}</p>
                    </div>
                    <div class="ui four wide column">
                        <p class="text">类型：{{task.testType}}</p>
                        <p class="text">难度：{{task.difficulty}}</p>
                        <p class="text">设备类型：{{task.device}}</p>
                    </div>
                    <div class="ui five wide column">
                        <p class="text">开始时间：{{task.startTime}}</p>
                        <p class="text">截止时间：{{task.deadLine}}</p>
                        <label>推荐指数：</label>
                        <RatingBar v-model:score="task.privilege"></RatingBar>
                    </div>
                    <div class="ui three wide column">
                        <button class="ui vertical center aligned button" @click="toContent(index)">招募中</button>
                    </div>
                </div>
            </div>
        </div>

        <!-- footer -->
        <div class="ui bottom attached segment">
            <div class="ui middle aligned three column grid">
                <div class="left aligned column">
                    <button class="ui button" @click="previous">上一页</button>
                </div>
                <div class="center aligned column">
                    <p class="text">第{{page}}页</p>
                </div>
                <div class="right aligned column">
                    <button class="ui button" @click="next">下一页</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios'
import RatingBar from './RatingBar'
export default {
    name:'TaskList',
    components:{
        RatingBar
    },
    data(){
        return {
            //任务名字，发包方名字，测试人数，已招募人数，测试类型，截止时间
            taskList:[],
            page: 1,
            userInfo:{
                username : window.sessionStorage.getItem('username'),
                role : window.sessionStorage.getItem('role'),
            },
            
        }
    },
    computed:{
        showList(){
            return this.taskList
        },
    },
    created(){
        this.page = 1
        axios.post(this.url.ip+this.url.recommendTask,{
                username:this.userInfo.username,
                role:parseInt(this.userInfo.role)
            }).then((res)=>{
                this.transform(res.data)
            }).catch(()=>{
                //alert('任务列表请求失败')
            })
    },
    methods:{
        transform(list){
            this.taskList = []
            let devices = ["Windows","Mac","Linux","Android","HarmonyOS","IOS"]
            for(var i=0;i<list.length;i++){
                let data = list[i]
                this.taskList[i] = {
                    taskId : data.tid,
                    taskName : data.name,
                    //功能测试是0，性能测试是1
                    testType : data.type === 1 ? '性能测试' : '功能测试',
                    introduction : data.introduction,
                    requiredPerson : data.required_workers,
                    hiredPerson : data.hired_workers,
                    startTime : data.time.substring(0,16),
                    deadLine : data.time.substring(17),
                    ownerName : data.employerName,
                    docPath : data.description_path,
                    appPath : data.execution_path,
                    difficulty : data.difficulty,
                    device: devices[data.device],
                    privilege:data.privilege,
                }
            }
        },
        previous(){
            if(this.page === 1){
                alert("已经是第一页了")
            }
            else{
                axios.post(this.url.ip+this.url.tasks,{
                    page: this.page - 1, 
                    userInfo: this.userInfo
                }).then((res)=>{
                    this.transform(res.data)
                    this.page = this.page - 1
                }).catch(()=>{
                    alert('任务列表请求失败')
                })
            }
        },
        next(){
            axios.post(this.url.ip+this.url.tasks,{
                page: this.page + 1, 
                userInfo: this.userInfo
            }).then((res)=>{
                console.log(res.data)
                if(res.data.length === 0){
                    alert('已经是最后一页了')
                }
                else{
                    this.transform(res.data)
                    this.page = this.page + 1
                }
            }).catch(()=>{
                alert('任务列表请求失败')
            })
        },
        toContent(index){
            window.sessionStorage.removeItem('taskInfo')
            window.sessionStorage.removeItem('from')
            window.sessionStorage.setItem('taskInfo',JSON.stringify(this.taskList[index]))
            window.sessionStorage.setItem('from',false)
            this.$router.push({
                name:'taskInfo'
            })
        }
    },

}
</script>

<style scoped>
#body{
    margin-top:50px;
    margin-bottom:50px;
}
</style>