import {createRouter, createWebHistory} from 'vue-router'
import MainContent from './components/Home/MainContent'
import LoginContent from './components/User/LoginContent'
import RegisterContent from './components/User/RegisterContent'
import TaskList from './components/Task/TaskList'
import TaskInfo from './components/Task/TaskInfo'
import TaskCenter from './components/Task/TaskCenter'
import TaskAdd from './components/Task/TaskAdd'
import RecommendRule from './components/Task/RecommendRule'
import ReportInfo from './components/Report/ReportInfo'
const routes =[
        {
            path: '/',
            component: MainContent,
            meta:{
                needLogin: false
            }
        },
        {
            path: '/login',
            component: LoginContent,
            meta:{
                needLogin: false
            }
        },
        {
            path: '/register',
            component: RegisterContent,
            meta:{
                needLogin: false
            }
        },
        {
            path:'/tasks',
            component: TaskList,
            meta:{
                needLogin: true 
            }
        },
        {
            path:'/taskInfo',
            name: 'taskInfo',
            component: TaskInfo,
            meta:{
                needLogin: true 
            }
        },
        {
            path:'/center',
            name: 'center',
            component: TaskCenter,
            meta:{
                needLogin: true 
            }
        },
        {
            path:'/taskAdd',
            name: 'taskAdd',
            component: TaskAdd,
            meta:{
                needLogin: true 
            }
        },
        {
            path:'/rule',
            name:'rule',
            component: RecommendRule,
            meta:{
                needLogin:true
            }
        },
        {
            path:'/report',
            name:'report',
            component:ReportInfo,
            meta:{
                needLogin: true
            }
        }

    ]

const router = createRouter({
    history: createWebHistory(),
    routes,
    linkActiveClass: 'active'
});
export default router;
