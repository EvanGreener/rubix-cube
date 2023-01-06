import {
    BoxGeometry,
    Mesh,
    MeshBasicMaterial,
    TextureLoader,
    Vector3,
} from "three"

function mapNums(num) {
    if (num === 1) {
        return { start: 0, end: 0 }
    } else if (num === 0) {
        return { start: 0, end: 2 }
    } else {
        return { start: 2, end: 2 }
    }
}

export default class RubixCube {
    constructor(width = 1) {
        this.width = width
        this.cubeMeshes = this.createRubixCube(width)
        this.cubes = [
            [
                [111, 112, 113],
                [121, 122, 123],
                [131, 132, 133],
            ],
            [
                [211, 212, 213],
                [221, 222, 223],
                [231, 232, 233],
            ],
            [
                [311, 312, 313],
                [321, 322, 323],
                [331, 332, 333],
            ],
        ]
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

        const { start: iStart, end: iEnd } = mapNums(side.x)
        const { start: jStart, end: jEnd } = mapNums(side.y)
        const { start: kStart, end: kEnd } = mapNums(side.z)
        for (let i = iStart; i <= iEnd; i++) {
            for (let j = jStart; j <= jEnd; j++) {
                for (let k = kStart; k <= kEnd; k++) {
                    let cube = this.cubeMeshes[i][j][k]
                    cube.position.sub(point)
                    cube.position.applyAxisAngle(axis, angle)
                    cube.position.add(point)
                    cube.rotateOnWorldAxis(axis, angle)
                }
            }
        }
    }

    /* 
    11 12 13  R  31 21 11
    21 22 23 ->  32 22 12 
    31 32 33     33 23 13

    11 12 13  L  13 23 33
    21 22 23 ->  12 22 32 
    31 32 33     11 21 31
    */
    adjustCubesArray(side, direction) {
        const { start: iStart, end: iEnd } = mapNums(side.x)
        const { start: jStart, end: jEnd } = mapNums(side.y)
        const { start: kStart, end: kEnd } = mapNums(side.z)

        let newPositions = []
        // Rotate the elements in the specified side of the cube.
        for (let i = iStart; i <= iEnd; i++) {
            for (let j = jStart; j <= jEnd; j++) {
                for (let k = kStart; k <= kEnd; k++) {
                    // Determine the new position of the element based on its current position
                    // and the direction of rotation.
                    let newI, newJ, newK
                    switch (direction) {
                        case 1:
                            if (iEnd - iStart === 0) {
                                newI = i
                                newJ = kEnd - k
                                newK = j
                            } else if (jEnd - jStart === 0) {
                                newI = kEnd - k
                                newJ = j
                                newK = i
                            } else {
                                newI = jEnd - j
                                newJ = i
                                newK = k
                            }
                            break
                        case -1:
                            if (iEnd - iStart === 0) {
                                newI = i
                                newJ = k
                                newK = jEnd - j
                            } else if (jEnd - jStart === 0) {
                                newI = k
                                newJ = j
                                newK = iEnd - i
                            } else {
                                newI = j
                                newJ = iEnd - i
                                newK = k
                            }
                            break
                        default:
                            throw new Error(`Invalid direction: ${direction}`)
                    }

                    newPositions.push(this.cubeMeshes[newI][newJ][newK])
                }
            }
        }
        for (let i = iStart; i <= iEnd; i++) {
            for (let j = jStart; j <= jEnd; j++) {
                for (let k = kStart; k <= kEnd; k++) {
                    if (iEnd - iStart === 0) {
                        this.cubeMeshes[i][j][k] = newPositions[3 * j + k]
                    } else if (jEnd - jStart === 0) {
                        this.cubeMeshes[i][j][k] = newPositions[3 * i + k]
                    } else {
                        this.cubeMeshes[i][j][k] = newPositions[3 * i + j]
                    }
                }
            }
        }
    }
}
