import Vue from 'vue'
import Router from 'vue-router'




import login from '@/pages/login/login.vue'
import resetPassword from '@/pages/resetPassword/resetPassword.vue'
import index from '@/pages/index/index.vue'
import order from '@/components/order/order.vue'
import earnings from '@/components/earnings/earnings.vue'
import buySuccess from '@/components/buySuccess/buySuccess.vue'
import orderDetail from '@/components/order/orderDetail/orderDetail.vue'
import takeOrder from '@/components/takeOrder/takeOrder.vue'
import tabCashier from '@/components/tabCashier/tabCashier.vue'
import coupon from '@/components/coupon/coupon.vue'
import couponDetail from '@/components/coupon/couponDetail/couponDetail.vue'
import check from '@/components/check/check.vue'
import workshift from '@/components/workshift/workshift.vue'
import achievement from '@/components/achievement/achievement.vue'
import workDetail from '@/components/workshift/workDetail/workDetail.vue'
import workOrderDetail from '@/components/workshift/workOrderDetail/workOrderDetail.vue'
import reward from "@/components/reward/reward.vue"
import table from "@/components/table/table.vue"
import goPay from "@/components/goPay/goPay.vue"
import selGoods from "@/components/selGoods/selGoods.vue"
import selTimeGoods from "@/components/selTimeGoods/selTimeGoods.vue"
import pay from "@/components/pay/pay.vue"
import payRes from "@/components/payRes/payRes.vue"



Vue.use(Router)


export default new Router({
    routes: [
        {
            //重定向
            path: '*',
            redirect: '/index'
        },
        {
            path: '/login',
            name: 'login',
            component: login
        },
        {
            path: '/resetPassword',
            name: 'resetPassword',
            component: resetPassword
        },
        {
            path: '/index',
            name: 'index',
            component: index
        },
        {
            path: '/buySuccess/:id',
            name: 'buySuccess',
            component: buySuccess
        },
        {
            path: '/orderDetail/:id',
            name: 'orderDetail',
            component: orderDetail
        },
        {
            path: '/order',
            name: 'order',
            component: order,
            children:[

            ]   
        },{//收益
            path: '/earnings',
            name: 'earnings',
            component: earnings,
            children:[

            ]	
        },
        {//打赏收益
            path: '/reward',
            name: 'reward',
            component: reward,
            children:[

            ]	
        },
        {
            path: '/takeOrder',
            name: 'takeOrder',
            component: takeOrder,
             children:[

            ]
        },
        {
            path: '/tabCashier',
            name: 'tabCashier',
            component: tabCashier,
             children:[

            ]
        },
        {
            path: '/table',
            name: 'table',
            component: table,
             children:[

            ]
        },
        {
            path: '/goPay',
            name: 'goPay',
            component: goPay,
             children:[

            ]
        },
        {
            path: '/pay',
            name: 'pay',
            component: pay,
             children:[

            ]
        },
        {
            path: '/payRes',
            name: 'payRes',
            component: payRes,
             children:[

            ]
        },
        {
            path: '/selGoods',
            name: 'selGoods',
            component: selGoods,
             children:[

            ]
        },
        {
            path: '/selTimeGoods',
            name: 'selTimeGoods',
            component: selTimeGoods,
             children:[

            ]
        },
        {
            path: '/achievement',
            name: 'achievement',
            component: achievement,
             children:[

            ]
        },
        {
            path: '/coupon',
            name: 'coupon',
            component: coupon
        },
        {
            path: '/couponDetail/:id',
            name: 'couponDetail',
            component: couponDetail
        },
        {
            path: '/check',
            name: 'check',
            component: check
        },
        {
            path: '/workshift',
            name: 'workshift',
            component: workshift
        },
        {
            path: '/workDetail/:id',
            name: 'workDetail',
            component: workDetail
        },
        {
            path: '/workOrderDetail/:id',
            name: 'workOrderDetail',
            component: workOrderDetail
        }
    ]
})