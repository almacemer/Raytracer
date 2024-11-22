class Vec3 {
    constructor(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
    } 

    static dot(v1, v2) {
        return v1.x*v2.x + v1.y*v2.y + v1.z*v2.z;
    }

    static subtract(v1, v2) {
        return new Vec3(v1.x - v2.x, v1.y - v2.y, v1.z - v2.z);
    }

    static multiply(k, v) {
        return new Vec3(k*v.x, k*v.y, k*v.z);
    }

    static add(v1, v2) {
        return new Vec3(v1.x + v2.x, v1.y + v2.y, v1.z + v2.z);
    }
    
    static length(v) {
        return Math.sqrt(Vec3.dot(v, v));
    }

    static clamp(v) {
        return new Vec3(
            Math.min(255, Math.max(0, v.x)),
            Math.min(255, Math.max(0, v.y)),
            Math.min(255, Math.max(0, v.z))
        );
    }

    static rotateY(v, angle) {
        const rad = angle*Math.PI / 180;
        const cos = Math.cos(rad);
        const sin = Math.sin(rad);
        
        return new Vec3(
            v.x*cos - v.z*sin,
            v.y,
            v.x*sin + v.z*cos
        );
    }

    static rotateX(v, angle) {
        const rad = angle*Math.PI / 180;
        const cos = Math.cos(rad);
        const sin = Math.sin(rad);

        return new Vec3(
            v.x,
            v.y*cos - v.z*sin,
            v.y*sin + v.z*cos
        );
    }

    static reflect(v1, v2) {
        return Vec3.subtract(Vec3.multiply(2 * Vec3.dot(v1, v2), v2), v1);
    }
}
