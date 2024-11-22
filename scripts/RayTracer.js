class RayTracer {
    constructor(canvasHandler, spheres, lights) {
        this.canvasHandler = canvasHandler;
        this.viewportSize = 1;
        this.projectionPlaneZ = 1;
        this.cameraPosition = new Vec3(0, 0, 0);
        this.cameraDirection = new Vec3(0, 0, 1);
        this.backgroundColor = new Vec3(255, 255, 255);
        this.spheres = spheres;
        this.lights = lights;
        this.EPSILON = 0.001;
        this.recursionDepth = 0;
    }

    canvasToViewport(p2d) {
        return new Vec3(
            p2d[0]*this.viewportSize / this.canvasHandler.canvas.width,
            p2d[1]*this.viewportSize / this.canvasHandler.canvas.height,
            this.projectionPlaneZ
        );
    }

    intersectRaySphere(origin, direction, sphere) {
        const oc = Vec3.subtract(origin, sphere.center);
        const k1 = Vec3.dot(direction, direction);
        const k2 = 2*Vec3.dot(oc, direction);
        const k3 = Vec3.dot(oc, oc) - sphere.radius*sphere.radius;

        const discriminant = k2*k2 - 4*k1*k3;
        if (discriminant < 0) {
            return [Infinity, Infinity];
        }

        const t1 = (-k2 + Math.sqrt(discriminant)) / (2*k1);
        const t2 = (-k2 - Math.sqrt(discriminant)) / (2*k1);
        return [t1, t2];
    }

    computeLighting(point, normal, view, specular, shadow) {
        let intensity = new Vec3(0, 0, 0);
        const lengthN = Vec3.length(normal);
        const lengthV = Vec3.length(view);

        for (const light of this.lights) {
            let lightIntensity = new Vec3(light.intensity * light.color.x / 255., light.intensity * light.color.y / 255., light.intensity * light.color.z / 255.);

            if (light.type == Light.AMBIENT) {
                intensity = Vec3.add(intensity, lightIntensity);
            } else {
                let vecL, tMax;
                if (light.type == Light.POINT) {
                    vecL = Vec3.subtract(light.position, point);
                    tMax = 1.0;
                } else {
                    vecL = light.position;
                    tMax = Infinity;
                }

                if (shadow) {
                    const blocker = this.closestIntersection(point, vecL, this.EPSILON, tMax);
                    if (blocker) continue;
                }

                const nDotL = Vec3.dot(normal, vecL);
                if (nDotL > 0) {
                    let diffuse = Vec3.multiply(nDotL / (lengthN * Vec3.length(vecL)), lightIntensity);
                    intensity = Vec3.add(intensity, diffuse);
                }

                if (specular != -1) {
                    let vecR = Vec3.subtract(Vec3.multiply(2.0 * Vec3.dot(normal, vecL), normal), vecL);
                    let rDotV = Vec3.dot(vecR, view);
                    if (rDotV > 0) {
                        let spec = Vec3.multiply(Math.pow(rDotV / (Vec3.length(vecR) * lengthV), specular), lightIntensity);
                        intensity = Vec3.add(intensity, spec);
                    }
                }
            }
        }

        return intensity;
    }

    closestIntersection(origin, direction, tMin, tMax) {
        let closestT = Infinity;
        let closestSphere = null;

        for (const sphere of this.spheres) {
            const [t1, t2] = this.intersectRaySphere(origin, direction, sphere);

            if (t1 < closestT && tMin < t1 && t1 < tMax) {
                closestT = t1;
                closestSphere = sphere;
            }
            if (t2 < closestT && tMin < t2 && t2 < tMax) {
                closestT = t2;
                closestSphere = sphere;
            }
        }

        if (closestSphere) {
            return [closestSphere, closestT];
        }
        return null;
    }

    traceRay(origin, direction, tMin, tMax, depth = 0) {
        let intersection = this.closestIntersection(origin, direction, tMin, tMax);
        if (!intersection) {
            return this.backgroundColor;
        }

        let closestSphere = intersection[0];
        let closestT = intersection[1];

        const point = Vec3.add(origin, Vec3.multiply(closestT, direction));
        let normal = Vec3.subtract(point, closestSphere.center);
        normal = Vec3.multiply(1.0 / Vec3.length(normal), normal);

        let view = Vec3.multiply(-1, direction);
        const fogAmount = Math.min(1, (closestT - tMin) / (tMax - tMin));
        let finalColor;
        if (useLighting && useShininess){
            const light = this.computeLighting(point, normal, view, closestSphere.specular, useShadows); 
            finalColor = new Vec3(
                closestSphere.color.x * light.x,
                closestSphere.color.y * light.y,
                closestSphere.color.z * light.z
            );
        } else if (useLighting) {
            const light = this.computeLighting(point, normal, view, -1, useShadows); 
            finalColor = new Vec3(
                closestSphere.color.x * light.x,
                closestSphere.color.y * light.y,
                closestSphere.color.z * light.z
            );
        } else {
            finalColor = closestSphere.color;
        }
        
        if (useFog) {
            finalColor = Vec3.add(Vec3.multiply(fogAmount, this.backgroundColor), Vec3.multiply(1-fogAmount, finalColor));
        }
            
        if (closestSphere.reflective <= 0 || depth >= this.recursionDepth) {
            return finalColor;
        }

        const reflectedDirection = Vec3.reflect(view, normal);
        const reflectedColor = this.traceRay(point, reflectedDirection, this.EPSILON, Infinity, depth + 1);

        finalColor = Vec3.add(Vec3.multiply(closestSphere.reflective, reflectedColor), Vec3.multiply(1 - closestSphere.reflective, finalColor));
        
        return finalColor;
    }

    moveCamera(x, y, z) {
        this.cameraPosition = Vec3.add(this.cameraPosition, new Vec3(x, y, z));
        this.render();
    }

    rotateCameraY(angle) {
        this.cameraDirection = Vec3.rotateY(this.cameraDirection, angle);
        this.render();
    }

    rotateCameraX(angle) {
        this.cameraDirection = Vec3.rotateX(this.cameraDirection, angle);
        this.render();
    }

    render() {
        //this.canvasHandler.clear();
        this.backgroundColor = this.lights[0].color;
        for (let x = -this.canvasHandler.canvas.width/2; x < this.canvasHandler.canvas.width/2; x++) {
            for (let y = -this.canvasHandler.canvas.height/2; y < this.canvasHandler.canvas.height/2; y++) {
                const direction = Vec3.add(this.cameraDirection, this.canvasToViewport([x, y]));
                const color = this.traceRay(this.cameraPosition, direction, 1.0, 100.0);
                this.canvasHandler.putPixel(x, y, Vec3.clamp(color));
            }
        }
        this.canvasHandler.updateCanvas();
    }
}
