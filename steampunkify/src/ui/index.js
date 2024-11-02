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
import "@spectrum-web-components/button-group/sp-button-group.js";
import "@spectrum-web-components/field-label/sp-field-label.js";
import "@spectrum-web-components/number-field/sp-number-field.js";
import "@spectrum-web-components/slider/sp-slider.js";
import "@spectrum-web-components/swatch/sp-swatch.js";


import addOnUISdk from "https://new.express.adobe.com/static/add-on-sdk/sdk.js";

addOnUISdk.ready.then(async () => {
  console.log("addOnUISdk is ready for use.");

  // Input Fields
  const teethInput = document.getElementById("teeth");
  const innerRadiusInput = document.getElementById("inner-radius");
  const outerRadiusInput = document.getElementById("outer-radius");
  const angleInput = document.getElementById("angle");

  teethInput.value = 32;
  innerRadiusInput.value = 50;
  outerRadiusInput.value = 60;
  angleInput.value = 10;

  const createGearButton = document.getElementById("createGear");
  const deleteGearButton = document.getElementById("deleteGear");

  createGearButton.onclick = async (event) => {
    await sandboxProxy.addGear({
      teeth: teethInput.value,
      innerRadius: innerRadiusInput.value,
      outerRadius: outerRadiusInput.value,
      angle: angleInput.value
    });
  }
  deleteGearButton.onclick = async (event) => {
    await sandboxProxy.delGear();
  }

  // Get the UI runtime.
  const { runtime } = addOnUISdk.instance;
  const sandboxProxy = await runtime.apiProxy("documentSandbox");
  sandboxProxy.log("Document sandbox up and running.");

  // Enabling CTA elements only when the addOnUISdk is ready
  createGearButton.disabled = false;
  deleteGearButton.disabled = false;
});
