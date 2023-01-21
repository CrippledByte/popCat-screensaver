// Request frames function
window.requestAnimFrame = (function (callback) {
  return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame ||
function (callback) {
  window.setTimeout(callback, 1000 / 60)
}
})()

// Create image and set to default if invalid input provided
var image = new Image()
image.src = './popCat-off.png';

// Ensure canvas shape has same dimensions as image
image.onload = function () {
  rect.width = image.width
  rect.height = image.height
}

// Hide and append image
image.style.display = 'none'
document.body.appendChild(image)

// Set favicon
document.getElementById('favicon').setAttribute('href', image.src)

// Draw image on canvas
function showImage (rect, context) {
  context.drawImage(image, rect.x, rect.y)
}

// Movement
var direction = 'se'
let prev_time = new Date();

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
    if (image.src === './popCat-on.png') {
      duration = 10;
    }

    image.src = './popCat-off.png';

    // turn popcat off for 10 ms if already on
    setTimeout(() => {
      image.src = './popCat-on.png';
    }, duration);

    // turn popcat on for 100 ms
    setTimeout(() => {
      image.src = './popCat-off.png';
    }, 100 + duration);
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
