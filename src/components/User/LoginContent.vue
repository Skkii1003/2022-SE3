<template>
    <div class="ui center aligned container padded-massive" id="container">
        <h2>登录CoTest</h2>
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
                <label class="text">您的用户类型是：</label>
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
        <button class="ui large button" @click="login">登录</button>
        </div>
    </div>
</template>

<script>
import axios from 'axios'

export default {
    name:'LoginContent',
    model:{
        prop:'isLogin',
        event:'input'
    },
    data(){
        return {
            userInfo:{
                username : '',
                password : '',
                role: 2,
            },
            reUserInfo:{
                username : '',
                role : 2, //0是管理员，1是发包方，2是工人
                userId : 0
            }
        }
    },
    inject:['reload'],
    methods:{
        login(){
            axios.post(this.url.ip+this.url.login,this.userInfo).then((res)=>{
                if(res.data.code === 0){
                    alert(res.data.msg)
                }
                else{
                    //console.log(res.data.data)
                    this.reUserInfo.username = res.data.data.name
                    this.reUserInfo.role = this.userInfo.role
                    this.reUserInfo.userId= res.data.data.uid
                    alert(res.data.msg)
                    window.sessionStorage.removeItem('username')
                    window.sessionStorage.removeItem('role')
                    window.sessionStorage.removeItem('userId')
                    window.sessionStorage.setItem('username',this.reUserInfo.username)
                    window.sessionStorage.setItem('role',this.reUserInfo.role)
                    window.sessionStorage.setItem('userId',this.reUserInfo.userId)
                    this.reload()
                    this.$router.push('/')
                }
            }).catch(()=>{
                alert("数据传输错误")
            })
        }
    },
}
</script>

<style>
#container{
    margin-top: 10%;
    border-style: solid;
    border-radius: 2ex;
    margin-bottom:10%;
}

</style>