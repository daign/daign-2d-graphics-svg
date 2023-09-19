import { expect } from 'chai';

import { Vector2 } from '@daign/math';
import { StyleSelectorChain, StyleSheet } from '@daign/style-sheets';
import { PresentationNode, View } from '@daign/2d-pipeline';
import { WrappedNode } from '@daign/dom-pool';
import { GraphicStyle, Polygon } from '@daign/2d-graphics';
import { MockDocument } from '@daign/mock-dom';

import { RendererFactory } from '../../lib';
import { polygonModule } from '../../lib/renderModules';

declare var global: any;

describe( 'polygonModule', (): void => {
  beforeEach( (): void => {
    global.document = new MockDocument();
  } );

  describe( 'render logic callback', (): void => {
    it( 'should return a wrapped node', (): void => {
      // Arrange
      const styleSheet = new StyleSheet<GraphicStyle>();
      const rendererFactory = new RendererFactory();
      const svgRenderer = rendererFactory.createRenderer( styleSheet );

      const module = polygonModule;
      const view = new View();
      const node = new Polygon();
      const currentNode = new PresentationNode( view, node );
      const selectorChain = new StyleSelectorChain();

      // Act
      const result = module.callback( currentNode, currentNode.projectNodeToView, selectorChain,
        null, svgRenderer );

      // Assert
      expect( result instanceof WrappedNode ).to.be.true;
    } );

    it( 'should create a polygon node and set the attributes', (): void => {
      // Arrange
      const styleSheet = new StyleSheet<GraphicStyle>();
      const rendererFactory = new RendererFactory();
      const svgRenderer = rendererFactory.createRenderer( styleSheet );

      const module = polygonModule;
      const view = new View();
      const polygon = new Polygon();
      polygon.points.elements = [
        new Vector2( 1, 2 ),
        new Vector2( 3, 4 ),
        new Vector2( 5, 6 )
      ];
      const currentNode = new PresentationNode( view, polygon );
      const selectorChain = new StyleSelectorChain();

      // Act
      const result = module.callback( currentNode, currentNode.projectNodeToView, selectorChain,
        null, svgRenderer );

      // Assert
      expect( result!.domNode.nodeName ).to.equal( 'polygon' );
      expect( result!.domNode.getAttribute( 'points' ) ).to.equal( '1,2 3,4 5,6' );
    } );
  } );
} );
