<template>
    <div>
     	<head-top></head-top>
        <el-form :label-position="labelPosition" label-width="80px" :model="formLabelAlign">
            <el-form-item label="文章标题">
                <el-input v-model="formLabelAlign.name"></el-input>
            </el-form-item>
            <el-form-item label="展示图">
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
            <el-form-item label="标签">
                <el-radio-group v-model="cat" size="medium" @change="change">
                    <el-radio-button label="1" >前端</el-radio-button>
                    <el-radio-button label="2">后台</el-radio-button>
                    <el-radio-button label="3">工具</el-radio-button>
                    <el-radio-button label="4">程序员</el-radio-button>
                    <el-radio-button label="5">Yoo说说</el-radio-button>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="发布时间">
                <el-date-picker type="date" placeholder="2019-05-16" v-model="formLabelAlign.date1" style="width: 100%;"></el-date-picker>
            </el-form-item>
            <el-form-item label="浏览数">
                <el-input v-model="formLabelAlign.juejing" disabled></el-input>
            </el-form-item>
            <el-form-item label="分享数">
                <el-input v-model="formLabelAlign.juejing" disabled></el-input>
            </el-form-item>
            <el-form-item label="作者">
                <el-input v-model="formLabelAlign.juejing"></el-input>
            </el-form-item>
            <el-form-item label="公开">
                <el-tooltip :content="'Switch value: 公开'" placement="top">
                    <el-switch
                        v-model="formLabelAlign.value5"
                        active-color="#13ce66"
                        inactive-color="#ff4949"
                        active-value="1"
                        inactive-value="0">
                    </el-switch>
                </el-tooltip>
            </el-form-item>
            <el-form-item label="内容" style="width: 1080px">
                <editor api-key="kibwgch7m4xlt7u7t27us16okomv7563yzzfs4eqe9cl5kzf" v-model="tinyHtml" :init="editorInit"></editor>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="submitForm('ruleForm')">立即保存</el-button>
                <el-button @click="resetForm('ruleForm')">重置</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
    import headTop from '../../../components/headTop'
    import {mapState} from 'vuex'
    import {baseUrl, baseImgPath} from '@/config/env'
    import Editor from '@tinymce/tinymce-vue'
    export default {
    	data(){
    		return {
                baseUrl,
                baseImgPath,
                labelPosition: 'right',
                tinyHtml:'<html>\n' +
                    '<head>\n' +
                    '  <style>\n' +
                    '    body, td {\n' +
                    '      font-family: 微软雅黑;\n' +
                    '      font-size: 10pt;\n' +
                    '    }\n' +
                    '  </style>\n' +
                    '</head>\n' +
                    '<body>\n' +
                    '<a name="509"/>\n' +
                    '\n' +
                    '<div>\n' +
                    '<span><div><span style="font-size: 19px;"><span style="color: rgb(65, 173, 28);"><span style="color: rgb(227, 0, 0);">Table:</span> </span></span></div><div style="box-sizing: border-box; padding: 8px; font-family: Monaco, Menlo, Consolas, \'Courier New\', monospace; color: rgb(51, 51, 51); border-top-left-radius: 4px; border-top-right-radius: 4px; border-bottom-right-radius: 4px; border-bottom-left-radius: 4px; background-color: rgb(251, 250, 248); border: 1px solid rgba(0, 0, 0, 0.14902);"><div><span style="font-size: 16px;">A relational database consist of a collection of tables,</span></div><div><span style="font-size: 16px;">each of which is assigned a unique name.</span></div></div><div><br/></div><div><span style="font-size: 19px;"><span style="color: rgb(227, 0, 0);">Relation:</span></span></div><div style="box-sizing: border-box; padding: 8px; font-family: Monaco, Menlo, Consolas, \'Courier New\', monospace; color: rgb(51, 51, 51); border-top-left-radius: 4px; border-top-right-radius: 4px; border-bottom-right-radius: 4px; border-bottom-left-radius: 4px; background-color: rgb(251, 250, 248); border: 1px solid rgba(0, 0, 0, 0.14902);"><div><span style="font-size: 16px;">In the relational model the term relation is used to</span></div><div><span style="font-size: 16px;">refer to a table.</span></div></div><div><br/></div><div><span style="font-size: 19px;"><span style="color: rgb(227, 0, 0);">Tuple:</span></span></div><div style="box-sizing: border-box; padding: 8px; font-family: Monaco, Menlo, Consolas, \'Courier New\', monospace; color: rgb(51, 51, 51); border-top-left-radius: 4px; border-top-right-radius: 4px; border-bottom-right-radius: 4px; border-bottom-left-radius: 4px; background-color: rgb(251, 250, 248); border: 1px solid rgba(0, 0, 0, 0.14902);"><div><span style="font-size: 16px;">In the relational model the term tuple is used to a row.</span></div></div><div><span style="font-size: 19px;"><br/></span></div><div><span style="font-size: 19px;"><span style="color: rgb(227, 0, 0);">Attribute:</span></span></div><div style="box-sizing: border-box; padding: 8px; font-family: Monaco, Menlo, Consolas, \'Courier New\', monospace; color: rgb(51, 51, 51); border-top-left-radius: 4px; border-top-right-radius: 4px; border-bottom-right-radius: 4px; border-bottom-left-radius: 4px; background-color: rgb(251, 250, 248); border: 1px solid rgba(0, 0, 0, 0.14902);"><div><span style="font-size: 16px;">In the relational model the term attribute refers to</span></div><div><span style="font-size: 16px;">a column of a table.</span></div></div><div><br/></div><div><span style="font-size: 19px;"><span style="color: rgb(227, 0, 0);">Domain: </span></span></div><div style="box-sizing: border-box; padding: 8px; font-family: Monaco, Menlo, Consolas, \'Courier New\', monospace; color: rgb(51, 51, 51); border-top-left-radius: 4px; border-top-right-radius: 4px; border-bottom-right-radius: 4px; border-bottom-left-radius: 4px; background-color: rgb(251, 250, 248); border: 1px solid rgba(0, 0, 0, 0.14902);"><div><span style="font-size: 16px;">For each attribute of a relation, there is a set of permitted values,</span></div><div><span style="font-size: 16px;">called the domain of that attribute.</span></div></div><div><span style="font-size: 19px;"><br/></span></div><div><span style="font-size: 19px;"><span style="color: rgb(227, 0, 0);">Atomic domain: </span></span></div><div style="box-sizing: border-box; padding: 8px; font-family: Monaco, Menlo, Consolas, \'Courier New\', monospace; color: rgb(51, 51, 51); border-top-left-radius: 4px; border-top-right-radius: 4px; border-bottom-right-radius: 4px; border-bottom-left-radius: 4px; background-color: rgb(251, 250, 248); border: 1px solid rgba(0, 0, 0, 0.14902);"><div><span style="font-size: 16px;">elements of the domain are considered to be indivisible units.</span></div></div><div><span style="font-size: 19px;"><br/></span></div><div><span style="font-size: 19px;"><span style="color: rgb(227, 0, 0);">Null value:</span></span></div><div style="box-sizing: border-box; padding: 8px; font-family: Monaco, Menlo, Consolas, \'Courier New\', monospace; color: rgb(51, 51, 51); border-top-left-radius: 4px; border-top-right-radius: 4px; border-bottom-right-radius: 4px; border-bottom-left-radius: 4px; background-color: rgb(251, 250, 248); border: 1px solid rgba(0, 0, 0, 0.14902);"><div><span style="font-size: 16px;">It is a special value that signifies that the value is unknown or does not exist.</span></div></div><div><span style="font-size: 19px;"><br/></span></div><div><span style="font-size: 19px;"><span style="color: rgb(227, 0, 0);">Database Schema: </span></span></div><div style="box-sizing: border-box; padding: 8px; font-family: Monaco, Menlo, Consolas, \'Courier New\', monospace; color: rgb(51, 51, 51); border-top-left-radius: 4px; border-top-right-radius: 4px; border-bottom-right-radius: 4px; border-bottom-left-radius: 4px; background-color: rgb(251, 250, 248); border: 1px solid rgba(0, 0, 0, 0.14902);"><div><span style="font-size: 16px;">It is the logical design of the database, and the database instance.</span></div></div><div><span style="font-size: 19px;"><br/></span></div><div><span style="font-size: 19px;"><span style="color: rgb(227, 0, 0);">Database instance:</span></span></div><div style="box-sizing: border-box; padding: 8px; font-family: Monaco, Menlo, Consolas, \'Courier New\', monospace; color: rgb(51, 51, 51); border-top-left-radius: 4px; border-top-right-radius: 4px; border-bottom-right-radius: 4px; border-bottom-left-radius: 4px; background-color: rgb(251, 250, 248); border: 1px solid rgba(0, 0, 0, 0.14902);"><div><span style="font-size: 16px;">It is snapshot of the data in the database at a given instant in time.</span></div></div><div><span style="font-size: 19px;"><br/></span></div><div><span style="font-size: 19px;"><span style="color: rgb(227, 0, 0);">Relation schema:</span></span></div><div style="box-sizing: border-box; padding: 8px; font-family: Monaco, Menlo, Consolas, \'Courier New\', monospace; color: rgb(51, 51, 51); border-top-left-radius: 4px; border-top-right-radius: 4px; border-bottom-right-radius: 4px; border-bottom-left-radius: 4px; background-color: rgb(251, 250, 248); border: 1px solid rgba(0, 0, 0, 0.14902);"><div><span style="font-size: 16px;">It corresponds to the programming-language notion of type definition.</span></div></div><div><span style="font-size: 19px;"><br/></span></div><div><span style="font-size: 19px;"><span style="color: rgb(227, 0, 0);">Relation instance:</span></span></div><div style="box-sizing: border-box; padding: 8px; font-family: Monaco, Menlo, Consolas, \'Courier New\', monospace; color: rgb(51, 51, 51); border-top-left-radius: 4px; border-top-right-radius: 4px; border-bottom-right-radius: 4px; border-bottom-left-radius: 4px; background-color: rgb(251, 250, 248); border: 1px solid rgba(0, 0, 0, 0.14902);"><div><span style="font-size: 16px;">The concept of a relation instance corresponds to the programming-language</span></div><div><span style="font-size: 16px;">notion of a value of a variable.</span></div></div><div><span style="font-size: 19px;"><br/></span></div><div><span style="font-size: 19px;"><span style="color: rgb(227, 0, 0);">Keys:</span></span></div><div style="box-sizing: border-box; padding: 8px; font-family: Monaco, Menlo, Consolas, \'Courier New\', monospace; color: rgb(51, 51, 51); border-top-left-radius: 4px; border-top-right-radius: 4px; border-bottom-right-radius: 4px; border-bottom-left-radius: 4px; background-color: rgb(251, 250, 248); border: 1px solid rgba(0, 0, 0, 0.14902);"><div><span style="font-size: 16px;">The values of the attribute values of a tuple must be such that they can</span></div><div><span style="font-size: 16px;">uniquely identify the tuple.</span></div></div><div><br/></div><div><span style="font-size: 19px;"><br/></span></div><div><span style="font-size: 19px;"><span style="color: rgb(227, 0, 0);">Superkey:</span></span></div><div style="box-sizing: border-box; padding: 8px; font-family: Monaco, Menlo, Consolas, \'Courier New\', monospace; color: rgb(51, 51, 51); border-top-left-radius: 4px; border-top-right-radius: 4px; border-bottom-right-radius: 4px; border-bottom-left-radius: 4px; background-color: rgb(251, 250, 248); border: 1px solid rgba(0, 0, 0, 0.14902);"><div><span style="font-size: 16px;">It is a set of one or more attributes that, taken collectively, allow us</span></div><div><span style="font-size: 16px;">to identify uniquely a tuple in the relation.</span></div></div><div><span style="font-size: 19px;"><br/></span></div><div><span style="font-size: 19px;"><span style="color: rgb(227, 0, 0);">Candidate key:</span></span></div><div style="box-sizing: border-box; padding: 8px; font-family: Monaco, Menlo, Consolas, \'Courier New\', monospace; color: rgb(51, 51, 51); border-top-left-radius: 4px; border-top-right-radius: 4px; border-bottom-right-radius: 4px; border-bottom-left-radius: 4px; background-color: rgb(251, 250, 248); border: 1px solid rgba(0, 0, 0, 0.14902);"><div><span style="font-size: 16px;">We are often interested in superkeys for which no proper subset is a superkey.</span></div><div><span style="font-size: 16px;">Such minimal superkeys are called Candidate keys.</span></div></div><div><span style="font-size: 19px;"><br/></span></div><div><span style="font-size: 19px;"><span style="color: rgb(227, 0, 0);">Primary key:</span></span></div><div style="box-sizing: border-box; padding: 8px; font-family: Monaco, Menlo, Consolas, \'Courier New\', monospace; color: rgb(51, 51, 51); border-top-left-radius: 4px; border-top-right-radius: 4px; border-bottom-right-radius: 4px; border-bottom-left-radius: 4px; background-color: rgb(251, 250, 248); border: 1px solid rgba(0, 0, 0, 0.14902);"><div><span style="font-size: 16px;">It is chosen by the database designer as the principal means of identifying</span></div><div><span style="font-size: 16px;">tuples within a relation.</span></div></div><div><span style="font-size: 19px;"><br/></span></div><div><span style="font-size: 19px;"><span style="color: rgb(227, 0, 0);">Foreign key:</span></span></div><div style="box-sizing: border-box; padding: 8px; font-family: Monaco, Menlo, Consolas, \'Courier New\', monospace; color: rgb(51, 51, 51); border-top-left-radius: 4px; border-top-right-radius: 4px; border-bottom-right-radius: 4px; border-bottom-left-radius: 4px; background-color: rgb(251, 250, 248); border: 1px solid rgba(0, 0, 0, 0.14902);"><div><span style="font-size: 16px;">A relation may include among its attributes the primaery key of another relation.</span></div></div><div><span style="font-size: 19px;"><br/></span></div><div><b><span style="color: rgb(227, 0, 0);">参照关系：</span></b></div><div><br/></div><div style="box-sizing: border-box; padding: 8px; font-family: Monaco, Menlo, Consolas, \'Courier New\', monospace; color: rgb(51, 51, 51); border-top-left-radius: 4px; border-top-right-radius: 4px; border-bottom-right-radius: 4px; border-bottom-left-radius: 4px; background-color: rgb(251, 250, 248); border: 1px solid rgba(0, 0, 0, 0.14902);"><div><span style="font-size: 16px;">A foreign key from r1, referencing r2. The relation r1 is also called the referencing</span></div><div><span style="font-size: 16px;">relation of the foreign key dependency, and r2 is also called the referenced relation</span></div><div><span style="font-size: 16px;">of the foreign key.</span></div></div><div><br/></div><div><span style="color: rgb(227, 0, 0);"><span style="font-size: 19px;">Referential integrity constraint:</span></span></div><div style="box-sizing: border-box; padding: 8px; font-family: Monaco, Menlo, Consolas, \'Courier New\', monospace; color: rgb(51, 51, 51); border-top-left-radius: 4px; border-top-right-radius: 4px; border-bottom-right-radius: 4px; border-bottom-left-radius: 4px; background-color: rgb(251, 250, 248); border: 1px solid rgba(0, 0, 0, 0.14902);"><div><span style="font-size: 16px;">the values appearing in specified attributes of any tuple in the referencing relation</span></div><div><span style="font-size: 16px;">also appear in specified attribute of at least one tuple in the referenced relation.</span></div></div><div><br/></div><div><span style="color: rgb(227, 0, 0);"><span style="font-size: 19px;">Schema diagram: </span></span></div><div style="box-sizing: border-box; padding: 8px; font-family: Monaco, Menlo, Consolas, \'Courier New\', monospace; color: rgb(51, 51, 51); border-top-left-radius: 4px; border-top-right-radius: 4px; border-bottom-right-radius: 4px; border-bottom-left-radius: 4px; background-color: rgb(251, 250, 248); border: 1px solid rgba(0, 0, 0, 0.14902);"><div><span style="font-size: 16px;">A database schema, along with primary key and foreign key dependencies, can be depicted</span></div><div><span style="font-size: 16px;">by schema diagrams.</span><span style="font-size: 16px;">Query language: It is language in which a user requests information</span></div><div><span style="font-size: 16px;">from the database .</span></div></div><div><br/></div><div><span style="font-size: 19px;"><span style="color: rgb(227, 0, 0);">Procedual language:</span></span></div><div style="box-sizing: border-box; padding: 8px; font-family: Monaco, Menlo, Consolas, \'Courier New\', monospace; color: rgb(51, 51, 51); border-top-left-radius: 4px; border-top-right-radius: 4px; border-bottom-right-radius: 4px; border-bottom-left-radius: 4px; background-color: rgb(251, 250, 248); border: 1px solid rgba(0, 0, 0, 0.14902);"><div><span style="font-size: 16px;">The user instructs the system to perform a sequence of operations on the database to</span></div><div><span style="font-size: 16px;">compute the desired result.</span></div></div><div><span style="font-size: 19px;"><br/></span></div><div><span style="font-size: 19px;"><span style="color: rgb(227, 0, 0);">Nonprocedual language:</span></span></div><div style="box-sizing: border-box; padding: 8px; font-family: Monaco, Menlo, Consolas, \'Courier New\', monospace; color: rgb(51, 51, 51); border-top-left-radius: 4px; border-top-right-radius: 4px; border-bottom-right-radius: 4px; border-bottom-left-radius: 4px; background-color: rgb(251, 250, 248); border: 1px solid rgba(0, 0, 0, 0.14902);"><div><span style="font-size: 16px;">The user describes the desired information without giving specific procedure for</span></div><div><span style="font-size: 16px;">obtaining that information.</span></div></div><div><span style="font-size: 19px;"><br/></span></div><div><span style="font-size: 19px;"><span style="color: rgb(227, 0, 0);">Operations on relations:</span></span></div><div style="box-sizing: border-box; padding: 8px; font-family: Monaco, Menlo, Consolas, \'Courier New\', monospace; color: rgb(51, 51, 51); border-top-left-radius: 4px; border-top-right-radius: 4px; border-bottom-right-radius: 4px; border-bottom-left-radius: 4px; background-color: rgb(251, 250, 248); border: 1px solid rgba(0, 0, 0, 0.14902);"><div><span style="font-size: 16px;">All procedual relational query language provide a st of operations that canbe applied</span></div><div><span style="font-size: 16px;">to either a single relation or a pair of relations.</span></div></div><div><span style="font-size: 19px;"><br/></span></div><div><span style="font-size: 19px;"><span style="color: rgb(227, 0, 0);">Selection of tuples:</span></span></div><div style="box-sizing: border-box; padding: 8px; font-family: Monaco, Menlo, Consolas, \'Courier New\', monospace; color: rgb(51, 51, 51); border-top-left-radius: 4px; border-top-right-radius: 4px; border-bottom-right-radius: 4px; border-bottom-left-radius: 4px; background-color: rgb(251, 250, 248); border: 1px solid rgba(0, 0, 0, 0.14902);"><div><span style="font-size: 16px;">It satisfies some particular predicate.</span></div></div><div><span style="font-size: 19px;"><br/></span></div><div><span style="font-size: 19px;"><span style="color: rgb(227, 0, 0);">Selection of attributes:</span></span></div><div style="box-sizing: border-box; padding: 8px; font-family: Monaco, Menlo, Consolas, \'Courier New\', monospace; color: rgb(51, 51, 51); border-top-left-radius: 4px; border-top-right-radius: 4px; border-bottom-right-radius: 4px; border-bottom-left-radius: 4px; background-color: rgb(251, 250, 248); border: 1px solid rgba(0, 0, 0, 0.14902);"><div><span style="font-size: 16px;">It is to select certain attributes (columns) from a relation. The result is a new relation</span></div><div><span style="font-size: 16px;">having only those selected attributes.</span></div></div><div><span style="font-size: 19px;"><br/></span></div><div><span style="font-size: 19px;"><span style="color: rgb(227, 0, 0);">Natural join:</span></span></div><div style="box-sizing: border-box; padding: 8px; font-family: Monaco, Menlo, Consolas, \'Courier New\', monospace; color: rgb(51, 51, 51); border-top-left-radius: 4px; border-top-right-radius: 4px; border-bottom-right-radius: 4px; border-bottom-left-radius: 4px; background-color: rgb(251, 250, 248); border: 1px solid rgba(0, 0, 0, 0.14902);"><div><span style="font-size: 16px;">The natural join operation on two relations matches tuples whose values are the same on all</span></div><div><span style="font-size: 16px;">attribute names that are common to both relations.</span></div></div><div><span style="font-size: 19px;"><br/></span></div><div><span style="font-size: 19px;"><span style="color: rgb(227, 0, 0);">Cartesian product:</span></span></div><div style="box-sizing: border-box; padding: 8px; font-family: Monaco, Menlo, Consolas, \'Courier New\', monospace; color: rgb(51, 51, 51); border-top-left-radius: 4px; border-top-right-radius: 4px; border-bottom-right-radius: 4px; border-bottom-left-radius: 4px; background-color: rgb(251, 250, 248); border: 1px solid rgba(0, 0, 0, 0.14902);"><div><span style="font-size: 16px;">It combines tuples from two relations, but unlike the join operation, its result contains all</span></div><div><span style="font-size: 16px;">pairs of the tuples from the two relations, regardless of whether their attribute values match.</span></div></div><div><span style="font-size: 19px;"><br/></span></div><div><span style="font-size: 19px;"><span style="color: rgb(227, 0, 0);">Set operations:</span></span></div><div style="box-sizing: border-box; padding: 8px; font-family: Monaco, Menlo, Consolas, \'Courier New\', monospace; color: rgb(51, 51, 51); border-top-left-radius: 4px; border-top-right-radius: 4px; border-bottom-right-radius: 4px; border-bottom-left-radius: 4px; background-color: rgb(251, 250, 248); border: 1px solid rgba(0, 0, 0, 0.14902);"><div><span style="font-size: 16px;">It performs a set union of two “similary structured” tables.</span></div></div><div><span style="font-size: 19px;"><br/></span></div><div><span style="font-size: 19px;"><span style="color: rgb(227, 0, 0);">Relational algebra:</span> </span></div><div style="box-sizing: border-box; padding: 8px; font-family: Monaco, Menlo, Consolas, \'Courier New\', monospace; color: rgb(51, 51, 51); border-top-left-radius: 4px; border-top-right-radius: 4px; border-bottom-right-radius: 4px; border-bottom-left-radius: 4px; background-color: rgb(251, 250, 248); border: 1px solid rgba(0, 0, 0, 0.14902);"><div><span style="font-size: 16px;">It provides a set of operations that take one or more relations as input and return a relation</span></div><div><span style="font-size: 16px;">as an output.</span></div></div><div><span style="font-size: 19px;"><br/></span></div><div><span style="color: rgb(222, 87, 0);"><span style="font-size: 16px;">2.2</span> Consider the foreign key constraint from the dept name attribute of instructorto the departmentrelation. Give examples of inserts and deletes to these                           relations, which can cause a violation of the foreign key constraint.</span></div><div><span style="color: rgb(222, 87, 0);"><br/></span></div><div><span style="color: rgb(227, 0, 0);">• Inserting a tuple:</span> (10111, Ostrom, Economics, 110,000) into the instructor table, where the department table does not have the department Economics, would violate the foreign key constraint.</div><div><span style="color: rgb(227, 0, 0);">• Deleting the tuple:</span> (Biology, Watson, 90000) from the department table, where at least one student or instructor tuple has dept name as Biology, would violate the foreign key constraint. employee (person name, street, city) works (person name, company name, salary) company (company name, city).</div><div><br/></div><div><span style="color: rgb(222, 87, 0);"><span style="font-size: 16px;">2.10</span> Consider the advisor relation shown in Figure 2.8, with s id as the primary key of advisor. Suppose a student can have more than one advisor. Then, would s id still be a primary key of the advisor relation? If not, what should the primary key of advisor be?</span></div><div><span style="color: rgb(222, 87, 0);"><br/></span></div><div><span style="color: rgb(227, 0, 0);">No, s id would not be a primary key, since there may be two (or more) tuples for a single student, corresponding to two (or more) advisors. The primary key should then be s id, i id.</span></div><div><span style="font-size: 19px;"><br/></span></div><div><span style="font-size: 19px;"><br/></span></div><div><span style="font-size: 19px;"><br/></span></div><div><span style="font-size: 19px;"><br/></span></div><div><span style="font-size: 19px;"><br/></span></div><div><span style="font-size: 19px;"><br/></span></div><div><span style="font-size: 19px;"><br/></span></div><div><span style="font-size: 19px;"><br/></span></div><div><span style="font-size: 19px;"><br/></span></div><div><span style="font-size: 19px;"><br/></span></div><div><span style="font-size: 19px;"><br/></span></div><div><span style="font-size: 19px;"><br/></span></div></span>\n' +
                    '</div></body></html> ',
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
                formLabelAlign: {
                    name: 'Yoo',
                    saying: '这雨量，不及我眼里一份！常即日暮他们都没有说清楚JS的基本类型有哪些。而且往往错误的说了一些C语言的数据类型',
                    github: 'https://github.com/Alvin9999/new-pac/wiki/ss%E5%85%8D%E8%B4%B9%E8%B4%A6%E5%8F%B7',
                    juejing: 0,
                    about:'',
                    value5:true
                }
    		}
    	},
        computed: {
            ...mapState(['adminInfo']),
        },
    	components: {
    		headTop,
            Editor
    	},
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
