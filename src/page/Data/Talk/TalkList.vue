<template>
    <div class="fillcontain">
        <head-top></head-top>
        <div class="table_container">
            <el-table
                :data="tableData"
                :row-key="row => row.index"
                style="width: 100%">
                <el-table-column
                    label="昵称"
                    prop="fromName">
                </el-table-column>
                <el-table-column
                    label="头像"
                    prop="fromAvatar">
                    <template slot-scope="scope">
                        <img :src="scope.row.fromAvatar" height="70" style="margin-top: 5px"/>
                    </template>
                </el-table-column>
                <el-table-column
                    label="邮箱"
                    prop="floor">
                </el-table-column>
                <el-table-column
                    label="留言内容"
                    prop="content">
                    <template slot-scope="scope">
                        <div v-html="scope.row.content"></div>
                    </template>
                </el-table-column>
                <el-table-column
                    label="楼层"
                    prop="floor">
                </el-table-column>
                <el-table-column
                    label="状态">
                    <template slot-scope="scope">
                        <el-tag v-if="scope.row.valid === 1" type="success">显示</el-tag>
                        <el-tag v-else-if="scope.row.valid === 0" type="danger">隐藏</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="160">
                    <template slot-scope="scope">
                        <el-button
                            size="small"
                            @click="handleEdit(scope.$index,scope.row)">编辑
                        </el-button>
                        <el-button
                            size="small"
                            type="danger"
                            @click="handleDelete(scope.$index, scope.row)">隐藏</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="Pagination">
                <el-pagination
                    @current-change="handleCurrentChange"
                    :current-page="currentPage"
                    layout="total, prev, pager, next"
                    :total="total">
                </el-pagination>
            </div>
            <el-dialog size="large" title="留言信息" v-model="dialogFormVisible">
                <el-form :model="selectTable">
                    <el-form-item label="昵称" label-width="100px">
                        <div v-html="selectTable.fromName"></div>
                    </el-form-item>
                    <el-form-item label="头像" label-width="100px">
                        <img style="width: 20%" :src="selectTable.fromAvatar">
                    </el-form-item>
                    <el-form-item label="邮箱" label-width="100px">
                        <div v-html="selectTable.email"></div>
                    </el-form-item>
                    <el-form-item label="留言内容" label-width="100px">
                        <div v-html="selectTable.content"></div>
                    </el-form-item>
                    <el-form-item label="ip" label-width="100px">
                        <span>{{selectTable.ip}}</span>
                    </el-form-item>
                    <el-form-item label="地址" label-width="100px">
                        <span>{{selectTable.address}}</span>
                    </el-form-item>
                    <el-form-item label="楼层" label-width="100px">
                        <span>{{selectTable.floor}}</span>
                    </el-form-item>
                    <el-form-item label="状态" label-width="100px">
                        <el-tag v-if="selectTable.valid === 1" type="success">显示</el-tag>
                        <el-tag v-else-if="selectTable.valid === 0" type="danger">隐藏</el-tag>
                    </el-form-item>
                    <el-form-item label="引述" label-width="100px">
                        <span>{{selectTable.quoteContent}}</span><sup>{{selectTable.quoteTitle}}</sup>
                    </el-form-item>
                    <el-form-item label="留言时间" label-width="100px">
                        <span>{{selectTable.createdTime}}</span>
                    </el-form-item>
                </el-form>
                <el-row style="overflow: auto; text-align: center;">
                    <el-table
                        :data="replyData"

                        style="margin-bottom: 20px;">
                        <el-table-column
                            label="回复者">
                            <template slot-scope="scope">
                                <el-tooltip class="item" effect="light" placement="right">
                                    <div slot="content">{{scope.row.fromEmail}}<br/><span v-if="scope.row.fromWebsite">{{scope.row.fromWebsite}}</span></div>
                                    <el-button type="text">{{scope.row.fromName}}</el-button>
                                </el-tooltip>
                            </template>
                        </el-table-column>
                        <el-table-column
                            prop="toName"
                            label="被回复者">
                        </el-table-column>
                        <el-table-column
                            label="回复内容">
                            <template slot-scope="scope">
                                <div v-html="scope.row.content"></div>
                            </template>
                        </el-table-column>
                        <el-table-column
                            prop="ip"
                            label="ip来源">
                            <template slot-scope="scope">
                                <span>{{scope.row.ip}}</span>
                                <el-tag type="danger">{{scope.row.address}}</el-tag>
                            </template>
                        </el-table-column>
                        <el-table-column
                            label="状态">
                            <template slot-scope="scope">
                                <el-tag v-if="scope.row.valid === 1" type="success">显示</el-tag>
                                <el-tag v-else-if="scope.row.valid === 0" type="danger">隐藏</el-tag>
                            </template>
                        </el-table-column>
                        <el-table-column label="操作" >
                            <template slot-scope="scope">
                                <el-button
                                    size="small"
                                    type="danger"
                                    @click="deleteSpecs(scope.$index)">隐藏</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-row>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="dialogFormVisible = false">取 消</el-button>
                    <el-button type="primary">确 定</el-button>
                </div>
            </el-dialog>
        </div>
    </div>
</template>

<script>
    import headTop from '../../../components/headTop'
    import {baseUrl, baseImgPath} from '@/config/env'
    import {getFoods, getFoodsCount, getMenu, updateFood, deleteFood, getResturantDetail, getMenuById} from '@/api/getData'
    import {getReplies, getTalks} from "../../../api";
    export default {
        data(){
            return {
                baseUrl,
                baseImgPath,
                total: 0,
                tableData:[],
                currentPage: 1,
                selectTable: {},
                dialogFormVisible: false,
                replyData:[],
            }
        },
        computed: {

        },
        components: {
            headTop,
        },
        created(){
            this.initData()
        },
        methods: {
            initData(){
                getTalks().then(res => {
                    if (res.code === 0) {
                        this.tableData = res.data.records;
                        this.currentPage = res.data.current;
                        this.total = res.data.total;
                    }
                })
            },
            handleCurrentChange(val) {
                console.log(val);
                getTalks({current:val}).then(res => {
                    if (res.code === 0) {
                        this.tableData = res.data.records;
                        this.currentPage = res.data.current;
                        this.total = res.data.total;
                    }
                })
            },
            handleEdit(index, row) {
                this.selectTable = row;
                this.dialogFormVisible = true;
                console.log(row);
                //请求子回复信息
                getReplies({commentsId: row.cid}).then(res => {
                    if (res.code === 0){
                        this.replyData = res.data;
                    }
                })
            },
            handleSelect(index){
                this.selectIndex = index;
                this.selectMenu = this.menuOptions[index];
            },
            handleDelete(index, row) {

            }
        },
    }
</script>

<style lang="less">
    @import '../../../style/mixin';
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
