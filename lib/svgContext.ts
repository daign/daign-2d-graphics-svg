import { Vector2 } from '@daign/math';
import { DomPool } from '@daign/2d-pipeline';

/**
 * Class for a svg context.
 */
export class SvgContext {
  public node: any;

  public size: Vector2 | null = null;

  /**
   * Constructor.
   */
  public constructor() {
    this.node = DomPool.get( 'svg', 'http://www.w3.org/2000/svg' );
    this.node.style.border = '1px solid black';
  }

  /**
   * Set the size of the SVG element.
   * @param size - The size vector.
   */
  public setSize( size: Vector2 ): void {
    this.size = size;
    this.node.style.width  = `${size.x}px`;
    this.node.style.height = `${size.y}px`;
    this.node.setAttribute( 'viewBox', `0,0,${size.x},${size.y}` );
  }
}
