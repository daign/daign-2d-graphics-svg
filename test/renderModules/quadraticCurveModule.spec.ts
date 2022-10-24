import { expect } from 'chai';

import { StyleSelectorChain, StyleSheet } from '@daign/style-sheets';
import { PresentationNode, View } from '@daign/2d-pipeline';
import { WrappedNode } from '@daign/dom-pool';
import { GraphicStyle, QuadraticCurve } from '@daign/2d-graphics';
import { MockDocument } from '@daign/mock-dom';

import { RendererFactory } from '../../lib';
import { quadraticCurveModule } from '../../lib/renderModules';

declare var global: any;

describe( 'quadraticCurveModule', (): void => {
  beforeEach( (): void => {
    global.document = new MockDocument();
  } );

  describe( 'render logic callback', (): void => {
    it( 'should return a wrapped node', (): void => {
      // Arrange
      const styleSheet = new StyleSheet<GraphicStyle>();
      const rendererFactory = new RendererFactory();
      const svgRenderer = rendererFactory.createRenderer( styleSheet );

      const module = quadraticCurveModule;
      const view = new View();
      const node = new QuadraticCurve();
      const currentNode = new PresentationNode( view, node );
      const selectorChain = new StyleSelectorChain();

      // Act
      const result = module.callback( currentNode, selectorChain, null, svgRenderer );

      // Assert
      expect( result instanceof WrappedNode ).to.be.true;
    } );
  } );
} );
