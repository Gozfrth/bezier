const colors = [
    "#FFFFFF",
    "#FFB3BA",
    "#FFDFBA",
    "#FFFFBA",
    "#BAFFC9",
    "#BAE1FF",
    "#E6A8D7",
    "#C4C4C4",
    "#FFF0BA"
];

export class GenBezier {
    constructor(points = [], stepSize) {
        this.points = points // Initial control points
        this.stepSize = stepSize // sampling rate for curve render
        this.t = 0 // t-value
        this.bezierPoints = [] // multi layer array to store intermediate control points
        this.tracer = [] // Curve points cached here to avoid recomputing every frame

        let temp = [...this.points]
        for (let i = 0; i < this.points.length - 1; i++) {
            this.bezierPoints.push([])
            for (let j = 0; j < temp.length - 1; j++) {
                temp[j] = temp[j].lerp(temp[j + 1], this.t)
                this.bezierPoints[i].push(temp[j])
            }
            temp.pop()
        }
    }

    draw(c) {
        // draw control points
        for (let i = 0; i < this.points.length; i++) {
            this.drawCircle(c, this.points[i], 6, colors[0])
        }

        // draw intermediate control points
        for (let i = 0; i < this.bezierPoints.length; i++) {
            for (let j = 0; j < this.bezierPoints[i].length; j++) {
                this.drawCircle(c, this.bezierPoints[i][j], 6, colors[(i + 1) % colors.length])
            }
        }

        // draw connecting line between control points
        this.drawLineBetween(c, this.points, colors[0])

        // merge with above for loop, its currently separate for clarity
        for (let i = 0; i < this.bezierPoints.length; i++) {
            this.drawLineBetween(c, this.bezierPoints[i], colors[(i + 1) % colors.length])
        }

        // draw the curve
        this.drawBezierCurve(c);
    }

    drawLineBetween(c, points, strokeStyle) {
        c.beginPath(c);
        for (let i = 0; i < points.length - 1; i++) {
            c.moveTo(points[i].x, points[i].y);
            c.lineTo(points[i + 1].x, points[i + 1].y);
        }
        c.strokeStyle = strokeStyle;
        c.stroke();
        c.closePath();
    }

    drawCircle(c, center, radius, fillStyle) {
        c.beginPath();
        c.fillStyle = fillStyle;
        c.arc(center.x, center.y, radius, 0, Math.PI * 2);
        c.fill();
        c.closePath();
    }

    // function to update tValue and all intermediate control points
    updateTPoint(t) {
        this.t = t
        console.log(this.t)
        this.reset()
    }
    
    // compute curve points and store in tracer for caching
    computeBezierPoints() {
        let len = this.points.length
        let val

        for (let k = 0; k <= 1; k += this.stepSize) {
            let temp = [...this.points]
            for (let i = 0; i < len - 1; i++) {
                for (let j = 0; j < temp.length - 1; j++) {
                    temp[j] = temp[j].lerp(temp[j + 1], k)
                    if (i === len - 2) {
                        val = temp[j]
                    }
                }
                temp.pop()
            }
            this.tracer.push(val)
        }
    }

    drawBezierCurve(c) {
        if (this.tracer.length === 0) {
            // initially
            this.computeBezierPoints();
        }
        c.beginPath();
        c.moveTo(this.tracer[0].x, this.tracer[0].y);
        for (let i = 1; i < this.tracer.length; i++) {
            c.lineTo(this.tracer[i].x, this.tracer[i].y);
            c.moveTo(this.tracer[i].x, this.tracer[i].y);
        }
        c.stroke()
        c.closePath();
    }
    reset() {

        let tempBezierPoints = []

        let temp = [...this.points]
        for (let i = 0; i < this.points.length - 1; i++) {
            tempBezierPoints.push([])
            for (let j = 0; j < temp.length - 1; j++) {
                temp[j] = temp[j].lerp(temp[j + 1], this.t)
                tempBezierPoints[i].push(temp[j])
            }
            temp.pop()
        }
        this.bezierPoints = [...tempBezierPoints]

        // this.tracer = []  
        // this should be done when changing vertices, so maybe accept a boolean condition to check whether vertices are being replaced or just the t value
    }
}