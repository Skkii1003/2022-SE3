<template>
	<NaviBar v-if="isRouterAlive"></NaviBar>
	<router-view />

	<MyFooter></MyFooter>
</template>

<script>
import NaviBar from './components/Home/NaviBar'
import MyFooter from './components/Home/MyFooter'

export default {
	name: 'App',
	provide(){
		return {
			reload:this.reload
		}
	},
	components: {
		NaviBar,
		MyFooter
	},

	data(){
		return {
			isRouterAlive:true
		}
	},

	watch:{
	},

	computed:{
		
	},

	created(){
	},
	
	methods:{
		reload(){
			this.isRouterAlive = false
			this.$nextTick(function(){
				this.isRouterAlive = true
			})
		}
	},
}
</script>

<style >
MyFooter{
}

</style>