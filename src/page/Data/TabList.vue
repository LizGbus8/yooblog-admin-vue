<template>
    <div class="fillcontain">
        <head-top></head-top>
        <div class="table_container">
            <div class="tab-op">
                <el-button type="primary" @click="handleAdd()">新增标签</el-button>
            </div>
            <el-table
                :data="tableData"
                :row-key="row => row.index"
                style="width: 100%">
                <el-table-column
                    label="标签ID"
                    prop="tid">
                </el-table-column>
                <el-table-column
                    label="说明"
                    prop="description">
                </el-table-column>
                <el-table-column
                    label="分类"
                    prop="catId">
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
                    :total="count">
                </el-pagination>
            </div>
            <el-dialog title="编辑标签" v-model="dialogEditFormVisible">
                <el-form :model="selectTable">
                    <el-form-item label="标签ID" label-width="100px">
                        <el-input v-model="selectTable.tid" auto-complete="off" disabled></el-input>
                    </el-form-item>
                    <el-form-item label="说明" label-width="100px">
                        <el-input v-model="selectTable.description"></el-input>
                    </el-form-item>
                    <el-form-item label="分类" label-width="100px">
                        <el-radio-group v-model="cat" size="medium" @change="change">
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
                    <el-button type="primary" @click="updateFood">保存</el-button>
                </div>
            </el-dialog>

            <el-dialog title="新增标签" v-model="dialogAddFormVisible">
                <el-form v-model="newtab">
                    <el-form-item label="说明" label-width="100px">
                        <el-input v-model="newtab.description"></el-input>
                    </el-form-item>
                    <el-form-item label="分类" label-width="100px">
                        <el-radio-group v-model="newtab.cat" size="medium">
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
                    <el-button type="primary" @click="updateFood">保存</el-button>
                </div>
            </el-dialog>
        </div>
    </div>
</template>

<script>
    import headTop from '../../components/headTop'
    import {baseUrl, baseImgPath} from '@/config/env'
    import {getFoods, getFoodsCount, getMenu, updateFood, deleteFood, getResturantDetail, getMenuById} from '@/api/getData'
    export default {
        data(){
            return {
                baseUrl,
                baseImgPath,
                restaurant_id: null,
                newtab:{},
                cat:1,//分类
                city: {},
                offset: 0,
                limit: 20,
                count: 0,
                tableData: [
                    {
                        "description": "Java",
                        "catId": "后台",
                        "tid": "1"
                    },
                    {
                        "description": "数据库相关",
                        "catId": "1",
                        "tid": 2
                    },
                    {
                        "description": "网站实践",
                        "catId": "1",
                        "tid": 3
                    },
                    {
                        "description": "EffectiveJava读书总结",
                        "catId": "1",
                        "tid": 4
                    },
                    {
                        "description": "vue实践",
                        "catId": "2",
                        "tid": 5
                    },
                    {
                        "description": "css的一些",
                        "catId": "2",
                        "tid": 6
                    },
                    {
                        "description": "git",
                        "catId": "3",
                        "tid": 7
                    },
                    {
                        "description": "设计画图",
                        "catId": "3",
                        "tid": 8
                    },
                    {
                        "description": "漫威宇宙",
                        "catId": "5",
                        "tid": 9
                    },
                    {
                        "description": "黄山实录",
                        "catId": "5",
                        "tid": 10
                    }
                ],
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
            //this.initData();
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
            }
        },
        components: {
            headTop,
        },
        methods: {
            change(){
                alert(this.cat)
            },
            async initData(){
                try{
                    const countData = await getFoodsCount({restaurant_id: this.restaurant_id});
                    if (countData.status == 1) {
                        this.count = countData.count;
                    }else{
                        throw new Error('获取数据失败');
                    }
                    this.getFoods();
                }catch(err){
                    console.log('获取数据失败', err);
                }
            },
            async getMenu(){
                this.menuOptions = [];
                try{
                    const menu = await getMenu({restaurant_id: this.selectTable.restaurant_id, allMenu: true});
                    menu.forEach((item, index) => {
                        this.menuOptions.push({
                            label: item.name,
                            value: item.id,
                            index,
                        })
                    })
                }catch(err){
                    console.log('获取食品种类失败', err);
                }
            },
            async getFoods(){
                const Foods = await getFoods({offset: this.offset, limit: this.limit, restaurant_id: this.restaurant_id});
                this.tableData = [];
                Foods.forEach((item, index) => {
                    const tableData = {};
                    tableData.name = item.name;
                    tableData.item_id = item.item_id;
                    tableData.description = item.description;
                    tableData.rating = item.rating;
                    tableData.month_sales = item.month_sales;
                    tableData.restaurant_id = item.restaurant_id;
                    tableData.category_id = item.category_id;
                    tableData.image_path = item.image_path;
                    tableData.specfoods = item.specfoods;
                    tableData.index = index;
                    this.tableData.push(tableData);
                })
            },
            tableRowClassName(row, index) {
                if (index === 1) {
                    return 'info-row';
                } else if (index === 3) {
                    return 'positive-row';
                }
                return '';
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
            handleSelect(index){
                this.selectIndex = index;
                this.selectMenu = this.menuOptions[index];
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
        margin: 10px;
        float: right;
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
