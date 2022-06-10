<template>
    <div class="ui center aligned container padded-massive" id="container">
        <h2>注册CoTest</h2>
            <div class="ui big input focus padded-large">
                <input type="text" v-model=userInfo.username placeholder="用户名" min="3" max="10"> 
            </div>
        <br/>
        <div class="ui big input focus padded-large">
            <input type="password" v-model=userInfo.password placeholder="密码" min="6" max="20"> 
        </div>
        <br/>
        
        <div class="ui text form">
            <div class="grouped fields">
                <label class="text">选择注册的用户类型：</label>
                <div class="field">
                    <div class="ui radio checkbox">
                        <input type="radio" name="role" v-model=userInfo.role :value="0">
                        <label>管理员</label>
                    </div>
                </div>
                <div class="field">
                    <div class="ui radio checkbox">
                        <input type="radio" name="role" v-model=userInfo.role :value="1">
                        <label>发包方</label>
                    </div>
                </div>
                <div class="field">
                    <div class="ui radio checkbox">
                        <input type="radio" name="role" checked="checked" v-model=userInfo.role :value="2">
                        <label>测试员</label>
                    </div>
                </div>
            </div>
        </div>
        
        <br/>
        <div>
            <button class="ui large button" @click="register">注册</button>
        </div>
        
    </div>
</template>

<script>
import axios from 'axios'
export default {
    name:'RegisterContent',
    data(){
        return {
            userInfo:{
                username : '',
                password : '',
                role : 2,
            }
        }
    },
    methods:{
        register(){
            axios.post(this.url.ip+this.url.register,this.userInfo).then((res)=>{
                if(res.data.code === 0){
                    alert(res.data.msg)
                }
                else{
                    alert(res.data.msg)
                    this.$router.push('/login')
                }
                
            }).catch(()=>{
                alert("数据传输错误")
                
            })
        }
    },
    watch:{
    }


}
</script>

<style>

</style>