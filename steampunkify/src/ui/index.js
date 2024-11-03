/*
Copyright 2023 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.
*/

import "@spectrum-web-components/styles/typography.css";

import "@spectrum-web-components/theme/src/themes.js";
import "@spectrum-web-components/theme/theme-light.js";
import "@spectrum-web-components/theme/express/theme-light.js";
import "@spectrum-web-components/theme/express/scale-medium.js";
import "@spectrum-web-components/theme/sp-theme.js";

import "@spectrum-web-components/button/sp-button.js";

import addOnUISdk from "https://new.express.adobe.com/static/add-on-sdk/sdk.js";

addOnUISdk.ready.then(async () => {
  console.log("addOnUISdk is ready for use.");
  const createShapeButton = document.getElementById("createShape");





  // Get the UI runtime.
  const { runtime } = addOnUISdk.instance;
  const sandboxProxy = await runtime.apiProxy("documentSandbox");
  sandboxProxy.log("Document sandbox up and running.");

  // Enabling CTA elements only when the addOnUISdk is ready
  createShapeButton.disabled = false;
});

//document.addEventListener("DOMContentLoaded", () => {
addOnUISdk.ready.then(async () => {
    const soundLibraryPanel = document.getElementById("sound-list");
  
    // Array of sound effects
    const soundEffects = [
      { name: "Steam Train Horn", file: "sounds/steam-train-horn.mp3" },
      { name: "Steam Hiss", file: "sounds/steam-hiss.mp3" },
      { name: "Gear Clank", file: "sounds/gear-clank.mp3" },
      { name: "Clock Tick", file: "sounds/clock-tick.mp3" },
      { name: "Engine Hum", file: "sounds/engine-hum.mp3" }
    ];
  
    // Function to create each sound item in the list
    soundEffects.forEach((sound) => {
      const soundItem = document.createElement("div");
      soundItem.classList.add("sound-item");
      soundItem.addEventListener("click", () => playSound(sound.file)); //playSound

      addOnUISdk.app.enableDragToDocument(soundItem, {
        previewCallback: sound => {
            return new URL("about:blank");
        },
        completionCallback: async (sound) => {
            return [{ blob: await getBlob(sound.file) }];
        }
    });

        
      const soundName = document.createElement("span");
      soundName.textContent = sound.name;
  
      soundItem.appendChild(soundName);
      soundLibraryPanel.appendChild(soundItem);
    });
  
    // Play sound function
    function playSound(file) {
      const audio = new Audio(file);
      audio.play();
    }


    // Register event handler for "dragstart" event
    addOnUISdk.app.on("dragstart", startDrag);
     // Register event handler for 'dragend' event
    addOnUISdk.app.on("dragend", endDrag);

});

/**
 * Add sound to the document. ???
 */
async function addToDocument(event) {
    const url = event.currentTarget.src;
    const blob = await getBlob(url);
    addOnUISdk.app.document.addImage(blob);
}

/**
 * Handle "dragstart" event
 */
function startDrag(eventData) {
    console.log("The drag event has started for", eventData.element.id);
}

/**
 * Handle "dragend" event
 */
function endDrag(eventData) {
    if (!eventData.dropCancelled) {
        console.log("The drag event has ended for", eventData.element.id);
    } else {
        console.log("The drag event was cancelled for", eventData.element.id);
    }
}



/**
 * Get the binary object for the image.
 */
async function getBlob(url) {
    return await fetch(url).then(response => response.blob());
}
