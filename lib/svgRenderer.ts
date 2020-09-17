import { Vector2 } from '@daign/math';
import { PresentationNode, View, DomPool } from '@daign/2d-pipeline';
import { StyleSelectorChain, StyleSheet, StyleProcessor } from '@daign/style-sheets';
import { GraphicStyle, Group, Line, Polyline, Text, TwoPointCircle, TwoPointRectangle } from
'@daign/2d-graphics';

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

      const lineNode = DomPool.get( 'line', 'http://www.w3.org/2000/svg' );
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

      const rectNode = DomPool.get( 'rect', 'http://www.w3.org/2000/svg' );
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

      const lineNode = DomPool.get( 'polyline', 'http://www.w3.org/2000/svg' );
      lineNode.setAttribute( 'points', pointsString );
      node = lineNode;
    }

    if ( currentNode.sourceNode instanceof TwoPointCircle ) {
      const circle = currentNode.sourceNode;
      selectorChain.addSelector( circle.styleSelector );

      const center = circle.getCenterTransformed( currentNode.projectNodeToView );
      const radius = circle.getRadiusTransformed( currentNode.projectNodeToView );

      const circleNode = DomPool.get( 'circle', 'http://www.w3.org/2000/svg' );
      circleNode.setAttribute( 'cx', String( center.x ) );
      circleNode.setAttribute( 'cy', String( center.y ) );
      circleNode.setAttribute( 'r', String( radius ) );
      node = circleNode;
    }

    if ( currentNode.sourceNode instanceof Text ) {
      const text = currentNode.sourceNode;
      selectorChain.addSelector( text.styleSelector );

      const anchor = text.getAnchorTransformed( currentNode.projectNodeToView );

      const textNode = DomPool.get( 'text', 'http://www.w3.org/2000/svg' );
      textNode.setAttribute( 'x', String( anchor.x ) );
      textNode.setAttribute( 'y', String( anchor.y ) );
      textNode.setAttribute( 'text-anchor', text.textAnchor );
      textNode.textContent = text.content;
      node = textNode;
    }

    if ( currentNode.sourceNode instanceof Group ) {
      selectorChain.addSelector( currentNode.sourceNode.styleSelector );

      const groupNode = DomPool.get( 'g', 'http://www.w3.org/2000/svg' );
      currentNode.children.forEach( ( child: PresentationNode ): void => {
        const selectorChainCopy = selectorChain.clone();
        const renderedNode = this.renderRecursive( child, selectorChainCopy );
        groupNode.appendChild( renderedNode );
      } );
      node = groupNode;
    }

    if ( currentNode.sourceNode instanceof View ) {
      const groupNode = DomPool.get( 'g', 'http://www.w3.org/2000/svg' );
      currentNode.children.forEach( ( child: PresentationNode ): void => {
        const selectorChainCopy = selectorChain.clone();
        const renderedNode = this.renderRecursive( child, selectorChainCopy );
        groupNode.appendChild( renderedNode );
      } );
      node = groupNode;
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
