import { expect } from 'chai';

import { Vector2 } from '@daign/math';
import { StyleSelectorChain, StyleSheet } from '@daign/style-sheets';
import { PresentationNode, View } from '@daign/2d-pipeline';
import { WrappedNode } from '@daign/dom-pool';
import { GraphicStyle, Polyline } from '@daign/2d-graphics';

import { RendererFactory } from '../../lib';
import { polylineModule } from '../../lib/renderModules';

describe( 'polylineModule', (): void => {
  describe( 'render logic callback', (): void => {
    it( 'should return a wrapped node', (): void => {
      // Arrange
      const styleSheet = new StyleSheet<GraphicStyle>();
      const rendererFactory = new RendererFactory();
      const svgRenderer = rendererFactory.createRenderer( styleSheet );

      const module = polylineModule;
      const view = new View();
      const node = new Polyline();
      const currentNode = new PresentationNode( view, node );
      const selectorChain = new StyleSelectorChain();

      // Act
      const result = module.callback( currentNode, currentNode.projectNodeToView, selectorChain,
        null, svgRenderer );

      // Assert
      expect( result instanceof WrappedNode ).to.be.true;
    } );

    it( 'should create a polyline node and set the attributes', (): void => {
      // Arrange
      const styleSheet = new StyleSheet<GraphicStyle>();
      const rendererFactory = new RendererFactory();
      const svgRenderer = rendererFactory.createRenderer( styleSheet );

      const module = polylineModule;
      const view = new View();
      const polyline = new Polyline();
      polyline.points.elements = [
        new Vector2( 1, 2 ),
        new Vector2( 3, 4 ),
        new Vector2( 5, 6 )
      ];
      const currentNode = new PresentationNode( view, polyline );
      const selectorChain = new StyleSelectorChain();

      // Act
      const result = module.callback( currentNode, currentNode.projectNodeToView, selectorChain,
        null, svgRenderer );

      // Assert
      expect( result!.domNode.nodeName ).to.equal( 'polyline' );
      expect( result!.domNode.getAttribute( 'points' ) ).to.equal( '1,2 3,4 5,6' );
    } );
  } );
} );
