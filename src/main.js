import { createApp } from 'vue'
import App from './App.vue'
import router from './router.js'


router.beforeEach((to,from,next)=>{
    if(to.meta.needLogin){
        if(window.sessionStorage.getItem('username') != null){
            next()
        }
        else{
            alert('请先登录')
            next('/login')
        }
    }
    else{
        next()
    }
})


const app = createApp(App)

//请求url合集
app.config.globalProperties.url = {
    ip: 'http://124.222.91.118:8889/CoTest-1.0.0',
    login : '/user/login', //发送登录请求
    register: '/user/register', //发送注册请求
    join: '/task/join', //发送加入任务请求，0-已加入，1-加入成功，2-人满
    submitReport: '/user/uploadReport', //上传测试报告
    askReport: '/user/downloadReport', //请求展示报告
    tasks: '/task/listAll', //任务广场请求任务列表
    doingTask: '/user/findWorkerWorkingTask', //请求正在进行的任务列表
    doneTask: '/user/findWorkerFinishedTask' , //请求已完成的任务列表
    releasedTask:'/user/findEmployerAllTask',//请求已发布的任务列表
    allTask: '/user/findAllTask' , //请求所有任务列表
    createTask:'/task/upload', //新建任务
    similarReport:'/user/getSimilarReport',//请求相似报告
    comment:'/user/uploadReportComment',//上传评论
    relationship:'/user/getCollaborativeReports',//报告协作关系
    recommendTask:'/recommend/recommendTask',//推荐任务列表
    getStrategy:'/recommend/getAllStrategy',//获取推荐策略
    updateStrategy:'/recommend/updateStrategy',//更新推荐策略
    finishTask:'/task/finish',//设置任务完成
    getComment:'/user/getReportComments',//获取评论列表
    getLikes: '/user/getReportCommentLike',//获取点赞数
    like:'/user/uploadReportCommentLike',//点赞或取消点赞
    getCapacity:'/workerEvaluate/getWorkerScore',//获取工人能力值
    getCluster:'/reportOptimize/runCluster',//获取报告聚类
    
}
app.use(router)
app.mount('#app')
