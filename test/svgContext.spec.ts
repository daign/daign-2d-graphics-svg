import { expect } from 'chai';

import { Vector2 } from '@daign/math';
import { MockDocument } from '@daign/mock-dom';

import { SvgContext } from '../lib';

declare var global: any;

describe( 'SvgContext', (): void => {
  beforeEach( (): void => {
    global.document = new MockDocument();
  } );

  describe( 'setter size', (): void => {
    it( 'should set the size', (): void => {
      // Arrange
      const svgContext = new SvgContext();

      // Act
      svgContext.size = new Vector2( 1, 2 );

      // Assert
      expect( svgContext.size.equals( new Vector2( 1, 2 ) ) ).to.be.true;
    } );
  } );
} );
