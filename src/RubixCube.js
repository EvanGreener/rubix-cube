import {
    BoxGeometry,
    Mesh,
    MeshBasicMaterial,
    TextureLoader,
    Vector3,
} from "three"

export default class RubixCube {
    constructor(width = 1) {
        this.width = width
        this.cubes = this.createRubixCube(width)
    }

    createRubixCube(width) {
        const loader = new TextureLoader()
        const red = new MeshBasicMaterial({ map: loader.load("../red.png") })
        const blue = new MeshBasicMaterial({ map: loader.load("../blue.png") })
        const green = new MeshBasicMaterial({
            map: loader.load("/green.png"),
        })
        const yellow = new MeshBasicMaterial({
            map: loader.load("/yellow.png"),
        })
        const orange = new MeshBasicMaterial({
            map: loader.load("/orange.png"),
        })
        const white = new MeshBasicMaterial({
            map: loader.load("/white.png"),
        })
        const black = new MeshBasicMaterial({ color: "black" })

        const box = new BoxGeometry(width, width, width)
        const rubixCube = [
            [
                [
                    new Mesh(box, [black, red, black, white, red, blue]),
                    new Mesh(box, [black, red, black, white, black, black]),
                    new Mesh(box, [black, red, black, white, green, black]),
                ],
                [
                    new Mesh(box, [black, red, black, black, black, blue]),
                    new Mesh(box, red),
                    new Mesh(box, [black, red, black, black, green, black]),
                ],
                [
                    new Mesh(box, [black, red, yellow, black, black, blue]),
                    new Mesh(box, [black, red, yellow, black, black, black]),
                    new Mesh(box, [black, red, yellow, black, green, black]),
                ],
            ],
            [
                [
                    new Mesh(box, [black, black, black, white, black, blue]),
                    new Mesh(box, white),
                    new Mesh(box, [black, black, black, white, green, black]),
                ],
                [
                    new Mesh(box, blue),
                    new Mesh(box, new MeshBasicMaterial({ color: 0x000000 })), // Invisible
                    new Mesh(box, green),
                ],
                [
                    new Mesh(box, [black, black, yellow, black, black, blue]),
                    new Mesh(box, yellow),
                    new Mesh(box, [black, black, yellow, black, green, black]),
                ],
            ],
            [
                [
                    new Mesh(box, [orange, black, black, white, black, blue]),
                    new Mesh(box, [orange, black, black, white, black, black]),
                    new Mesh(box, [orange, black, green, white, green, black]),
                ],
                [
                    new Mesh(box, [orange, black, black, black, black, blue]),
                    new Mesh(box, orange),
                    new Mesh(box, [orange, black, black, black, green, black]),
                ],
                [
                    new Mesh(box, [orange, black, yellow, black, black, blue]),
                    new Mesh(box, [orange, black, yellow, black, black, black]),
                    new Mesh(box, [
                        orange,
                        green,
                        yellow,
                        orange,
                        green,
                        yellow,
                    ]),
                ],
            ],
        ]

        return rubixCube
    }

    rotateSide(diff, side = new Vector3(1, 0, 0), direction = -1) {
        const angle = diff
        const axis = new Vector3(
            side.x * direction,
            side.y * direction,
            side.z * direction
        )
        const point = side

        function mapNums(num) {
            if (num === 0) {
                return { start: 0, end: 2 }
            } else if (num === -1) {
                return { start: 2, end: 2 }
            } else {
                return { start: 0, end: 0 }
            }
        }
        let sideCubes = []
        const { start: iStart, end: iEnd } = mapNums(side.x)
        const { start: jStart, end: jEnd } = mapNums(side.y)
        const { start: kStart, end: kEnd } = mapNums(side.z)
        for (let i = iStart; i <= iEnd; i++) {
            for (let j = jStart; j <= jEnd; j++) {
                for (let k = kStart; k <= kEnd; k++) {
                    sideCubes.push(this.cubes[i][j][k])
                }
            }
        }

        sideCubes.forEach((cube) => {
            cube.position.sub(point)
            cube.position.applyAxisAngle(axis, angle)
            cube.position.add(point)
            cube.rotateOnAxis(axis, angle)
        })
    }
}
