<template>
	<div class="ui container" id="body">
		<div class="ui tabular menu">
			<a class="ui header active item">报告详情</a>
			<div class="right menu">
				<button class="ui active button item" @click="toComment">
					报告评价
				</button>
				<button class="ui active button item" @click="toReport">
					报告协作
				</button>
			</div>
		</div>

		<div class="ui segment divide">
			<div class="ui three column grid">
				<div class="column">
					<h3>报告号：{{ report.reportId }}</h3>
				</div>
				<div class="column">
					<h3>测试员：{{ report.username }}</h3>
				</div>
				<div class="column">
					<h3>评分：{{ report.score }}</h3>
				</div>
			</div>
		</div>
		<!-- report详情 -->
		<div class="ui segment">
			<h4>缺陷情况说明：</h4>
			<div class="ui text container">
				{{ report.situation }}
			</div>

			<h4>缺陷步骤复现：</h4>
			<div class="ui text container">
				{{ report.step }}
			</div>

			<h4>测试设备信息：</h4>
			<div class="ui text container">
				{{ report.device }}
			</div>

			<h4>出现缺陷的应用截图：</h4>
			<img class="ui fluid image" :src="report.image" />
		</div>

		<!-- 评论 -->
		<div class="ui segment">
			<div class="ui comments" id="comment">
				<h3 class="ui center aligned dividing header">评论</h3>
				
				<div
					class="comment ui grid"
					v-for="(c, index) in commentList"
					:key="index"
				>
					<div class="ui twelve wide column">
						<di class="content">
							<a class="author">{{ c.userName }}</a>
							<div class="metadata">
								<span class="date">评分：{{ c.score }}</span>
							</div>
							<div class="text">{{ c.comment }}</div>
						</di>
					</div>
					<div class="ui four wide column">
						<div class="ui left labeled right floated button">
							<a class="ui basic label">{{ c.like }}</a>
							<div class="ui basic button" @click="like(index, 0)">
								<i v-show="!isLike[index]" class="heart outline icon"></i>
								<i v-show="isLike[index]" class="heart icon"></i>
								赞
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>

		<!-- report协作关系 -->
		<div class="ui segment">
			<h3>
				参与<u>报告:{{ report.reportId }}</u
				>协作的报告
			</h3>
			<div class="ui divider"></div>

			<div
				v-show="see"
				class="ui relaxed divided large list"
				v-for="(r, index) of reportList"
				:key="index"
			>
				<div class="item">
					<div class="right floated content">
						<button class="ui button" @click="toInfo(index)">查看详情</button>
					</div>
					<div class="content">
						<a class="header">报告号：{{ r.reportId }}</a>
						<div class="description">测试员：{{ r.username }}</div>
						<div class="description">评分：{{ r.score }}</div>
					</div>
				</div>
			</div>
		</div>

		<button class="ui fluid button" @click="back">返回</button>
	</div>

	<ReportRatingModal v-model:modal="showComment"></ReportRatingModal>
	<ReportCooperationModal
		v-model:modal="showReport"
		:origin_rid="report.reportId"
	></ReportCooperationModal>
</template>

<script>
import ReportRatingModal from "./ReportRatingModal.vue";
import ReportCooperationModal from "./ReportCooperationModal.vue";
import { ref, onMounted, getCurrentInstance } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";
export default {
	name: "ReportInfo",
	components: {
		ReportRatingModal,
		ReportCooperationModal,
	},
	setup() {
		const router = useRouter();
		const { proxy } = getCurrentInstance();
		let reportList = ref([]);
		let report = ref({
			reportId: "",
			username: "",
			situation: "",
			step: "",
			device: "",
			image: "",
			score: 0,
		});
		if (window.sessionStorage.getItem("report") != null) {
			report.value = JSON.parse(window.sessionStorage.getItem("report"));
		}
		let commentList = ref([]);
		getComments();

		let showComment = ref(false);
		let showReport = ref(false);
		let see = ref(false);
		let isLike = ref([]);

		function toComment() {
			showComment.value = true;
		}
		function toReport() {
			showReport.value = true;
		}
		function back() {
			router.push("/taskInfo");
		}
		function transform(list) {
			reportList.value = [];
			for (var i = 0; i < list.length; i++) {
				let data = list[i];
				reportList.value[i] = {
					reportId: data.rid,
					situation: data.situation,
					step: data.step,
					device: data.device,
					image: data.picture_path,
					username: data.userName,
					score: data.average_score,
				};
			}
		}
		function toInfo(index) {
			report.value = this.reportList[index];
			getRelatedReport();
			window.sessionStorage.removeItem("report");
			window.sessionStorage.setItem("report", JSON.stringify(report.value));
		}
		function getRelatedReport() {
			axios
				.post(proxy.url.ip + proxy.url.relationship, {
					origin_rid: report.value.reportId,
				})
				.then((res) => {
					transform(res.data);
					if (reportList.value.length === 0) {
						see.value = false;
					} else {
						see.value = true;
					}
				});
		}
		function getComments() {
			commentList.value = [];
			axios
				.post(proxy.url.ip + proxy.url.getComment, {
					rid: report.value.reportId,
				})
				.then((res) => {
					commentList.value = res.data;
					for (var i = 0; i < commentList.value.length; i++) {
						like(i, 1);
					}
				})
				.catch(() => {
					alert("获取评论失败！");
				});
		}
		function like(index, mode) {
			axios
				.post(proxy.url.ip + proxy.url.like, {
					uid: parseInt(window.sessionStorage.getItem("userId")),
					cid: commentList.value[index].cid,
					mode: mode,
				})
				.then((res) => {
					if (mode === 0) {
						alert(res.data);
						getLikes(index);
						if (res.data === "点赞成功") {
							isLike.value[index] = true;
						} else if (res.data === "取消点赞成功") {
							isLike.value[index] = false;
						}
					}
					else{
						if(res.data === 1){
							isLike.value[index] = true;
						}
						else{
							isLike.value[index] = false;
						}
					}
				});
		}
		function getLikes(index) {
			axios
				.post(proxy.url.ip + proxy.url.getLikes, {
					cid: commentList.value[index].cid,
				})
				.then((res) => {
					commentList.value[index].like = res.data;
				});
		}

		onMounted(() => {
			getRelatedReport();
		});

		return {
			report,
			showComment,
			showReport,
			reportList,
			commentList,
			toComment,
			toReport,
			back,
			toInfo,
			see,
			like,
			isLike
		};
	},
	beforeRouteLeave() {
		window.sessionStorage.removeItem("report");
	},
};
</script>

<style scoped>
#body {
	margin-top: 20px;
	border-radius: 5px;
	margin-bottom: 200px;
}
.ui.text.container {
	margin-top: 20px;
	margin-bottom: 80px;
}
h4 {
	margin-top: 20px;
}
.divide {
	margin-top: 50px;
}
.ui.fluid.button {
	margin-top: 50px;
}
#comment {
	margin: 0 auto;
}
</style>
