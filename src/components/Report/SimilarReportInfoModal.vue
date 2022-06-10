<template>
	<teleport to="body">
		<div v-show="show" class="modal-mask">
			<div class="modal-main">
				<div class="modal-header">
					<h3 class="modal-title">相似报告</h3>
                    <button @click="cancel" class="circular ui icon button">
                        <i  class="close icon"></i>
                    </button>
                    
				</div>
				<div class="modal-content ui form">
					<div class="ui segment divide">
						<div class="ui three column grid">
							<div class="column">
								<h3>报告号：{{ report.reportId }}</h3>
							</div>
							<div class="column">
								<h3>测试员：{{ report.username }}</h3>
							</div>
							<div class="column">
								<h3>相似度：{{ report.similarity }}</h3>
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
				</div>
				<div v-show="co" class="modal-footer">
					<button class="ui button" @click="toReport">进行报告协作</button>
				</div>
			</div>
		</div>
	</teleport>
</template>

<script>
import { ref, watch } from "vue";
import { useRouter } from "vue-router";
export default {
	name: "SimilarReportInfoModal",
	props: {
		modal: {
			type: Boolean,
			default: false,
		},
        report:{
            type: Object
        },
        co:{
            type:Boolean,
            default: true
        }
	},
	setup(props, context) {
        const router = useRouter()
		let show = ref(props.modal);

		function cancel() {
			show.value = false;
		}
        function toReport(){
            window.sessionStorage.removeItem('report')
            window.sessionStorage.setItem('report',JSON.stringify(props.report))
            router.push('/report')
        }

		watch(
			() => props.modal,
			(val) => {
				show.value = val;
			}
		);
		watch(
			() => show.value,
			(val) => {
				context.emit("update:modal", val);
			}
		);
		return {
			show,
			cancel,
            toReport
		};
	},
};
</script>

<style scoped>
.modal-mask {
	position: fixed;
	top: 0;
	left: 0;
	width: 100vw;
	height: 100vh;
	background: rgba(0, 0, 0, 0.5);
}
.modal-main {
	margin: 0 auto;
	margin-bottom: 5%;
	margin-top: 5%;
	width: 75vw;
	background: #fff;
	border-radius: 8px;
}
.modal-header {
	display: flex;
	padding: 14px;
	align-items: flex-start;
	justify-content: space-between;
}
.modal-title {
	margin: 0;
	line-height: 30px;
}
.modal-content {
	padding: 40px;
	height: 70vh;
	font-size: 16px;
	line-height: 16px;
	border-top: 1px solid #ccc;
	border-bottom: 1px solid #ccc;
	overflow-y: scroll;
}
.modal-footer {
	display: flex;
	padding: 20px;
	align-items: flex-start;
	flex-direction: row-reverse;
	justify-content: flex-start;
}
button {
	margin-left: 12px;
}
</style>
