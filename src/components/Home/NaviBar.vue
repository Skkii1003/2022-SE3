<template>
	<nav class="ui inverted attached segment">
		<div class="ui container">
			<div class="ui inverted secondary menu">
				<h2 class="ui header item">CoTest</h2>
				<router-link to="/" class="item"
					><i class="large home icon"></i>首页</router-link
				>
				<router-link to="/tasks" class="item"
					><i class="large tasks icon"></i>任务广场</router-link
				>

				<div class="right item" v-if="!this.isLogin">
					<router-link class="item" to="/login"><i class="large sign in icon"></i>登录</router-link>
					<router-link class="item" to="/register"><i class="large registered icon"></i>注册</router-link>
				</div>

				<div class="right item" v-if="this.isLogin">
					<i class="large user circle  icon"></i>
					<div class="ui simple dropdown">
						<div class="text">{{ username }}</div>
						<i class="dropdown icon"></i>
						<div class="menu">
							<router-link class="item" to="/center"><i class="large user icon"></i>个人中心</router-link>
							<router-link class="item" to="/login" @click="logout"
								><i class="large sign out icon"></i>退出登录</router-link
							>
						</div>
					</div>
				</div>
			</div>
		</div>
	</nav>
</template>

<script>
export default {
	name: "NaviBar",
	data() {
		return {};
	},

	created() {
		this.isLogin = window.sessionStorage.getItem("username") != null;
	},

	computed: {
		username() {
			return window.sessionStorage.getItem("username");
		},
		isLogin() {
			return window.sessionStorage.getItem("username") != null;
		},
		role() {
			return window.sessionStorage.getItem("role");
		},
	},
	inject: ["reload"],
	methods: {
		logout() {
			window.sessionStorage.clear();
			this.reload();
		},
	},
};
</script>

<style></style>
