import { Vector2 } from '@daign/math';
import { ITargetContext } from '@daign/2d-graphics';
import { WrappedDomPool, WrappedNode } from '@daign/dom-pool';

/**
 * Class for an svg context.
 */
export class SvgContext implements ITargetContext {
  private _size: Vector2 = new Vector2( 1, 1 );
  public wrappedNode: WrappedNode;

  /**
   * Get the dom node for the SVG element.
   * @returns - The dom node.
   */
  public get domNode(): any {
    return this.wrappedNode.domNode;
  }

  /**
   * Get the size of the SVG element.
   * @returns - The size of the SVG element.
   */
  public get size(): Vector2 {
    return this._size;
  }

  /**
   * Set the size of the SVG element.
   * @param size - The size of the SVG element.
   */
  public set size( size: Vector2 ) {
    this._size.copy( size );
    this.domNode.setAttribute( 'xmlns', WrappedDomPool.svgNamespace );
    this.domNode.setAttribute( 'xmlns:xlink', WrappedDomPool.xlinkNamespace );
    this.domNode.style.width  = `${size.x}px`;
    this.domNode.style.height = `${size.y}px`;
    this.domNode.setAttribute( 'viewBox', `0,0,${size.x},${size.y}` );
  }

  /**
   * Constructor.
   */
  public constructor() {
    this.wrappedNode = WrappedDomPool.getSvg( 'svg' );
  }
}
