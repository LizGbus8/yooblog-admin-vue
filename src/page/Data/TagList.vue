<template>
    <div class="fillcontain">
        <head-top></head-top>
        <div class="table_container">
            <div class="tab-op">
                <div class="search">
                    <el-input style="width: 120px" v-model="condition.tId" placeholder="ID"></el-input>
                    <el-input style="width: 200px" v-model="condition.description" placeholder="说明"></el-input>
                    <el-select  style="width: 120px" v-model="condition.catId" placeholder="分类">
                        <el-option label="前端" value="1"></el-option>
                        <el-option label="后端" value="2"></el-option>
                        <el-option label="工具" value="3"></el-option>
                        <el-option label="程序员" value="4"></el-option>
                        <el-option label="Yoo说说" value="5"></el-option>
                    </el-select>
                    <el-button type="primary" @click="handleSelect">查询</el-button>
                </div>
                <el-button type="primary" @click="handleAdd()">新增标签</el-button>
            </div>
            <el-table
                :data="tableData"
                :row-key="row => row.index"
                style="width: 100%">
                <el-table-column
                    label="标签ID"
                    prop="tId">
                </el-table-column>
                <el-table-column
                    label="说明"
                    prop="description">
                </el-table-column>
                <el-table-column
                    label="分类"
                    prop="catId">
                    <template slot-scope="scope">
                        <span>{{catDesc(scope.row.catId)}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="160">
                    <template slot-scope="scope">
                        <el-button
                            size="small"
                            @click="handleEdit(scope.row)">编辑</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="Pagination">
                <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="currentPage"
                    :page-size="20"
                    layout="total, prev, pager, next"
                    :total="this.tableData.length">
                </el-pagination>
            </div>
            <el-dialog title="编辑标签" v-model="dialogEditFormVisible">
                <el-form :model="selectTable">
                    <el-form-item label="标签ID" label-width="100px">
                        <el-input v-model="selectTable.tId" auto-complete="off" readonly></el-input>
                    </el-form-item>
                    <el-form-item label="说明" label-width="100px">
                        <el-input v-model="selectTable.description"></el-input>
                    </el-form-item>
                    <el-form-item label="分类" label-width="100px">
                        <el-radio-group v-model="selectTable.catId" size="medium">
                            <el-radio-button label="1" >前端</el-radio-button>
                            <el-radio-button label="2">后台</el-radio-button>
                            <el-radio-button label="3">工具</el-radio-button>
                            <el-radio-button label="4">程序员</el-radio-button>
                            <el-radio-button label="5">Yoo说说</el-radio-button>
                        </el-radio-group>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="dialogEditFormVisible = false">取 消</el-button>
                    <el-button type="primary" @click="updateOrSaveTag(selectTable)">保存</el-button>
                </div>
            </el-dialog>

            <el-dialog title="新增标签" v-model="dialogAddFormVisible">
                <el-form v-model="newtab">
                    <el-form-item label="说明" label-width="100px">
                        <el-input v-model="newtab.description"></el-input>
                    </el-form-item>
                    <el-form-item label="分类" label-width="100px">
                        <el-radio-group v-model="newtab.catId" size="medium">
                            <el-radio-button label="1" >前端</el-radio-button>
                            <el-radio-button label="2">后台</el-radio-button>
                            <el-radio-button label="3">工具</el-radio-button>
                            <el-radio-button label="4">程序员</el-radio-button>
                            <el-radio-button label="5">Yoo说说</el-radio-button>
                        </el-radio-group>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="dialogAddFormVisible = false">取 消</el-button>
                    <el-button type="primary" @click="updateOrSaveTag(newtab)">保存</el-button>
                </div>
            </el-dialog>
        </div>
    </div>
</template>

<script>
    import headTop from '../../components/headTop'
    import {baseImgPath, baseUrl} from '@/config/env'
    import {
        deleteFood,
        getFoods,
        getFoodsCount,
        getMenu,
        getMenuById,
        getResturantDetail,
        updateFood
    } from '@/api/getData'
    import {getTagList, saveTag, selectTag} from "../../api";
    import config from "../../config/config";

    export default {
        data(){
            return {
                baseUrl,
                baseImgPath,
                restaurant_id: null,
                newtab:{},
                condition:{},//搜索条件
                cat:1,//分类
                city: {},
                offset: 0,
                limit: 20,
                count: 0,
                tableData: [],
                currentPage: 1,
                selectTable: {},
                dialogEditFormVisible: false,
                dialogAddFormVisible: false,
                menuOptions: [],
                selectMenu: {},
                selectIndex: null,
                specsForm: {
                    specs: '',
                    packing_fee: 0,
                    price: 20,
                },
                specsFormrules: {
                    specs: [
                        { required: true, message: '请输入规格', trigger: 'blur' },
                    ],
                },
                specsFormVisible: false,
                expendRow: [],
            }
        },
        created(){
            this.initData();
        },
        computed: {
            specs: function (){
                let specs = [];
                if (this.selectTable.specfoods) {
                    this.selectTable.specfoods.forEach(item => {
                        specs.push({
                            specs: item.specs_name,
                            packing_fee: item.packing_fee,
                            price: item.price,
                        })
                    })
                }
                return specs
            },
            catDesc:function () {
                return function (catId) {
                    return config.technologyClass.filter(e => e.id == catId)[0].name;
                }
            }
        },
        components: {
            headTop,
        },
        methods: {
            initData(){
                getTagList().then(res => {
                    if (res.code === 0) {
                        this.tableData = res.data;
                    }
                })
                this.condition = {};
            },
            updateOrSaveTag(params){
                saveTag(params).then(res => {
                    if (res.code === 0 ){
                        this.$message({
                            type:'success',
                            center:true,
                            message: '提交成功！\\(^ 0^)/'
                        });
                        this.dialogEditFormVisible = this.dialogAddFormVisible = false;
                        this.initData();
                    }
                })
            },
            handleSelect(){
                selectTag(this.condition).then(res => {
                    if (res.code === 0){
                        this.tableData = res.data;
                    }
                })
            },

            addspecs(){
                this.specs.push({...this.specsForm});
                this.specsForm.specs = '';
                this.specsForm.packing_fee = 0;
                this.specsForm.price = 20;
                this.specsFormVisible = false;
            },
            deleteSpecs(index){
                this.specs.splice(index, 1);
            },
            handleSizeChange(val) {
                console.log(`每页 ${val} 条`);
            },
            handleCurrentChange(val) {
                this.currentPage = val;
                this.offset = (val - 1)*this.limit;
                this.getFoods()
            },
            expand(row, status){
                if (status) {
                    this.getSelectItemData(row)
                }else{
                    const index = this.expendRow.indexOf(row.index);
                    this.expendRow.splice(index, 1)
                }
            },
            handleAdd() {
                this.dialogAddFormVisible = true;
            },
            handleEdit(row) {
                this.getSelectItemData(row, 'edit');
                this.dialogEditFormVisible = true;
            },
            async getSelectItemData(row, type){
                const restaurant = await getResturantDetail(row.restaurant_id);
                const category = await getMenuById(row.category_id)
                this.selectTable = {...row, ...{restaurant_name: restaurant.name, restaurant_address: restaurant.address, category_name: category.name}};

                this.selectMenu = {label: category.name, value: row.category_id}
                this.tableData.splice(row.index, 1, {...this.selectTable});
                this.$nextTick(() => {
                    this.expendRow.push(row.index);
                })
                if (type == 'edit' && this.restaurant_id != row.restaurant_id) {
                    this.getMenu();
                }
            },
            async handleDelete(index, row) {
                try{
                    const res = await deleteFood(row.item_id);
                    if (res.status == 1) {
                        this.$message({
                            type: 'success',
                            message: '删除食品成功'
                        });
                        this.tableData.splice(index, 1);
                    }else{
                        throw new Error(res.message)
                    }
                }catch(err){
                    this.$message({
                        type: 'error',
                        message: err.message
                    });
                    console.log('删除食品失败')
                }
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
    @import '../../style/mixin';
    .tab-op{
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        margin: 10px;
        float: right;
    }
    .search{
        display: flex;
        justify-content: space-between;
        width: 534px;
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
