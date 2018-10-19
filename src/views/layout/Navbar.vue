<template>
  <el-menu class="navbar" mode="horizontal" @dblclick.native="toggleSideBar">
    <hamburger class="hamburger-container" :toggleClick="toggleSideBar" :isActive="sidebar.opened"></hamburger>
    <hamburger2 class="hamburger-container" style="float: right;" :toggleClick="toggleSideBar" :isActive="sidebar.opened"></hamburger2>
    <levelbar></levelbar>
  </el-menu>
</template>

<script>
import { mapGetters } from 'vuex'
import Levelbar from './Levelbar'
import Hamburger from '@/components/Hamburger'
import Hamburger2 from '@/components/Hamburger2'

export default {
  components: {
    Levelbar,
    Hamburger,
    Hamburger2
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'avatar'
    ])
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('ToggleSideBar')
    },
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
    .navbar {
        height: 50px;
        line-height: 50px;
        border-radius: 0px !important;
        .hamburger-container {
            line-height: 50px;
            height: 50px;
            float: left;
            padding: 0 10px;
            color: #5e6573;
        }
        .errLog-container {
            display: inline-block;
            position: absolute;
            right: 150px;
        }
        .screenfull {
            position: absolute;
            right: 90px;
            top: 16px;
            color: red;
        }
        .avatar-container {
            height: 50px;
            display: inline-block;
            position: absolute;
            right: 35px;
            .avatar-wrapper {
                cursor: pointer;
                margin-top: 5px;
                position: relative;
                .user-avatar {
                    width: 40px;
                    height: 40px;
                    border-radius: 10px;
                }
                .el-icon-caret-bottom {
                    position: absolute;
                    right: -20px;
                    top: 25px;
                    font-size: 12px;
                }
            }
        }
    }
</style>

