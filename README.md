# ✨ Magic Particle Trail

A smooth, touch-friendly **particle drawing effect** built with **HTML5 Canvas**.
It works on **desktop and mobile**, supports **curved strokes**, **constant density**, and **clean stroke separation**.

---

## 🖼 Preview

### Desktop

### Mobile

> Tip: Replace the image files with real screenshots from your project.

---

## 🚀 Features

* 🖱️ Mouse & 📱 Touch support
* ✨ Smooth curved strokes (Bézier smoothing)
* 🎯 Constant particle spacing (no gaps at high speed)
* ✋ Proper stroke reset (no overlap between drawings)
* ⚡ 60 FPS animation loop
* 🖤 Always-black background (no color bleeding)

---

## 📁 Project Structure

```
project-root/
│
├── index.html
├── README.md
```

---

## 🧠 How It Works

* **Input events** only update the target position
* **requestAnimationFrame** handles drawing every frame
* Particle positions are generated using **quadratic Bézier curves**
* Distance-based interpolation ensures **equal spacing at any speed**
* Stroke state resets on `mouseup / touchend`

This architecture is similar to how **professional drawing apps** work.

---

## ⚙️ Configuration

You can tweak these values in the script:

```js
const SPACING = 3;        // Distance between particles
const FOLLOW_SPEED = 0.35; // Cursor follow responsiveness
```

| Setting             | Effect                |
| ------------------- | --------------------- |
| Smaller SPACING     | Denser line           |
| Larger SPACING      | Lighter line          |
| Higher FOLLOW_SPEED | Faster response       |
| Lower FOLLOW_SPEED  | Smooth, floaty motion |

---

## 🛠 Installation

1. Clone or download the project
2. Open `index.html` in your browser
3. Draw with mouse or finger ✨

No dependencies. No build step.

---

## 📱 Mobile Notes

* Uses `touchstart / touchmove / touchend`
* `touch-action: none` prevents scrolling
* Tested on modern Android & iOS browsers

---

## 🌱 Possible Improvements

* 🎨 Gradient or rainbow trails
* 🖊 Pressure-based thickness
* 💾 Export canvas as image
* ⚡ WebGL / GPU acceleration
* ↩ Undo / clear gestures

---

## 📄 License

MIT License — free to use, modify, and share.

---

## 🙌 Credits

Created with ❤️ using vanilla JavaScript and HTML5 Canvas.
