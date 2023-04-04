import { expect } from 'chai';

import { Vector2 } from '@daign/math';
import { StyleSelectorChain, StyleSheet } from '@daign/style-sheets';
import { PresentationNode, View } from '@daign/2d-pipeline';
import { WrappedNode } from '@daign/dom-pool';
import { GraphicStyle, Text } from '@daign/2d-graphics';

import { RendererFactory } from '../../lib';
import { textModule } from '../../lib/renderModules';

describe( 'textModule', (): void => {
  describe( 'render logic callback', (): void => {
    it( 'should return a wrapped node', (): void => {
      // Arrange
      const styleSheet = new StyleSheet<GraphicStyle>();
      const rendererFactory = new RendererFactory();
      const svgRenderer = rendererFactory.createRenderer( styleSheet );

      const module = textModule;
      const view = new View();
      const node = new Text();
      const currentNode = new PresentationNode( view, node );
      const selectorChain = new StyleSelectorChain();

      // Act
      const result = module.callback( currentNode, currentNode.projectNodeToView, selectorChain,
        null, svgRenderer );

      // Assert
      expect( result instanceof WrappedNode ).to.be.true;
    } );

    it( 'should create a text node and set the attributes', (): void => {
      // Arrange
      const styleSheet = new StyleSheet<GraphicStyle>();
      const rendererFactory = new RendererFactory();
      const svgRenderer = rendererFactory.createRenderer( styleSheet );

      const module = textModule;
      const view = new View();
      const text = new Text();
      text.anchor = new Vector2( 1, 2 );
      text.content = 'SomeContent';
      text.textAnchor = 'middle';
      const currentNode = new PresentationNode( view, text );
      const selectorChain = new StyleSelectorChain();

      // Act
      const result = module.callback( currentNode, currentNode.projectNodeToView, selectorChain,
        null, svgRenderer );

      // Assert
      expect( result!.domNode.nodeName ).to.equal( 'text' );
      expect( result!.domNode.getAttribute( 'x' ) ).to.equal( '1' );
      expect( result!.domNode.getAttribute( 'y' ) ).to.equal( '2' );
      expect( result!.domNode.textContent ).to.equal( 'SomeContent' );
    } );
  } );
} );
