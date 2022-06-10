<template>
    <div class="ui container" id="body">
        <!-- header -->
        <div class="ui top attached segment">
            <div class="ui middle aligned one column grid">
                <div class="column center aligned">
                    <h2 class="ui black header">创建任务</h2>
                </div>
            </div>
        </div>

        <div class="ui attached segment">
            <form @submit="check" target="_blank" class="ui form" :action="formUrl" enctype="multipart/form-data" method="post">
                <div class="field">
                    <label >任务名称</label>
                    <div class="ui input">
                        <input name='taskName' v-model="taskInfo.taskName" type="text" placeholder="请输入任务名称">
                    </div>
                </div>
                <div class="field">
                    <label >任务简介</label>
                    <textarea name='introduction' v-model="taskInfo.introduction" placeholder="请填写任务简介..."></textarea>
                </div>
                <div class="field">
                    <label >测试开始时间</label>
                    <div class="ui input">
                        <input name='startTime' v-model="taskInfo.startTime" type="datetime-local" placeholder="请输入测试开始时间">
                    </div>
                </div>
                <div class="field">
                    <label >测试截止时间</label>
                    <div class="ui input">
                        <input name='endTime' v-model="taskInfo.endTime" type="datetime-local" placeholder="请输入测试截止时间">
                    </div>
                </div>
                <div class="field">
                    <label>测试所需人数</label>
                    <div class="ui input">
                        <input name='personNum' v-model="taskInfo.requiredPerson" type="number" min="1" max="100" placeholder="请输入测试所需人数...">
                    </div>
                </div>
                
                <div class="field">
                    <label>测试类型</label>
                    <div class="ui radio checkbox">
                        <input v-model="taskInfo.testType" value="0" type="radio" name="testType">
                        <label>功能测试</label>
                    </div>
                    <div class="ui radio checkbox">
                        <input v-model="taskInfo.testType" value="1" type="radio" name="testType">
                        <label>性能测试</label>
                    </div>
                </div>

                <div class="ui divider"></div>

                <div class="field">
                    <label>测试设备</label>
                    <div class="ui radio checkbox">
                        <input v-model="taskInfo.deviceType" value="0" type="radio" name="deviceType">
                        <label>Windows</label>
                    </div>
                    <div class="ui radio checkbox">
                        <input v-model="taskInfo.deviceType" value="1" type="radio" name="deviceType">
                        <label>Mac</label>
                    </div>
                    <div class="ui radio checkbox">
                        <input v-model="taskInfo.deviceType" value="2" type="radio" name="deviceType">
                        <label>Linux</label>
                    </div>
                    <div class="ui radio checkbox">
                        <input v-model="taskInfo.deviceType" value="3" type="radio" name="deviceType">
                        <label>Android</label>
                    </div>
                    <div class="ui radio checkbox">
                        <input v-model="taskInfo.deviceType" value="4" type="radio" name="deviceType">
                        <label>HarmonyOS</label>
                    </div>
                    <div class="ui radio checkbox">
                        <input v-model="taskInfo.deviceType" value="5" type="radio" name="deviceType">
                        <label>IOS</label>
                    </div>
                </div>

                <div class="ui divider"></div>

                <div class="center aligned field">
                    <label>测试难度</label>
                    <div class="ui radio checkbox">
                        <input v-model="taskInfo.difficulty" value="0" type="radio" name="difficulty">
                        <label>1</label>
                    </div>
                    <div class="ui radio checkbox">
                        <input v-model="taskInfo.difficulty" value="1" type="radio" name="difficulty">
                        <label>2</label>
                    </div>
                    <div class="ui radio checkbox">
                        <input v-model="taskInfo.difficulty" value="2" type="radio" name="difficulty">
                        <label>3</label>
                    </div>
                    <div class="ui radio checkbox ">
                        <input v-model="taskInfo.difficulty" value="3" type="radio" name="difficulty">
                        <label>4</label>
                    </div>
                    <div class="ui radio checkbox ">
                        <input v-model="taskInfo.difficulty" value="4" type="radio" name="difficulty">
                        <label>5</label>
                    </div>
                </div>

                <div class="ui divider"></div>

                <div class="field">
                    <label>上传待测应用可执行文件</label>
                    <div class="ui input">
                        <input name='file1' type="file">
                    </div>
                </div>
                <div class="field">
                    <label>上传测试需求描述文档</label>
                    <div class="ui input">
                        <input name='file2' type="file">
                    </div>
                </div>
                <input name='ownerName' :value="taskInfo.ownerName" type="hidden">
                <input name='userInfo' type="hidden" :value="userInfo">
                <input type="submit" value="发布" class="ui fluid button">
            </form>
        </div>
        
    </div>
</template>

<script>
export default {
    name:'TaskAdd',
    created(){
    },
    data(){
        return {
            userInfo:{
                username : window.sessionStorage.getItem('username'),
                role : window.sessionStorage.getItem('role'),
            },
            taskInfo:{
                    taskName:'',
                    ownerName: window.sessionStorage.getItem('username'),
                    requiredPerson: '',
                    testType: '',
                    startTime: '',
                    endTime:'',
                    introduction: '',
                    app:[],
                    doc:[],
                    deviceType:'',
                    difficulty:'',
            },
            formUrl : this.url.ip + this.url.createTask
        }
    },
    methods:{
        uploadApp(file){
            this.taskInfo.app = file.target.files
            console.log(this.taskInfo.app)
        },
        uploadDoc(file){
            this.taskInfo.doc = file.target.files
        },
        check(e){
			//let devices = ["Windows","Mac","Linux","Android","HarmonyOS","IOS"]
			if(this.taskInfo.taskName.length === 0){
				alert("任务名称不能为空！")
				e.preventDefault();
				return false
			}
			if(this.taskInfo.introduction.length === 0){
				alert("任务简介不能为空！")
				e.preventDefault();
				return false
			}
            if(this.taskInfo.introduction.length === 0){
				alert("任务简介不能为空！")
				e.preventDefault();
				return false
			}
            if(this.taskInfo.startTime.length === 0){
				alert("测试开始时间不能为空！")
				e.preventDefault();
				return false
			}
            if(this.taskInfo.endTime.length === 0){
				alert("测试截止时间不能为空！")
				e.preventDefault();
				return false
			}
            if(this.taskInfo.requiredPerson.length === 0){
				alert("测试所需人数不能为空！")
				e.preventDefault();
				return false
			}
            if(this.taskInfo.testType.length === 0){
				alert("测试类型不能为空！")
				e.preventDefault();
				return false
			}
            if(this.taskInfo.deviceType.length === 0){
				alert("测试设备类型不能为空！")
				e.preventDefault();
				return false
			}
            if(this.taskInfo.difficulty.length === 0){
				alert("测试难度不能为空！")
				e.preventDefault();
				return false
			}
			return true
		}
    }
}
</script>

<style scoped>
#body{
    margin-top:50px;
    margin-bottom:50px;
}
.ui.radio.checkbox{
    margin-left:50px;
    margin-right:50px;
}

</style>