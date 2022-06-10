<template>
    <button class="ui button fluid" @click="read">
		{{ msg }}
		<i v-show="!see" class="angle down icon"></i>
		<i v-show="see" class="angle up icon"></i>
	</button>
    <div v-show="see" class="ui relaxed divided list">
        <div class="item" v-for="(c,i) in cluster" :key="i">
            <h3 class="ui header">类别{{i+1}}</h3>
            <WordCloud :id="i" v-model:words="cluster[i].wordFrequency" v-model:rawReportList="cluster[i].reportVOList"></WordCloud>
        </div>
    </div>
    <button v-show="see" class="ui button fluid" @click="getCluster">
        重新生成聚类
	</button>
</template>

<script>
import {ref,getCurrentInstance} from "vue"
import WordCloud from "./WordCloud.vue"
import axios from "axios"
export default {
    name:'ReportCluster',
    props: ["taskId"],
    components: {
        WordCloud
    },
    setup(props){
        const {proxy} = getCurrentInstance()
        let see = ref(false)
        let msg = ref("查看报告聚类")
        let cluster = ref([])
        let first = 0

        function read(){
            if(see.value === false){
                see.value = true
                msg.value = "收起报告聚类"

                if(first === 0){
                    getCluster()
                    first = 1
                }
            }
            else{
                see.value = false
                msg.value = "查看报告聚类"
            }
            
        }

        function getCluster(){
            axios.post(proxy.url.ip+proxy.url.getCluster,{
                tid:parseInt(props.taskId)
            })
            .then((res)=>{
                cluster.value = res.data
            })
        }

        return {
            see,msg,read,cluster,getCluster
        }
    }

}
</script>

<style>

</style>