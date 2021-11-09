import axios from 'axios'

export const getPipelines = (namespace, name) => {
  /**
   * 返回符合要求的pipeline列表
   * 1. user为空 返回空列表；
   * 2. user不为空且namespace为空返回user对应的所有记录；
   * 3. user和namespace不为空且name为空，返回user和namespace对应的所有记录；
   * 4. 都不为空返回精确查找的记录。
   * 其中user默认值为“default”
   *
   * 参数：
   * · user, string
   * · namespace, string
   * · name, string
   *
   * 参数格式：
   * · URL末尾添加
   */
  return axios({
    url: this.GLOBAL.dataUrl + '/pipelines',
    method: 'get',
    withCredentials: true,
    params: {
      namespace: namespace,
      name: name
    }
  })
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
  return axios.request({
    url: dataUrl + '/pipelines/:id',
    method: 'get'
  })
}

/**
 * 创建 pipeline
 * @param params
 * {
 *   //必选参数
 *   “PipelineName”: 'a',
 *   'PipelineNamespace': '24344556467532b',
 *   //可选参数
 *   'UserName': 'x',
 *   'PipelineDescription': 'x'
 * }
 * @returns {AxiosPromise}
 */
export const addPipeline = (params) => {
  return axios.request({
    headers: {
      'Content-Type': 'application/json'
    },
    url: dataUrl + `/pipelines/`,
    method: 'post',
    data: {
      // 必选参数
      PipelineName: params.PipelineName,
      PipelineNamespace: params.PipelineNamespace,
      // 可选参数
      PipelineDescription: params.PipelineDescription,
      PipelineGlobalParams: params.PipelineGlobalParams
    }
  })
}

/**
 * 删除指定 id 的 pipeline
 *
 * 参数：
 * · id, string
 *
 * 参数格式：
 * · URL末尾添加
 */
export const delPipelineById = (id) => {
  return axios.request({
    url: dataUrl + `/pipelines/${id}`,
    method: 'delete'
  })
}

/**
 * 对 pipeline 执⾏操作
 *
 * 参数：
 * · op, string, 支持 'start' 和 'stop' ，在URL末尾添加
 *
 * 参数格式：
 * · URL末尾添加
 */
export const uploadPipelineById = (id) => {
  return axios.request({
    url: dataUrl + `/pipelines/${id}`,
    method: 'put'
  })
}

/**
 * 修改指定 id 的 pipeline
 *
 * 参数：
 * {
 *   //必选参数
 *   “PipelineName”: 'a',
 *   'PipelineNamespace': '24344556467532b',
 *   //可选参数
 *   'UserName': 'x',
 *   'PipelineDescription': 'x'
 * }
 *
 * 参数格式：
 * · json
 * · 跟随请求路径
 */
export const modifyPipeline = (id) => {
  return axios.request({
    url: dataUrl + `/pipelines/${id}`,
    method: 'patch'
  })
}

// TODO item
export const getItem = (id) => {
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
    url: dataUrl + `/pipelines/${id}/items`,
    method: 'get',
    withCredentials: true
  })
}

/**
 * 在指定 pipeline 下的创建一组模组
 *
 * 参数：
 * [
 *   {
 *      //必选参数
 *      “Name”: 'x',
 *      'Namespace': 'xx',
 *      'ImageId': 1,
 *      'OperatorId': 1,
 *      //可选参数
 *      'ObjectDataId': 1,
 *      'Params': {}
 *   }
 * ]
 *
 * 参数格式：
 * · json
 * · 跟随请求路径
 */
export const addItem = (id) => {
  return axios.request({
    url: dataUrl + `/pipelines/${id}/items`,
    method: 'post'
  })
}

/**
 * 在指定 pipeline 下的更新一组模组
 * @param id
 * @returns {*}
 */
export const modifyItem = (id) => {
  return axios.request({
    url: dataUrl + `/pipelines/${id}/items`,
    method: 'patch'
  })
}
