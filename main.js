// Global variables

const GIPHY_API_KEY = "KKDsobxyi7sfcmve7nwIASleRZcSd3jM" // Public demo key – DO NOT misuse

let draggedElement = null
let elementCounter = 0
let currentTheme = "classic"

// Import JSZip library
const JSZip = window.JSZip

// Initialize the app
document.addEventListener("DOMContentLoaded", () => {
  initializeDragAndDrop()
  setupCanvas()
})

// Initialize drag and drop functionality
function initializeDragAndDrop() {
  const draggableElements = document.querySelectorAll(".draggable-element")
  const canvas = document.getElementById("canvas")

  // Add drag event listeners to sidebar elements
  draggableElements.forEach((element) => {
    element.addEventListener("dragstart", handleDragStart)
    element.addEventListener("dragend", handleDragEnd)
    element.setAttribute("draggable", "true")
  })

  // Add drop event listeners to canvas
  canvas.addEventListener("dragover", handleDragOver)
  canvas.addEventListener("drop", handleDrop)
}

// Handle drag start
function handleDragStart(e) {
  draggedElement = e.target.closest(".draggable-element")
  e.dataTransfer.effectAllowed = "copy"
  e.target.style.opacity = "0.5"
}

// Handle drag end
function handleDragEnd(e) {
  e.target.style.opacity = "1"
}

// Handle drag over canvas
function handleDragOver(e) {
  e.preventDefault()
  e.dataTransfer.dropEffect = "copy"
}

// Handle drop on canvas
function handleDrop(e) {
  e.preventDefault()

  if (!draggedElement) return

  const canvas = document.getElementById("canvas")
  const rect = canvas.getBoundingClientRect()
  const x = e.clientX - rect.left
  const y = e.clientY - rect.top

  createElement(draggedElement.dataset.type, x, y, draggedElement.dataset)
  draggedElement = null
}

// Create element on canvas
function createElement(type, x, y, data = {}) {
  const canvas = document.getElementById("canvas")
  const element = document.createElement("div")
  element.className = "canvas-element"
  element.style.left = x + "px"
  element.style.top = y + "px"
  element.id = "element-" + ++elementCounter
element.addEventListener("click", (e) => {
  // Prevent clicking on delete button or nested editable elements
  if (e.target.classList.contains("delete-btn")) return
  e.stopPropagation()

  // Remove previous selections
  document.querySelectorAll(".canvas-element").forEach((el) => {
    el.classList.remove("selected")
  })

  // Select this element
  element.classList.add("selected")
})

  // Add delete button
  const deleteBtn = document.createElement("button")
  deleteBtn.className = "delete-btn"
  deleteBtn.innerHTML = "×"
  deleteBtn.onclick = () => element.remove()
  element.appendChild(deleteBtn)

  // Create content based on type
  let content = ""
  switch (type) {
    case "text":
      content = '<div class="retro-text" contenteditable="true">Click to edit this text!</div>'
      break
    case "heading":
      content = '<div class="retro-heading" contenteditable="true">Your Awesome Heading!</div>'
      break
    case "marquee":
      content = '<div class="retro-marquee"><marquee>🌟 Welcome to my awesome website! 🌟</marquee></div>'
      break
    case "gif":
      content = `<img class="retro-gif" src="${data.src}" alt="Retro GIF" width="150" height="150">`
      break
    case "construction":
      content = '<div class="construction-sign">🚧 UNDER CONSTRUCTION 🚧<br>Please excuse our mess!</div>'
      break
    case "guestbook":
      content = `
                <div class="guestbook">
                    <h3>📖 Sign My Guestbook!</h3>
                    <textarea placeholder="Leave a message..." rows="3" cols="30"></textarea><br>
                    <button>Sign Guestbook</button>
                </div>
            `
      break
    case "counter":
      content = `
                <div class="visitor-counter">
                    <div>You are visitor #</div>
                    <div style="font-size: 1.5em; color: #00ff00;">${Math.floor(Math.random() * 999999) + 1}</div>
                </div>
            `
      break
    case "music":
      content = `
                <div class="music-player">
                    🎵 Now Playing: Retro Beats 🎵<br>
                    <button onclick="alert('♪ Music would play here! ♪')">▶️ Play</button>
                    <button onclick="alert('⏸️ Music paused!')">⏸️ Pause</button>
                </div>
            `
      break
  }

  element.innerHTML = content + element.innerHTML
  canvas.appendChild(element)

  // Make element draggable within canvas
  makeElementDraggable(element)

  // Hide welcome message if it exists
  const welcomeMessage = document.querySelector(".welcome-message")
  if (welcomeMessage) {
    welcomeMessage.style.display = "none"
  }
}

// Make canvas elements draggable
function makeElementDraggable(element) {
  let isDragging = false
  let startX, startY, initialX, initialY

  element.addEventListener("mousedown", (e) => {
    if (e.target.classList.contains("delete-btn")) return

    isDragging = true
    startX = e.clientX
    startY = e.clientY
    initialX = Number.parseInt(element.style.left) || 0
    initialY = Number.parseInt(element.style.top) || 0

    element.classList.add("selected")

    document.addEventListener("mousemove", handleMouseMove)
    document.addEventListener("mouseup", handleMouseUp)
  })

  function handleMouseMove(e) {
    if (!isDragging) return

    const deltaX = e.clientX - startX
    const deltaY = e.clientY - startY

    element.style.left = initialX + deltaX + "px"
    element.style.top = initialY + deltaY + "px"
  }

  function handleMouseUp() {
    isDragging = false
    element.classList.remove("selected")
    document.removeEventListener("mousemove", handleMouseMove)
    document.removeEventListener("mouseup", handleMouseUp)
  }

   
}

// Setup canvas
function setupCanvas() {
  const canvas = document.getElementById("canvas")

  // Click outside elements to deselect
  canvas.addEventListener("click", (e) => {
    if (e.target === canvas) {
      document.querySelectorAll(".canvas-element.selected").forEach((el) => {
        el.classList.remove("selected")
      })
    }
  })
}

// Change theme
function changeTheme(theme) {
  currentTheme = theme
  const body = document.body

  // Remove existing theme classes
  body.classList.remove("theme-neon", "theme-classic", "theme-dark")

  // Add new theme class
  body.classList.add("theme-" + theme)

  // Update canvas background based on theme
  const canvas = document.getElementById("canvas")
  switch (theme) {
    case "neon":
      canvas.style.background = "linear-gradient(45deg, #ff0080, #0080ff)"
      break
    case "classic":
      canvas.style.background = "#fff"
      break
    case "dark":
      canvas.style.background = "linear-gradient(45deg, #2d1b69, #11998e)"
      break
  }
}

// Clear canvas
function clearCanvas() {
  if (confirm("Are you sure you want to clear all elements?")) {
    const canvas = document.getElementById("canvas")
    const elements = canvas.querySelectorAll(".canvas-element")
    elements.forEach((el) => el.remove())

    // Show welcome message again
    const welcomeMessage = document.querySelector(".welcome-message")
    if (welcomeMessage) {
      welcomeMessage.style.display = "block"
    }
  }
}

// Export site functionality
function exportSite() {
  const canvas = document.getElementById("canvas")
  const elements = canvas.querySelectorAll(".canvas-element")

  if (elements.length === 0) {
    alert("Add some elements to your site before exporting!")
    return
  }

  // Generate HTML content
  const htmlContent = generateHTML()
  const cssContent = generateCSS()

  // Create ZIP file
  const zip = new JSZip()
  zip.file("index.html", htmlContent)
  zip.file("style.css", cssContent)

  // Add a README
  const readme = `# My Retro Website 🕸️

Welcome to your exported retro website!

## Files included:
- index.html - Your main webpage
- style.css - All the retro styling

## How to use:
1. Upload these files to any web hosting service
2. Or open index.html in your browser to view locally
3. Share your retro creation with the world!

Built with RetroWeb Builder - GeoCities 2.0 🌟
`

  zip.file("README.md", readme)

  // Generate and download ZIP
  zip.generateAsync({ type: "blob" }).then((content) => {
    const link = document.createElement("a")
    link.href = URL.createObjectURL(content)
    link.download = "my-retro-website.zip"
    link.click()
  })
}

// Generate HTML for export
function generateHTML() {
  const canvas = document.getElementById("canvas")
  const elements = canvas.querySelectorAll(".canvas-element")

  let bodyContent = ""

  elements.forEach((element) => {
    const rect = element.getBoundingClientRect()
    const canvasRect = canvas.getBoundingClientRect()

    const left = element.style.left
    const top = element.style.top

    // Get element content without delete button
    const content = element.cloneNode(true)
    const deleteBtn = content.querySelector(".delete-btn")
    if (deleteBtn) deleteBtn.remove()

    bodyContent += `
        <div style="position: absolute; left: ${left}; top: ${top};">
            ${content.innerHTML}
        </div>`
  })

  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My Retro Website 🕸️</title>
    <link rel="stylesheet" href="style.css">
</head>
<body class="exported-site theme-${currentTheme}">
    <div class="site-container">
        ${bodyContent}
    </div>
    
    <div class="footer">
        <p>🌟 Made with RetroWeb Builder - GeoCities 2.0 🌟</p>
    </div>
</body>
</html>`
}

// Generate CSS for export
function generateCSS() {
  return `
@import url('https://fonts.googleapis.com/css2?family=Comic+Neue:wght@400;700&display=swap');

* {
    box-sizing: border-box;
}

body {
    font-family: 'Comic Neue', 'Comic Sans MS', cursive;
    margin: 0;
    padding: 0;
    min-height: 100vh;
    background: linear-gradient(45deg, #ff00ff, #00ffff, #ffff00, #ff00ff);
    background-size: 400% 400%;
    animation: gradientShift 3s ease infinite;
}

@keyframes gradientShift {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
}

@keyframes blink {
    0%, 50% { opacity: 1; }
    51%, 100% { opacity: 0; }
}

.site-container {
    position: relative;
    min-height: 100vh;
    padding: 20px;
}

.retro-text {
    font-family: 'Comic Neue', 'Comic Sans MS', cursive;
    background: #ffff00;
    border: 2px solid #ff00ff;
    padding: 10px;
    border-radius: 5px;
}

.retro-heading {
    font-family: 'Comic Neue', 'Comic Sans MS', cursive;
    font-size: 2em;
    font-weight: bold;
    color: #ff00ff;
    text-shadow: 2px 2px 0px #00ffff;
    background: #ffff00;
    padding: 10px;
    border: 3px solid #ff00ff;
    border-radius: 10px;
}

.retro-marquee {
    background: #ff00ff;
    color: #ffff00;
    padding: 10px;
    border: 2px solid #00ffff;
    font-weight: bold;
    font-size: 1.2em;
}

.retro-gif {
    border: 3px solid #ff00ff;
    border-radius: 10px;
    box-shadow: 5px 5px 15px rgba(0, 0, 0, 0.3);
}

.construction-sign {
    background: #ffff00;
    border: 3px solid #ff4500;
    padding: 15px;
    text-align: center;
    font-weight: bold;
    color: #ff4500;
    border-radius: 10px;
    animation: blink 1s infinite;
}

.guestbook {
    background: #e6e6fa;
    border: 3px solid #ff00ff;
    padding: 15px;
    border-radius: 10px;
    font-family: 'Comic Neue', cursive;
}

.visitor-counter {
    background: #000;
    color: #00ff00;
    padding: 10px;
    border: 2px solid #00ff00;
    font-family: 'Courier New', monospace;
    text-align: center;
    border-radius: 5px;
}

.music-player {
    background: #c0c0c0;
    border: 2px inset #c0c0c0;
    padding: 10px;
    border-radius: 5px;
    text-align: center;
}

.footer {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background: rgba(255, 255, 255, 0.9);
    text-align: center;
    padding: 10px;
    border-top: 2px solid #ff00ff;
    font-weight: bold;
    color: #ff00ff;
}

/* Theme variations */
.theme-neon {
    background: linear-gradient(45deg, #ff0080, #0080ff, #80ff00, #ff0080) !important;
}

.theme-classic {
    background: #f0f0f0 !important;
}

.theme-dark {
    background: linear-gradient(45deg, #2d1b69, #11998e, #2d1b69) !important;
}

/* Responsive design */
@media (max-width: 768px) {
    .site-container {
        padding: 10px;
    }
    
    .retro-heading {
        font-size: 1.5em;
    }
}
`
}

// Preview site functionality
function previewSite() {
  const htmlContent = generateHTML()
  const cssContent = generateCSS()

  // Create a complete HTML document with embedded CSS
  const fullHTML = htmlContent.replace('<link rel="stylesheet" href="style.css">', `<style>${cssContent}</style>`)

  // Open preview modal
  const modal = document.getElementById("previewModal")
  const frame = document.getElementById("previewFrame")

  modal.style.display = "block"

  // Create a blob URL for the HTML content
  const blob = new Blob([fullHTML], { type: "text/html" })
  const url = URL.createObjectURL(blob)

  frame.src = url

  // Clean up the blob URL after a delay
  setTimeout(() => {
    URL.revokeObjectURL(url)
  }, 1000)
}

// Close preview modal
function closePreview() {
  document.getElementById("previewModal").style.display = "none"
}

// Close modal when clicking outside
window.onclick = (event) => {
  const modal = document.getElementById("previewModal")
  if (event.target === modal) {
    modal.style.display = "none"
  }
}


// Handle AI Prompt
function handleAIPrompt() {
    const prompt = document.getElementById("aiPrompt").value.toLowerCase()
    const response = document.getElementById("aiResponse")
    if (!prompt.trim()) return

    let found = false
    const x = 100 + Math.floor(Math.random() * 400)
    const y = 100 + Math.floor(Math.random() * 300)

    if (prompt.includes("text")) {
        createElement("text", x, y)
        found = true
    }
    if (prompt.includes("heading")) {
        createElement("heading", x, y)
        found = true
    }
    if (prompt.includes("marquee")) {
        createElement("marquee", x, y)
        found = true
    }
    if (prompt.includes("rainbow")) {
        createElement("gif", x, y, { src: "https://media.giphy.com/media/3o7btPCcdNniyf0ArS/giphy.gif" })
        found = true
    }
    if (prompt.includes("stars")) {
        createElement("gif", x, y, { src: "https://media.giphy.com/media/13HgwGsXF0aiGY/giphy.gif" })
        found = true
    }
    if (prompt.includes("fire")) {
        createElement("gif", x, y, { src: "https://media.giphy.com/media/3oKIPnAiaMCws8nOsE/giphy.gif" })
        found = true
    }
    if (prompt.includes("music")) {
        createElement("music", x, y)
        found = true
    }
    if (prompt.includes("counter")) {
        createElement("counter", x, y)
        found = true
    }
    if (prompt.includes("guestbook")) {
        createElement("guestbook", x, y)
        found = true
    }

    response.innerText = found ? "✨ Elements added!" : "❌ Sorry, I didn't understand."
    setTimeout(() => response.innerText = "", 3000)
}
// Insert element into canvas
canvas.appendChild(element)

// Insert content into it
element.insertAdjacentHTML("afterbegin", content)

// Re-add delete button on top (after content)
element.appendChild(deleteBtn)

// Make draggable
makeElementDraggable(element)



function changeFont(fontFamily) {
  const selected = document.querySelector(".canvas-element.selected")
  if (selected) {
    selected.style.fontFamily = fontFamily
    selected.querySelectorAll("*").forEach((child) => {
      child.style.fontFamily = fontFamily
    })
  } else {
    alert("Select an element first!")
  }
}
function changeBgColor(color) {
  const selected = document.querySelector(".canvas-element.selected")
  if (selected) {
    selected.style.backgroundColor = color
    selected.querySelectorAll("*").forEach(child => child.style.backgroundColor = color)
  } else {
    alert("Select an element first!")
  }
}



function uploadImage(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function (e) {
    const imgSrc = e.target.result;

    const canvas = document.getElementById("canvas");
    const imgDiv = document.createElement("div");
    imgDiv.className = "canvas-element";
    imgDiv.style.left = "100px";
    imgDiv.style.top = "100px";
    imgDiv.id = "element-" + ++elementCounter;

    // Add delete button
    const deleteBtn = document.createElement("button");
    deleteBtn.className = "delete-btn";
    deleteBtn.innerHTML = "×";
    deleteBtn.onclick = () => imgDiv.remove();
    imgDiv.appendChild(deleteBtn);

    // Add image
    const img = document.createElement("img");
    img.src = imgSrc;
    img.alt = "Uploaded";
    img.style.width = "150px";
    img.style.height = "auto";
    img.style.border = "3px solid #ff00ff";
    img.style.borderRadius = "10px";
    img.style.boxShadow = "5px 5px 15px rgba(0, 0, 0, 0.3)";
    img.style.display = "block";
    imgDiv.appendChild(img);

    // Append to canvas
    canvas.appendChild(imgDiv);
    makeElementDraggable(imgDiv);

    // Hide welcome message if present
    const welcomeMessage = document.querySelector(".welcome-message");
    if (welcomeMessage) welcomeMessage.style.display = "none";
  };

  reader.readAsDataURL(file);
}


function searchGiphy(query) {
  if (!query.trim()) return alert("Please enter a search term!")

  console.log("Searching GIPHY for:", query);

  fetch(`https://api.giphy.com/v1/gifs/search?api_key=${GIPHY_API_KEY}&q=${encodeURIComponent(query)}&limit=6`)
    .then(res => res.json())
    .then(data => {
      if (!data.data || data.data.length === 0) {
        alert("No GIFs found!")
        return
      }

      const results = data.data.map(gif => gif.images.fixed_height.url)
      console.log("GIF URLs:", results);
      showGiphyResults(results)
    })
    .catch(err => {
      console.error("GIPHY fetch failed:", err)
      alert("Failed to load GIFs. Check your internet or API key.")
    })
}


function showGiphyResults(urls) {
  const oldDiv = document.querySelector(".giphy-results")
  if (oldDiv) oldDiv.remove()

  const resultDiv = document.createElement("div")
  resultDiv.className = "giphy-results"
  resultDiv.style.position = "fixed"
  resultDiv.style.bottom = "10px"
  resultDiv.style.left = "10px"
  resultDiv.style.background = "#fff"
  resultDiv.style.border = "2px solid #000"
  resultDiv.style.padding = "10px"
  resultDiv.style.zIndex = "9999"
  resultDiv.style.display = "flex"
  resultDiv.style.flexWrap = "wrap"
  resultDiv.style.maxWidth = "90vw"

  // ❌ Close button
  const closeBtn = document.createElement("button")
  closeBtn.innerText = "❌"
  closeBtn.style.position = "absolute"
  closeBtn.style.top = "5px"
  closeBtn.style.right = "5px"
  closeBtn.style.background = "#f00"
  closeBtn.style.color = "#fff"
  closeBtn.style.border = "none"
  closeBtn.style.fontSize = "16px"
  closeBtn.style.cursor = "pointer"
  closeBtn.onclick = () => resultDiv.remove()
  resultDiv.appendChild(closeBtn)

  urls.forEach(url => {
    const img = document.createElement("img")
    img.src = url
    img.style.width = "100px"
    img.style.margin = "5px"
    img.style.cursor = "pointer"
    img.onclick = () => {
      createElement("gif", 150, 150, { src: url })
      resultDiv.remove() // auto close after selection
    }
    resultDiv.appendChild(img)
  })

  document.body.appendChild(resultDiv)
}
// Add resizable handles
element.style.resize = "both"
element.style.overflow = "auto"

// use your own
function exportScreenshot() {
  const canvas = document.getElementById("canvas")
  html2canvas(canvas).then((canvasImage) => {
    const link = document.createElement("a")
    link.download = "retro-canvas-screenshot.png"
    link.href = canvasImage.toDataURL()
    link.click()
  })
}
function loadGoogleFont(fontName) {
  const link = document.createElement("link")
  link.href = `https://fonts.googleapis.com/css2?family=${fontName.replace(/ /g, "+")}&display=swap`
  link.rel = "stylesheet"
  document.head.appendChild(link)
}


function interpretPrompt(prompt) {
  prompt = prompt.toLowerCase()

  if (prompt.includes("add") && prompt.includes("fire gif")) {
    createElement("gif", 100, 400, { src: "https://media.giphy.com/media/3oKIPnAiaMCws8nOsE/giphy.gif" })
  }

  if (prompt.includes("change theme to dark")) {
    changeTheme("dark")
  }

  if (prompt.includes("add text")) {
    createElement("text", 200, 300)
  }
}
