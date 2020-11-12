enum SHADER_TYPE {
  VERTEX = WebGLRenderingContext.VERTEX_SHADER,
  FRAGMENT = WebGLRenderingContext.FRAGMENT_SHADER
}

const loaderShader = (gl:WebGLRenderingContext, type: SHADER_TYPE, source: string) => {
  const shader = gl.createShader(type) as WebGLShader
  gl.shaderSource(shader, source)

  gl.compileShader(shader)

  if(!gl.getShaderParameter(shader,gl.COMPILE_STATUS)) {
    throw new Error('An error occurred compiling the shaders: ' + gl.getShaderInfoLog(shader))
  }

  return shader
}

export const initShaderProgram = (gl:WebGLRenderingContext, vsSource: string, fsSource: string) => {
  const vertexShader = loaderShader(gl, SHADER_TYPE.VERTEX, vsSource)
  const fragentShader = loaderShader(gl, SHADER_TYPE.FRAGMENT, fsSource)

  const shaderProgram = gl.createProgram() as WebGLProgram
  gl.attachShader(shaderProgram, vertexShader)
  gl.attachShader(shaderProgram, fragentShader)
  gl.linkProgram(shaderProgram)

  if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
    throw new Error(('Unable to initialize the shader program: ' + gl.getProgramInfoLog(shaderProgram)));
  }
  
  return shaderProgram
}
