import { expect } from 'chai';

import { Vector2 } from '@daign/math';
import { StyleSelectorChain, StyleSheet } from '@daign/style-sheets';
import { PresentationNode, View } from '@daign/2d-pipeline';
import { WrappedNode } from '@daign/dom-pool';
import { GraphicStyle, Group, TwoPointPattern } from '@daign/2d-graphics';

import { RendererFactory } from '../../lib';
import { twoPointPatternModule } from '../../lib/renderModules';

describe( 'twoPointPatternModule', (): void => {
  describe( 'render logic callback', (): void => {
    it( 'should return a wrapped node', (): void => {
      // Arrange
      const styleSheet = new StyleSheet<GraphicStyle>();
      const rendererFactory = new RendererFactory();
      const svgRenderer = rendererFactory.createRenderer( styleSheet );

      const module = twoPointPatternModule;
      const view = new View();
      const node = new TwoPointPattern();
      const currentNode = new PresentationNode( view, node );
      const selectorChain = new StyleSelectorChain();

      // Act
      const result = module.callback( currentNode, currentNode.projectNodeToView, selectorChain,
        null, svgRenderer );

      // Assert
      expect( result instanceof WrappedNode ).to.be.true;
    } );

    it( 'should create a rect node and set the attributes', (): void => {
      // Arrange
      const styleSheet = new StyleSheet<GraphicStyle>();
      const rendererFactory = new RendererFactory();
      const svgRenderer = rendererFactory.createRenderer( styleSheet );

      const module = twoPointPatternModule;
      const view = new View();
      const pattern = new TwoPointPattern();
      pattern.start = new Vector2( 1, 2 );
      pattern.end = new Vector2( 4, 6 );
      const currentNode = new PresentationNode( view, pattern );
      const selectorChain = new StyleSelectorChain();

      // Act
      const result = module.callback( currentNode, currentNode.projectNodeToView, selectorChain,
        null, svgRenderer );

      // Assert
      expect( result!.domNode.nodeName ).to.equal( 'pattern' );
      expect( result!.domNode.getAttribute( 'x' ) ).to.equal( '1' );
      expect( result!.domNode.getAttribute( 'y' ) ).to.equal( '2' );
      expect( result!.domNode.getAttribute( 'width' ) ).to.equal( '3' );
      expect( result!.domNode.getAttribute( 'height' ) ).to.equal( '4' );
    } );

    it( 'should render all child nodes', (): void => {
      // Arrange
      const styleSheet = new StyleSheet<GraphicStyle>();
      const rendererFactory = new RendererFactory();
      const svgRenderer = rendererFactory.createRenderer( styleSheet );

      const module = twoPointPatternModule;
      const view = new View();
      const pattern = new TwoPointPattern();
      pattern.start = new Vector2( 1, 2 );
      pattern.end = new Vector2( 4, 6 );
      view.mountNode( pattern );

      const child1 = new Group();
      const child2 = new Group();
      const child3 = new Group();
      pattern.appendChild( child1 );
      pattern.appendChild( child2 );
      pattern.appendChild( child3 );

      const currentNode = view.viewPresentationNode!.children[ 0 ];
      const selectorChain = new StyleSelectorChain();

      // Act
      const result = module.callback( currentNode, currentNode.projectNodeToView, selectorChain,
        null, svgRenderer );

      // Assert
      expect( result!.children.length ).to.equal( 3 );
      expect( result!.domNode.children.length ).to.equal( 3 );
    } );
  } );
} );
