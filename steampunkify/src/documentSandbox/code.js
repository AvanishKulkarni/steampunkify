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

import addOnSandboxSdk from "add-on-sdk-document-sandbox";
const { runtime } = addOnSandboxSdk.instance;
import { editor, colorUtils, constants } from "express-document-sdk";

function start() {
  runtime.exposeApi({
    createShape({ width, height }) {
        //
        const rect = editor.createRectangle();
        rect.width = width;
        rect.height = height;
        rect.translation = { x: 50, y: 50 };
        const col = colorUtils.fromRGB(0.9, 0.5, 0.9);
        const fillColor = editor.makeColorFill(col);
        rect.fill = fillColor;

        editor.context.insertionParent.children.append(rect);
    },
    // other properties will go here...
  });
}

start();
