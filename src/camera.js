import { PerspectiveCamera } from "three"

export default function Camera(aspect, fov = 75, near = 0.1, far = 50) {
    const camera = new PerspectiveCamera(fov, aspect, near, far)
    camera.position.set(5, 5, 5)
    return camera
}
