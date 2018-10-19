/* import Base from '@/api/class/fileupload'

class FileUpload extends Base {

}

export default new FileUpload('common') */
import { getBaseURLBySN } from '@/utils/index'

const fileUploadConfig = {
  fileUploadUrl: getBaseURLBySN('falconUser')
}

export default fileUploadConfig
