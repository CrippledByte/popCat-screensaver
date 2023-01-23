// Request frames function
window.requestAnimFrame = (function (callback) {
  return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame ||
function (callback) {
  window.setTimeout(callback, 1000 / 60)
}
})()

let is_on = false;

function popCatOff() {
  is_on = false;
  image.src = './popCat-off.png';
  setTimeout(() => {
    document.getElementById('favicon').setAttribute('href', './popCat-off.png');
  }, 200);
}

function popCatOn() {
  is_on = true;
  image.src = './popCat-on.png';
  document.getElementById('favicon').setAttribute('href', './popCat-on.png');
}

// Create image and set to default if invalid input provided
var image = new Image()
popCatOff();

// Ensure canvas shape has same dimensions as image
image.onload = function () {
  rect.width = image.width
  rect.height = image.height
}

// Hide and append image
image.style.display = 'none'
document.body.appendChild(image)

// Draw image on canvas
function showImage (rect, context) {
  context.drawImage(image, rect.x, rect.y)
}

// Movement
var direction = 'se'
let prev_time = new Date();
let pop_timeout = null;

function display (rect, canvas, context) {
  let curr_time = new Date();
  let time_diff = curr_time - prev_time;
  prev_time = curr_time;

  const speed_modifier = time_diff / (1000 / 60);
  let speed = 5 * speed_modifier;

  // If image hits top
  let hit = false;
  if (rect.y <= 0) {
    hit = true;
    if (direction === 'ne') {
      direction = 'se'
    } else if (direction === 'nw') {
      direction = 'sw'
    }

  // If image hits bottom
  } else if (rect.y >= canvas.height - rect.height) {
    hit = true;
    if (direction === 'se') {
      direction = 'ne'
    } else if (direction === 'sw') {
      direction = 'nw'
    }

  // If image hits left
  } else if (rect.x <= 0) {
    hit = true;
    if (direction === 'nw') {
      direction = 'ne'
    } else if (direction === 'sw') {
      direction = 'se'
    }

  // If image hits right
  } else if (rect.x >= canvas.width - rect.width) {
    hit = true;
    if (direction === 'ne') {
      direction = 'nw'
    } else if (direction === 'se') {
      direction = 'sw'
    }
  }

  if (hit) {
    let duration = 0;

    // check if popcat is already on
    if (is_on) {
      duration = 10;
    }

    popCatOff();
    clearTimeout(pop_timeout);
    pop_timeout = null;

    // turn popcat off for 10 ms if already on
    setTimeout(() => {
      popCatOn();

      // turn popcat on for 100 ms
      pop_timeout = setTimeout(() => {
        popCatOff();
      }, 100 + duration);
    }, duration);
  }

  // Now to define what the directions actually mean
  switch(direction) {
    case 'ne':
      rect.x += speed
      rect.y -= speed
    break

    case 'nw':
      rect.x -= speed
      rect.y -= speed
    break

    case 'se':
      rect.x += speed
      rect.y += speed
    break

    case 'sw':
      rect.x -= speed
      rect.y += speed
    break

    default:
      // This shouldn't ever happen
  }

  // Clear canvas
  context.clearRect(0, 0, canvas.width, canvas.height)

  showImage(rect, context)

  // Request another frame
  requestAnimFrame(function () {
    display(rect, canvas, context)
  })
}

// Get canvas and context
var canvas = document.getElementById('canvas')
var context = canvas.getContext('2d')

// Change canvas dimensions when browser window is resized
function resize (canvas) {
  canvas.height = window.innerHeight
  canvas.width = window.innerWidth
}
resize(canvas)
window.onresize = function () {
  resize(canvas)
}

// Define canvas rectangle
var rect = {
  x: Math.floor(Math.random() * window.innerWidth) + 1,
  y: Math.floor(Math.random() * window.innerHeight) + 1,
  width: image.width,
  height: image.height
}

// Start animation
showImage(rect, context)
display(rect, canvas, context)
