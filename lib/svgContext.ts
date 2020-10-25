import { Vector2 } from '@daign/math';
import { ITargetContext } from '@daign/2d-graphics';
import { DomPool } from '@daign/dom-pool';

/**
 * Class for an svg context.
 */
export class SvgContext implements ITargetContext {
  public _size: Vector2 = new Vector2( 1, 1 );
  public domNode: any = null;

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
    this.domNode.style.width  = `${size.x}px`;
    this.domNode.style.height = `${size.y}px`;
    this.domNode.setAttribute( 'viewBox', `0,0,${size.x},${size.y}` );
  }

  /**
   * Constructor.
   */
  public constructor() {
    this.domNode = DomPool.getSvg( 'svg' );
  }
}
