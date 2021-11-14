<script>
// 这里的改成服务器的地址和端口
// const BASE_URL = 'http://47.107.44.37:8080/';
// const BASE_URL = 'http://120.77.244.102:8080/';

// const etlUrl = 'http://47.107.44.37:8088/'
// const etlUrl = 'http://192.168.1.210:8087/'

// const etlUrl = 'http://localhost:8080/'
// const BASE_URL = 'http://121.89.214.2:8080/'
const etlUrl = URLCONFIG.etlUrl
const BASE_URL = URLCONFIG.BASE_URL
const dataUrl = URLCONFIG.dataUrl
const operatorUrl = URLCONFIG.operatorUrl
export default{
  BASE_URL,
  etlUrl,
  dataUrl,
  operatorUrl
}
</script>
