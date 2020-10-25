import { expect } from 'chai';

import { MockDocument, MockNode } from '@daign/mock-dom';
import { View } from '@daign/2d-pipeline';
import { GraphicStyle, Line } from '@daign/2d-graphics';
import { StyleSheet } from '@daign/style-sheets';

import { SvgRenderer } from '../lib';

declare var global: any;

describe( 'SvgRenderer', (): void => {
  beforeEach( (): void => {
    global.document = new MockDocument();
  } );

  describe( 'render', (): void => {
    it( 'should append the rendered node to the target node', (): void => {
      // Arrange
      const styleSheet = new StyleSheet<GraphicStyle>();
      const svgRenderer = new SvgRenderer( styleSheet );
      const node = new Line();
      const view = new View();
      view.mountNode( node );
      const target = new MockNode();

      // Act
      svgRenderer.render( view, target );

      // Assert
      expect( target.children.length ).to.equal( 1 );
    } );
  } );
} );
