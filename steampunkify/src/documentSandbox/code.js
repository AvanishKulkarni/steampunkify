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
import { editor } from "express-document-sdk";
const { runtime } = addOnSandboxSdk.instance;

function start() {
  runtime.exposeApi({
    log: (...args) => {
      console.log(...args);
    },
    addGear({ teeth, innerRadius, outerRadius, angle }) {
      console.log("addGear", teeth, innerRadius, outerRadius, angle);
      // generate a gear...
      const doc = editor.documentRoot;
      const page = doc.pages.first;

      var teethArr = [];
      let c = editor.createEllipse();
      c.width = innerRadius * 2;
      c.height = c.width;
      console.log("c dim", c.width, c.height)
      // c.translation = {
      //   x: page.width / 2 - c.width / 2, y: page.height / 2 - c.height / 2
      // };

      for (let i = 0; i < teeth; i++) {
        let r = editor.createRectangle();
        r.width = outerRadius - innerRadius;
        r.height = 10;
        let center_x = page.width / 2;
        let center_y = page.height / 2

        let angle = (i * (360 / teeth)) * (Math.PI / 180);
        let radius = (c.width / 2) + 10;

        r.translation = {
          x: center_x + radius * Math.cos(angle) - r.width / 2,
          y: center_y + radius * Math.sin(angle) - r.height / 2,
        }
        r.setRotationInParent(i * (360 / teeth), { x: r.width / 2, y: r.height / 2 })
        teethArr.push(r);
      }

      page.artboards.first.children.append(c);
      teethArr.forEach((rect) => page.artboards.first.children.append(rect));
    },
    delGear() {
      console.log("delGear");
    }
    // other properties will go here...
  });
}

start();
