import Data from '../data.js'
export default class data extends Data {
  constructor(root) {
    root = root || '' //nx: the root path of the project
    super(root)
  }

  cache(file, data, expire, type, allowEmpty) {
    return super.cache('tmp/' + file, data, expire, type, allowEmpty)
  }
}
