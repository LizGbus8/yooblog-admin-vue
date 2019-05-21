<template>
    <div>
     	<head-top></head-top>
        <el-form :label-position="right" label-width="80px" :model="formLabelAlign">
            <el-form-item label="文章标题">
                <el-input v-model="formLabelAlign.title"></el-input>
            </el-form-item>
            <el-form-item label="展示图">
                <el-upload
                    class="avatar-uploader"
                    :action="baseUrl + '/admin/update/avatar/' + adminInfo.id"
                    :show-file-list="false"
                    :on-success="uploadImg"
                    :before-upload="beforeImgUpload">
                    <img v-if="adminInfo.avatar" :src="formLabelAlign.imageUrl" class="avatar">
                    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                </el-upload>
            </el-form-item>
            <el-form-item label="标签">
                <el-select v-model="formLabelAlign.tId" filterable placeholder="请选择">
                    <el-option
                        v-for="item in tags"
                        :key="item.tId"
                        :label="item.description"
                        :value="item.tId">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="发布时间">
                <el-date-picker disabled type="date" v-model="formLabelAlign.createdTime" style="width: 100%;"></el-date-picker>
            </el-form-item>
            <el-form-item label="最近编辑">
                <el-date-picker disabled type="date" v-model="formLabelAlign.updatedTime" style="width: 100%;"></el-date-picker>
            </el-form-item>
            <el-form-item label="浏览数">
                <el-input v-model="formLabelAlign.readCount" disabled></el-input>
            </el-form-item>
            <el-form-item label="分享数">
                <el-input v-model="formLabelAlign.starCount" disabled></el-input>
            </el-form-item>
            <el-form-item label="作者">
                <el-input v-model="formLabelAlign.author"></el-input>
            </el-form-item>
            <el-form-item label="公开">
                <el-radio-group v-model="formLabelAlign.pub">
                    <el-radio-button label="1">公开</el-radio-button>
                    <el-radio-button label="0">隐私</el-radio-button>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="内容" style="width: 1080px">
                <editor api-key="kibwgch7m4xlt7u7t27us16okomv7563yzzfs4eqe9cl5kzf" v-model="formLabelAlign.content" :init="editorInit"></editor>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="submitForm('ruleForm')">立即保存</el-button>
                <el-button @click="resetForm()">重置</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
    import headTop from '../../../components/headTop'
    import {mapState} from 'vuex'
    import {baseUrl, baseImgPath} from '@/config/env'
    import Editor from '@tinymce/tinymce-vue'
    import {getArticle, getTagList, saveArticle} from "../../../api";
    import {isObjectValueEqual} from "../../../config/mUtils";
    export default {
    	data(){
    		return {
                baseUrl,
                baseImgPath,
                tags:[],
                tinyHtml:'',
                editorInit: {
                    selector: "#tinymce",
                    //插件
                    plugins: ['advlist', 'autolink', 'lists', 'charmap', 'print', 'preview', 'hr', 'anchor', 'pagebreak', 'spellchecker',
                        'searchreplace', 'wordcount', 'visualblocks', 'visualchars', 'fullscreen', 'insertdatetime', 'nonbreaking',
                        'save', 'table','image','imagetools', 'contextmenu', 'directionality', 'emoticons', 'paste', 'textcolor',
                        'codesample','code','fullscreen','link'],
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
        computed: {
            ...mapState(['adminInfo']),
        },
    	components: {
    		headTop,
            Editor
    	},
        created(){
    	  this.initData();
        },
        methods: {
            initData() {
                //请求标签信息
                getTagList().then(res => {
                    if (res.code === 0) {
                        this.tags = res.data;

                        //请求文章信息
                        const aId = this.$route.params.aid;
                        getArticle(aId).then(res => {
                            if (res.code === 0) {
                                this.formLabelAlign = res.data;
                                this.backup = JSON.parse(JSON.stringify(res.data));
                            }
                        });
                    }
                })
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
                //保存
                saveArticle(this.formLabelAlign).then(res => {
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
                this.formLabelAlign = JSON.parse(JSON.stringify(this.backup));
            }
        }
    }
</script>

<style lang="less">
	@import '../../../style/mixin';
    .dog{
        color: inherit;
    }
    .tox-notification{
        display: none;
    }
    .el-form{
        margin-top: 10px;
    }
	.form{
		min-width: 400px;
		margin-bottom: 30px;
		&:hover{
			box-shadow: 0 0 8px 0 rgba(232,237,250,.6), 0 2px 4px 0 rgba(232,237,250,.5);
			border-radius: 6px;
			transition: all 400ms;
		}
	}
	.food_form{
		border: 1px solid #eaeefb;
		padding: 10px 10px 0;
	}
	.form_header{
		text-align: center;
		margin-bottom: 10px;
	}
	.category_select{
		border: 1px solid #eaeefb;
		padding: 10px 30px 10px 10px;
		border-top-right-radius: 6px;
		border-top-left-radius: 6px;
	}
	.add_category_row{
		height: 0;
		overflow: hidden;
		transition: all 400ms;
		background: #f9fafc;
	}
	.showEdit{
		height: 185px;
	}
	.add_category{
		background: #f9fafc;
		padding: 10px 30px 0px 10px;
		border: 1px solid #eaeefb;
		border-top: none;
	}
	.add_category_button{
		text-align: center;
		line-height: 40px;
		border-bottom-right-radius: 6px;
		border-bottom-left-radius: 6px;
		border: 1px solid #eaeefb;
		border-top: none;
		transition: all 400ms;
		&:hover{
			background: #f9fafc;
			span, .edit_icon{
				color: #20a0ff;
			}
		}
		span{
			.sc(14px, #999);
			transition: all 400ms;
		}
		.edit_icon{
			color: #ccc;
			transition: all 400ms;
		}
	}
	.avatar-uploader .el-upload {
	    border: 1px dashed #d9d9d9;
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
	.cell{
		text-align: center;
	}
</style>
