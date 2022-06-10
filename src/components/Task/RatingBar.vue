<template>
    <i v-for="index in stars" :key="index" class="ui star icon"></i>
    <i v-for="index in semi" :key="index" class="ui star half icon"></i>
</template>

<script>
import {ref,watch} from 'vue'
export default {
    name:'RatingBar',
    props:{
        score:{
            type:Number,
            default:0
        }
    },
    setup(props){
        let stars = ref(parseInt(props.score/2))
        let semi = ref(props.score%2)
        watch(()=>props.score,()=>{
            stars.value = parseInt(props.score/2)
            semi.value = props.score%2
        })
        return {
            semi,stars
        }

    }

}
</script>

<style scoped>
</style>