import { expect } from 'chai';

import { Vector2 } from '@daign/math';
import { StyleSelectorChain, StyleSheet } from '@daign/style-sheets';
import { PresentationNode, View } from '@daign/2d-pipeline';
import { WrappedNode } from '@daign/dom-pool';
import { GraphicStyle, Line } from '@daign/2d-graphics';

import { RendererFactory } from '../../lib';
import { lineModule } from '../../lib/renderModules';

describe( 'lineModule', (): void => {
  describe( 'render logic callback', (): void => {
    it( 'should return a wrapped node', (): void => {
      // Arrange
      const styleSheet = new StyleSheet<GraphicStyle>();
      const rendererFactory = new RendererFactory();
      const svgRenderer = rendererFactory.createRenderer( styleSheet );

      const module = lineModule;
      const view = new View();
      const node = new Line();
      const currentNode = new PresentationNode( view, node );
      const selectorChain = new StyleSelectorChain();

      // Act
      const result = module.callback( currentNode, currentNode.projectNodeToView, selectorChain,
        null, svgRenderer );

      // Assert
      expect( result instanceof WrappedNode ).to.be.true;
    } );

    it( 'should create a line node and set the attributes', (): void => {
      // Arrange
      const styleSheet = new StyleSheet<GraphicStyle>();
      const rendererFactory = new RendererFactory();
      const svgRenderer = rendererFactory.createRenderer( styleSheet );

      const module = lineModule;
      const view = new View();
      const line = new Line();
      line.start = new Vector2( 1, 2 );
      line.end = new Vector2( 3, 4 );
      const currentNode = new PresentationNode( view, line );
      const selectorChain = new StyleSelectorChain();

      // Act
      const result = module.callback( currentNode, currentNode.projectNodeToView, selectorChain,
        null, svgRenderer );

      // Assert
      expect( result!.domNode.nodeName ).to.equal( 'line' );
      expect( result!.domNode.getAttribute( 'x1' ) ).to.equal( '1' );
      expect( result!.domNode.getAttribute( 'y1' ) ).to.equal( '2' );
      expect( result!.domNode.getAttribute( 'x2' ) ).to.equal( '3' );
      expect( result!.domNode.getAttribute( 'y2' ) ).to.equal( '4' );
    } );
  } );
} );
