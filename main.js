import { AxesHelper, Color, GridHelper, Vector3, WebGLRenderer } from "three"
import MainScene from "./src/scene"
import Camera from "./src/camera"
import { OrbitControls } from "three/addons/controls/OrbitControls"

const totalAngle = Math.PI / 2
const { scene, rubixCube } = MainScene()

let side = null
let direction = 1

let btnPressed = "none"
let animationDone = null
let lastRepaint = null
let angleCurrent = 0

function renderScene() {
    const canvas = document.querySelector("#c")
    const renderer = new WebGLRenderer({ canvas })
    renderer.setSize(window.innerWidth, window.innerHeight, false)

    const camera = Camera(window.innerWidth / window.innerHeight)

    const controls = new OrbitControls(camera, canvas)
    controls.update()

    scene.background = new Color("pink")

    const axesHelper = new AxesHelper(3)
    axesHelper.renderOrder = 2
    scene.add(axesHelper)

    const size = 50
    const divisions = 50
    const gridHelper = new GridHelper(size, divisions)
    gridHelper.position.y = -5
    gridHelper.renderOrder = 1
    scene.add(gridHelper)

    document.getElementById("direction").onchange = (event) => {
        direction = event.currentTarget.value === "normal" ? 1 : -1
    }
    document.getElementById("rotate_front").onclick = function () {
        btnPressed = "rotate_front"
    }
    document.getElementById("rotate_back").onclick = function () {
        btnPressed = "rotate_back"
    }
    document.getElementById("rotate_left").onclick = function () {
        btnPressed = "rotate_left"
    }
    document.getElementById("rotate_right").onclick = function () {
        btnPressed = "rotate_right"
    }
    document.getElementById("rotate_top").onclick = function () {
        btnPressed = "rotate_top"
    }
    document.getElementById("rotate_bot").onclick = function () {
        btnPressed = "rotate_bot"
    }

    function updateRotation(secs) {
        if (lastRepaint === null) {
            lastRepaint = secs
        } else {
            let diff = secs - lastRepaint
            angleCurrent = angleCurrent + diff
            if (angleCurrent > totalAngle) {
                diff -= angleCurrent - totalAngle
                angleCurrent = totalAngle
                animationDone = true
            }
            rubixCube.rotateSide(diff, side, direction)
            lastRepaint = secs
        }
    }

    function render(time) {
        const secs = time * 0.002 // x2 speed
        if (btnPressed === "rotate_front") {
            side = new Vector3(-1, 0, 0)
        } else if (btnPressed === "rotate_back") {
            side = new Vector3(1, 0, 0)
        } else if (btnPressed === "rotate_left") {
            side = new Vector3(0, -1, 0)
        } else if (btnPressed === "rotate_right") {
            side = new Vector3(0, 1, 0)
        } else if (btnPressed === "rotate_top") {
            side = new Vector3(0, 0, -1)
        } else if (btnPressed === "rotate_bot") {
            side = new Vector3(0, 0, 1)
        }

        if (side !== null) {
            animationDone = false
            updateRotation(secs)
        }

        if (animationDone) {
            rubixCube.adjustCubesArray(side, direction)
            side = null
            animationDone = null
            btnPressed = "none"
            lastRepaint = null
            angleCurrent = 0
        }

        renderer.render(scene, camera)
        requestAnimationFrame(render)
    }

    requestAnimationFrame(render)
}

renderScene()
