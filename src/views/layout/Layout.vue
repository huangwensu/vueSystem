<template>
  <div class="app-wrapper" :class="{hideSidebar:!sidebar.opened, hideTopbar:!sidebar.opened}">
    <!-- 头部主菜单 -->
    <div class="topbar-wrapper"> 
      <ul class="header-inner topbar-container" >
        <li class="logo"></li>
        <li v-for="(item, index) in routers" class="manu-list" 
            :class="{'current': mCurrentIndex == index}" @click.stop="topMenuClick(item, index)" :key="item.path">{{item.name}}</li>
        <li class="manu-list" style="font-size:14px;padding-right:10px;float: right;" @click.stop="showMsg=!showMsg">
            <span>消息</span>
            <span class="msg_img"><img src="../../assets/img/msg.png"></span>
            <span class="msg_num">14</span>
        </li>
        <li class="manu-list" style="font-size:14px;float: right;" @click.stop="logout();">退出</li>
      </ul>
    </div>
    <div style="clear:both;"></div>
    <div class="msg_container" v-show="showMsg">
        <div class="popup">
            <span><em></em></span>
        </div>
        <ul>
            <li v-for="item in noticeList" :key="item.title">
                <span>{{item.title}}</span><br>
                <span>{{item.content}}</span>
            </li>
            <li>
                <div class="btn">查看更多</div>
            </li>
        </ul>
    </div>
    <!-- 左边子菜单 -->
    <div id="sidebarWrapperId" class="sidebar-wrapper" >
        <div class="menu-sidebar">
          <ul class="menu-sidebar-ul">
            <li>
               <ul v-for="(item, index) in subMenuList" :class="{'current': currentIndex == index}" @click.stop="menuClick(item, index)" :key="item.name">
                    <li><i :class="item.icon"></i></li>
                    <li>{{item.name}}</li>
                </ul>
            </li>
          </ul>
        </div>   
     </div>
    <div class="main-container" style="padding-top: 60px;">
      <navbar></navbar>
      <app-main></app-main>
    </div>
  </div>
</template>

<script>
import { Navbar, Sidebar, AppMain } from '@/views/layout'
import { asyncRouterMap, constantRouterMap, defaultPath} from '@/router/index'
import img_msg from '@/assets/img/msg.png'

export default {
  name: 'layout',
  data() {
    return {
        img_msg: img_msg,
        subPath: '/role',
        mCurrentIndex: 0,
        currentIndex: 0,
        showMsg: false,
        noticeList: [{
            title: '系统消息',
            content: '我想我是海，冬天的大海，轻轻随风...'
        },{
            title: '系统消息',
            content: '我想我是海，冬天的大海，轻轻随风...'
        },{
            title: '项目消息',
            content: '我想我是海，冬天的大海，轻轻随风...'
        },{
            title: '项目消息',
            content: '我想我是海，冬天的大海，轻轻随风...'
        }]
    }
  },
  components: {
    Navbar,
    Sidebar,
    AppMain,
  },
  methods: {
    topMenuClick(item, index) {
        this.mCurrentIndex = index
        this.currentIndex = 0
        this.subPath = item.path
        if(item.redirect){
            this.$router.push(item.redirect)
        }
    },
    menuClick(item, index){
        this.currentIndex = index
        this.$router.push(this.subPath + '/' + item.path)
    },
    logout(){
        this.$router.push('/login')
    }
  },
  computed: {
    sidebar() {
      return this.$store.state.app.sidebar
    },
    routers() {
        let routers = constantRouterMap.filter(function(item){
            return !item.hidden;
        })
        this.subPath = routers[0].path 
        this.$router.push(defaultPath || (routers[0].path + '/' + routers[0].children[0].path))
        return routers;
    },
    subMenuList() {
        //return this.routers[this.mCurrentIndex].children
        let subMenuList = this.routers[this.mCurrentIndex].children;
        let newSubMenuList = subMenuList.filter(item => {
            return !item.hidden
        })
        return newSubMenuList;

    }
  }
}
</script>

<style type="text/css">
    *{
        padding: 0;
        margin: 0;
    }
    .pull-right{
        float: right;
    }
    .header-inner li{
        list-style: none;
        float: left;
        line-height: 60px;
    }
    .header-inner .manu-list{
        line-height:60px;
        padding:0 20px;
        cursor:pointer;
        font-size:16px;
        color: #fff;
    }

    .header-inner .manu-list:hover{
        background-color: #5676ba;
    }

    .header-inner .current{
        background-color: #4867a7;
    }
    .header-inner .logo {
        color: #fff;
        text-transform: uppercase;
        display: block;
        font-size: 16px;
        width: 160px;
        height: 60px;
        background: url(../../assets/img/index_logo.png) center center no-repeat;
    }
    .menu-sidebar-ul {
        text-align: center;
        font-size: 12px;
        color: #fff;
    }

    .menu-sidebar-ul .current {
        background-color: #25578A;
    }

    .menu-sidebar-ul ul {
        height: 100px;
        padding: 16px 6px 0 6px;
        border-bottom: 1px solid #16334f;
        cursor: pointer;
    }

    .menu-sidebar-ul ul:hover {
        background-color: #1D4974;
    }

    .menu-sidebar-ul ul li:nth-child(1) {
        font-size: 24px;
        line-height: 50px;
        color: #99B9C9;
    }

    .msg_container {
        position: fixed;
        top: 76px;
        right: 4px;
        width: 280px;
        height: 332px;
        line-height: 40px;
        background: #fff;
        border: 1px solid #dddddd;
        border-radius: 6px;
        padding: 18px 16px;
        z-index: 100;
    }

    .msg_container>ul>li {
        list-style: none;
        line-height: 26px;
        padding-bottom: 10px;
        font-size: 12px;
    }

    .msg_container>ul>li>span:nth-child(1) {
        font-size: 16px;
        color: #7a95d8;
    }

    .msg_container .btn {
        padding: 2px 0px;
        margin-top: 16px;
        border: 1px dashed #94b5d8;
        color: #94b5d8;
        text-align: center;
        cursor: pointer;
    }

    .msg_img {
        position: relative;
        top: -6px;
    }

    .msg_num {
        position: relative;
        top: -11px;
        left: -24px;
        font-size: 10px;
    }

    .msg_container .popup span {
        display: block;
        width: 0;
        height: 0;
        border-width: 0 10px 10px;
        border-style: solid;
        border-color: transparent transparent #94b5d8;
        position: absolute;
        top: -10px;
        right: 36px;
        margin-left: -10px; /* 三角形居中显示 */
    }

    .msg_container .popup em {
        display: block;
        width: 0;
        height: 0;
        border-width: 0 10px 10px;
        border-style: solid;
        border-color: transparent transparent #fff;
        position: absolute;
        top: 1px;
        left: -10px;
    }
</style>

<style rel="stylesheet/scss" lang="scss" scoped>
    @import "src/styles/mixin.scss";
    .app-wrapper {
        @include clearfix;
        position: relative;
        height: 100%;
        width: 100%;
        &.hideSidebar {
            .sidebar-wrapper {
                transform: translate(-50px, 0);
                .sidebar-container {
                    transform: translate(82px, 0);
                }
                &:hover {
                    transform: translate(0, 0);
                    .sidebar-container {
                        transform: translate(0, 0);
                    }
                }
            }
            .main-container {
                margin-left: 40px;
            }
        }
        &.hideTopbar {
            .topbar-wrapper {
                transform: translate(0, -60px);
                .topbar-container {
                    transform: translate(0, 60);
                }
            }
            .sidebar-wrapper {
                top: 0;
            }
            .main-container {
                padding-top: 0 !important;
            }
        }
        .topbar-wrapper{
            background-color: rgb(100, 134, 205); 
            position: fixed; 
            width: 100%; 
            z-index: 100000;
        }
        .topbar-container{
            padding: 0px;
            margin: 0px;
        }
        .sidebar-wrapper {
            width: 90px;
            position: fixed;
            top: 60px;
            bottom: 0;
            left: 0;
            z-index: 1001;
            overflow: hidden;
            transition: all .28s ease-out;
            background-color: #1b2c3d;
        }
        .sidebar-container {
            transition: all .28s ease-out;
            position: absolute;
            top: 0;
            bottom: 0;
            left: 0;
            right: -17px;
            overflow-y: scroll;
        }
        .main-container {
            min-height: 100%;
            transition: all .28s ease-out;
            margin-left: 90px;
        }
    }
</style>
