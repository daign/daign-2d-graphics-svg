import { expect } from 'chai';

import { Vector2 } from '@daign/math';
import { StyleSelectorChain, StyleSheet } from '@daign/style-sheets';
import { PresentationNode, View } from '@daign/2d-pipeline';
import { WrappedNode } from '@daign/dom-pool';
import { GraphicStyle, TwoPointRectangle } from '@daign/2d-graphics';

import { RendererFactory } from '../../lib';
import { twoPointRectangleModule } from '../../lib/renderModules';

describe( 'twoPointRectangleModule', (): void => {
  describe( 'render logic callback', (): void => {
    it( 'should return a wrapped node', (): void => {
      // Arrange
      const styleSheet = new StyleSheet<GraphicStyle>();
      const rendererFactory = new RendererFactory();
      const svgRenderer = rendererFactory.createRenderer( styleSheet );

      const module = twoPointRectangleModule;
      const view = new View();
      const node = new TwoPointRectangle();
      const currentNode = new PresentationNode( view, node );
      const selectorChain = new StyleSelectorChain();

      // Act
      const result = module.callback( currentNode, currentNode.projectNodeToView, selectorChain,
        null, svgRenderer );

      // Assert
      expect( result instanceof WrappedNode ).to.be.true;
    } );

    it( 'should create a rect node and set the attributes', (): void => {
      // Arrange
      const styleSheet = new StyleSheet<GraphicStyle>();
      const rendererFactory = new RendererFactory();
      const svgRenderer = rendererFactory.createRenderer( styleSheet );

      const module = twoPointRectangleModule;
      const view = new View();
      const rectangle = new TwoPointRectangle();
      rectangle.start = new Vector2( 1, 2 );
      rectangle.end = new Vector2( 4, 6 );
      const currentNode = new PresentationNode( view, rectangle );
      const selectorChain = new StyleSelectorChain();

      // Act
      const result = module.callback( currentNode, currentNode.projectNodeToView, selectorChain,
        null, svgRenderer );

      // Assert
      expect( result!.domNode.nodeName ).to.equal( 'rect' );
      expect( result!.domNode.getAttribute( 'x' ) ).to.equal( '1' );
      expect( result!.domNode.getAttribute( 'y' ) ).to.equal( '2' );
      expect( result!.domNode.getAttribute( 'width' ) ).to.equal( '3' );
      expect( result!.domNode.getAttribute( 'height' ) ).to.equal( '4' );
    } );
  } );
} );
