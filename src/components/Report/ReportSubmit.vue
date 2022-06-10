<template>
	<button v-if="topButton" class="ui button fluid" @click="write">
		{{msg}}
		<i v-show="!show" class="angle down icon"></i>
		<i v-show="show" class="angle up icon"></i>
	</button>

	<div v-show="show" class="ui container" id="back">
		<form autocomplete="on" @submit="check" target="_blank" class="ui form" :action="formUrl" enctype="multipart/form-data" method="post">
			<div class="field">
				<label >缺陷情况说明</label>
				<textarea v-model="report.situation" name="situation" placeholder="请说明缺陷的情况..."></textarea>
			</div>

			<div class="field">
				<label >缺陷复现步骤</label>
				<textarea v-model="report.step" name="step" placeholder="请描述从应用启动到缺陷出现的操作步骤..."></textarea>
			</div>

			<div class="field">
                    <label>测试设备</label>
                    <div class="ui radio checkbox">
                        <input v-model="report.device" value="0" type="radio" name="device">
                        <label>Windows</label>
                    </div>
                    <div class="ui radio checkbox">
                        <input v-model="report.device" value="1" type="radio" name="device">
                        <label>Mac</label>
                    </div>
                    <div class="ui radio checkbox">
                        <input v-model="report.device" value="2" type="radio" name="device">
                        <label>Linux</label>
                    </div>
                    <div class="ui radio checkbox">
                        <input v-model="report.device" value="3" type="radio" name="device">
                        <label>Android</label>
                    </div>
                    <div class="ui radio checkbox">
                        <input v-model="report.device" value="4" type="radio" name="device">
                        <label>HarmonyOS</label>
                    </div>
                    <div class="ui radio checkbox">
                        <input v-model="report.device" value="5" type="radio" name="device">
                        <label>IOS</label>
                    </div>
                </div>
			
			<div class="field">
				<label>出现缺陷的应用截图</label>
				<div class="ui input">
					<input type="file" name="image">
				</div>
			</div>

			<input name='username' type="hidden" :value="username">
			<input name='taskId' type="hidden" :value="taskId">
			<input name="origin_rid" type="hidden" :value="origin_rid">

			<input v-if="topButton" type="button" @click="analyze" value="分析报告" class="ui fluid button" id="ana">

			<div v-show="see" v-for="(r,index) of reportList" :key="index" class="ui relaxed divided large list">
				<div class="item">
					<div class="right floated content">
						相似度：{{r.similarity}}
					</div>
					<div class="content">
						<a class="header" @click="toReport(index)">报告号：{{r.reportId}}</a>
						<div class="description">测试员：{{r.username}}</div>
					</div>
				</div>
			</div>
			<div v-show="see" class="item">
				<div class="header">{{result}}</div>
			</div>
			<input v-show="showSubmit" type="submit" value="提交" class="ui fluid button" id="submit">
		</form>

		<SimilarReportInfoModal v-model:co="toCo" v-model:modal="showSimilar" v-model:report="info"></SimilarReportInfoModal>
	</div>
</template>

<script>
import axios from 'axios'
import { ref, onMounted, getCurrentInstance } from "vue";
import SimilarReportInfoModal from './SimilarReportInfoModal.vue'
export default {
	name: 'ReportSubmit',
	components:{
		SimilarReportInfoModal
	},
	props:{
		topButton:{
			type:Boolean,
			default:true
		},
		origin_rid:{
			type:Number,
			default:-1
		}
	},
	setup(props){
		const { proxy } = getCurrentInstance();
		let username = window.sessionStorage.getItem('username')
		let report = ref({
			situation:'',
			step:'',
			device:''
		})
		let taskId = JSON.parse(window.sessionStorage.getItem('taskInfo')).taskId
		let reportList = ref([])
		let formUrl = proxy.url.ip + proxy.url.submitReport
		let show = ref(false)
		let see = ref(false)
		let showSubmit = ref(false)
		if(props.topButton === false){
			showSubmit.value = true
		}
		let msg = ref("填写测试报告")
		let result = ref("检测到以上相似报告，建议查看后再提交")
		let showSimilar = ref(false)
		let info = ref({})
		let toCo = ref(true)
		if(props.origin_rid !=-1){
			toCo.value = false
		}

		onMounted(()=>{
			if(!props.topButton){
			show.value = true
		}
		})

		function transform(list) {
			reportList.value = [];
			for (var i = 0; i < list.length; i++) {
				let data = list[i];
				reportList.value[i] = {
					reportId: data.rid,
					username: data.userName,
					similarity: data.similar,
					situation: data.situation,
					step: data.step,
					device: data.device,
					image: data.picture_path,
					score: data.average_score,
				};
			}
		}
		function write(){
			if(show.value==false){
				show.value=true
				msg.value="收起测试报告"
			}
			else{
				show.value=false
				msg.value="填写测试报告"
			}
			
		}
		function analyze(){
			if(!check(false)){
				return
			}
			axios.post(proxy.url.ip+proxy.url.similarReport,{
				taskId,
				report: report.value
			}).then((res)=>{
				transform(res.data)
				if(reportList.value.length === 0){
					result.value="未检测到相似报告，请继续提交"
				}
				else{
					result.value="检测到以上相似报告，建议查看后再提交"
				}
				see.value = true
				showSubmit.value = true
			}).catch(()=>{
				console.log("error!")
			})
		}
		function toReport(index){
			info.value = reportList.value[index];
			showSimilar.value = true
		}
		function check(e){
			let devices = ["Windows","Mac","Linux","Android","HarmonyOS","IOS"]
			if(report.value.situation.length === 0){
				alert("缺陷情况说明不能为空！")
				if(e!=false){
					e.preventDefault();
				}
				return false
			}
			if(report.value.step.length === 0){
				alert("缺陷复现步骤不能为空！")
				if(e!=false){
					e.preventDefault();
				}
				return false
			}
			if(devices[parseInt(report.value.device)] != JSON.parse(window.sessionStorage.getItem('taskInfo')).device){
				alert("所选测试设备类型与任务要求的设备类型不一致！")
				if(e!=false){
					e.preventDefault();
				}
				return false
			}
			return true
		}

		return {
			username,report,taskId,reportList,formUrl,
			show,see,msg,result,showSimilar,info,toCo,
			write,analyze,toReport,check,showSubmit
		}
	},
}
</script>

<style>
textarea{
	width:100%;
	max-width:100%;
	height:100px;
	max-height:300px;
	min-height:100px;
	min-width:100%;
	border-radius:5px;
	margin-bottom : 30px;
	margin-top: 10px;
}
#submit{
	margin-top:10px;
	margin-bottom:10px;
}
#ana{
	margin-top:10px;
	margin-bottom:10px;
}
.ui.radio.checkbox{
    margin-left:50px;
    margin-right:50px;
}
</style>