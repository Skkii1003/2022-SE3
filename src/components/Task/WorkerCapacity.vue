<template>
	<div class="ui segment">
		<div class="item">
			<h3>个人指标</h3>
		</div>
		<div class="item">
			<div class="middle aligned content">
				<div class="header">
					活跃程度：
					<RatingBar v-model:score="capacity.activity"></RatingBar>
				</div>
			</div>
		</div>
		<div class="item">
			<div class="middle aligned content">
				<div class="header">
					协作能力：
					<RatingBar v-model:score="capacity.coWorkCapacity"></RatingBar>
				</div>
			</div>
		</div>
		<div class="item">
			<div class="middle aligned content">
				<div class="header">
					审查能力：
					<RatingBar v-model:score="capacity.reviewCapacity"></RatingBar>
				</div>
			</div>
		</div>
		<div class="item">
			<div class="middle aligned content">
				<div class="header">
					专业能力：
					<RatingBar v-model:score="capacity.avgScore"></RatingBar>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import axios from "axios";
import RatingBar from "./RatingBar.vue";
import { ref, getCurrentInstance } from "vue";
export default {
	name: "WorkerCapacity",
	components: {
		RatingBar,
	},
	setup() {
		let capacity = ref({})
		const { proxy } = getCurrentInstance();
		axios
			.post(proxy.url.ip + proxy.url.getCapacity, {
				username: window.sessionStorage.getItem("username"),
				role: parseInt(window.sessionStorage.getItem("role")),
			})
			.then((res) => {
				let role = parseInt(window.sessionStorage.getItem("role"))
				if(role === 2)
					capacity.value = res.data
			});

		return {
			capacity
		}
	},
};
</script>

<style scoped>
.item {
	margin-top: 10px;
	margin-bottom: 10px;
	font-size: 16px;
}
</style>
