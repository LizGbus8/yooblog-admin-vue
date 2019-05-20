import Vue from 'vue'
import Router from 'vue-router'
import Blogger from "../page/Data/Blogger";
import TabList from "../page/Data/TagList";
import ArticleList from "../page/Data/Article/ArticleList";
import ArticleEdit from "../page/Data/Article/ArticleEdit";
import RecordList from "../page/Data/RecordList";
import TalkList from "../page/Data/TalkList";
import CommentList from "../page/Data/CommentList";
import BlogRollList from "../page/Data/BlogRollList";

Vue.use(Router)


const login = r => require.ensure([], () => r(require('@/page/login')), 'login');
const manage = r => require.ensure([], () => r(require('@/page/Meun/manage')), 'manage');
const home = r => require.ensure([], () => r(require('@/page/Home/home.vue')), 'home');
const addShop = r => require.ensure([], () => r(require('@/page/addShop')), 'addShop');
const addGoods = r => require.ensure([], () => r(require('@/page/addGoods')), 'addGoods');
const userList = r => require.ensure([], () => r(require('@/page/userList')), 'userList');
const shopList = r => require.ensure([], () => r(require('@/page/shopList')), 'shopList');
const foodList = r => require.ensure([], () => r(require('@/page/foodList')), 'foodList');
const orderList = r => require.ensure([], () => r(require('@/page/orderList')), 'orderList');
const adminList = r => require.ensure([], () => r(require('@/page/adminList')), 'adminList');
const visitor = r => require.ensure([], () => r(require('@/page/visitor')), 'visitor');
const newMember = r => require.ensure([], () => r(require('@/page/newMember')), 'newMember');
const uploadImg = r => require.ensure([], () => r(require('@/page/uploadImg')), 'uploadImg');
const vueEdit = r => require.ensure([], () => r(require('@/page/vueEdit')), 'vueEdit');
const adminSet = r => require.ensure([], () => r(require('@/page/adminSet')), 'adminSet');
const sendMessage = r => require.ensure([], () => r(require('@/page/sendMessage')), 'sendMessage');
const explain = r => require.ensure([], () => r(require('@/page/explain')), 'explain');

const routes = [
	{
		path: '/',
		component: login
	},
	{
		path: '/manage',
		component: manage,
		name: '',
		children: [{
			path: '',
			component: home,
			meta: [],
		},{
			path: '/blogger',
			component: Blogger,
			meta: ['数据管理', '博主信息'],
		},{
            path: '/tags',
            component: TabList,
            meta: ['数据管理', '标签管理'],
        },{
			path: '/articleList',
			component: ArticleList,
			meta: ['数据管理', '文章管理'],
		},{
            path: '/article/:aid',
            component: ArticleEdit,
            meta: ['数据管理', '文章管理','文章编辑'],
        },{
            path: '/recordList',
            component: RecordList,
            meta: ['数据管理', '归档管理'],
        },{
			path: '/talkList',
			component: TalkList,
			meta: ['数据管理', '留言管理'],
		},{
			path: '/commentList',
			component: CommentList,
			meta: ['数据管理', '评论管理'],
		},{
			path: '/blogRollList',
			component: BlogRollList,
			meta: ['数据管理', '友链管理'],
		},{
			path: '/orderList',
			component: orderList,
			meta: ['数据管理', '订单列表'],
		},{
			path: '/adminList',
			component: adminList,
			meta: ['数据管理', '管理员列表'],
		},{
			path: '/visitor',
			component: visitor,
			meta: ['图表', '用户分布'],
		},{
			path: '/newMember',
			component: newMember,
			meta: ['图表', '用户数据'],
		},{
			path: '/uploadImg',
			component: uploadImg,
			meta: ['文本编辑', 'MarkDown'],
		},{
			path: '/vueEdit',
			component: vueEdit,
			meta: ['编辑', '文本编辑'],
		},{
			path: '/adminSet',
			component: adminSet,
			meta: ['设置', '管理员设置'],
		},{
			path: '/sendMessage',
			component: sendMessage,
			meta: ['设置', '发送通知'],
		},{
			path: '/explain',
			component: explain,
			meta: ['说明', '说明'],
		}]
	}
]

export default new Router({
	routes,
	strict: process.env.NODE_ENV !== 'production',
})
