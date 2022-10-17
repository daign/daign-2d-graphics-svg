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

  describe( 'render', (): void => {
    it( 'should append the rendered node to the target node', (): void => {
      // Arrange
      const styleSheet = new StyleSheet<GraphicStyle>();
      const rendererFactory = new RendererFactory();
      const svgRenderer = rendererFactory.createRenderer( styleSheet );

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
  } );
} );
