// DRAG AND DROP FUNCTIONALITY
let iframeContainer = document.getElementById('iframe-container');
let isDragging = false;
let offsetX, offsetY;

iframeContainer.addEventListener('mousedown', function(e) {
    isDragging = true;
    offsetX = e.clientX - iframeContainer.getBoundingClientRect().left;
    offsetY = e.clientY - iframeContainer.getBoundingClientRect().top;
    document.addEventListener('mousemove', dragMove);
});

document.addEventListener('mouseup', function() {
    isDragging = false;
    document.removeEventListener('mousemove', dragMove);
});

function dragMove(e) {
    if (isDragging) {
        iframeContainer.style.left = e.clientX - offsetX + 'px';
        iframeContainer.style.top = e.clientY - offsetY + 'px';
    }
}

// RESIZE FUNCTIONALITY
let resizeHandle = document.getElementById('resize-handle');
let isResizing = false;

resizeHandle.addEventListener('mousedown', function(e) {
    isResizing = true;
    document.addEventListener('mousemove', resizeIframe);
    document.addEventListener('mouseup', stopResize);
    e.preventDefault(); // Prevent default behavior for better control
});

function resizeIframe(e) {
    if (isResizing) {
        let newWidth = e.clientX - iframeContainer.getBoundingClientRect().left;
        let newHeight = e.clientY - iframeContainer.getBoundingClientRect().top;
        iframeContainer.style.width = newWidth + 'px';
        iframeContainer.style.height = newHeight + 'px';
    }
}

function stopResize() {
    isResizing = false;
    document.removeEventListener('mousemove', resizeIframe);
}
