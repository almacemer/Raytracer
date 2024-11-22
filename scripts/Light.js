class Light {
    constructor(type, intensity, position, color) {
        this.type = type;
        this.intensity = intensity;
        this.position = position;
        this.color = color;
    }

    static get AMBIENT() { return 0; }
    static get POINT() { return 1; }
    static get DIRECTIONAL() { return 2; }
}
