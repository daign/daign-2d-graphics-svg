import { PresentationNode } from '@daign/2d-pipeline';
import { StyleSelectorChain } from '@daign/style-sheets';
import { WrappedNode } from '@daign/dom-pool';

import { SvgRenderer } from './svgRenderer';

/**
 * Class for the render modules.
 * Every time the renderer encounters an object of the specified type it will invoke the callback
 * function.
 */
export class RenderModule {
  // The type of object for which the module applies.
  public type: any;

  // The callback function with the code that specifies how the object is rendered.
  public callback: (
    // The PresentationNode of the object to render.
    currentNode: PresentationNode,
    // The style selector chain object.
    selectorChain: StyleSelectorChain,
    // The node created by another module that was applied on the object already before this module.
    node: WrappedNode | null,
    // The reference to the SvgRenderer object which is running.
    renderer: SvgRenderer
  ) => WrappedNode | null;

  /**
   * Constructor.
   * @param type - The type of object for which the module applies.
   * @param callback - The callback function that specifies how the object is rendered.
   */
  public constructor (
    type: any,
    callback: (
        currentNode: PresentationNode,
        selectorChain: StyleSelectorChain,
        node: WrappedNode | null,
        renderer: SvgRenderer
      ) => WrappedNode | null
  ) {
    this.type = type;
    this.callback = callback;
  }
}
