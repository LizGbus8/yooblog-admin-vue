<template>
    <div class="fillcontain">
        <head-top></head-top>
        <header class="admin_title">博主信息</header>
        <div class="admin_set">
            <el-form label-position="right" label-width="80px" :model="formLabelAlign">
                <el-form-item label="更换头像">
                    <el-upload
                        class="avatar-uploader"
                        :action="baseUrl + '/admin/update/avatar/' + adminInfo.id"
                        :show-file-list="false"
                        :on-success="uploadImg"
                        :before-upload="beforeImgUpload">
                        <img v-if="formLabelAlign.avatar" :src="formLabelAlign.avatar" class="avatar">
                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                    </el-upload>
                </el-form-item>
                <el-form-item label="昵称">
                    <el-input v-model="formLabelAlign.nickname"></el-input>
                </el-form-item>
                <el-form-item label="说说">
                    <el-input type="textarea" :rows="6" v-model="formLabelAlign.saying"></el-input>
                </el-form-item>
                <el-form-item label="github">
                    <el-input v-model="formLabelAlign.github"></el-input>
                </el-form-item>
                <el-form-item label="掘金">
                    <el-input v-model="formLabelAlign.juejin"></el-input>
                </el-form-item>
                <el-form-item label="关于博主" style="width: 756px">
                    <editor api-key="kibwgch7m4xlt7u7t27us16okomv7563yzzfs4eqe9cl5kzf" v-model="formLabelAlign.about" :init="editorInit"></editor>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="submitForm()">立即保存</el-button>
                    <el-button @click="resetForm()">重置</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>
	import headTop from '../../components/headTop'
    import {mapState} from 'vuex'
    import {baseUrl, baseImgPath} from '@/config/env'
    import Editor from '@tinymce/tinymce-vue'
    import {getBlogger, saveBlogger} from "../../api";
    import {isObjectValueEqual} from "../../config/mUtils";

    export default {
        data(){
            return {
                baseUrl,
                baseImgPath,
                labelPosition: 'right',
                tinyHtml:'',
                editorInit: {
                    selector: "#tinymce",
                    //插件
                    plugins: ['advlist', 'autolink', 'lists', 'charmap', 'print', 'preview', 'hr', 'anchor', 'pagebreak', 'spellchecker',
                        'searchreplace', 'wordcount', 'visualblocks', 'visualchars', 'fullscreen', 'insertdatetime', 'nonbreaking',
                        'save', 'table','image','imagetools', 'contextmenu', 'directionality', 'emoticons', 'paste', 'textcolor',
                        'codesample','code','fullscreen','link','pageembed','bbcode'],
                    link_class_list: [
                        {title: 'None', value: ''},
                        {title: 'Dog', value: 'dog'},
                        {title: 'Cat', value: 'cat'}
                    ],
                    //图片说明
                    image_caption: true,
                    //图片样式
                    image_advtab: true,
                    //图片上传
                    images_upload_url: 'postAcceptor.php',
                    automatic_uploads: true,
                    image_list: [
                        {title: 'Dog', value: 'mydog.jpg'},
                        {title: 'Cat', value: 'mycat.gif'}
                    ],
                    imagetools_toolbar: "rotateleft rotateright | flipv fliph | editimage imageoptions",
                    toolbar: "forecolor backcolor undo redo  styleselect  bold italic link image alignleft aligncenter alignright",
                    height:600,
                    color_map: [
                        "000000", "Black",
                        "993300", "Burnt orange",
                        "333300", "Dark olive",
                        "003300", "Dark green",
                        "003366", "Dark azure",
                        "000080", "Navy Blue",
                        "333399", "Indigo",
                        "333333", "Very dark gray",
                        "800000", "Maroon",
                        "FF6600", "Orange",
                        "808000", "Olive",
                        "008000", "Green",
                        "008080", "Teal",
                        "0000FF", "Blue",
                        "666699", "Grayish blue",
                        "808080", "Gray",
                        "FF0000", "Red",
                        "FF9900", "Amber",
                        "99CC00", "Yellow green",
                        "339966", "Sea green",
                        "33CCCC", "Turquoise",
                        "3366FF", "Royal blue",
                        "800080", "Purple",
                        "999999", "Medium gray",
                        "FF00FF", "Magenta",
                        "FFCC00", "Gold",
                        "FFFF00", "Yellow",
                        "00FF00", "Lime",
                        "00FFFF", "Aqua",
                        "00CCFF", "Sky blue",
                        "993366", "Red violet",
                        "FFFFFF", "White",
                        "FF99CC", "Pink",
                        "FFCC99", "Peach",
                        "FFFF99", "Light yellow",
                        "CCFFCC", "Pale green",
                        "CCFFFF", "Pale cyan",
                        "99CCFF", "Light sky blue",
                        "CC99FF", "Plum"
                    ]
                },
                formLabelAlign: {},
                backup:{},//表单备份数据
            }
        },
    	components: {
    		headTop,
            Editor
    	},
        computed: {
            ...mapState(['adminInfo']),
        },
        mounted(){
            this.getBlogger();
        },
        methods: {
            getBlogger() {
                getBlogger({id: 1}).then(res => {
                    if (res.code === 0) {
                        this.formLabelAlign = res.data;
                        //深拷贝
                        this.backup = JSON.parse(JSON.stringify(res.data));
                    }
                });
            },
            submitForm(){
                //没有修改
                if (isObjectValueEqual(this.formLabelAlign, this.backup)) {
                        this.$message({
                            type:'info',
                            center:true,
                            message: '没做任何修改！\\(^ 0^)/'
                        });
                        return;
                }
                //保存数据库
                saveBlogger(this.formLabelAlign).then(res => {
                    if (res.code === 0) {
                        //提示
                        this.$message({
                            type:'success',
                            center:true,
                            message: '提交成功！\\(^ 0^)/'
                        });
                        this.formLabelAlign = res.data;
                        this.backup = JSON.parse(JSON.stringify(res.data));
                    }
                });
            },
            resetForm(){
                //深拷贝
                this.formLabelAlign = JSON.parse(JSON.stringify(this.backup));
            },
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
