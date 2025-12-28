let longPressTimer = null;
let pressX = 0;
let pressY = 0;

let touchLongPressTimer = null;
let touchStartX = 0;
let touchStartY = 0;


let currentColor = "200,0,255";
let currentShape = "circle";
let currentSize = 4;

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

window.addEventListener("resize", () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

let particles = [];
let lastX = null, lastY = null, prevX = null, prevY = null;
let targetX = null, targetY = null, drawX = null, drawY = null;
let isDrawing = false;

const menu = document.getElementById("menu");
const SPACING = 3;
const FOLLOW_SPEED = 0.35;

function resetStroke() {
    lastX = null;
    lastY = null;
    prevX = null;
    prevY = null;
    drawX = null;
    drawY = null;
}

class Particle {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = currentSize;
        this.life = 3;
        this.vx = (Math.random() - 0.5) * 1;
        this.vy = (Math.random() - 0.5) * 1;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.life -= 0.03;
        this.size *= 0.97;
    }

    draw() {
        ctx.fillStyle = `rgba(${currentColor}, ${this.life})`;
        ctx.shadowColor = `rgba(${currentColor}, 1)`;
        ctx.shadowBlur = 12;

        ctx.beginPath();

        switch(currentShape) {
            case "circle":
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
                break;
            case "square":
                ctx.fillRect(this.x - this.size, this.y - this.size, this.size*2, this.size*2);
                break;
            case "star":
                drawStar(ctx, this.x, this.y, 5, this.size, this.size/2);
                ctx.fill();
                break;
             case "heart":
                drawHeart(ctx, this.x, this.y, this.size);
                ctx.fill();
                break;
            }
    }
}

function drawStar(ctx, cx, cy, spikes, outerRadius, innerRadius) {
    let rot = Math.PI / 2 * 3;
    let step = Math.PI / spikes;

    ctx.moveTo(cx, cy - outerRadius);
    for (let i = 0; i < spikes; i++) {
        ctx.lineTo(cx + Math.cos(rot) * outerRadius, cy + Math.sin(rot) * outerRadius);
        rot += step;
        ctx.lineTo(cx + Math.cos(rot) * innerRadius, cy + Math.sin(rot) * innerRadius);
        rot += step;
    }
    ctx.lineTo(cx, cy - outerRadius);
    ctx.closePath();
}

function drawHeart(ctx, x, y, size) {
    const topCurveHeight = size * 0.3;
    ctx.beginPath();
    ctx.moveTo(x, y + topCurveHeight);
    ctx.bezierCurveTo(
        x, y, 
        x - size, y, 
        x - size, y + topCurveHeight
    );
    ctx.bezierCurveTo(
        x - size, y + size, 
        x, y + size * 1.3, 
        x, y + size * 1.6
    );
    ctx.bezierCurveTo(
        x, y + size * 1.3, 
        x + size, y + size, 
        x + size, y + topCurveHeight
    );
    ctx.bezierCurveTo(
        x + size, y, 
        x, y, 
        x, y + topCurveHeight
    );
    ctx.closePath();
}

function addParticles(x, y) {
    if (lastX !== null && prevX !== null) {
        const cx1 = (prevX + lastX) / 2;
        const cy1 = (prevY + lastY) / 2;
        const cx2 = (lastX + x) / 2;
        const cy2 = (lastY + y) / 2;

        const dx = cx2 - cx1;
        const dy = cy2 - cy1;
        const distance = Math.hypot(dx, dy);
        const steps = Math.floor(distance / SPACING);

        for (let i = 0; i <= steps; i++) {
            const t = i / steps || 0;
            const px = (1 - t) * (1 - t) * cx1 + 2 * (1 - t) * t * lastX + t * t * cx2;
            const py = (1 - t) * (1 - t) * cy1 + 2 * (1 - t) * t * lastY + t * t * cy2;
            particles.push(new Particle(px, py));
        }
    }

    prevX = lastX;
    prevY = lastY;
    lastX = x;
    lastY = y;
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    if (isDrawing && targetX !== null) {
        if (drawX === null) {
            drawX = targetX;
            drawY = targetY;
        } else {
            drawX += (targetX - drawX) * FOLLOW_SPEED;
            drawY += (targetY - drawY) * FOLLOW_SPEED;
        }
        addParticles(drawX, drawY);
    }

    particles = particles.filter(p => p.life > 0);
    particles.forEach(p => { p.update(); p.draw(); });

    requestAnimationFrame(animate);
}

function showMenu(x, y) {
    menu.style.left = x + "px";
    menu.style.top = y + "px";
    menu.style.display = "block";
}

function hideMenu() {
    menu.style.display = "none";
    clearTimeout(longPressTimer);
    isDrawing = false;
}

// Drawing helpers
function startDrawing(x, y) { isDrawing = true; targetX = x; targetY = y; }
function moveDrawing(x, y) { if (!isDrawing) return; targetX = x; targetY = y; }
function stopDrawing() { isDrawing = false; resetStroke(); }

// Mouse drawing
window.addEventListener("mousedown", e => startDrawing(e.clientX, e.clientY));
window.addEventListener("mousemove", e => moveDrawing(e.clientX, e.clientY));
window.addEventListener("mouseup", stopDrawing);
window.addEventListener("mouseleave", stopDrawing);

// Touch drawing
window.addEventListener("touchstart", e => {
    const t = e.touches[0];
    touchStartX = t.clientX;
    touchStartY = t.clientY;

    // Start long press timer
    touchLongPressTimer = setTimeout(() => {
        showMenu(touchStartX, touchStartY);
        isDrawing = false; // stop drawing when menu opens
    }, 1000); // 2 seconds

    // Start drawing only after short delay
    isDrawing = true;
    targetX = touchStartX;
    targetY = touchStartY;
});

window.addEventListener("touchmove", e => {
    const t = e.touches[0];

    // Cancel long press if moved too far
    if (Math.abs(t.clientX - touchStartX) > 10 || Math.abs(t.clientY - touchStartY) > 10) {
        clearTimeout(touchLongPressTimer);
    }

    // Update drawing position
    if (isDrawing) {
        targetX = t.clientX;
        targetY = t.clientY;
    }
});

window.addEventListener("touchend", () => {
    stopDrawing();
    clearTimeout(touchLongPressTimer);
});
window.addEventListener("touchcancel", () => {
    stopDrawing();
    clearTimeout(touchLongPressTimer);
});

// Long-press for mouse (single listener)
function startLongPress(x, y) {
    pressX = x; pressY = y;
    longPressTimer = setTimeout(() => { showMenu(pressX, pressY); stopDrawing(); }, 1000);
}
window.addEventListener("mousedown", e => startLongPress(e.clientX, e.clientY));
window.addEventListener("mousemove", () => clearTimeout(longPressTimer));
window.addEventListener("mouseup", () => clearTimeout(longPressTimer));

// Color selection
document.querySelectorAll(".color").forEach(c => {
    c.addEventListener("click", () => { currentColor = c.dataset.color; hideMenu(); });
});

// Shape selection
document.querySelectorAll(".shape").forEach(s => {
    s.addEventListener("click", () => { currentShape = s.dataset.shape; hideMenu(); });
});

// Size selection
document.querySelectorAll(".size-option").forEach(s => {
    s.addEventListener("click", () => {
        currentSize = parseFloat(s.dataset.size);
        hideMenu();
    });
});


// Menu close button
document.getElementById("close-menu").addEventListener("click", hideMenu);

animate();
