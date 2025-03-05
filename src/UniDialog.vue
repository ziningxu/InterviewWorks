<template>
  <RenderTarget />
</template>

<script lang="tsx" setup>
// 二次封装 "ElDialog" 组件
// 把组件的抬头换一种风格，必须保留 "ElDialog" 组件的属性，事件，插槽，方法
// 这里使用了jsx语法，因为相对于vue的模板语法，jsx更适合做这件事
import { computed, defineComponent, isRef, Ref, shallowRef, useAttrs } from 'vue'
import { ElDialog, ElButton } from 'element-plus'

// 原始组件的类型声明获取
type TypeNoReadonly<T> = {
  -readonly [K in keyof T]: T[K]
}
type TypeComponentInstance<T extends abstract new (...args: any) => any> = TypeNoReadonly<InstanceType<T>>
type ElDialogInstanceType = TypeComponentInstance<typeof ElDialog>
type ElDialogSlotsType = ElDialogInstanceType['$slots']
type ElDialogPropsType = ElDialogInstanceType['$props']
// 插槽
export interface UniDialogSlotsType extends /* @vue-ignore */ ElDialogSlotsType {
  btns?(): any
}
// props
// 中间的注释是处理多层输出type，vue无法识别的问题
// 也会把 "ElDialog" 组件的props和新赋予的props分开
export interface UniDialogPropsType extends /* @vue-ignore */ ElDialogPropsType {
  dialogRef?: ((ins: ElDialogInstanceType) => void) | Ref
  // 放在这里重写，是为了处理响应式，否则在attrs中，不是响应式
  // 如果不需要单独使用，直接透传，则无需单独处理
  title?: ElDialogPropsType['title']
  showClose?: ElDialogPropsType['showClose']
}
defineOptions({ name: 'UniDialog', inheritAttrs: false })
const props = defineProps<UniDialogPropsType>()
const dialogRef = shallowRef()
const attrs: ElDialogPropsType = useAttrs()
const slots = defineSlots<UniDialogSlotsType>()
const dialogAttrs = computed(getDialogAttrs)
function getDialogAttrs(): ElDialogPropsType {
  // 整理所有的props数据
  return {
    // 注意这里的attrs是没有自动转驼峰的
    // 如果需要用里面的值，需要自行转换
    ...attrs,
    ref(v: any) {
      // 本地记录 "ElDialog" 组件实例
      dialogRef.value = v
      // 把 "ElDialog" 组件实例向外部透传
      if (typeof props.dialogRef === 'function') {
        props.dialogRef(v)
      } else if (isRef(props.dialogRef)) {
        props.dialogRef.value = v
      }
    },
    showClose: false,
  }
}
const headerSlot: typeof slots.header = (scoped) => {
  if (slots.header) {
    // 用户插槽优先
    return slots.header(scoped)
  }
  // 重新定义一个抬头出来
  // 简单写一个抬头
  return (
    <div id={scoped.titleId} class={scoped.titleClass} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <div>{props.title || '提示'}</div>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        {/* 用户可以提供按键插槽 */}
        {slots.btns?.()}
        {/* 关闭按键重新处理 */}
        {props.showClose !== false ? <ElButton onClick={scoped.close}>X</ElButton> : null}
      </div>
    </div>
  )
}
// 目标组件渲染
const RenderTarget = defineComponent({
  setup() {
    return () => {
      return (
        <ElDialog {...dialogAttrs.value}>
          {{
            ...slots,
            header: headerSlot,
          }}
        </ElDialog>
      )
    }
  },
})
defineExpose({
  // 提供多种获取 "ElDialog" 组件实例的方式
  get dialogRef() {
    return dialogRef.value
  },
  // 代理  "ElDialog" 组件实例方法
  proxySource(key: string) {
    return dialogRef.value?.[key]
  },
})
</script>
