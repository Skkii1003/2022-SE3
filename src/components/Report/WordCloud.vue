<template>
	<div :id="id" style="height: 200px"></div>
	<div class="ui relaxed divided large list">
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
import { ref, onMounted, nextTick,watch } from "vue";
import * as echarts from "echarts";
import "echarts-wordcloud";
import { useRouter } from "vue-router";
export default {
	name: "WordCloud",
	props: ["words", "rawReportList", "id"],
	setup(props) {
		const router = useRouter();
		let data = [];
		let reportList = ref([]);

		transform();

		function transform() {
            data = []
			for (var i in props.words) {
				data.push({
					value: props.words[i],
					name: i,
				});
			}

            reportList.value = []
			for (i = 0; i < props.rawReportList.length; i++) {
				let data = props.rawReportList[i];
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
		function toReport(index) {
			let report = this.reportList[index];
			window.sessionStorage.removeItem("report");
			window.sessionStorage.setItem("report", JSON.stringify(report));
			router.push("/report");
		}
        function runCluster(){
			let myChart = echarts.getInstanceByDom(document.getElementById(props.id))
			if(myChart == null){
				myChart = echarts.init(document.getElementById(props.id));
			}
			nextTick(() => {
				myChart.setOption({
					title: {
						text: "",
					},
					series: [
						{
							type: "wordCloud",
							shape: "circle",
							keepAspect: false,
							left: "center",
							top: "center",
							width: "80%",
							height: "80%",
							right: null,
							bottom: null,
							sizeRange: [20, 60],
							rotatationRange: [-40, 40],
							rotataionStep: 20,
							gridSize: 15,
							layoutAnimation: true,
							textStyle: {
								color: function () {
									// Random color
									return (
										"rgb(" +
										[
											Math.round(Math.random() * 160),
											Math.round(Math.random() * 160),
											Math.round(Math.random() * 160),
										].join(",") +
										")"
									);
								},
							},
							data: data,
						},
					],
				});
			});
        }
		onMounted(() => {
			runCluster()
		});

        watch(()=>props.words,()=>{
            transform()
            runCluster()
        })

        watch(()=>props.rawReportList,()=>{
            transform()
            runCluster()
        })

		return {
			toReport,
			reportList,
		};
	},
};
</script>

<style></style>
