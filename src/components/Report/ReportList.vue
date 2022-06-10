<template>
	<button class="ui button fluid" @click="read">
		{{ msg }}
		<i v-show="!see" class="angle down icon"></i>
		<i v-show="see" class="angle up icon"></i>
	</button>
	<!-- report列表 -->
	<div
		v-show="see"
		class="ui relaxed divided large list"
	>
		<div class="item" v-for="(r, index) of reportList" :key="index">
			<div class="right floated content">
				<button class="ui button" @click="toReport(index)">查看详情</button>
			</div>
			<div class="content">
				<a class="header">报告号：{{ r.reportId }}</a>
				<div class="description">测试员：{{ r.username }}</div>
				<div class="description">评分：{{ r.score }}</div>
			</div>
		</div>
	</div>
</template>

<script>
import axios from "axios";
export default {
	name: "ReportList",
	props: ["taskId"],
	data() {
		return {
			reportList: [],
			userInfo: {
				username: window.sessionStorage.getItem("username"),
				role: window.sessionStorage.getItem("role"),
			},
			see: false,
			msg: "查看测试报告",
		};
	},
	mounted() {
		axios
			.post(this.url.ip + this.url.askReport, {
				userInfo: this.userInfo,
				taskId: this.taskId,
			})
			.then((res) => {
				this.transform(res.data);
			});
	},
	methods: {
		transform(list) {
			let device = ['Windows','Mac','Linux','Android','HarmonyOS','IOS']
			this.reportList = [];
			for (var i = 0; i < list.length; i++) {
				let data = list[i];
				this.reportList[i] = {
					reportId:data.rid,
					situation: data.situation,
					step: data.step,
					device: device[parseInt(data.device)],
					image: data.picture_path,
					username: data.userName,
					score: data.average_score
				};
			}
		},
		toReport(index) {
			let report = this.reportList[index];
            window.sessionStorage.removeItem('report')
            window.sessionStorage.setItem('report',JSON.stringify(report))
			this.$router.push('/report')
		},
		read() {
			if (this.see == false) {
				this.see = true;
				this.msg = "收起测试报告";
			} else {
				this.see = false;
				this.msg = "查看测试报告";
			}
		},
	},
};
</script>

<style>
#back {
	margin-top: 20px;
}
</style>
