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
                    <el-button type="primary" @click="handleSelect">查询</el-button>
                </div>
                <el-button type="primary" @click="handleRefresh()"><i class="el-icon-refresh"></i>刷新表格</el-button>
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
                            @click="handleEdit(scope.row)">编辑</el-button>
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
        </div>
    </div>
</template>

<script>
    import headTop from '../../../components/headTop'
    import {baseImgPath, baseUrl} from '@/config/env'
    import {getArticles, getTagList, selectArticle} from "../../../api";

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
            }
        },
        created(){
            this.initData();
        },
        computed: {

        },
        components: {
            headTop,
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
            handleEdit(row) {
                this.$router.push({
                    path: `/article/${row.aId}`,
                })
            },
            handleRefresh(){
                //请求文章列表
                getArticles({current: this.currentPage, size: 10}).then(res => {
                    if (res.code === 0){
                        this.tableData = res.data.records;
                        this.currentPage = res.data.current;
                        this.total = res.data.total;
                    }
                });
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
        width: 755px;
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
