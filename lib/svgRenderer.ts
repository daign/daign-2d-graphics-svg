import { GraphicNode, PresentationNode, View } from '@daign/2d-pipeline';
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
    if ( style.fillOpacity ) {
      node.setAttribute( 'fill-opacity', String( style.fillOpacity ) );
    }
    if ( style.fillRule ) {
      node.setAttribute( 'fill-rule', style.fillRule );
    }
    if ( style.stroke ) {
      node.setAttribute( 'stroke', style.stroke );
    }
    if ( style.strokeWidth ) {
      node.setAttribute( 'stroke-width', String( style.strokeWidth ) );
    }
    if ( style.strokeOpacity ) {
      node.setAttribute( 'stroke-opacity', String( style.strokeOpacity ) );
    }
    if ( style.strokeLinecap ) {
      node.setAttribute( 'stroke-linecap', style.strokeLinecap );
    }
    if ( style.strokeLinejoin ) {
      node.setAttribute( 'stroke-linejoin', style.strokeLinejoin );
    }
    if ( style.strokeMiterlimit ) {
      node.setAttribute( 'stroke-miterlimit', String( style.strokeMiterlimit ) );
    }
    if ( style.strokeDasharray ) {
      node.setAttribute( 'stroke-dasharray', style.strokeDasharray );
    }
    if ( style.strokeDashoffset ) {
      node.setAttribute( 'stroke-dashoffset', String( style.strokeDashoffset ) );
    }
    if ( style.vectorEffect ) {
      node.setAttribute( 'vector-effect', style.vectorEffect );
    }
    if ( style.display ) {
      node.setAttribute( 'display', style.display );
    }
    if ( style.visibility ) {
      node.setAttribute( 'visibility', style.visibility );
    }
    if ( style.opacity ) {
      node.setAttribute( 'opacity', String( style.opacity ) );
    }
    if ( style.fontFamily ) {
      node.style.fontFamily = style.fontFamily;
    }
    if ( style.fontSize ) {
      node.style.fontSize = style.fontSize;
    }
    if ( style.fontStyle ) {
      node.style.fontSize = style.fontStyle;
    }
    if ( style.fontVariant ) {
      node.style.fontVariant = style.fontVariant;
    }
    if ( style.fontWeight ) {
      node.style.fontWeight = style.fontWeight;
    }
    if ( style.fontStretch ) {
      node.style.fontStretch = style.fontStretch;
    }
    if ( style.letterSpacing ) {
      node.style.letterSpacing = style.letterSpacing;
    }
    if ( style.wordSpacing ) {
      node.style.wordSpacing = style.wordSpacing;
    }
    if ( style.textDecoration ) {
      node.style.textDecoration = style.textDecoration;
    }
    if ( style.pointerEvents ) {
      node.setAttribute( 'pointer-events', style.pointerEvents );
    }
    if ( style.cursor ) {
      node.setAttribute( 'cursor', style.cursor );
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
      if (
        currentNode.sourceNode &&
        this.doesModuleMatchToNode( currentNode.sourceNode, module.type )
      ) {
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

  /**
   * Checks whether the type of the render module matches the graphic node. It matches when the
   * source node is from the same class type or an inherited class type.
   * @param graphicNode - The graphic node from the document tree.
   * @param moduleType - The type of the render module.
   * @returns Whether the types match.
   */
  private doesModuleMatchToNode( graphicNode: GraphicNode, moduleType: any ): boolean {
    // Instanceof check.
    if ( graphicNode instanceof moduleType ) {
      return true;
    }

    /* Instanceof is not working for classes inherited from a base class that originates from its
     * own instance of an imported library. Therefore we do a recursive check against the prototype
     * chain of the node. */
    const recursiveCheck = ( classType: any ): boolean => {
      if ( classType.constructor.name === moduleType.name ) {
        return true;
      } else {
        const parentClass = Object.getPrototypeOf( classType );
        if ( parentClass ) {
          return recursiveCheck( parentClass );
        } else {
          return false;
        }
      }
    };

    return recursiveCheck( graphicNode );
  }
}
