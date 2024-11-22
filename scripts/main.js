
let ambientLight = new Light(Light.AMBIENT, 0.2, null, new Vec3(255, 255, 255));
let pointLight = new Light(Light.POINT, 0.6, new Vec3(2, 1, 0), new Vec3(255, 255, 255));
let directionalLight = new Light(Light.DIRECTIONAL, 0.2, new Vec3(1, 4, 4), new Vec3(255, 255, 255));

let useLighting = false;
let useShininess = false;
let useShadows = false;
let usePinkLight = false;
let useFog = false;

const canvasHandler = new CanvasHandler("canvas");
const rayTracer = new RayTracer(canvasHandler, spheresExample1, [ambientLight, pointLight, directionalLight]);

document.getElementById("toggle-lighting").addEventListener("click", () => {
    useLighting = !useLighting;
    rayTracer.render();
});

document.getElementById("toggle-shininess").addEventListener("click", () => {
    useShininess = !useShininess;
    rayTracer.render();
});

document.getElementById("toggle-shadows").addEventListener("click", () => {
    useShadows = !useShadows;
    rayTracer.render();
});

document.getElementById("toggle-fog").addEventListener("click", () => {
    useFog = !useFog;
    rayTracer.render();
});

document.addEventListener("keydown", (event) => {
    const step = 0.1;
    const angle = 5;
    switch (event.key) {
        case "w":
            rayTracer.moveCamera(0, step, 0);
            break;
        case "s":
            rayTracer.moveCamera(0, -step, 0);
            break;
        case "a":
            rayTracer.moveCamera(-step, 0, 0);
            break;
        case "d":
            rayTracer.moveCamera(step, 0, 0);
            break;
        case "i":
            rayTracer.moveCamera(0, 0, step);
            break;
        case "o":
            rayTracer.moveCamera(0, 0, -step);
            break;
        case "y":
            rayTracer.rotateCameraY(angle);
            break;
        case "x":
            rayTracer.rotateCameraY(-angle);
            break;
        case "c":
            rayTracer.rotateCameraX(angle);
            break;
        case "v":
            rayTracer.rotateCameraX(-angle);
            break;
    }
});

document.getElementById("toggle-pink").addEventListener("click", () => {
    usePinkLight = !usePinkLight;
    for (const light of rayTracer.lights) {
      if (usePinkLight) {
        light.color = new Vec3(200, 100, 100);
      } else {
        light.color = new Vec3(255, 255, 255);
      }
      
    }
    rayTracer.render();
  });
  document.getElementById("ambient-color").addEventListener("input", (event) => {
    const color = hexToRgb(event.target.value);
    ambientLight.color = new Vec3(color.r, color.g, color.z);
    rayTracer.render();
});

document.getElementById("ambient-intensity").addEventListener("input", (event) => {
    ambientLight.intensity = parseFloat(event.target.value);
    rayTracer.render();
});

document.getElementById("point-color").addEventListener("input", (event) => {
    const color = hexToRgb(event.target.value);
    pointLight.color = new Vec3(color.r, color.g, color.b);
    rayTracer.render();
});

document.getElementById("point-intensity").addEventListener("input", (event) => {
    pointLight.intensity = parseFloat(event.target.value);
    rayTracer.render();
});

document.getElementById("directional-color").addEventListener("input", (event) => {
    const color = hexToRgb(event.target.value);
    directionalLight.color = new Vec3(color.r, color.g, color.b);
    rayTracer.render();
});

document.getElementById("directional-intensity").addEventListener("input", (event) => {
    directionalLight.intensity = parseFloat(event.target.value);
    rayTracer.render();
});

document.getElementById("reflection-depth").addEventListener("keypress", (event) => {
    if (event.key === 'Enter') {
        rayTracer.recursionDepth = parseInt(event.target.value);
        rayTracer.render();
    }
});

document.getElementById('generate-example1').addEventListener('click', () => {
    rayTracer.spheres = spheresExample1;
    rayTracer.render();
});
document.getElementById('generate-example2').addEventListener('click', () => {
    rayTracer.spheres = spheresExample2;
    rayTracer.render();
});
document.getElementById('generate-example3').addEventListener('click', () => {
    rayTracer.spheres = spheresExample3;
    rayTracer.render();
});
document.getElementById('generate-example4').addEventListener('click', () => {
    rayTracer.spheres = spheresExample4;
    rayTracer.render();
});

function hexToRgb(hex) {
    const bigint = parseInt(hex.slice(1), 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return { r, g, b };
}
rayTracer.render();
