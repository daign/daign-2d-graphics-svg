import { GraphicNode, PresentationNode, View } from '@daign/2d-pipeline';
import { StyleSelectorChain, StyleSheet, StyleProcessor } from '@daign/style-sheets';
import { GraphicStyle, StyledGraphicNode } from '@daign/2d-graphics';
import { WrappedDomPool, WrappedNode } from '@daign/dom-pool';
import { Handle } from '@daign/handle';

import { RenderModule } from './renderModule';

/**
 * Class for the SvgRenderer.
 * Constructs a DOM-tree of SVG-specific nodes.
 */
export class SvgRenderer {
  private renderModules: RenderModule[] = [];

  // Whether to remove unnecessary group notes from the renderer output.
  public flattenGroups: boolean = false;

  // Whether the renderer should render using SVG native transforms where possible.
  public useNativeTransforms: boolean = false;

  // Whether the renderer should apply styles directly to elements instead of using a stylesheet.
  public useInlineStyles: boolean = false;

  /**
   * Constructor.
   * @param styleSheet - The style sheet to use.
   */
  public constructor(
    private styleSheet: StyleSheet<GraphicStyle>
  ) {}

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
    if ( style.fillOpacity !== null ) {
      node.setAttribute( 'fill-opacity', String( style.fillOpacity ) );
    }
    if ( style.fillRule ) {
      node.setAttribute( 'fill-rule', style.fillRule );
    }
    if ( style.stroke ) {
      node.setAttribute( 'stroke', style.stroke );
    }
    if ( style.strokeWidth !== null ) {
      node.setAttribute( 'stroke-width', String( style.strokeWidth ) );
    }
    if ( style.strokeOpacity !== null ) {
      node.setAttribute( 'stroke-opacity', String( style.strokeOpacity ) );
    }
    if ( style.strokeLinecap ) {
      node.setAttribute( 'stroke-linecap', style.strokeLinecap );
    }
    if ( style.strokeLinejoin ) {
      node.setAttribute( 'stroke-linejoin', style.strokeLinejoin );
    }
    if ( style.strokeMiterlimit !== null ) {
      node.setAttribute( 'stroke-miterlimit', String( style.strokeMiterlimit ) );
    }
    if ( style.strokeDasharray ) {
      node.setAttribute( 'stroke-dasharray', style.strokeDasharray );
    }
    if ( style.strokeDashoffset !== null ) {
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
    if ( style.opacity !== null ) {
      node.setAttribute( 'opacity', String( style.opacity ) );
    }
    if ( style.paintOrder ) {
      node.setAttribute( 'paint-order', style.paintOrder );
    }
    if ( style.mask ) {
      node.setAttribute( 'mask', style.mask );
    }
    if ( style.fontFamily ) {
      node.style.fontFamily = style.fontFamily;
    }
    if ( style.fontSize ) {
      node.style.fontSize = style.fontSize;
    }
    if ( style.fontStyle ) {
      node.style.fontStyle = style.fontStyle;
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
    // The GraphicNode from which the PresentationNode was generated.
    const sourceNode = currentNode.sourceNode;

    /* The resulting node. All modules access this variable and can modify or overwrite nodes that
     * were created by other modules prior in the execution order. */
    let node: WrappedNode | null = null;

    /* If the renderer is also applying native transforms, then use the non native projection
     * matrix, because it does not include the native transformations. */
    const projection = this.useNativeTransforms ? currentNode.projectNodeToViewNonNative :
      currentNode.projectNodeToView;

    // All render modules added to the SvgRenderer are checked and executed if the type matches.
    this.renderModules.forEach( ( module: RenderModule ): void => {
      if ( this.doesModuleMatchToNode( sourceNode, module.type ) ) {
        const result = module.callback( currentNode, projection, selectorChain, node, this );
        if ( result !== null ) {
          node = result;
        }
      }
    } );

    // Test if a node was returned as a result from one of the render modules.
    if ( node !== null ) {
      node = node as WrappedNode;

      // If the renderer should use native transforms, then add the transform attribute.
      if ( this.useNativeTransforms ) {
        const transformCommand = currentNode.sourceNode.transformation.nativeSvgTransform;
        if ( transformCommand ) {
          node.setAttribute( 'transform', transformCommand );
        }
      }

      if ( sourceNode instanceof StyledGraphicNode ) {
        // Apply styling to the node.
        if ( this.useInlineStyles ) {
          // Calculate the style information and apply as inline style.
          const styleProcessor = new StyleProcessor<GraphicStyle>();

          const calculatedStyle = styleProcessor.calculateStyle( this.styleSheet, selectorChain,
            GraphicStyle, sourceNode.elementStyle || undefined );
          this.applyStyle( node, calculatedStyle );
        } else {
          // Or set the class attribute to reference a style sheet.
          const classNames = sourceNode.styleSelector.printSelectorSpaced();
          node.setAttribute( 'class', classNames );
          // And only set the element style directly to the node.
          if ( sourceNode.elementStyle ) {
            this.applyStyle( node, sourceNode.elementStyle );
          }
        }

        // Set properties that can be set to every StyledGraphicNode.
        if ( sourceNode.id ) {
          node.setAttribute( 'id', sourceNode.id );
        }
        if ( sourceNode.mask ) {
          node.setAttribute( 'mask', sourceNode.mask );
        }
        if ( sourceNode.clipPath ) {
          node.setAttribute( 'clip-path', sourceNode.clipPath );
        }

        // Callback will be executed when node is clicked.
        if ( sourceNode.onclick ) {
          const handle = new Handle();
          handle.setStartNode( node );
          handle.beginning = (): boolean => {
            return true;
          };
          handle.clicked = (): void => {
            sourceNode.onclick!();
          };
        }
      }
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
      const renderedNode = this.renderRecursive( presentationNode, selectorChain );
      this.appendRenderedNode( target, renderedNode );
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
    return ( graphicNode instanceof moduleType );
  }

  /**
   * Append the rendered node to the parent node.
   * @param parent - The parent node.
   * @param renderedNode - The rendered node to append or null.
   */
  public appendRenderedNode( parent: WrappedNode, renderedNode: WrappedNode | null ): void {
    if ( renderedNode !== null ) {
      /* When attempting to append an unchanged group element while the flattenGroups property is
       * set, then the child elements are appended directly instead. */
      if ( this.flattenGroups && renderedNode.nodeName === 'g' && renderedNode.isPristine ) {
        renderedNode.children.forEach( ( subChild: WrappedNode ): void => {
          parent.appendChild( subChild );
        } );

        // The unused group node is returned to the dom pool.
        WrappedDomPool.giveBack( renderedNode );
      } else {
        // Else append the rendered node directly.
        parent.appendChild( renderedNode );
      }
    }
  }
}
