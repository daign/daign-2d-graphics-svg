import { expect } from 'chai';

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
      const result = module.callback( currentNode, selectorChain, null, svgRenderer );

      // Assert
      expect( result instanceof WrappedNode ).to.be.true;
    } );
  } );
} );
