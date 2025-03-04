// Drag and Drop functionality
let iframeContainer = document.getElementById('iframe-container');
let isDragging = false;
let offsetX, offsetY;

iframeContainer.addEventListener('mousedown', (e) => {
    isDragging = true;
    offsetX = e.clientX - iframeContainer.getBoundingClientRect().left;
    offsetY = e.clientY - iframeContainer.getBoundingClientRect().top;
});

document.addEventListener('mousemove', (e) => {
    if (isDragging) {
        iframeContainer.style.left = e.clientX - offsetX + 'px';
        iframeContainer.style.top = e.clientY - offsetY + 'px';
    }
});

document.addEventListener('mouseup', () => {
    isDragging = false;
});

// Resize functionality
let resizeHandle = document.createElement('div');
resizeHandle.classList.add('resize-handle');
iframeContainer.appendChild(resizeHandle);

let isResizing = false;

resizeHandle.addEventListener('mousedown', (e) => {
    e.preventDefault();
    isResizing = true;
    document.addEventListener('mousemove', resizeIframe);
    document.addEventListener('mouseup', () => {
        isResizing = false;
        document.removeEventListener('mousemove', resizeIframe);
    });
});

function resizeIframe(e) {
    if (isResizing) {
        let newWidth = e.clientX - iframeContainer.getBoundingClientRect().left;
        let newHeight = e.clientY - iframeContainer.getBoundingClientRect().top;
        iframeContainer.style.width = newWidth + 'px';
        iframeContainer.style.height = newHeight + 'px';
    }
}
