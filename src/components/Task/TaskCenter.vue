<template>
	<div class="ui container" id="body">
		<div class="ui grid">
			<div class="ui twelve wide column">
				<!-- header -->
				<div class="ui attached segment">
					<div class="ui middle aligned grid">
						<div class="five wide column">
							<h3 class="ui black header">个人中心</h3>
						</div>
						<div class="eleven wide column">
							<div class="ui blue pointing two item menu">
								<a class="ui item" :class="menu1" @click="button1Get(0)">
									{{ button1 }}
								</a>
								<a class="ui item" :class="menu2" @click="button2Get(0)">
									{{ button2 }}
								</a>
							</div>
						</div>
					</div>
				</div>

				<!-- list -->
				<div
					class="ui attached segment"
					v-for="(task, index) of showList"
					:key="index"
				>
					<div class="ui vertical segment">
						<div class="ui grid">
							<div class="ui six wide column">
								<h3 class="ui header">{{ task.taskName }}</h3>
								<p class="text">发包方：{{ task.ownerName }}</p>
								<p class="text">
									报名详情：{{ task.hiredPerson }} / {{ task.requiredPerson }}
								</p>
							</div>
							<div class="ui five wide column">
								<p class="text">类型：{{ task.testType }}</p>
								<p class="text">难度：{{ task.difficulty }}</p>
								<p class="text">设备类型：{{ task.device }}</p>
							</div>
							<div class="ui five wide column">
								<p class="text">开始时间：{{ task.startTime }}</p>
								<p class="text">截止时间：{{ task.deadLine }}</p>
								<button class="ui fluid button" @click="toContent(index)">
									{{ buttonText }}
								</button>
							</div>
						</div>
					</div>
				</div>

				<!-- footer -->
				<div v-show="false" class="ui bottom attached segment">
					<div class="ui middle aligned three column grid">
						<div class="left aligned column">
							<button class="ui button" @click="previous">上一页</button>
						</div>
						<div class="center aligned column">
							<p class="text">第{{ page }}页</p>
						</div>
						<div class="right aligned column">
							<button class="ui button" @click="next">下一页</button>
						</div>
					</div>
				</div>
			</div>
            <div class="ui four wide column">
                <WorkerCapacity></WorkerCapacity>
            </div>
		</div>
		<!-- capacity -->
	</div>
</template>

<script>
import axios from "axios";
import WorkerCapacity from "./WorkerCapacity.vue";
export default {
	name: "TaskCenter",
	components: {
		WorkerCapacity,
	},
	data() {
		return {
			taskList: [],
			page: 1,
			userInfo: {
				username: window.sessionStorage.getItem("username"),
				role: window.sessionStorage.getItem("role"),
			},
			button1: "正在进行的任务",
			button2: "已完成的任务",
			buttonText: "已加入",
			menu1: "active",
			menu2: "",
		};
	},
	computed: {
		showList() {
			return this.taskList;
		},
	},
	mounted() {
		if (this.userInfo.role == 1) {
			this.button1 = "新建任务";
			this.menu1 = "";
			this.menu2 = "active";
			this.button2 = "已发布的任务";
			this.buttonText = "已发布";
		} else if (this.userInfo.role == 0) {
			this.button1 = "修改推荐规则";
			this.menu1 = "";
			this.menu2 = "active";
			this.button2 = "所有任务";
			this.buttonText = "查看详情";
		}
		if (this.userInfo.role === "0" || this.userInfo.role === "1") {
			this.button2Get(0);
		} else {
			this.button1Get(0);
		}
	},

	methods: {
		transform(list) {
			this.taskList = [];
			let devices = ["Windows", "Mac", "Linux", "Android", "HarmonyOS", "IOS"];
			for (var i = 0; i < list.length; i++) {
				let data = list[i];
				this.taskList[i] = {
					taskId: data.tid,
					taskName: data.name,
					//功能测试是0，性能测试是1
					testType: data.type === 1 ? "性能测试" : "功能测试",
					introduction: data.introduction,
					requiredPerson: data.required_workers,
					hiredPerson: data.hired_workers,
					startTime: data.time.substring(0, 16),
					deadLine: data.time.substring(17),
					ownerName: data.employerName,
					docPath: data.description_path,
					appPath: data.execution_path,
					difficulty: data.difficulty,
					device: devices[data.device],
					privilege: data.privilege,
				};
			}
		},
		button1Get(val) {
			if (this.button1 == "新建任务") {
				this.$router.push({
					name: "taskAdd",
				});
			} else if (this.button1 == "修改推荐规则") {
				this.$router.push("/rule");
			} else {
				axios
					.post(this.url.ip + this.url.doingTask, {
						page: this.page + val,
						userInfo: this.userInfo,
					})
					.then((res) => {
						if (res.data.length === 0 && val != 0) {
							alert("已经是最后一页了");
						} else {
							this.page = this.page + val;
							this.transform(res.data);
							this.menu1 = "active";
							this.menu2 = "";
							this.buttonText = "已加入";
						}
					})
					.catch(() => {
						alert("任务列表请求失败");
					});
			}
		},
		button2Get(val) {
			let url = "";
			let text = "";
			if (this.button2 == "已发布的任务") {
				url = this.url.releasedTask;
				text = "已发布";
			} else if (this.button2 == "所有任务") {
				url = this.url.allTask;
				text = "查看详情";
			} else {
				url = this.url.doneTask;
				text = "已完成";
			}
			axios
				.post(this.url.ip + url, {
					userInfo: this.userInfo,
					page: this.page + val,
				})
				.then((res) => {
					if (res.data.length === 0 && val != 0) {
						alert("已经是最后一页了");
					} else {
						this.page = this.page + val;
						this.transform(res.data);
						this.menu2 = "active";
						this.menu1 = "";
						this.buttonText = text;
					}
				})
				.catch(() => {
					alert("任务列表请求失败");
				});
		},
		previous() {
			if (this.page === 1 || this.page - 1 < 1) {
				alert("已经是第1页了");
			} else {
				if (this.menu1 == "active") {
					this.button1Get(-1);
				} else {
					this.button2Get(-1);
				}
			}
		},
		next() {
			if (this.menu1 == "active") {
				this.button1Get(1);
			} else {
				this.button2Get(1);
			}
		},
		toContent(index) {
			window.sessionStorage.removeItem("taskInfo");
			window.sessionStorage.removeItem("from");
			window.sessionStorage.setItem(
				"taskInfo",
				JSON.stringify(this.taskList[index])
			);
			window.sessionStorage.setItem("from", true);
			this.$router.push({
				name: "taskInfo",
			});
		},
	},
};
</script>

<style scoped>
#body {
	margin-top: 50px;
	margin-bottom: 50px;
}
</style>
