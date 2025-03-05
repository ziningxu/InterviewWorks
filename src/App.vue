<template>
  <div>
    <div style="position: absolute; inset: 0; display: flex; align-items: center; justify-content: center">
      <ElButton type="primary" @click="state.show = true">打开弹窗</ElButton>
    </div>
    <UniDialog v-model="state.show" ref="uniDialogRef" @open="onDialogOpen">
      <ElResult icon="success" title="这是弹窗内容" sub-title="自动透传原始属性，比如：v-model"></ElResult>
      <p style="text-align: center; color: var(--el-color-primary); font-size: 16px">
        这是一个对 "ElDialog" 组件二次封装的新组件，拥有 "ElDialog" 组件的所有属性，方法，事件和插槽
      </p>
      <p style="text-align: center; color: var(--el-color-warning); font-size: 16px">
        即使升级 "element-plus" 框架， "ElDialog" 组件有了新属性，方法，事件和插槽，也会继承
      </p>
      <template #footer>
        <ElButton type="primary" @click="onBtnsClick">这是自带的 "footer" 插槽</ElButton>
      </template>
      <template #btns>
        <ElButton type="primary" @click="onBtnsClick">这是新增的 "btns" 插槽</ElButton>
      </template>
    </UniDialog>
  </div>
</template>
<script setup lang="tsx">
import { reactive, shallowRef, watch } from 'vue'
import UniDialog from './UniDialog.vue'
import { ElButton, ElResult } from 'element-plus'
const uniDialogRef = shallowRef()
const state = reactive({ show: false })
watch(
  () => uniDialogRef.value,
  (val) => {
    console.log('这是原始组件 "ElDialog" 实例', val?.dialogRef)
  },
)
function onDialogOpen() {
  console.log('这是透传的 "ElDialog" 组件的 "open" 事件回调')
}
function onBtnsClick() {
  alert('按键回调')
}
</script>
<style lang="scss" scoped></style>
