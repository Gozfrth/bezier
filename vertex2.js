export class Vector2 {
  constructor(x, y) {
    this.x = x
    this.y = y
  }

  magnitude() {
    return Math.sqrt(this.x ** 2 + this.y ** 2)
  }

  add(vec) {
    return new Vector2(this.x + vec.x, this.y + vec.y)
  }

  subtract(vec) {
    return new Vector2(this.x - vec.x, this.y - vec.y)
  }

  // Multiply wid a scalar
  scale(scalar) {
    return new Vector2(this.x * scalar, this.y * scalar)
  }

  // Lin interpolate
  lerp(vec, t) {
    return new Vector2(this.x + (vec.x - this.x) * t, this.y + (vec.y - this.y) * t);
  }
}