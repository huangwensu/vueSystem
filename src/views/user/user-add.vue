<template>
    <div  class="cw-row">
        <el-card class="box-card" style="margin: 10px 4px;">
            <div class="app-container">
                <el-form :rules="g_rules" ref="vForm" :model="mFormData" label-width="100px" label-position="right">
                    <el-col :span="10">
                        <el-form-item>
                            <el-form-item label="注册头像" class="cw-upload" prop="">
                                <el-upload
                                    action="http://192.168.80.74:8080/file/fileUpload"
                                    list-type="picture-card"                                  
                                    :on-remove="handleRemove"                                  
                                    :file-list="fileListHeader"
                                    :on-success="handleAvatarSuccess"
                                    :before-upload="beforeAvatarUpload"
                                    :limit="3">
                                    <i class="el-icon-plus"></i>
                                </el-upload>
                                <el-dialog :visible.sync="dialogVisible" size="tiny">
                                    <img width="100%" :src="mFormData.dialogImageUrl" alt="">
                                </el-dialog>
                            </el-form-item>
                        </el-form-item>
                        <el-form-item>
                            <el-form-item label="人员姓名" prop="name">
                                <el-input v-model="mFormData.name" placeholder="请输入人员姓名"></el-input>
                            </el-form-item>
                        </el-form-item>
                        <el-form-item>
                            <el-form-item label="人员工号" prop="code">
                                <el-input v-model="mFormData.code" placeholder="请输入人员工号"></el-input>
                            </el-form-item>
                        </el-form-item>
                        <el-form-item>
                            <el-form-item label="用户账号" prop="account">
                                <el-input v-model="mFormData.account" placeholder="请输入用户账号"></el-input>
                            </el-form-item>
                        </el-form-item>
                        <el-form-item>
                            <el-form-item label="身份证号" prop="idCard">
                                <el-input v-model="mFormData.idCard" placeholder="请输入身份证"></el-input>
                            </el-form-item>
                        </el-form-item>
                        <el-form-item>
                            <el-form-item label="登录名" prop="loginName">
                                <el-input v-model="mFormData.loginName" placeholder="请输入登录名，最多30个字符"></el-input>
                            </el-form-item>
                        </el-form-item>
                        <el-form-item>
                            <el-form-item label="密码" prop="password">
                                <el-input v-model="mFormData.password" placeholder="请输入密码，最少6个字符"></el-input>
                            </el-form-item>
                        </el-form-item>
                        <el-form-item>
                            <el-form-item label="所属终端" prop="name">
                                <el-input v-model="mFormData.name"></el-input>
                            </el-form-item>
                        </el-form-item>
                    </el-col>
                    <el-col :span="10">
                        <el-form-item>
                            <el-form-item label="自定义头像" class="cw-upload" prop="">
                            <el-upload
                                action="http://192.168.80.74:8080/file/fileUpload"
                                list-type="picture-card"                               
                                :on-remove="handleRemove"                              
                                :file-list="fileListCustom"
                                :on-success="handleAvatarSuccessCus"
                                :before-upload="beforeAvatarUpload"
                                :limit="1">
                                <i class="el-icon-plus"></i>
                            </el-upload>
                            <el-dialog :visible.sync="dialogVisible" size="tiny">
                                <img width="100%" :src="mFormData.dialogImageUrl" alt="">
                            </el-dialog>
                            </el-form-item>                            
                        </el-form-item>
                        <el-form-item>
                            <el-form-item label="电话" prop="telephone">
                                <el-input v-model="mFormData.telephone" placeholder="请输入手机号码"></el-input>
                            </el-form-item>
                        </el-form-item>
                        <el-form-item>
                            <el-form-item label="邮箱" prop="email">
                                <el-input v-model="mFormData.email" placeholder="请输入电子邮箱地址"></el-input>
                            </el-form-item>
                        </el-form-item>
                        <el-form-item>
                            <el-form-item label="所属单位" prop="orgCode">
                                <el-input v-model="mFormData.orgCode"></el-input>
                            </el-form-item>
                        </el-form-item>
                        <el-form-item>
                            <el-form-item label="所属部门" prop="deptCode">
                                <el-select v-model="mFormData.deptCode" placeholder="请选择" style="width:100%;">
                                    <el-option label="请选择" value="shanghai"></el-option>
                                    <el-option label="研发部" value="beijing"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-form-item>
                        <el-form-item>
                            <el-form-item label="职位" prop="position">
                                <el-input v-model="mFormData.position" placeholder="请输入职位"></el-input>
                            </el-form-item>
                        </el-form-item>
                        <el-form-item>
                            <el-form-item label="出生日期" prop="birthday">
                                <el-date-picker type="date" placeholder="选择出生日期" v-model="mFormData.birthday" style="width: 100%;"></el-date-picker>
                            </el-form-item>
                        </el-form-item>
                        <el-form-item>
                            <el-form-item label="性别" prop="gender">
                                <el-radio-group v-model="mFormData.gender">
                                    <el-radio label="男"></el-radio>
                                    <el-radio label="女"></el-radio>
                                </el-radio-group>
                            </el-form-item>
                        </el-form-item>
                    </el-col>
                </el-form>
                <div class="form-footer">
                    <el-button icon="el-icon-check" type="primary" @click.stop="g_addOrUpdateAction">确 定</el-button>
                    <el-button icon="el-icon-close" @click.stop="g_showDialog">取 消</el-button>
                </div>
            </div>
        </el-card>
    </div>
</template>
<script>
  const USER_TYPE = 1
  let vm = null
export default {
    data(){
        return {
            mFormData: {
                userType: USER_TYPE,
                id: '',
                pictureNames: [],
                dialogImageUrl:'',
                customerPicName: '',
                inputTreeVal: '',
                name: '',
                code:'',
                account:'',
                idCard:'',
                loginName: '',
                password: '',
                birthday: '',
                deviceId: '',
                telphone: '',
                email: '',
                orgCode:'',
                deptCode:'',
                position:'',
                birthday:'',
                gender: '0'
            },
            dialogVisible: false,
            dialogImageUrl: '',
            g_rules: {
                name: [
                    { required: true, message: '请输入员工姓名', trigger: 'blur' },
                    { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
                ],
                code: [
                    { required: true, message: '请输入员工编号', trigger: 'change' },
                    { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
                ],
                account: [
                    { required: true, message: '请输入用户账号', trigger: 'change' },
                    { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
                ]                
            },
            fileListHeader: [],
            fileListCustom: []
        }
    },
    // 实例创建勾子
    created:function(){
        vm = this
    },
    methods:{
        //删除上传的图片
        handleRemove(file, fileList) {

        },
        handleAvatarSuccess(res, file) {
            vm.mFormData.pictureNames.push(file.url)
        },
        handleAvatarSuccessCus(res, file) {
            console.log(res)
            vm.mFormData.customerPicName = file.url
        },
        beforeAvatarUpload(file) {
            const isJPG = file.type === 'image/jpeg'
            const isLt2M = file.size / 1024 / 1024 < 2

            if (!isJPG) {
            this.$message.error('上传头像图片只能是 JPG 格式!')
            }
            if (!isLt2M) {
            this.$message.error('上传头像图片大小不能超过 2MB!')
            }
            return isJPG && isLt2M
        }
    }
}
</script>
<style>
.form-footer{
    clear: both;
    text-align: center
}
</style>


