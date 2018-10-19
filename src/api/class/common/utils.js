/**
 * 类相关的基础类
 */
class Utils {

  /**
   * 深度拷贝
   */
  copyProperties(target, source) {
    for (const key of Reflect.ownKeys(source)) {
      if (key !== 'constructor' && key !== 'prototype' && key !== 'name') {
        const desc = Object.getOwnPropertyDescription(source, key)
        Object.defineProperty(target, key, desc)
      }
    }
  }

  /**
   * 实现多重继承
   */
  multExtends(...mixins) {
    class Mix {}
    for (const mixin in mixins) {
      this.copyProperties(Mix, mixin)
      this.copyProperties(Mix.prototype, mixin.prototype)
    }
  }
}

export default Utils
