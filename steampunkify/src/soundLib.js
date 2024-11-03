document.write("HELLO");

document.addEventListener("DOMContentLoaded", () => {
    const soundLibraryPanel = document.getElementById("sound-list");
  
    // Array of sound effects
    const soundEffects = [
      { name: "Steam Hiss", file: "sounds/steam-hiss.mp3" },
      { name: "Gear Clank", file: "sounds/gear-clank.mp3" },
      { name: "Clock Tick", file: "sounds/clock-tick.mp3" },
      { name: "Engine Hum", file: "sounds/engine-hum.mp3" }
    ];
  
    // Function to create each sound item in the list
    soundEffects.forEach((sound) => {
      const soundItem = document.createElement("div");
      soundItem.classList.add("sound-item");
  
      const soundName = document.createElement("span");
      soundName.textContent = sound.name;
  
      const playButton = document.createElement("button");
      playButton.textContent = ">"; //▶️▶
      playButton.classList.add("play-button");
      playButton.addEventListener("click", () => playSound(sound.file));
  
      soundItem.appendChild(soundName);
      soundItem.appendChild(playButton);
      soundLibraryPanel.appendChild(soundItem);
    });
  
    // Play sound function
    function playSound(file) {  
      const audio = new Audio(file);
      audio.play();
    }
  });

  