import Mock from 'mockjs'
import { doCustomTimes } from '@/libs/util'
import { pipelinesData } from './data/pipeline-data'
// const Random = Mock.Random

export const getPipelines = (user, namespace, name) => {
  // let tableData = []
  // doCustomTimes(5, () => {
  //   tableData.push(Mock.mock({
  //     name: '@name',
  //     email: '@email',
  //     createTime: '@date',
  //     Id: Random.integer(60, 100)
  //   }))
  // })
  return pipelinesData
}

export const getPipelineById = (id) => {
  /**
   * 返回指定 id 的 pipeline
   *
   * 参数：
   * · id, string
   *
   * 参数格式：
   * · 跟随请求路径
   */
  let data = []
  doCustomTimes(5, () => {
    tableData.push(Mock.mock({
      name: '@name',
      email: '@email',
      createTime: '@date',
      Id: Random.integer(60, 100)
    }))
  })
  return data
}

export const addPipeline = () => {
  /**
   * 创建 pipeline
   *
   * 参数：
   * {
   *   //必选参数
   *   “PipelineName”: "a",
   *   "PipelineNamespace": "24344556467532b",
   *   //可选参数
   *   "UserName": "x",
   *   "PipelineDescription": "x"
   * }
   *
   * 参数格式：
   * · json
   */
  return axios.request({
    url: '/pipelines',
    method: 'post'
  })
}

export const delPipelineById = (id) => {
  /**
   * 删除指定 id 的 pipeline
   *
   * 参数：
   * · id, string
   *
   * 参数格式：
   * · URL末尾添加
   */
  return axios.request({
    url: '/pipelines/:id',
    method: 'delete'
  })
}

export const uploadPipelineById = (id) => {
  /**
   * 对 pipeline 执⾏操作
   *
   * 参数：
   * · op, string, 支持 "start" 和 "stop" ，在URL末尾添加
   *
   * 参数格式：
   * · URL末尾添加
   */
  return axios.request({
    url: '/pipelines/:id',
    method: 'put'
  })
}

export const modifyPipeline = (id) => {
  /**
   * 修改指定 id 的 pipeline
   *
   * 参数：
   * {
   *   //必选参数
   *   “PipelineName”: "a",
   *   "PipelineNamespace": "24344556467532b",
   *   //可选参数
   *   "UserName": "x",
   *   "PipelineDescription": "x"
   * }
   *
   * 参数格式：
   * · json
   * · 跟随请求路径
   */
  return axios.request({
    url: '/pipelines/:id',
    method: 'patch'
  })
}

// TODO item
export const getItemById = (id) => {
  /**
   * 返回指定 pipeline 下的所有模组
   *
   * 参数：
   * · id, string
   *
   * 参数格式：
   * · 跟随请求路径
   */
  return axios.request({
    url: '/pipelines/:id/items',
    method: 'get'
  })
}

export const addItemById = (id) => {
  /**
   * 在指定 pipeline 下的创建一组模组
   *
   * 参数：
   * [
   *   {
   *      //必选参数
   *      “Name”: "x",
   *      "Namespace": "xx",
   *      "ImageId": 1,
   *      "OperatorId": 1,
   *      //可选参数
   *      "ObjectDataId": 1,
   *      "Params": {}
   *   }
   * ]
   *
   * 参数格式：
   * · json
   * · 跟随请求路径
   */
  return axios.request({
    url: '/pipelines/:id/items',
    method: 'post'
  })
}

export const modifyItemById = (id) => {
  /**
   * 在指定 pipeline 下的更新一组模组
   *
   * 参数：
   * [
   *   {
   *      //必选参数
   *      “Name”: "x",
   *      "Namespace": "xx",
   *      "ImageId": 1,
   *      "OperatorId": 1,
   *      //可选参数
   *      "ObjectDataId": 1,
   *      "Params": {}
   *   }
   * ]
   *
   * 参数格式：
   * · json
   * · 跟随请求路径
   */
  return axios.request({
    url: '/pipelines/:id/items',
    method: 'patch'
  })
}
