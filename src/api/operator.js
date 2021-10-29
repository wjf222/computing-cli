import axios from '@/libs/api.request'

export const getOperators = (tag, namespace, name) => {
  /**
   *   返回Operators全量数据

   功能
   1. 返回符合要求的 operator 列表，namespace 为空返回空列表；
   2. namespace 不为空且 name 为空返回 namespace 对应的所有记录；
   3. namespace 和 name 不为空且 tag 为空返回 namespace 和 name 对应的所有记录；
   4. 都不为空返回精确查找的记录；

   参数：
   • tag, string
   • namespace, string
   • name, string

   参数格式：
   URL末尾添加
   */
  return axios.request({
    url: '/operators',
    method: 'get'
  })
}

export const getOperatorById = (id) => {
  /**
   根据id检索指定operator

   功能
   1. 返回指定Id的operator

   参数：
   • id, string

   参数格式：
   跟随请求路径
   */
  return axios.request({
    url: '/operators',
    method: 'get'
  })
}

export const addOperator = () => {
  /**
  创建 operator

  功能
    1. 创建 operator

  参数：
    {
    // 必选参数
      "OperatorName": "a",
      "OperatorNamespace": "24344556467532b",
      "OperatorTag": "x"
      // 可选参数
      "OperatorMainClass": "x"
      "OperatorRuntimeType": "x"
      "OperatorDescription": "x"
    }

  参数格式：
    · Post
   */
  return axios.request({
    url: '/operators/:id',
    method: 'post'
  })
}

export const uploadOperatorById = (id, upload_file) => {
  /**
  上传 operator

  功能
    1. 上传 operator

  参数：
    • id, string
    · upload_file

  参数格式：
    · form-data + URL末尾添加
   */
  return axios.request({
    url: '/operators/:id',
    method: 'put'
  })
}

export const delOperatorById = (id) => {
  /**
  删除指定的 operator

  功能
    1. 上传 operator

  参数：
    • id, string
    · upload_file

  参数格式：
    · form-data + URL末尾添加
   */
  return axios.request({
    url: '/operators/:id',
    method: 'delete'
  })
}
