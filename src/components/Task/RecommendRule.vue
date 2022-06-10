<template>
	<div class="ui container" id="body">
		<!-- header -->
		<div class="ui top attached segment">
			<div class="ui middle aligned grid">
				<div class="five wide column">
					<h3 class="ui black header">推荐规则</h3>
				</div>
			</div>
		</div>

		<!-- content -->
		<div class="ui attached segment">
			<h4>待选规则</h4>
			<div
				class="ui attached segment"
				v-for="(rule, index) of rules"
				:key="index"
			>
				<div class="ui two column grid">
					<div class="ui text container left aligned column">
						{{ rule.strategyName }}
					</div>
					<div class="right aligned column">
						<button class="ui green basic icon button" @click="add(index)">
							<i class="plus icon" />
						</button>
					</div>
				</div>
			</div>
		</div>

		<div class="ui attached segment">
			<h4>已选规则</h4>
			<div
				class="ui attached segment"
				v-for="(rule, index) of select"
				:key="index"
			>
				<div class="ui two column grid">
					<div class="ui text container left aligned column">
						{{ rule.strategyName }}
					</div>
					<div class="right aligned column">
						<button class="ui gray basic icon button" @click="sub(index)">
							<i class="minus icon" />
						</button>
					</div>
				</div>
			</div>
			<div class="ui attached segment">
				<button class="ui fluid button" @click="confirm">确认修改</button>
			</div>
		</div>
	</div>
</template>

<script>
import axios from "axios";
export default {
	name: "RecommendRule",
	data() {
		return {
			rules: [],
			select: [],
		};
	},
	methods: {
		add(i) {
			this.select.push(this.rules[i]);
			this.rules.splice(i, 1);
		},
		sub(i) {
			this.rules.push(this.select[i]);
			this.select.splice(i, 1);
		},
		confirm() {
			//todo: send selected rule list
			let arg = {};
			this.select.forEach((item, i) => {
				arg[item.strategyName] = i + 1;
			});
			this.rules.forEach((item) => {
				arg[item.strategyName] = 0;
			});
			axios
				.post(this.url.ip + this.url.updateStrategy, arg)
				.then((res) => {
					alert(res.data);
				})
				.catch(() => {
					alert("推荐规则修改失败！");
				});
		},
	},
	mounted() {
		//todo: get rule list
		axios
			.post(this.url.ip + this.url.getStrategy, {})
			.then((res) => {
				this.rules = res.data;
				this.select = this.rules.filter(function (e) {
					return e.status != 0;
				});
				let tmp = this.rules.filter(function (e) {
					return e.status === 0;
				});
				this.rules = tmp;
                this.select.sort(function (a,b) {
                    return a.status < b.status
                })
                
			})
			.catch((res) => {
				console.log(res.data);
				alert("推荐规则获取失败！");
			});
	},
};
</script>

<style scoped>
#body {
	margin-top: 50px;
	margin-bottom: 50px;
}
</style>
