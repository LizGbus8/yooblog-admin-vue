<template>
    <div class="fillcontain">
        <head-top></head-top>
        <header class="admin_title">博主信息</header>
        <div class="admin_set">
            <el-form :label-position="right" label-width="80px" :model="formLabelAlign">
                <el-form-item label="更换头像">
                    <el-upload
                        class="avatar-uploader"
                        :action="baseUrl + '/admin/update/avatar/' + adminInfo.id"
                        :show-file-list="false"
                        :on-success="uploadImg"
                        :before-upload="beforeImgUpload">
                        <img v-if="adminInfo.avatar" :src="baseImgPath + adminInfo.avatar" class="avatar">
                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                    </el-upload>
                </el-form-item>
                <el-form-item label="昵称">
                    <el-input v-model="formLabelAlign.name"></el-input>
                </el-form-item>
                <el-form-item label="说说">
                    <el-input type="textarea" rows="6" v-model="formLabelAlign.saying"></el-input>
                </el-form-item>
                <el-form-item label="github">
                    <el-input v-model="formLabelAlign.github"></el-input>
                </el-form-item>
                <el-form-item label="掘金">
                    <el-input v-model="formLabelAlign.juejing"></el-input>
                </el-form-item>
                <el-form-item label="关于博主">
                    <el-input v-model="formLabelAlign.about"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="submitForm('ruleForm')">立即保存</el-button>
                    <el-button @click="resetForm('ruleForm')">重置</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>
	import headTop from '../../components/headTop'
    import {mapState} from 'vuex'
    import {baseUrl, baseImgPath} from '@/config/env'

    export default {
        data(){
            return {
                baseUrl,
                baseImgPath,
                labelPosition: 'right',
                formLabelAlign: {
                    name: 'Yoo',
                    saying: '这雨量，不及我眼里一份！常即日暮他们都没有说清楚JS的基本类型有哪些。而且往往错误的说了一些C语言的数据类型',
                    github: 'https://github.com/Alvin9999/new-pac/wiki/ss%E5%85%8D%E8%B4%B9%E8%B4%A6%E5%8F%B7',
                    juejing:'https://github.com/Alvin9999/new-pac/wiki/ss%E5%85%8D%E8%B4%B9%E8%B4%A6%E5%8F%B7',
                    about:''
                }
            }
        },
    	components: {
    		headTop,
    	},
        computed: {
            ...mapState(['adminInfo']),
        },
        methods: {
            uploadImg(res, file) {
                if (res.status == 1) {
                    this.adminInfo.avatar = res.image_path;
                }else{
                    this.$message.error('上传图片失败！');
                }
            },
            beforeImgUpload(file) {
                const isRightType = (file.type === 'image/jpeg') || (file.type === 'image/png');
                const isLt2M = file.size / 1024 / 1024 < 2;

                if (!isRightType) {
                    this.$message.error('上传头像图片只能是 JPG 格式!');
                }
                if (!isLt2M) {
                    this.$message.error('上传头像图片大小不能超过 2MB!');
                }
                return isRightType && isLt2M;
            },
        },
    }
</script>

<style lang="less">
	@import '../../style/mixin';
	.explain_text{
		margin-top: 20px;
		text-align: center;
		font-size: 20px;
		color: #333;
	}
    .el-form{
        width: 520px;
    }
    .admin_set{
        width: 60%;
        background-color: #F9FAFC;
        min-height: 400px;
        margin: 20px auto 0;
        border-radius: 10px;
        ul > li{
            padding: 20px;
            span{
                color: #666;
            }
        }
    }
    .admin_title{
        margin-top: 20px;
        .sc(24px, #666);
        text-align: center;
    }
    .avatar-uploader .el-upload {
        border: 1px dashed #d9d9d9;
        margin-top: 10px;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
    }
    .avatar-uploader .el-upload:hover {
        border-color: #20a0ff;
    }
    .avatar-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: 120px;
        height: 120px;
        line-height: 120px;
        text-align: center;
    }
    .avatar {
        width: 120px;
        height: 120px;
        display: block;
    }
</style>
