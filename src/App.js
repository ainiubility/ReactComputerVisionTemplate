// Import dependencies
// import React, { useRef, useState, useEffect } from "react"
import React, { useRef, useEffect } from "react"
import * as tf from "@tensorflow/tfjs" //不可以删除，此处会隐性的在浏览器环境中注册一个后端环境
// 1. TODO - Import required model here
// e.g. import * as tfmodel from "@tensorflow-models/tfmodel";
import * as cocossd from "@tensorflow-models/coco-ssd"

import Webcam from "react-webcam"
import "./App.css"
// 2. TODO - Import drawing utility here
// e.g. import { drawRect } from "./utilities";
import { drawRect } from './utilities'


function App() {
  const webcamRef = useRef(null)
  const canvasRef = useRef(null)

  // Main function
  const runCoco = async () => {

    if (! await tf.ready()) {
      console.log('tf is not ready, waiting for getting ready')

    }
    await setupWebGL()
    // 3. TODO - Load network 
    // e.g. 
    const net = await cocossd.load()

    //  Loop and detect hands
    // setInterval(() => {
    //   detect(net)
    // }, 10)
    let isRunning = true // 添加一个标志位判断是否继续执行
    async function loopAndDetect() {
      if (isRunning) {
        await detect(net)
        setTimeout(loopAndDetect,10) // 每次检测完成后，若仍在运行则重新设置setTimeout
      }
    }
    loopAndDetect()
  }

  const detect = async (/** @type {cocossd.ObjectDetection}  */net) => {
    // Check data is available
    if (
      typeof webcamRef.current !== "undefined" &&
      webcamRef.current !== null &&
      webcamRef.current.video.readyState === 4
    ) {
      // Get Video Properties
      const video = webcamRef.current.video
      const videoWidth = webcamRef.current.video.videoWidth
      const videoHeight = webcamRef.current.video.videoHeight

      // Set video width
      webcamRef.current.video.width = videoWidth
      webcamRef.current.video.height = videoHeight

      // Set canvas height and width
      canvasRef.current.width = videoWidth
      canvasRef.current.height = videoHeight

      // 4. TODO - Make Detections
      // e.g. const obj = await net.detect(video);
      const obj = await net.detect(video)
      console.log(obj)
      // Draw mesh
      const ctx = canvasRef.current.getContext("2d")

      // 5. TODO - Update drawing utility
      // drawSomething(obj, ctx)  
      drawRect(obj, ctx)
    }
  }

  async function setupWebGL() {

    if (!tf.getBackend()) { // 如果尚未设置后端
      console.log('Setting up WebGL backend.')
      if (tf.env().getBool('IS_BROWSER') &&
        typeof window !== 'undefined' &&
        ('WebGLRenderingContext' in window)) {

        try {
          // 尝试设置WebGL后端
          await tf.setBackend('webgl')
          console.log('Successfully set backend to WebGL.')

          // 这里可以放置依赖于WebGL后端的TensorFlow.js代码

        } catch (err) {
          console.error('Failed to set WebGL backend.', err)
          // 如果设置失败，可以选择降级到CPU后端
          await tf.setBackend('cpu')
          console.log('Falling back to CPU backend.')
        }
      } else {
        console.warn('WebGL is not supported on this platform.')
        // 默认设置为CPU后端
        await tf.setBackend('cpu')
      }
    }
  }

  useEffect(() => { runCoco() }, [])

  return (
    <div className="App">
      <header className="App-header">
        <Webcam
          ref={webcamRef}
          muted={true}
          style={{
            position: "absolute",
            marginLeft: "auto",
            marginRight: "auto",
            left: 0,
            right: 0,
            textAlign: "center",
            zindex: 9,
            width: 640,
            height: 480,
          }}
        />

        <canvas
          ref={canvasRef}
          style={{
            position: "absolute",
            marginLeft: "auto",
            marginRight: "auto",
            left: 0,
            right: 0,
            textAlign: "center",
            zindex: 8,
            width: 640,
            height: 480,
          }}
        />
      </header>
    </div>
  )
}

export default App
