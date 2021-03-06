import { PresentationNode, View } from '@daign/2d-pipeline';
import { StyleSelectorChain, StyleSheet, StyleProcessor } from '@daign/style-sheets';
import { GraphicStyle } from '@daign/2d-graphics';
import { WrappedDomPool, WrappedNode } from '@daign/dom-pool';

import { RenderModule } from './renderModule';

/**
 * Class for the SvgRenderer.
 * Constructs a DOM-tree of SVG-specific nodes.
 */
export class SvgRenderer {
  private styleSheet: StyleSheet<GraphicStyle>;

  private renderModules: RenderModule[] = [];

  /**
   * Constructor.
   * @param styleSheet - The style sheet to use.
   */
  public constructor( styleSheet: StyleSheet<GraphicStyle> ) {
    this.styleSheet = styleSheet;
  }

  /**
   * Add a render module to the renderer.
   * @param renderModule - The renderModule to add.
   */
  public addRenderModule( renderModule: RenderModule ): void {
    this.renderModules.push( renderModule );
  }

  /**
   * Apply the style to a node.
   * @param node - The node to use.
   * @param style - The style to apply.
   */
  private applyStyle( node: WrappedNode, style: GraphicStyle ): void {
    if ( style.fill ) {
      node.setAttribute( 'fill', style.fill );
    }
    if ( style.stroke ) {
      node.setAttribute( 'stroke', style.stroke );
    }
    if ( style.strokeWidth ) {
      node.setAttribute( 'stroke-width', String( style.strokeWidth ) );
    }
    if ( style.opacity ) {
      node.setAttribute( 'opacity', String( style.opacity ) );
    }
    if ( style.fontSize ) {
      node.style.fontSize = style.fontSize;
    }
  }

  /**
   * Recursive render function to create the display version of the nodes.
   * @param currentNode - The presentation node to render.
   * @param selectorChain - The style selector chain object.
   * @returns The rendered node or null.
   */
  public renderRecursive(
    currentNode: PresentationNode, selectorChain: StyleSelectorChain
  ): WrappedNode | null {
    /* The resulting node. All modules access this variable and can modify or overwrite nodes that
     * were created by other modules prior in the execution order. */
    let node: WrappedNode | null = null;

    // All render modules added to the SvgRenderer are checked and executed if the type matches.
    this.renderModules.forEach( ( module: RenderModule ): void => {
      if ( currentNode.sourceNode instanceof module.type ) {
        const result = module.callback( currentNode, selectorChain, node, this );
        if ( result !== null ) {
          node = result;
        }
      }
    } );

    if ( node !== null ) {
      const styleProcessor = new StyleProcessor<GraphicStyle>();
      const calculatedStyle = styleProcessor.calculateStyle( this.styleSheet, selectorChain,
        GraphicStyle );
      this.applyStyle( node, calculatedStyle );
    }
    return node;
  }

  /**
   * Clear all children from a node recursive.
   * @param node - The node to clear.
   */
  private clearRecursive( node: WrappedNode ): void {
    node.children.forEach( ( child: WrappedNode ): void => {
      this.clearRecursive( child );
    } );
    WrappedDomPool.giveBack( node );
  }

  /**
   * Render the view into the target node.
   * @param view - The view to render.
   * @param target - The node to append the render result to.
   */
  public render( view: View, target: WrappedNode ): void {
    target.children.forEach( ( child: WrappedNode ): void => {
      this.clearRecursive( child );
    } );
    target.clearChildren();

    const presentationNode = view.viewPresentationNode;
    const selectorChain = new StyleSelectorChain();

    if ( presentationNode !== null ) {
      const result = this.renderRecursive( presentationNode, selectorChain );
      if ( result !== null ) {
        target.appendChild( result );
      }
    }
  }
}
