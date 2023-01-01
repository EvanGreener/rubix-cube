import { Scene, Color } from "three"
import RubixCube  from "./RubixCube"

export default function MainScene() {
    const scene = new Scene()
    scene.background = new Color("white")
    const rubixCube = new RubixCube()

    for (let i = 0; i <= 2; i++) {
        for (let j = 0; j <= 2; j++) {
            for (let k = 0; k <= 2; k++) {
                let cube = rubixCube.cubes[i][j][k]
                cube.position.x = i - 1
                cube.position.y = j - 1
                cube.position.z = k - 1
                scene.add(cube)
            }
        }
    }
    return { rubixCube, scene }
}
