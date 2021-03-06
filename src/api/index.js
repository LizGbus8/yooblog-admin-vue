import ajax from './ajax'

const BASE_URL = 'http://localhost:8001/manage';


//请求最近文章
export const getBlogger = (params) => ajax(BASE_URL + '/blogger', params);


//保存个人信息
export const saveBlogger = (params) => ajax(BASE_URL + '/blogger', params,'POST');

//获取标签列表
export const getTagList = () => ajax(BASE_URL + '/tags');

//保存标签
export const saveTag = (params) => ajax(BASE_URL + '/tag', params, 'POST');

//标签条件查询
export const selectTag = (params) => ajax(BASE_URL + '/tag', params);

//文章列表
export const getArticles = (params) => ajax(BASE_URL + '/articles', params);

//文章
export const getArticle = (params) => ajax(BASE_URL + `/article/${params}`);

//保存文章
export const saveArticle = (params) => ajax(BASE_URL + '/article', params, 'POST');

//标签条件查询
export const selectArticle = (params) => ajax(BASE_URL + '/article', params);

//归档列表
export const getRecords = (params) => ajax(BASE_URL + '/records', params);

//保存归档
export const saveRecord = (params) => ajax(BASE_URL + '/record', params, 'POST');

//标签条件查询
export const selectRecord = (params) => ajax(BASE_URL + '/record', params);

//留言列表
export const getTalks = (params) => ajax(BASE_URL + '/talks', params);

//子回复列表
export const getReplies = (params) => ajax(BASE_URL + '/replies', params);

