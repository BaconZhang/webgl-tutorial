<template>
  <canvas ref="canvas" width="640" height="480"></canvas>
</template>

<script lang="ts">
import { ref, onMounted } from 'vue'
import { assert } from './utils'
import { initShaderProgram } from './gl'
import { mat4 } from 'gl-matrix'

const vsSource = `
attribute vec4 aVertexPosition;

uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;

void main() {
  gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
}
`;

const fsSource = `
precision mediump float;
void main() {
  gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
}
`;

interface Buffers {
  position: WebGLBuffer;
}

interface ProgramInfo {
  program: WebGLProgram;
  attribLocations: {
    vertexPosition: GLint;
  },
  uniformLocations: {
    projectionMatrix: WebGLUniformLocation;
    modelViewMatrix: WebGLUniformLocation;
  },
}

const initBuffers = (gl: WebGLRenderingContext): Buffers => {
  const positionBuffer = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)

  const vertices = new Float32Array([
    1.0, 1.0, 0.0,
    -1.0, 1.0, 0.0,
    1.0, -1.0, 0.0,
    -1.0, -1.0, 0.0,
  ])

  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW)

  return {
    position: positionBuffer
  }
}

const draw = (gl: WebGLRenderingContext, programInfo: ProgramInfo, buffers: Buffers) => {
  gl.clearColor(0.0, 0.0, 0.0, 1.0)
  gl.clearDepth(1.0)
  gl.enable(gl.DEPTH_TEST)
  gl.depthFunc(gl.LEQUAL)
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)

  const fieldOfView = 45 * Math.PI / 180
  const aspect = gl.canvas.width / gl.canvas.height
  const zNear = 0.1
  const zFar = 100.0

  const projectionMatrix = mat4.create()
  mat4.perspective(projectionMatrix, fieldOfView, aspect, zNear, zFar)

  const modelViewMatrix = mat4.create()
  mat4.translate(modelViewMatrix, modelViewMatrix, [-0.0, 0.0, -6.0])

  const numComponents = 3
  const type = gl.FLOAT
  const normalize = false
  const stride = 0
  const offset = 0
  gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position)
  gl.vertexAttribPointer(
    programInfo.attribLocations.vertexPosition,
    numComponents,
    type,
    normalize,
    stride,
    offset
  )
  gl.enableVertexAttribArray(programInfo.attribLocations.vertexPosition)

  gl.useProgram(programInfo.program)
  gl.uniformMatrix4fv(
    programInfo.uniformLocations.projectionMatrix,
    false,
    projectionMatrix)
  gl.uniformMatrix4fv(
    programInfo.uniformLocations.modelViewMatrix,
    false,
    modelViewMatrix)

  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
}

export default {
  name: 'App',
  setup() {
    const canvas = ref<HTMLCanvasElement>(null)

    onMounted(() => {
      const elm = canvas.value
      assert(elm, "can not get canvas element")
      const gl = elm.getContext('webgl')
      assert(gl, "can not get webgl context")

      const shaderProgram = initShaderProgram(gl, vsSource, fsSource)

      const programInfo: ProgramInfo = {
        program: shaderProgram,
        attribLocations: {
          vertexPosition: gl.getAttribLocation(shaderProgram, 'aVertexPosition'),
        },
        uniformLocations: {
          projectionMatrix: gl.getUniformLocation(shaderProgram, 'uProjectionMatrix'),
          modelViewMatrix: gl.getUniformLocation(shaderProgram, 'uModelViewMatrix'),
        },
      }
      const buffers = initBuffers(gl)

      draw(gl, programInfo, buffers)
    })

    return { canvas }
  }
}
</script>
