<template>
  <canvas ref="canvas" width="640" height="480"></canvas>
</template>

<script lang="ts">
import { ref, onMounted } from 'vue'
import { assert } from './utils'

export default {
  name: 'App',
  setup() {
    const canvas = ref<HTMLCanvasElement>(null)

    onMounted(() => {
      const elm = canvas.value
      assert(elm, "can not get canvas element")
      const gl = elm.getContext('webgl')
      assert(gl, "can not get webgl context")
      gl.clearColor(0.0, 0.0, 0.0, 1.0)
      gl.clear(gl.COLOR_BUFFER_BIT)
    })

    return { canvas }
  }
}
</script>
