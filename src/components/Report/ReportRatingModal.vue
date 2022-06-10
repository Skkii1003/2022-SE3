<template>
	<teleport to="body">
		<div v-show="show" class="modal-mask">
			<div class="modal-main">
				<div class="modal-header">
					<h3 class="modal-title">报告评价</h3>
                    <button @click="cancel" class="circular ui icon button">
                        <i  class="close icon"></i>
                    </button>
				</div>
				<div class="modal-content ui form">
                    <div class="field">
                        <label >评分：</label>
                        <input v-model="score" type="number" placeholder="0-5" min="1" max="5" class="ui input">
                    </div>
                    <div class="field">
                        <label>评论：</label>
                        <textarea v-model="comment" placeholder="请填写评论内容..."></textarea>
                    </div>
                    
                </div>
				<div class="modal-footer">
					
					<button class="ui button" @click="confirm">提交</button>
				</div>
			</div>
		</div>
	</teleport>
</template>

<script>
import {getCurrentInstance, ref, watch} from 'vue'
import axios from 'axios'
export default {
	name: "ReportRatingModal",
    props:{
        modal:{
            type:Boolean,
            default:false
        }
    },

    setup(props,context){
        let comment = ref('')
        let score = ref(1)
        let show = ref(props.modal)
        const {proxy} = getCurrentInstance()

        function cancel() {
            show.value = false
        }
        function confirm(){
            if(comment.value.length===0){
                alert("评论不能为空")
            }
            let username = window.sessionStorage.getItem('username')
            let rid = JSON.parse(window.sessionStorage.getItem("report")).reportId
            axios.post(proxy.url.ip+proxy.url.comment,{
                username,
                rid,
                comment:comment.value,
                score:score.value
            }).then((res) => {
                if(res.data.code === 0){
                    alert(res.data.msg)
                }
                else{
                    alert(res.data.msg)
                    show.value = false
                }
            })
            .catch(()=>{
                alert("评论失败！")
            })
        }
        watch(()=>props.modal,(val)=>{
            show.value = val
        })
        watch(()=>show.value,(val)=>{
            context.emit('update:modal',val)
        })

        return {
            show,comment,score,
            cancel,confirm
        }
    },
    
};
</script>

<style scoped> 
.modal-mask{
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, 0.5);
}
.modal-main{
    margin: 0 auto;
    margin-bottom: 5vh;
    margin-top: 5vh;
    width: 50vw;
    background: #fff;
    border-radius: 8px;
}
.modal-header{
    display: flex;
    padding: 14px;
    align-items: flex-start;
    justify-content: space-between;

}
.modal-title{
    margin: 0;
    line-height: 30px;
}
.modal-content{
    padding: 40px;
    height:40vh;
    font-size: 16px;
    line-height: 16px;
    border-top: 1px solid #ccc;
    border-bottom: 1px solid #ccc;
    overflow-y: scroll;
}
.modal-footer{
    display: flex;
    padding: 20px;
    align-items: flex-start;
    flex-direction: row-reverse;
    justify-content: flex-start;
}
button{
    margin-left: 12px;
}
textarea{
	width:100%;
	max-width:100%;
	height:100px;
	max-height:250px;
	min-height:100px;
	min-width:100%;
	border-radius:5px;
	margin-bottom : 30px;
	margin-top: 10px;
}
</style>
