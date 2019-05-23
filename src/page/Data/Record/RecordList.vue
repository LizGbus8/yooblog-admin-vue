<template>
    <div class="fillcontain">
        <head-top></head-top>
        <div class="table_container">
            <div class="tab-op">
                <div class="search_r">
                    <el-input style="width: 200px" v-model="condition.content" placeholder="内容"></el-input>
                    <el-input style="width: 150px" v-model="condition.author" placeholder="作者"></el-input>
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
                    label="内容"
                    show-overflow-tooltip
                    prop="content">
                </el-table-column>
                <el-table-column
                    label="链接">
                    <template slot-scope="scope">
                        <a style="color: gray" :href="scope.row.reference" target="_blank">{{scope.row.referenceDesc}}</a>
                    </template>
                </el-table-column>
                <el-table-column
                    label="作者"
                    prop="author">
                </el-table-column>
                <el-table-column
                    label="最近编辑"
                    prop="updatedTime">
                </el-table-column>
                <el-table-column label="操作" width="160">
                    <template slot-scope="scope">
                        <el-button
                            size="small"
                            @click="handleEdit(scope.row)">编辑
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="Pagination">
                <el-pagination
                    @current-change="handleCurrentChange"
                    :current-page="currentPage"
                    :page-size="20"
                    layout="total, prev, pager, next"
                    :total="total">
                </el-pagination>
            </div>

            <el-dialog title="编辑归档" v-model="dialogEditFormVisible">
                <el-form :model="selectTable">
                    <el-form-item label="归档ID" label-width="100px">
                        <el-input v-model="selectTable.recId" auto-complete="off" disabled></el-input>
                    </el-form-item>
                    <el-form-item label="内容" label-width="100px">
                        <el-input type="textarea" rows="6" v-model="selectTable.content"></el-input>
                    </el-form-item>
                    <el-form-item label="链接文字" label-width="100px">
                        <el-input v-model="selectTable.referenceDesc"></el-input>
                    </el-form-item>
                    <el-form-item label="链接" label-width="100px">
                        <el-input v-model="selectTable.reference"></el-input>
                    </el-form-item>
                    <el-form-item label="作者" label-width="100px">
                        <el-input v-model="selectTable.author"></el-input>
                    </el-form-item>
                    <el-form-item label="创建时间" label-width="100px">
                        <el-date-picker disabled type="datetime" v-model="selectTable.createdTime"
                                        style="width: 100%;"></el-date-picker>
                    </el-form-item>
                    <el-form-item label="更新时间" label-width="100px">
                        <el-date-picker disabled type="datetime" v-model="selectTable.createdTime"
                                        style="width: 100%;"></el-date-picker>
                    </el-form-item>
                </el-form>

                <div slot="footer" class="dialog-footer">
                    <el-button @click="dialogEditFormVisible = false">取 消</el-button>
                    <el-button type="primary" @click="updateOrSaveRecord(selectTable)">保存</el-button>
                </div>
            </el-dialog>

            <el-dialog title="新增标签" v-model="dialogAddFormVisible">
                <el-form v-model="newtab">
                    <el-form-item label="说明" label-width="100px">
                        <el-input v-model="newtab.description"></el-input>
                    </el-form-item>
                    <el-form-item label="分类" label-width="100px">
                        <el-radio-group v-model="newtab.cat" size="medium">
                            <el-radio-button label="1">前端</el-radio-button>
                            <el-radio-button label="2">后台</el-radio-button>
                            <el-radio-button label="3">工具</el-radio-button>
                            <el-radio-button label="4">程序员</el-radio-button>
                            <el-radio-button label="5">Yoo说说</el-radio-button>
                        </el-radio-group>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="dialogAddFormVisible = false">取 消</el-button>
                    <el-button type="primary">保存</el-button>
                </div>
            </el-dialog>
        </div>
    </div>
</template>

<script>
    import headTop from '../../../components/headTop'
    import {baseUrl, baseImgPath} from '@/config/env'
    import {getRecords, saveRecord, selectRecord} from "../../../api";

    export default {
        data() {
            return {
                baseUrl,
                baseImgPath,
                newtab: {},
                cat: 1,//分类
                createdTimes:[],
                condition:{
                    current:1,
                },//筛选条件
                tableData:[],
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
                currentPage: 1,
                total:0,
                selectTable: {},
                dialogEditFormVisible: false,
                dialogAddFormVisible: false,
            }
        },
        created() {
            this.initData();
        },
        computed: {
        },
        components: {
            headTop,
        },
        methods: {
            initData() {
                getRecords({current: this.currentPage}).then(res => {
                    if (res.code === 0) {
                       this.tableData = res.data.records;
                       this.total = res.data.total;
                    }
                });
            },
            handleSizeChange(val) {
                console.log(`每页 ${val} 条`);
            },
            handleCurrentChange(val) {

            },
            handleAdd() {
                this.dialogAddFormVisible = true;
            },
            handleEdit(row) {
                this.selectTable = row;
                this.dialogEditFormVisible = true;
            },
            handleSelect(){
                if (this.createdTimes.length > 1 &&  this.createdTimes[1] != null) {
                    //GMT handle
                    this.condition.createdTimes = [this.createdTimes[0].getTime(), this.createdTimes[1].getTime()];
                }

                //请求后台查询
                selectRecord(this.condition).then(res => {
                    if (res.code === 0) {
                        this.tableData = res.data.records;
                        this.currentPage = res.data.current;
                        this.total = res.data.total;
                    }
                })
            },
            updateOrSaveRecord(params) {
                saveRecord(params).then(res => {
                    if (res.code === 0) {
                        this.$message({
                            type: 'success',
                            center: true,
                            message: '提交成功！\\(^ 0^)/'
                        });
                        this.dialogEditFormVisible = this.dialogAddFormVisible = false;
                        this.initData();
                    }
                })
            },
            clearCondition(){
                this.condition = {current: 1};
                this.createdTimes = [];
            }
        },
    }
</script>

<style lang="less">
    @import '../../../style/mixin';

    .tab-op{
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        margin: 10px 0 10px 10px;
        width: 100%;
        float: right;
    }
    .search_r{
        display: flex;
        justify-content: space-between;
        width: 730px;
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

    .table_container {
        padding: 20px;
    }

    .Pagination {
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
