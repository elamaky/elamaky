// Funkcija za otvaranje modalnog prozora sa smilovima
document.getElementById('smilesBtn').addEventListener('click', function() {
  var smileModal = document.getElementById('smileModal');
  var rect = smileBtn.getBoundingClientRect();
  var x = rect.left + window.scrollX;
  var y = rect.top + window.scrollY;
  
  smileModal.style.top = (y - 300) + 'px';
  smileModal.style.left = x + 'px';
  smileModal.style.display = 'flex';
});

// Funkcija za zatvaranje modalnog prozora
function closeSmileModal() {
  document.getElementById('smileModal').style.display = 'none';
}

// Funkcija za dodavanje smilova u chat
function addSmile(smile) {
  const chatInput = document.getElementById('chatInput');
  chatInput.value += smile; 
  closeSmileModal();
}

// Dodavanje HTML kod za modalni prozor sa smilovima
const smileModalHTML = `
    <div id="smileModal" style="display: none; position: fixed; top: 50%; left: 0; transform: translateY(-50%); background: black; padding: 10px; border: 1px solid white; z-index: 1000; width: 300px; height: 300px; overflow-y: scroll;">
        <div id="smileContainer" style="display: flex; flex-direction: column; color: white;">
            <span class="smile" onclick="addSmile('😀')">😀</span>
            <span class="smile" onclick="addSmile('😂')">😂</span>
            <span class="smile" onclick="addSmile('😍')">😍</span>
            <span class="smile" onclick="addSmile('😎')">😎</span>
            <span class="smile" onclick="addSmile('😢')">😢</span>
            <span class="smile" onclick="addSmile('😡')">😡</span>
            <span class="smile" onclick="addSmile('🤔')">🤔</span>
            <span class="smile" onclick="addSmile('☕')">☕</span>
            
            <span class="smile" onclick="addSmile('👍')">👍</span>
            <span class="smile" onclick="addSmile('👎')">👎</span>
            <span class="smile" onclick="addSmile('💋')">💋</span> <!-- Poljubac sa usnama -->
            <span class="smile" onclick="addSmile('💕')">💕</span> <!-- Dva srca -->
            <span class="smile" onclick="addSmile('💞')">💞</span> <!-- Rotirajuća srca -->
            <span class="smile" onclick="addSmile('❤️')">❤️</span>
            <span class="smile" onclick="addSmile('💔')">💔</span>
            <span class="smile" onclick="addSmile('🌧️')">🌧️</span>
            <span class="smile" onclick="addSmile('☀️')">☀️</span>
            <span class="smile" onclick="addSmile('🎶')">🎶</span>
            <span class="smile" onclick="addSmile('🎉')">🎉</span>
            <span class="smile" onclick="addSmile('🔥')">🔥</span>
            <span class="smile" onclick="addSmile('🎵')">🎵</span>
            <span class="smile" onclick="addSmile('😜')">😜</span>
            <span class="smile" onclick="addSmile('😝')}}">😝<!-- Dodano je duplikat smiles emotikona -->

<!-- Umetanje modalnog HTML-a u telo stranice -->
document.body.insertAdjacentHTML('beforeend', smileModalHTML);

// Dodavanje dugmeta za otvaranje modalnog prozora
var smileBtn = document.getElementById('smilesBtn');

// Funkcija za pozicioniranje modalnog prozora
function positionModal() {
  var rect = smileBtn.getBoundingClientRect();
  var x = rect.left + window.scrollX;
  var y = rect.top + window.scrollY;
  
  smileModal.style.top = (y - 300) + 'px';
  smileModal.style.left = x + 'px';
}
