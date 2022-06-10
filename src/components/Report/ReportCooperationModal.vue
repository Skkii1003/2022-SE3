<template>
	<teleport to="body">
		<div v-show="show" class="modal-mask">
			<div class="modal-main">
				<div class="modal-header">
					<h3 class="modal-title">报告协作</h3>
					<button @click="cancel" class="circular ui icon button">
                        <i  class="close icon"></i>
                    </button>
				</div>
				<div class="modal-content ui form">
					<ReportSubmit :topButton="false" :origin_rid="origin_rid"></ReportSubmit>
				</div>
			</div>
		</div>
	</teleport>
</template>

<script>
import { ref, watch } from "vue";
import ReportSubmit from './ReportSubmit.vue'
//import axios from "axios";
export default {
	name: "ReportCooperationModal",
    components:{
        ReportSubmit
    },
	props: {
		modal: {
			type: Boolean,
			default: false,
		},
        origin_rid: {
            type:Number,
            default:-1
        }
	},
	setup(props, context) {
		let show = ref(props.modal);
        let see = ref(false)

		function cancel() {
			show.value = false;
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
			show,see,
			cancel,
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
	margin-bottom: 5vh;
	margin-top: 5vh;
	width: 70vw;
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
textarea {
	width: 100%;
	max-width: 100%;
	height: 100px;
	max-height: 300px;
	min-height: 100px;
	min-width: 100%;
	border-radius: 5px;
	margin-bottom: 30px;
	margin-top: 10px;
}
</style>
