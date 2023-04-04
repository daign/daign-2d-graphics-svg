import { expect } from 'chai';

import { Vector2 } from '@daign/math';
import { StyleSelectorChain, StyleSheet } from '@daign/style-sheets';
import { PresentationNode, View } from '@daign/2d-pipeline';
import { WrappedNode } from '@daign/dom-pool';
import { GraphicStyle, TwoPointImage } from '@daign/2d-graphics';

import { RendererFactory } from '../../lib';
import { twoPointImageModule } from '../../lib/renderModules';

const xlinkNamespace = 'http://www.w3.org/1999/xlink';

describe( 'twoPointImageModule', (): void => {
  describe( 'render logic callback', (): void => {
    it( 'should return a wrapped node', (): void => {
      // Arrange
      const styleSheet = new StyleSheet<GraphicStyle>();
      const rendererFactory = new RendererFactory();
      const svgRenderer = rendererFactory.createRenderer( styleSheet );

      const module = twoPointImageModule;
      const view = new View();
      const node = new TwoPointImage();
      const currentNode = new PresentationNode( view, node );
      const selectorChain = new StyleSelectorChain();

      // Act
      const result = module.callback( currentNode, currentNode.projectNodeToView, selectorChain,
        null, svgRenderer );

      // Assert
      expect( result instanceof WrappedNode ).to.be.true;
    } );

    it( 'should create an image node and set the attributes', (): void => {
      // Arrange
      const styleSheet = new StyleSheet<GraphicStyle>();
      const rendererFactory = new RendererFactory();
      const svgRenderer = rendererFactory.createRenderer( styleSheet );

      const module = twoPointImageModule;
      const view = new View();
      const image = new TwoPointImage();
      image.start = new Vector2( 1, 2 );
      image.end = new Vector2( 4, 6 );
      image.href = 'imageSource';
      const currentNode = new PresentationNode( view, image );
      const selectorChain = new StyleSelectorChain();

      // Act
      const result = module.callback( currentNode, currentNode.projectNodeToView, selectorChain,
        null, svgRenderer );

      // Assert
      expect( result!.domNode.nodeName ).to.equal( 'image' );
      expect( result!.domNode.getAttribute( 'x' ) ).to.equal( '1' );
      expect( result!.domNode.getAttribute( 'y' ) ).to.equal( '2' );
      expect( result!.domNode.getAttribute( 'width' ) ).to.equal( '3' );
      expect( result!.domNode.getAttribute( 'height' ) ).to.equal( '4' );
      expect( result!.domNode.getAttributeNS( xlinkNamespace, 'href' ) ).to.equal( 'imageSource' );
    } );
  } );
} );
