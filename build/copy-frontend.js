/******/ (function() { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "@wordpress/a11y":
/*!******************************!*\
  !*** external ["wp","a11y"] ***!
  \******************************/
/***/ (function(module) {

module.exports = window["wp"]["a11y"];

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	!function() {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = function(module) {
/******/ 			var getter = module && module.__esModule ?
/******/ 				function() { return module['default']; } :
/******/ 				function() { return module; };
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	!function() {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = function(exports, definition) {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	!function() {
/******/ 		__webpack_require__.o = function(obj, prop) { return Object.prototype.hasOwnProperty.call(obj, prop); }
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	!function() {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = function(exports) {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	}();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
!function() {
/*!*********************!*\
  !*** ./src/copy.js ***!
  \*********************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _wordpress_a11y__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/a11y */ "@wordpress/a11y");
/* harmony import */ var _wordpress_a11y__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_a11y__WEBPACK_IMPORTED_MODULE_0__);
/**
 * Copy to clipboard functionality for the code block.
 */


// Set up event on document load.
document.addEventListener('DOMContentLoaded', () => {
  // Let's grab all copy containers.
  const copyContainers = document.querySelectorAll('.dlx-syntax-highlighting-code-block-copy-container');
  if (null === copyContainers) {
    return;
  }

  // Do not do anything if copying to clipboard is not supported.
  // If firefox, navigator.clipboard.write() will throw an error.
  if (!navigator.clipboard) {
    return;
  }

  // Loop through each copy container, grab its sibling (should be a pre with class .wp-block-code), copy classes, add container element, and place copy container inside this new container element.
  copyContainers.forEach(copyContainer => {
    // Grab previous sibling, which should be a pre with class .wp-block-code.
    const preBlock = copyContainer.previousElementSibling;
    const preBlockClone = copyContainer.previousElementSibling.cloneNode(true);
    const preBlockClasses = preBlock.classList;

    // Check that it is a pre with class .wp-block-code.
    if (!preBlockClasses.contains('wp-block-code')) {
      return;
    }

    // Let's create a parent around everything, copying pre attributes and moving them to the parent.
    const newContainer = document.createElement('div');
    newContainer.classList.add(...preBlockClasses);

    // Add pre ID to new container.
    const preBlockId = preBlock.getAttribute('id');
    if (preBlockId) {
      newContainer.setAttribute('id', preBlockId);
    }

    // Let's create a container to go around the pre tag.
    const preContainer = document.createElement('div');

    // Force no padding/margin/spacing on container.
    preContainer.style.padding = '0';
    preContainer.style.margin = '0';
    preContainer.style.position = 'relative';

    // Strip preBlock of its classes and ID.
    preBlockClone.removeAttribute('id');
    preBlockClone.remove(...preBlockClasses);

    // Move pre block inside of container.
    preContainer.appendChild(preBlockClone);

    // Move copy container inside pre-container.
    preContainer.appendChild(copyContainer);

    // Add pre-container to new container.
    newContainer.appendChild(preContainer);

    // Now add new container above pre block and remove old pre block.
    preBlock.parentNode.insertBefore(newContainer, preBlock);
    preBlock.remove();

    // Now let's find the copy button and add a click event to it.
    const copyButton = copyContainer.querySelector('button');
    if (null === copyButton) {
      return;
    }

    // Add click event.
    copyButton.addEventListener('click', () => {
      // Grab the pre block.
      const preBlock = copyButton.closest('.wp-block-code');

      // Grab the code block.
      const codeBlock = preBlock.querySelector('code');

      // Grab the code block's text.
      const codeBlockText = codeBlock.innerText;
      try {
        const copyBlob = new Blob([codeBlockText], {
          type: 'text/plain'
        });
        const data = [new ClipboardItem({
          [copyBlob.type]: copyBlob
        })];
        navigator.clipboard.write(data);

        // Change icon to checkmark.
        copyButton.querySelector('use').setAttribute('xlink:href', '#lucide-copy-check');

        // Change icon back to copy.
        setTimeout(() => {
          copyButton.querySelector('use').setAttribute('xlink:href', '#lucide-copy');
        }, 1500);

        // Let the user know the code block has been copied.
        (0,_wordpress_a11y__WEBPACK_IMPORTED_MODULE_0__.speak)(dlxSyntaxHighlightingCodeBlockCopyAddon.copiedLabel);
      } catch (e) {
        // Copying is not supported on Mozilla (firefox).
      }
    });
  });
});
}();
/******/ })()
;
//# sourceMappingURL=copy-frontend.js.map