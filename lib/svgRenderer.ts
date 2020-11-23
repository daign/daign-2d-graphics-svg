import { Vector2 } from '@daign/math';
import { Handle } from '@daign/handle';
import { PresentationNode, View } from '@daign/2d-pipeline';
import { StyleSelectorChain, StyleSheet, StyleProcessor } from '@daign/style-sheets';
import { GraphicStyle, Group, Line, Polyline, Text, TwoPointCircle, TwoPointRectangle,
ControlObject, ApplicationView, FixedRadiusCircle, ControlPoint, ButtonControl
} from '@daign/2d-graphics';
import { DomPool } from '@daign/dom-pool';

/**
 * Class for the SvgRenderer.
 * Constructs a DOM-tree of SVG-specific nodes.
 */
export class SvgRenderer {
  private styleSheet: StyleSheet<GraphicStyle>;

  /**
   * Constructor.
   * @param styleSheet - The style sheet to use.
   */
  public constructor( styleSheet: StyleSheet<GraphicStyle> ) {
    this.styleSheet = styleSheet;
  }

  /**
   * Apply the style to a node.
   * @param node - The node to use.
   * @param style - The style to apply.
   */
  private applyStyle( node: any, style: GraphicStyle ): void {
    // Clear attributes because we are reusing the nodes.
    node.removeAttribute( 'fill' );
    node.removeAttribute( 'stroke' );
    node.removeAttribute( 'stroke-width' );
    node.removeAttribute( 'opacity' );
    node.removeAttribute( 'style' );

    if ( style.fill ) {
      node.setAttribute( 'fill', style.fill );
    }
    if ( style.stroke ) {
      node.setAttribute( 'stroke', style.stroke );
    }
    if ( style.strokeWidth ) {
      node.setAttribute( 'stroke-width', style.strokeWidth );
    }
    if ( style.opacity ) {
      node.setAttribute( 'opacity', style.opacity );
    }
    if ( style.fontSize ) {
      node.style.fontSize = style.fontSize;
    }
  }

  /**
   * Recursive render function to create the display version of the nodes.
   * @param currentNode - The presentation node to render.
   * @param selectorChain - The style selector chain object.
   * @returns The rendered node.
   */
  private renderRecursive( currentNode: PresentationNode, selectorChain: StyleSelectorChain ): any {
    let node;

    if ( currentNode.sourceNode instanceof Line ) {
      const line = currentNode.sourceNode;
      selectorChain.addSelector( line.styleSelector );

      const startPoint = line.getStartTransformed( currentNode.projectNodeToView );
      const endPoint = line.getEndTransformed( currentNode.projectNodeToView );

      const lineNode = DomPool.getSvg( 'line' );
      lineNode.setAttribute( 'x1', String( startPoint.x ) );
      lineNode.setAttribute( 'y1', String( startPoint.y ) );
      lineNode.setAttribute( 'x2', String( endPoint.x ) );
      lineNode.setAttribute( 'y2', String( endPoint.y ) );
      node = lineNode;
    }

    if ( currentNode.sourceNode instanceof TwoPointRectangle ) {
      const rectangle = currentNode.sourceNode;
      selectorChain.addSelector( rectangle.styleSelector );

      const startPoint = rectangle.getStartTransformed( currentNode.projectNodeToView );
      const size = rectangle.getSizeTransformed( currentNode.projectNodeToView );

      const rectNode = DomPool.getSvg( 'rect' );
      rectNode.setAttribute( 'x', String( startPoint.x ) );
      rectNode.setAttribute( 'y', String( startPoint.y ) );
      rectNode.setAttribute( 'width', String( size.x ) );
      rectNode.setAttribute( 'height', String( size.y ) );
      node = rectNode;
    }

    if ( currentNode.sourceNode instanceof Polyline ) {
      const polyline = currentNode.sourceNode;
      selectorChain.addSelector( polyline.styleSelector );

      const points = polyline.getPointsTransformed( currentNode.projectNodeToView );
      const pointsString = points.map( ( p: Vector2 ): string => `${p.x},${p.y}` ).join( ' ' );

      const lineNode = DomPool.getSvg( 'polyline' );
      lineNode.setAttribute( 'points', pointsString );
      node = lineNode;
    }

    if ( currentNode.sourceNode instanceof TwoPointCircle ) {
      const circle = currentNode.sourceNode;
      selectorChain.addSelector( circle.styleSelector );

      const center = circle.getCenterTransformed( currentNode.projectNodeToView );
      const radius = circle.getRadiusTransformed( currentNode.projectNodeToView );

      const circleNode = DomPool.getFreshSvg( 'circle' );
      circleNode.setAttribute( 'cx', String( center.x ) );
      circleNode.setAttribute( 'cy', String( center.y ) );
      circleNode.setAttribute( 'r', String( radius ) );
      node = circleNode;
    }

    if ( currentNode.sourceNode instanceof FixedRadiusCircle ) {
      const circle = currentNode.sourceNode;
      selectorChain.addSelector( circle.styleSelector );

      const center = circle.getCenterTransformed( currentNode.projectNodeToView );
      const radius = circle.radius;

      const circleNode = DomPool.getFreshSvg( 'circle' );
      circleNode.setAttribute( 'cx', String( center.x ) );
      circleNode.setAttribute( 'cy', String( center.y ) );
      circleNode.setAttribute( 'r', String( radius ) );
      node = circleNode;
    }

    if ( currentNode.sourceNode instanceof Text ) {
      const text = currentNode.sourceNode;
      selectorChain.addSelector( text.styleSelector );

      const anchor = text.getAnchorTransformed( currentNode.projectNodeToView );

      const textNode = DomPool.getSvg( 'text' );
      textNode.setAttribute( 'x', String( anchor.x ) );
      textNode.setAttribute( 'y', String( anchor.y ) );
      textNode.setAttribute( 'text-anchor', text.textAnchor );
      textNode.textContent = text.content;
      node = textNode;
    }

    if ( currentNode.sourceNode instanceof Group ) {
      selectorChain.addSelector( currentNode.sourceNode.styleSelector );

      const groupNode = DomPool.getFreshSvg( 'g' );
      currentNode.children.forEach( ( child: PresentationNode ): void => {
        const selectorChainCopy = selectorChain.clone();
        const renderedNode = this.renderRecursive( child, selectorChainCopy );
        groupNode.appendChild( renderedNode );
      } );
      node = groupNode;
    }

    if ( currentNode.sourceNode instanceof View ) {
      const groupNode = DomPool.getSvg( 'g' );
      currentNode.children.forEach( ( child: PresentationNode ): void => {
        const selectorChainCopy = selectorChain.clone();
        const renderedNode = this.renderRecursive( child, selectorChainCopy );
        groupNode.appendChild( renderedNode );
      } );
      node = groupNode;
    }

    if ( currentNode.sourceNode instanceof ControlObject ) {
      const handle = new Handle( node );
      handle.beginning = (): boolean => {
        return true;
      };
      handle.clicked = (): void => {
        if ( currentNode.sourceNode ) {
          currentNode.sourceNode.presentationNodes.forEach( ( pn: PresentationNode ): void => {
            if ( pn.view instanceof ApplicationView ) {
              pn.view.application.activateElement( currentNode.sourceNode as ControlObject );
            }
          } );
        }
      };
    }

    if ( currentNode.sourceNode instanceof ControlPoint ) {
      const controlPoint = currentNode.sourceNode as ControlPoint;

      const handle = new Handle( node );
      handle.beginning = (): boolean => {
        controlPoint.snap();
        return true;
      };
      handle.continuing = (): void => {
        controlPoint.drag( handle.delta.clone() );
      };
    }

    if ( currentNode.sourceNode instanceof ButtonControl ) {
      const buttonControl = currentNode.sourceNode as ButtonControl;

      const handle = new Handle( node );
      handle.beginning = (): boolean => {
        return true;
      };
      handle.clicked = (): void => {
        buttonControl.click();
      };
    }

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
  private clearRecursive( node: any ): void {
    while ( node.firstChild ) {
      const child = node.firstChild;
      this.clearRecursive( child );
      node.removeChild( child );
      DomPool.giveBack( child );
    }
  }

  /**
   * Render the view into the target node.
   * @param view - The view to render.
   * @param target - The node to append the render result to.
   */
  public render( view: View, target: any ): void {
    this.clearRecursive( target );

    const presentationNode = view.viewPresentationNode;
    const selectorChain = new StyleSelectorChain();

    if ( presentationNode !== null ) {
      const result = this.renderRecursive( presentationNode, selectorChain );
      target.appendChild( result );
    }
  }
}
