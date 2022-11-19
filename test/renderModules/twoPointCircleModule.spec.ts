import { expect } from 'chai';

import { Vector2 } from '@daign/math';
import { StyleSelectorChain, StyleSheet } from '@daign/style-sheets';
import { PresentationNode, View } from '@daign/2d-pipeline';
import { WrappedNode } from '@daign/dom-pool';
import { GraphicStyle, TwoPointCircle } from '@daign/2d-graphics';

import { RendererFactory } from '../../lib';
import { twoPointCircleModule } from '../../lib/renderModules';

describe( 'twoPointCircleModule', (): void => {
  describe( 'render logic callback', (): void => {
    it( 'should return a wrapped node', (): void => {
      // Arrange
      const styleSheet = new StyleSheet<GraphicStyle>();
      const rendererFactory = new RendererFactory();
      const svgRenderer = rendererFactory.createRenderer( styleSheet );

      const module = twoPointCircleModule;
      const view = new View();
      const node = new TwoPointCircle();
      const currentNode = new PresentationNode( view, node );
      const selectorChain = new StyleSelectorChain();

      // Act
      const result = module.callback( currentNode, selectorChain, null, svgRenderer );

      // Assert
      expect( result instanceof WrappedNode ).to.be.true;
    } );

    it( 'should create a circle node and set the attributes', (): void => {
      // Arrange
      const styleSheet = new StyleSheet<GraphicStyle>();
      const rendererFactory = new RendererFactory();
      const svgRenderer = rendererFactory.createRenderer( styleSheet );

      const module = twoPointCircleModule;
      const view = new View();
      const circle = new TwoPointCircle();
      circle.center = new Vector2( 1, 2 );
      circle.circlePoint = new Vector2( 1, 5 );
      const currentNode = new PresentationNode( view, circle );
      const selectorChain = new StyleSelectorChain();

      // Act
      const result = module.callback( currentNode, selectorChain, null, svgRenderer );

      // Assert
      expect( result!.domNode.nodeName ).to.equal( 'circle' );
      expect( result!.domNode.getAttribute( 'cx' ) ).to.equal( '1' );
      expect( result!.domNode.getAttribute( 'cy' ) ).to.equal( '2' );
      expect( result!.domNode.getAttribute( 'r' ) ).to.equal( '3' );
    } );
  } );
} );
