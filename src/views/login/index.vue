<template>
  <div class="login-container" v-loading.body="g_listLoading">
    <div style="position: relative;">
      <img src="../../assets/img/singin_welcome.png">
        <section class="cw-login-container">
          <article class="login-params">
            <span id="errorMsg" class="error_msg" style="display: none;">登录名或者密码错误！</span>
            <form id="_loginForm" ref="loginForm" class="form form-horizontal" action="account/login.do" method="post" autocomplete="off">
              <input type="hidden" id="catchUsername" value="" />
              <input type="hidden" id="lastUserName" value="" />
              <input type="hidden" id="cookieUsername" value=""/>
              <input type="hidden" id="cookiePassword" value=""/>
              <input type="hidden" id="companyDownLogo" value="lib/images/loginbg.jpg"/>
              <div class="form-item" style="position: relative;">
                <span class="singin-icon"> 
                  <img src="../../assets/img/signin_user.png">
                </span>
                <i></i>
                <span class="input"><input id="username" type="text" v-model="loginForm.username" placeholder="请输入登录名"></span>
                <span class="singin-icon close">
                  <img id="closeImage" src="../../assets/img/singin_close.png">
                </span>
              </div>
              <div class="form-item" style="position: relative;">
                <span class="singin-icon">
                  <img src="../../assets/img/signin_lock.png">
                </span>
                <i></i> 
                <span class="input"><input id="password" type="password" v-model="loginForm.password" placeholder="请输入密码"></span>
              </div>
              <div id="validateCodeDiv" class="form-item" style="position: relative; display: none;">
                <span class="singin-icon">
                  <img src="../../assets/img/signin_lock.png">
                </span> 
                <i></i> 
                <span class="input">
                  <input id="validateCode" type="text" name="validateCode" placeholder="请输入验证码">
                </span> 
                <span class="v-code-icon">
                  <img id="_img" src="" onclick="changeImg();">
                </span>
              </div>
              <div class="form-item" style="line-height: 30px; text-align: left; color: #b6b6b6;">
                <input id="isOnline" name="isOnline" type="hidden"/>
                <span>
                  <input id="online" type="checkbox" name="online" value="">
                </span>
                <span style="position: relative; top: -2px;">记住密码</span>
              </div>
              <div class="form-item">
                <span id="_submit" class="login-btn" @click.stop="handleLogin();">登&nbsp;&nbsp;录</span>
              </div>
            </form>
          </article>
        </section>
    </div>
  </div>
</template>

<script>
import { isvalidUsername } from '@/utils/validate'

export default {
  name: 'login',
  data() {
    const validateUsername = (rule, value, callback) => {
      if (!isvalidUsername(value)) {
        callback(new Error('请输入正确的人员名'))
      } else {
        callback()
      }
    }
    const validatePass = (rule, value, callback) => {
      if (value.length < 5) {
        callback(new Error('密码不能小于5位'))
      } else {
        callback()
      }
    }
    return {
      g_listLoading: false,
      loginForm: {
        username: 'admin',
        password: '123456'
      },
      loginRules: {
        username: [{ required: true, trigger: 'blur', validator: validateUsername }],
        password: [{ required: true, trigger: 'blur', validator: validatePass }]
      },
      loading: false
    }
  },
  methods: {
    /* submitAction() {
      this.$router.push({ path: '/' })
    }, */
    handleLogin() {
      // this.$refs.loginForm.validate(valid => {
        /* if (valid) { */
      this.g_listLoading = true
      this.$store.dispatch('Login', this.loginForm).then(() => {
        this.g_listLoading = false
        this.$router.push({ path: '/' })
      }).catch(() => {
        console.log('用户名或者密码错误！')
        setTimeout(() => {
          this.g_listLoading = false
        }, 200)
        this.$message({
          type: 'error',
          message: '用户名或者密码错误！'
        })
      })
        /* } else {
          console.log('error submit!!')
          return false
        } */
      // })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
  @import "src/styles/mixin.scss";
  $bg:#2d3a4b;
  $dark_gray:#889aa4;
  $light_gray:#eee;

  * {
    padding: 0;
    margin: 0;
    font-family: "微软雅黑";
    box-sizing: content-box;
  }

  input:-webkit-autofill, textarea:-webkit-autofill, select:-webkit-autofill {
    color: rgb(255, 255, 255) !important;
  }

  input:-webkit-autofill, textarea:-webkit-autofill, select:-webkit-autofill {
    color: rgb(255, 255, 255) !important;
  }
  .cw-login-container {
    margin: 0 auto;
    text-align: center;
    position: absolute;
    top: 12%;
    left: 56%;
  }

  div.container {
    min-height: 600px;
    min-width: 800px;
    display: flex;
    justify-content: center;
    align-items: center;
    position: fixed;
    left: 0;
    width: 100%;
    height: 100%;
    background:
      url(../../assets/img/siignin_bg.png);
  }

  .form-item {
    line-height: 80px;
  }

  .form-item input {
    padding: 17px 100px 17px 60px;
    border: 1px solid lightgray;
    border-radius: 5px;
  }

  .login-btn {
    width: 311px;
    background-color: #93a4b8;
    border-radius: 5px;
    padding: 11px 128px;
    color: #fff;
    font-size: 22px;
    cursor: pointer;
  }

  .singin-icon {
    position: absolute;
    top: 8px; 
    left: 20px;
  }

  .v-code-icon {
    position: absolute;
    top: 12px;
      left: 222px;
  }

  .close {
    top: 6px;
    left: 280px;
  }

  .close img {
    cursor: pointer;
  }

  .form-item i {
    border-right: 1px solid #cccccc;
    position: relative;
    top: 0px;
    left: 52px;
    padding: 4px 0;
  }

  .error_msg {
    position: absolute;
    top: -12px;
    left: 100px;
    font-size: 12px;
    color: red;
  }
  .login-container {
    @include relative;
    display: flex;
    position: fixed;
    justify-content: center;
    align-items: center;
    background-color: #fff;
    background: url(../../assets/img/siignin_bg.png);
      input:-webkit-autofill {
        -webkit-box-shadow: 0 0 0px 1000px #293444 inset !important;
        -webkit-text-fill-color: #fff !important;
        box-shadow: 0 0 0px 1000px #293444 inset !important;
    }
  }
</style>
