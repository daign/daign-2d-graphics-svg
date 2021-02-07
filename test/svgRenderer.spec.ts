import { expect } from 'chai';

import { MockDocument } from '@daign/mock-dom';
import { View } from '@daign/2d-pipeline';
import { GraphicStyle, Line } from '@daign/2d-graphics';
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
      expect( target.children.length ).to.equal( 1 );
    } );
  } );
} );
