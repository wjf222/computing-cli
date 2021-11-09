<template>
    <div>
        <Card>
            <p class="card-title">爬虫数据导入</p>
            <hr/>
            <br/>
            <br/>
              <Row>
                  <Col span="4" offset="2"><input type="file" ref="clearFile" @change="getFile($event)" class="add-file-right-input" accept=".xlsx"></Col>
                  <Col span="4" offset="2"><Button type="primary" @click="submitAddFile">上传</Button></Col>
                  <Col span="4" offset="2"><Button type="primary" :disabled="downloadFlag" @click="downloadLog">日志文件下载</Button></Col>
              </Row>
        </Card>
    </div>
</template>
<script>
// eslint-disable-next-line no-unused-vars
import axios from 'axios'
import global_ from '../../Global.vue'
export default {
  name: 'crawl',
  data () {
    var uploadUrl =   global_.BASE_URL  + '/AIOPS-CRAWL/upload'
    console.log(uploadUrl)
    return {
      addArr: [],
      downloadFlag: false
    }
  },
  methods: {
    getFile: function(event){
        var file = event.target.files;
        for(var i = 0; i < file.length; i++){
            // 上传类型判断
            var fileName = file[i].name;
            var idx = fileName.lastIndexOf(".");
            if(idx != -1){
                var ext = fileName.substr(idx+1).toUpperCase();
                ext = ext.toLowerCase();
                if(ext != 'xls' && ext != 'xlsx'){

                }else{
                    this.addArr.push(file[i])
                }
            }
        }
    },
    submitAddFile: function(){
        // 确保已经选择文件
        if( 0 == this.addArr.length){
            this.$Message.info('请先选择文件！')
            return ;
        }
        // 构建formData 用于传输文件
        var formData = new FormData();
        // 使得每一个传输的文件的名字都为固定的data.xlsx
        formData.append('fileName',"data.xlsx");
        if(this.addArr.length !== 0){
            this.addArr = new Array(this.addArr.pop())
            formData.append('file',this.addArr[0])
        }
        
        let headers = {
                'Content-Type' : 'multipart/form-data',
                'Authorization': this.token
            }
        let that = this
        axios({
            method: 'post',
            headers: headers,
            url: '/AIOPS-CRAWL/upload',
            data: formData
        }).then(function(response){
            if(response.data.status_code === 0){
                that.$Message.success('附件上传成功！')
                that.downloadFlag = true
            }
        })
    },
    downloadByBlob: function(data, fileType, fileName){
        try {
            const conent = data
            const blob = new Blob([conent])
            console.log(blob)
            const link = document.createElement('a')
            link.download = fileName
            link.style.display = 'none'
            link.href = URL.createObjectURL(blob)
            document.body.appendChild(link)
            link.click()
            URL.revokeObjectURL(link.href)
            document.body.removeChild(link)
        } catch (error) {
            console.error('download function error!', error);
        }
    },
    downloadLog: function(){
        // 发起请求，下载日志文件
        let that = this
        let fileType = 'log'
        let fileName = 'csv_to_mysql'
        axios({
            method: 'get',
            url: '/AIOPS-CRAWL/download_log',
            responseType: 'blob'
        }).then(function(res){
            let data = res.data
            that.downloadByBlob(data,fileType,fileName)
        })
    }
  },
  created: function () {
    
  }
}
</script>

<style scoped>
.card-title{
    font-family: "Helvetica Neue",Helvetica,"PingFang SC","Hiragino Sans GB","Microsoft YaHei","微软雅黑",Arial,sans-serif;
    font-size: 20px;
    font-weight: 600;
}

.margin-space{
    margin-top: 20px;
}
</style>
