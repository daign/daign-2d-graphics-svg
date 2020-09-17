import { expect } from 'chai';

import { Vector2 } from '@daign/math';
import { MockDocument } from '@daign/mock-dom';

import { SvgContext } from '../lib/svgContext';

declare var global: any;

describe( 'SvgContext', (): void => {
  beforeEach( (): void => {
    global.document = new MockDocument();
  } );

  describe( 'setSize', (): void => {
    it( 'should set the size', (): void => {
      // Arrange
      const svgContext = new SvgContext();

      // Act
      svgContext.setSize( new Vector2( 0, 1 ) );

      // Assert
      expect( svgContext.size ).to.not.be.null;
      if ( svgContext.size !== null ) {
        expect( svgContext.size.equals( new Vector2( 0, 1 ) ) ).to.be.true;
      }
    } );
  } );
} );
