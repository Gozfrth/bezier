export class QuadBezier {
    constructor(p1, p2, p3, stepSize) {
      this.p1 = p1
      this.p2 = p2
      this.p3 = p3
      this.stepSize = stepSize
      this.t = 0
      this.tPoint1 = this.p1.lerp(this.p2, this.t)
      this.tPoint2 = this.p2.lerp(this.p3, this.t)
      this.tPoint3 = this.tPoint1.lerp(this.tPoint2, this.t)
      this.bezierPoints = []
    }
  
    draw(c) {
      this.drawCircle(c,this.p1, 6, "rgba(0, 0, 0, 0.5)");
      this.drawCircle(c, this.p2, 6, "rgba(0, 0, 0, 0.5)");
      this.drawCircle(c, this.p3, 6, "rgba(0, 0, 0, 0.5)");
      this.drawLine(c);
      this.drawCircle(c, this.p1, 6, "rgba(0, 0, 0, 0.5)");
      this.drawCircle(c, this.p2, 6, "rgba(0, 0, 0, 0.5)");
      this.drawCircle(c, this.p3, 6, "rgba(0, 0, 0, 0.5)");
      this.drawTPoints(c);
      this.drawInterpolators(c);
      this.drawBezierCurve(c);
    }
  
    drawLine(c) {
      c.beginPath(c);
      c.moveTo(this.p1.x, this.p1.y);
      c.lineTo(this.p2.x, this.p2.y);
      c.moveTo(this.p2.x, this.p2.y);
      c.lineTo(this.p3.x, this.p3.y);
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
  
    drawTPoints(c) {
      this.drawCircle(c, this.tPoint1, 4, "rgba(255, 0, 0, 0.7)");
      this.drawCircle(c, this.tPoint2, 4, "rgba(255, 0, 0, 0.7)");
      this.drawCircle(c, this.tPoint3, 4, "rgba(255, 0, 0, 0.7)");
    }
    updateTPoint(t) {
      this.tPoint1 = this.p1.lerp(this.p2, this.t)
      this.tPoint2 = this.p2.lerp(this.p3, this.t)
      this.tPoint3 = this.tPoint1.lerp(this.tPoint2, this.t)
    }
    drawInterpolators(c) {
      c.beginPath();
      c.moveTo(this.tPoint1.x, this.tPoint1.y);
      c.lineTo(this.tPoint2.x, this.tPoint2.y);
      c.stroke();
      c.closePath();
    }
    computeBezierPoints() {
      this.bezierPoints = []
      for (let i = 0; i <= 1; i += this.stepSize) {
        let p12 = this.p1.lerp(this.p2, i)
        let p23 = this.p2.lerp(this.p3, i)
        let p123 = p12.lerp(p23, i)
        this.bezierPoints.push(p123)
      }
    }
    drawBezierCurve(c) {
      if (this.bezierPoints.length === 0) {
        this.computeBezierPoints();
      }
      c.beginPath();
      c.moveTo(this.bezierPoints[0].x, this.bezierPoints[0].y);
      for (let i = 1; i < this.bezierPoints.length; i++) {
        c.lineTo(this.bezierPoints[i].x, this.bezierPoints[i].y);
      }
      c.stroke()
      c.closePath();
    }
    reset(){
      this.tPoint1 = this.p1.lerp(this.p2, this.t)
      this.tPoint2 = this.p2.lerp(this.p3, this.t)
      this.tPoint3 = this.tPoint1.lerp(this.tPoint2, this.t)
      this.bezierPoints = []
    }
  }