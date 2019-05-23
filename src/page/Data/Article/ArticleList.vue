<template>
    <div class="fillcontain">
        <head-top></head-top>
        <div class="table_container">
            <div class="tab-op">
                <div class="search_a">
                    <el-input style="width: 200px" v-model="condition.title" placeholder="标题"></el-input>
                    <el-select style="width: 150px" filterable clearable v-model="condition.tId" placeholder="标签">
                        <el-option
                            v-for="item in tags"
                            :key="item.tId"
                            :label="item.description"
                            :value="item.tId">
                        </el-option>
                    </el-select>
                    <el-select  style="width: 100px" v-model="condition.pub" clearable placeholder="状态">
                        <el-option label="公开" value="1"></el-option>
                        <el-option label="隐私" value="0"></el-option>
                    </el-select>
                    <el-date-picker
                        v-model="createdTimes"
                        type="daterange"
                        align="right"
                        unlink-panels
                        placeholder="发布时间"
                        :picker-options="pickerOptions">
                    </el-date-picker>
                    <el-button @click="clearCondition">清空</el-button>
                    <el-button type="primary" @click="handleSelect">查询</el-button>
                </div>
            </div>
            <el-table
                :data="tableData"
                :row-key="row => row.index"
                style="width: 100%">
                <el-table-column
                    label="文章标题"
                    prop="title">
                </el-table-column>
                <el-table-column
                    label="文章标签"
                    prop="tId" :formatter="descFormatter">
                </el-table-column>
                <el-table-column
                    label="阅读数"
                    prop="readCount">
                </el-table-column>
                <el-table-column
                    label="最近编辑时间"
                    prop="updatedTime">
                </el-table-column>
                <el-table-column
                    label="公开"
                    prop="pub">
                    <template slot-scope="scope">
                        <el-tag v-if="scope.row.pub === 1" type="success">公开</el-tag>
                        <el-tag v-else-if="scope.row.pub === 0" type="danger">隐私</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="160">
                    <template slot-scope="scope">
                        <el-button
                            size="small"
                            @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                        <el-button
                            size="small"
                            type="danger"
                            @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="Pagination">
                <el-pagination
                    @current-change="handleCurrentChange"
                    :current-page="condition.current"
                    :page-size="10"
                    layout="total, prev, pager, next"
                    :total="total">
                </el-pagination>
            </div>

            <el-dialog size="full" title="文章信息" v-model="dialogFormVisible">
                <el-form :label-position="right" label-width="80px" :model="selectTable">
                    <el-form-item label="文章标题">
                        <el-input v-model="selectTable.title"></el-input>
                    </el-form-item>
                    <el-form-item label="展示图">
                        <el-upload
                            class="avatar-uploader"
                            :action="baseUrl + '/admin/update/avatar/' + adminInfo.id"
                            :show-file-list="false"
                            :on-success="uploadImg"
                            :before-upload="beforeImgUpload">
                            <img v-if="adminInfo.avatar" :src="selectTable.imageUrl" class="avatar">
                            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                        </el-upload>
                    </el-form-item>
                    <el-form-item label="标签">
                        <el-select v-model="selectTable.tId" filterable placeholder="请选择">
                            <el-option
                                v-for="item in tags"
                                :key="item.tId"
                                :label="item.description"
                                :value="item.tId">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="发布时间">
                        <el-date-picker disabled type="date" v-model="selectTable.createdTime" style="width: 100%;"></el-date-picker>
                    </el-form-item>
                    <el-form-item label="最近编辑">
                        <el-date-picker disabled type="date" v-model="selectTable.updatedTime" style="width: 100%;"></el-date-picker>
                    </el-form-item>
                    <el-form-item label="浏览数">
                        <el-input v-model="selectTable.readCount" disabled></el-input>
                    </el-form-item>
                    <el-form-item label="分享数">
                        <el-input v-model="selectTable.starCount" disabled></el-input>
                    </el-form-item>
                    <el-form-item label="作者">
                        <el-input v-model="selectTable.author"></el-input>
                    </el-form-item>
                    <el-form-item label="公开">
                        <el-radio-group v-model="selectTable.pub">
                            <el-radio-button label=1>公开</el-radio-button>
                            <el-radio-button label=0>隐私</el-radio-button>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="内容" style="width: 1080px">
                        <editor api-key="kibwgch7m4xlt7u7t27us16okomv7563yzzfs4eqe9cl5kzf" v-model="selectTable.content" :init="editorInit"></editor>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="submitForm(selectTable.index)">立即保存</el-button>
                        <el-button @click="resetForm()">重置</el-button>
                        <el-button @click="dialogFormVisible = false">取 消</el-button>
                    </el-form-item>
                </el-form>
            </el-dialog>
        </div>
    </div>
</template>

<script>
    import headTop from '../../../components/headTop'
    import {baseImgPath, baseUrl} from '@/config/env'
    import {mapState} from 'vuex'
    import Editor from '@tinymce/tinymce-vue'
    import {getArticles, getTagList, saveArticle, selectArticle} from "../../../api";
    import {isObjectValueEqual} from "../../../config/mUtils";

    export default {
        data(){
            return {
                baseUrl,
                baseImgPath,
                currentPage: 1,
                size: 20,
                total: 0,
                createdTimes:[],
                condition:{
                    current:1,
                },//筛选条件
                tags:[],//标签
                tableData: [],
                selectTable: {},
                dialogFormVisible: false,
                menuOptions: [],
                selectMenu: {},
                selectIndex: null,
                expendRow: [],
                pickerOptions: {
                    shortcuts: [{
                        text: '最近一周',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                            picker.$emit('pick', [start, end]);
                        }
                    }, {
                        text: '最近一个月',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                            picker.$emit('pick', [start, end]);
                        }
                    }, {
                        text: '最近三个月',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                            picker.$emit('pick', [start, end]);
                        }
                    }]
                },
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
        created(){
            this.initData();
        },
        computed: {
            ...mapState(['adminInfo']),
        },
        components: {
            headTop,
            Editor
        },
        methods: {
            initData(){
                //请求标签列表
                getTagList().then(res => {
                    if (res.code === 0) {
                        this.tags = res.data;

                        //请求文章列表
                        getArticles({current: this.currentPage, size: 10}).then(res => {
                            if (res.code === 0){
                                this.tableData = res.data.records;
                                this.currentPage = res.data.current;
                                this.total = res.data.total;
                            }
                        });
                    }
                });
            },
            handleCurrentChange(val) {
                this.currentPage = val;
                getArticles({current: this.currentPage, size: 10}).then(res => {
                    if (res.code === 0){
                        this.tableData = res.records;
                        this.currentPage = res.current;
                        this.total = res.total;
                    }
                })
            },
            handleEdit(index, row) {
                this.selectTable = row;
                this.selectTable.index = index;
                this.backup = JSON.parse(JSON.stringify(row));
                this.dialogFormVisible = true;
            },
            descFormatter(row,column){
                let tId = row.tId;
                return this.tags.filter(tag => tag.tId === tId)[0].description;
            },
            handleSelect(){
                if (this.createdTimes.length > 1 &&  this.createdTimes[1] != null) {
                    //GMT handle
                    this.condition.createdTimes = [this.createdTimes[0].getTime(), this.createdTimes[1].getTime()];
                }

                //请求后台查询
                selectArticle(this.condition).then(res => {
                    if (res.code === 0) {
                        this.tableData = res.data.records;
                        this.currentPage = res.data.current;
                        this.total = res.data.total;
                    }
                })
            },
            handleDelete(index, row) {
                this.$message({
                    type: 'warning',
                    message: '暂不支持改功能！'
                });
            },
            clearCondition(){
                this.condition = {current: 1};
                this.createdTimes = [];
            },
            submitForm(index){
                //没有修改
                if (isObjectValueEqual(this.selectTable, this.backup)) {
                    this.$message({
                        type:'info',
                        center:true,
                        message: '没做任何修改！\\(^ 0^)/'
                    });
                    return;
                }
                //保存
                saveArticle(this.selectTable).then(res => {
                    if (res.code === 0) {
                        //提示
                        this.$message({
                            type:'success',
                            center:true,
                            message: '提交成功！\\(^ 0^)/'
                        });
                        this.selectTable = res.data;
                        this.tableData.splice(index, 1, JSON.parse(JSON.stringify(res.data)));
                        this.backup = JSON.parse(JSON.stringify(res.data));
                    }
                });
            },
            resetForm(){
                this.selectTable = JSON.parse(JSON.stringify(this.backup));
            },



            handleServiceAvatarScucess(res, file) {
                if (res.status == 1) {
                    this.selectTable.image_path = res.image_path;
                }else{
                    this.$message.error('上传图片失败！');
                }
            },
            beforeAvatarUpload(file) {
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
            async updateFood(){
                this.dialogFormVisible = false;
                try{
                    const subData = {new_category_id: this.selectMenu.value, specs: this.specs};
                    const postData = {...this.selectTable, ...subData};
                    const res = await updateFood(postData)
                    if (res.status == 1) {
                        this.$message({
                            type: 'success',
                            message: '更新食品信息成功'
                        });
                        this.getFoods();
                    }else{
                        this.$message({
                            type: 'error',
                            message: res.message
                        });
                    }
                }catch(err){
                    console.log('更新餐馆信息失败', err);
                }
            },
        },
    }
</script>

<style lang="less">
    @import '../../../style/mixin';
    .tab-op{
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        margin: 10px;
        float: right;
    }
    .search_a{
        display: flex;
        justify-content: space-between;
        width: 820px;
    }
    .demo-table-expand {
        font-size: 0;
    }
    .demo-table-expand label {
        width: 90px;
        color: #99a9bf;
    }
    .demo-table-expand .el-form-item {
        margin-right: 0;
        margin-bottom: 0;
        width: 50%;
    }
    .table_container{
        padding: 20px;
    }
    .Pagination{
        display: flex;
        justify-content: flex-start;
        margin-top: 8px;
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
</style>
