const SIDE_TOP = 0;
const SIDE_RIGHT = 1;
const SIDE_BOTTOM = 2;
const SIDE_LEFT = 3;
const MAX_DISTANCE_FROM_BORDER = 200;
const SIDE_CLASSES = {
    1: ["front", "bottom", "left", "right", "top", "back"],
    2: ["left", "front", "top", "bottom", "back", "right"],
    3: ["top", "left", "front", "back", "right", "bottom"],
    4: ["bottom", "right", "back", "front", "left", "top"],
    5: ["right", "back", "bottom", "top", "front", "left"],
    6: ["back", "top", "right", "left", "bottom", "front"],
};
class Cube {
    constructor(element, boundingElement) {
        this.element = element;
        this.boundingElement = boundingElement;
        this.boundingElementHeight =
            this.boundingElement.offsetHeight ||
            this.boundingElement.innerHeight;
        this.boundingElementWidth =
            this.boundingElement.offsetWidth || this.boundingElement.innerWidth;
        this.currentValue = 0;
        this.startAnimationTimeout = 0;
        this.endAnimationTimeout = 0;
        this.setValueTimeout = 0;
    }
    getRandom(start, end) {
        return start + Math.random() * (end - start);
    }
    getRandomInt(start, end) {
        return Math.floor(this.getRandom(start, end));
    }
    getRandomPoint(topLeft, bottomRight) {
        return [
            this.getRandom(topLeft[0], bottomRight[0]),
            this.getRandom(topLeft[1], bottomRight[1]),
        ];
    }
    makeRandomSide() {
        return this.getRandomInt(0, 4);
    }
    makeRandomStartPoint() {
        let side = this.makeRandomSide();
        switch (side) {
            case SIDE_TOP:
                return this.getRandomPoint(
                    [
                        -1 * MAX_DISTANCE_FROM_BORDER,
                        -1 * MAX_DISTANCE_FROM_BORDER,
                    ],
                    [this.boundingElementWidth + MAX_DISTANCE_FROM_BORDER, 0]
                );
            case SIDE_RIGHT:
                return this.getRandomPoint(
                    [this.boundingElementWidth, -1 * MAX_DISTANCE_FROM_BORDER],
                    [
                        this.boundingElementWidth + MAX_DISTANCE_FROM_BORDER,
                        this.boundingElementHeight + MAX_DISTANCE_FROM_BORDER,
                    ]
                );
            case SIDE_BOTTOM:
                return this.getRandomPoint(
                    [-1 * MAX_DISTANCE_FROM_BORDER, this.boundingElementHeight],
                    [
                        this.boundingElementWidth + MAX_DISTANCE_FROM_BORDER,
                        this.boundingElementHeight + MAX_DISTANCE_FROM_BORDER,
                    ]
                );
            case SIDE_LEFT:
                return this.getRandomPoint(
                    [
                        -1 * MAX_DISTANCE_FROM_BORDER,
                        -1 * MAX_DISTANCE_FROM_BORDER,
                    ],
                    [0, this.boundingElementHeight + MAX_DISTANCE_FROM_BORDER]
                );
        }
    }
    makeRandomEndPoint() {
        return this.getRandomPoint(
            [MAX_DISTANCE_FROM_BORDER, MAX_DISTANCE_FROM_BORDER],
            [
                this.boundingElementWidth - MAX_DISTANCE_FROM_BORDER,
                this.boundingElementHeight - MAX_DISTANCE_FROM_BORDER,
            ]
        );
    }
    getLineAngle(point1, point2) {
        let leftPoint = point1[0] < point2[0] ? point1 : point2,
            rightPoint = point1[0] < point2[0] ? point2 : point1;
        return (
            (180 / Math.PI) *
            Math.abs(
                Math.atan(
                    (rightPoint[1] - leftPoint[1]) /
                        (rightPoint[0] - leftPoint[0])
                )
            )
        );
    }

    reorderSides(value) {
        SIDE_CLASSES[value].forEach((element, index) => {
            this.element.querySelector(
                `.cube-side-${index + 1}`
            ).className = `cube-side cube-side-${
                index + 1
            } cube-side-${element}`;
        });
    }

    throw() {
        this.element.style.position = "absolute";
        let startPoint = this.makeRandomStartPoint(),
            endPoint = this.makeRandomEndPoint(),
            lineAngle = this.getLineAngle(startPoint, endPoint);
        this.element.style.transitionDuration = "0s";
        this.element.style.top = `${startPoint[1]}px`;
        this.element.style.left = `${startPoint[0]}px`;
        this.element.style.transform = `rotateZ(0)`;
        this.boundingElement.style.opacity = 1;
        let value = this.getRandomInt(1, 7);
        for (let i = 0; i < 3; ++i) {
            if (value === this.currentValue) {
                value = this.getRandomInt(1, 7);
            }
        }
        this.reorderSides(value);
        clearTimeout(this.startAnimationTimeout);
        clearTimeout(this.setValueTimeout);
        clearTimeout(this.endAnimationTimeout);
        this.startAnimationTimeout = setTimeout(() => {
            this.element.style.transitionDuration = "1s";
            this.element.style.top = `${endPoint[1]}px`;
            this.element.style.left = `${endPoint[0]}px`;
            this.element.style.transform = `rotateX(720deg) rotateY(360deg) rotateZ(${
                360 - lineAngle
            }deg)`;
        }, 200);
        this.setValueTimeout = setTimeout(() => {
            this.currentValue = value;
        }, 1200);
        this.endAnimationTimeout = setTimeout(() => {
            this.boundingElement.style.opacity = 0;
        }, 3000);
    }
}

window.addEventListener("load", () => {
    let throwCubeBtn = document.querySelector("#throw-cube"),
        cubeValueP = document.querySelector("#cube-value"),
        cubes = Array.from(document.querySelectorAll(".cube")).map(
            (cube) => new Cube(cube, cube.parentElement)
        );
    throwCubeBtn.addEventListener("click", () => {
        cubes.forEach((cube) => cube.throw());
        setTimeout(() => {
            cubeValueP.innerText = `Выпало: ${
                cubes[0].currentValue + cubes[1].currentValue
            }`;
        }, 1250);
    });
});
