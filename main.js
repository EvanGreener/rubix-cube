import {
    AxesHelper,
    Color,
    GridHelper,
    Vector3,
    WebGLRenderer,
} from "three"
import MainScene from "./src/scene"
import Camera from "./src/camera"
import { OrbitControls } from "three/addons/controls/OrbitControls"

let direction = 1

function renderScene() {
    const canvas = document.querySelector("#c")
    const renderer = new WebGLRenderer({ canvas })
    renderer.setSize(window.innerWidth, window.innerHeight, false)

    const camera = Camera(window.innerWidth / window.innerHeight)

    const controls = new OrbitControls(camera, canvas)
    controls.update()

    const { scene, rubixCube } = MainScene()
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

    function animateRotation(side) {
        const totalAngle = Math.PI / 2
        let lastRepaint = undefined
        let angleCurrent = 0
        function render(time) {
            const secs = time * 0.002
            if (lastRepaint === undefined) {
                lastRepaint = secs
            } else {
                let diff = secs - lastRepaint
                angleCurrent = angleCurrent + diff
                if (angleCurrent > totalAngle) {
                    diff -= angleCurrent - totalAngle
                    angleCurrent = totalAngle
                }
                rubixCube.rotateSide(diff, side, direction)
                lastRepaint = secs
            }

            if (angleCurrent < totalAngle) {
                renderer.render(scene, camera)
                requestAnimationFrame(render)
            }
        }
        requestAnimationFrame(render)
    }

    document.getElementById("rotate_front").onclick = function () {
        animateRotation(new Vector3(-1, 0, 0))
    }
    document.getElementById("rotate_back").onclick = function () {
        animateRotation(new Vector3(1, 0, 0))
    }
    document.getElementById("rotate_left").onclick = function () {
        animateRotation(new Vector3(0, -1, 0))
    }
    document.getElementById("rotate_right").onclick = function () {
        animateRotation(new Vector3(0, 1, 0))
    }
    document.getElementById("rotate_top").onclick = function () {
        animateRotation(new Vector3(0, 0, -1))
    }
    document.getElementById("rotate_bot").onclick = function () {
        animateRotation(new Vector3(0, 0, 1))
    }

    function render(time) {
        renderer.render(scene, camera)
        requestAnimationFrame(render)
    }

    requestAnimationFrame(render)
}

renderScene()
