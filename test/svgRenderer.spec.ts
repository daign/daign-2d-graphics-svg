import { expect } from 'chai';

import { MockDocument } from '@daign/mock-dom';
import { View } from '@daign/2d-pipeline';
import { GraphicStyle, Line, StyledGraphicNode } from '@daign/2d-graphics';
import { StyleSheet } from '@daign/style-sheets';
import { WrappedNode } from '@daign/dom-pool';

import { RendererFactory } from '../lib';

declare var global: any;

describe( 'SvgRenderer', (): void => {
  beforeEach( (): void => {
    global.document = new MockDocument();
  } );

  describe( 'applyStyle', (): void => {
    it( 'should set all attributes to the node', (): void => {
      // Arrange
      const styleSheet = new StyleSheet<GraphicStyle>();
      const rendererFactory = new RendererFactory();
      const svgRenderer = rendererFactory.createRenderer( styleSheet );

      const wrappedNode = new WrappedNode( 'div' );
      const style = new GraphicStyle( 'black', 0.9, 'evenodd', 'blue', 2, 0.8, 'square', 'bevel', 4,
        '1,2,3', 10, 'non-scaling-stroke', 'block', 'hidden', 0.7, 'normal', 'url(#mask)',
        'sans-serif', '12px', 'italic', 'small-caps', 'bold', 'ultra-condensed', '2px', '3px',
        'line-through', 'fill', 'pointer' );

      // Act
      ( svgRenderer as any ).applyStyle( wrappedNode, style );

      // Assert
      expect( wrappedNode.domNode.getAttribute( 'fill' ) ).to.equal( 'black' );
      expect( wrappedNode.domNode.getAttribute( 'fill-opacity' ) ).to.equal( '0.9' );
      expect( wrappedNode.domNode.getAttribute( 'fill-rule' ) ).to.equal( 'evenodd' );
      expect( wrappedNode.domNode.getAttribute( 'stroke' ) ).to.equal( 'blue' );
      expect( wrappedNode.domNode.getAttribute( 'stroke-width' ) ).to.equal( '2' );
      expect( wrappedNode.domNode.getAttribute( 'stroke-opacity' ) ).to.equal( '0.8' );
      expect( wrappedNode.domNode.getAttribute( 'stroke-linecap' ) ).to.equal( 'square' );
      expect( wrappedNode.domNode.getAttribute( 'stroke-linejoin' ) ).to.equal( 'bevel' );
      expect( wrappedNode.domNode.getAttribute( 'stroke-miterlimit' ) ).to.equal( '4' );
      expect( wrappedNode.domNode.getAttribute( 'stroke-dasharray' ) ).to.equal( '1,2,3' );
      expect( wrappedNode.domNode.getAttribute( 'stroke-dashoffset' ) ).to.equal( '10' );
      expect( wrappedNode.domNode.getAttribute( 'vector-effect' ) )
        .to.equal( 'non-scaling-stroke' );
      expect( wrappedNode.domNode.getAttribute( 'display' ) ).to.equal( 'block' );
      expect( wrappedNode.domNode.getAttribute( 'visibility' ) ).to.equal( 'hidden' );
      expect( wrappedNode.domNode.getAttribute( 'opacity' ) ).to.equal( '0.7' );
      expect( wrappedNode.domNode.getAttribute( 'paint-order' ) ).to.equal( 'normal' );
      expect( wrappedNode.domNode.getAttribute( 'mask' ) ).to.equal( 'url(#mask)' );
      expect( wrappedNode.domNode.style.fontFamily ).to.equal( 'sans-serif' );
      expect( wrappedNode.domNode.style.fontSize ).to.equal( '12px' );
      expect( wrappedNode.domNode.style.fontStyle ).to.equal( 'italic' );
      expect( wrappedNode.domNode.style.fontVariant ).to.equal( 'small-caps' );
      expect( wrappedNode.domNode.style.fontWeight ).to.equal( 'bold' );
      expect( wrappedNode.domNode.style.fontStretch ).to.equal( 'ultra-condensed' );
      expect( wrappedNode.domNode.style.letterSpacing ).to.equal( '2px' );
      expect( wrappedNode.domNode.style.wordSpacing ).to.equal( '3px' );
      expect( wrappedNode.domNode.style.textDecoration ).to.equal( 'line-through' );
      expect( wrappedNode.domNode.getAttribute( 'pointer-events' ) ).to.equal( 'fill' );
      expect( wrappedNode.domNode.getAttribute( 'cursor' ) ).to.equal( 'pointer' );
    } );
  } );

  describe( 'render', (): void => {
    it( 'should append the rendered node to the target node', (): void => {
      // Arrange
      const styleSheet = new StyleSheet<GraphicStyle>();
      const rendererFactory = new RendererFactory();
      const svgRenderer = rendererFactory.createRenderer( styleSheet );
      svgRenderer.useInlineStyles = true;

      const node = new Line();
      const view = new View();
      view.mountNode( node );
      const target = new WrappedNode( 'div' );

      // Act
      svgRenderer.render( view, target );

      // Assert
      expect( target.children.length ).to.equal( 1 ); // View node.
      expect( target.children[ 0 ].children.length ).to.equal( 1 ); // Line node.
      expect( ( target.children[ 0 ].children[ 0 ] as any )._domNode.nodeName )
        .to.equal( 'line' );
    } );

    it( 'should render a node for an inherited class', (): void => {
      // Arrange
      class CustomLine extends Line {
        public constructor() {
          super();
        }
      }

      const styleSheet = new StyleSheet<GraphicStyle>();
      const rendererFactory = new RendererFactory();
      const svgRenderer = rendererFactory.createRenderer( styleSheet );
      svgRenderer.useInlineStyles = true;

      const node = new CustomLine();
      const view = new View();
      view.mountNode( node );
      const target = new WrappedNode( 'div' );

      // Act
      svgRenderer.render( view, target );

      // Assert
      expect( target.children.length ).to.equal( 1 ); // View node.
      expect( target.children[ 0 ].children.length ).to.equal( 1 ); // Line node.
      expect( ( target.children[ 0 ].children[ 0 ] as any )._domNode.nodeName )
        .to.equal( 'line' );
    } );

    it( 'should not render a node for a class without a corresponding render module', (): void => {
      // Arrange
      class CustomLine extends StyledGraphicNode {
        public constructor() {
          super();
        }
      }

      const styleSheet = new StyleSheet<GraphicStyle>();
      const rendererFactory = new RendererFactory();
      const svgRenderer = rendererFactory.createRenderer( styleSheet );
      svgRenderer.useInlineStyles = true;

      const node = new CustomLine();
      const view = new View();
      view.mountNode( node );
      const target = new WrappedNode( 'div' );

      // Act
      svgRenderer.render( view, target );

      // Assert
      expect( target.children.length ).to.equal( 1 ); // View node.
      expect( target.children[ 0 ].children.length ).to.equal( 0 );
    } );

    it( 'should clear children when doing multiple renders', (): void => {
      // Arrange
      const styleSheet = new StyleSheet<GraphicStyle>();
      const rendererFactory = new RendererFactory();
      const svgRenderer = rendererFactory.createRenderer( styleSheet );
      svgRenderer.useInlineStyles = true;

      const node = new Line();
      const view = new View();
      view.mountNode( node );
      const target = new WrappedNode( 'div' );

      // Act
      svgRenderer.render( view, target ); // First render call.
      svgRenderer.render( view, target ); // Second render call.

      // Assert
      // Result still has single nodes only.
      expect( target.children.length ).to.equal( 1 ); // View node.
      expect( target.children[ 0 ].children.length ).to.equal( 1 ); // Line node.
      expect( ( target.children[ 0 ].children[ 0 ] as any )._domNode.nodeName )
        .to.equal( 'line' );
    } );

    it( 'should set class property when rendering with style sheet enabled', (): void => {
      // Arrange
      const styleSheet = new StyleSheet<GraphicStyle>();
      const rendererFactory = new RendererFactory();
      const svgRenderer = rendererFactory.createRenderer( styleSheet );
      svgRenderer.useInlineStyles = false;

      const node = new Line();
      node.addClass( 'lineClass' );
      const view = new View();
      view.mountNode( node );
      const target = new WrappedNode( 'div' );

      // Act
      svgRenderer.render( view, target );

      // Assert
      // View node.
      expect( target.children.length ).to.equal( 1 );
      const viewNode = target.children[ 0 ];

      // Line node.
      expect( viewNode.children.length ).to.equal( 1 );
      const lineNode = viewNode.children[ 0 ];
      expect( ( lineNode as any )._domNode.attributes.class )
        .to.equal( 'line lineClass' );
    } );
  } );

  describe( 'appendRenderedNode', (): void => {
    it( 'should append the rendered node to the target node', (): void => {
      // Arrange
      const styleSheet = new StyleSheet<GraphicStyle>();
      const rendererFactory = new RendererFactory();
      const svgRenderer = rendererFactory.createRenderer( styleSheet );

      const parent = new WrappedNode( 'g' );
      const renderedNode = new WrappedNode( 'line' );

      // Act
      svgRenderer.appendRenderedNode( parent, renderedNode );

      // Assert
      expect( parent.children.length ).to.equal( 1 );
      expect( parent.children[ 0 ].domNode.nodeName ).to.equal( 'line' );
    } );

    it( 'should not append an unchanged group when flattenGroups property is set', (): void => {
      // Arrange
      const styleSheet = new StyleSheet<GraphicStyle>();
      const rendererFactory = new RendererFactory();
      const svgRenderer = rendererFactory.createRenderer( styleSheet );
      svgRenderer.flattenGroups = true;

      const parent = new WrappedNode( 'g' );
      const renderedNode = new WrappedNode( 'g' );

      // Act
      svgRenderer.appendRenderedNode( parent, renderedNode );

      // Assert
      expect( parent.children.length ).to.equal( 0 );
    } );

    it( 'should append group children directly when flattenGroups property is set', (): void => {
      // Arrange
      const styleSheet = new StyleSheet<GraphicStyle>();
      const rendererFactory = new RendererFactory();
      const svgRenderer = rendererFactory.createRenderer( styleSheet );
      svgRenderer.flattenGroups = true;

      const parent = new WrappedNode( 'g' );
      const renderedNode = new WrappedNode( 'g' );
      const child1 = new WrappedNode( 'line' );
      const child2 = new WrappedNode( 'rect' );
      renderedNode.appendChild( child1 );
      renderedNode.appendChild( child2 );

      // Act
      svgRenderer.appendRenderedNode( parent, renderedNode );

      // Assert
      expect( parent.children.length ).to.equal( 2 );
      expect( parent.children[ 0 ].domNode.nodeName ).to.equal( 'line' );
      expect( parent.children[ 1 ].domNode.nodeName ).to.equal( 'rect' );
    } );
  } );
} );
