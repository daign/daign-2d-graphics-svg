import { expect } from 'chai';

import { StyleSelectorChain, StyleSheet } from '@daign/style-sheets';
import { PresentationNode, View } from '@daign/2d-pipeline';
import { WrappedNode } from '@daign/dom-pool';
import { GraphicStyle, Group, SymbolElement } from '@daign/2d-graphics';

import { RendererFactory } from '../../lib';
import { symbolElementModule } from '../../lib/renderModules';

describe( 'symbolElementModule', (): void => {
  describe( 'render logic callback', (): void => {
    it( 'should return a wrapped node', (): void => {
      // Arrange
      const styleSheet = new StyleSheet<GraphicStyle>();
      const rendererFactory = new RendererFactory();
      const svgRenderer = rendererFactory.createRenderer( styleSheet );

      const module = symbolElementModule;
      const view = new View();
      const symbolElement = new SymbolElement();
      const currentNode = new PresentationNode( view, symbolElement );
      const selectorChain = new StyleSelectorChain();

      // Act
      const result = module.callback( currentNode, currentNode.projectNodeToView, selectorChain,
        null, svgRenderer );

      // Assert
      expect( result instanceof WrappedNode ).to.be.true;
    } );

    it( 'should create a mask node', (): void => {
      // Arrange
      const styleSheet = new StyleSheet<GraphicStyle>();
      const rendererFactory = new RendererFactory();
      const svgRenderer = rendererFactory.createRenderer( styleSheet );

      const module = symbolElementModule;
      const view = new View();
      const symbolElement = new SymbolElement();
      const currentNode = new PresentationNode( view, symbolElement );
      const selectorChain = new StyleSelectorChain();

      // Act
      const result = module.callback( currentNode, currentNode.projectNodeToView, selectorChain,
        null, svgRenderer );

      // Assert
      expect( result!.domNode.nodeName ).to.equal( 'symbol' );
    } );

    it( 'should render all child nodes', (): void => {
      // Arrange
      const styleSheet = new StyleSheet<GraphicStyle>();
      const rendererFactory = new RendererFactory();
      const svgRenderer = rendererFactory.createRenderer( styleSheet );

      const module = symbolElementModule;
      const view = new View();
      const symbolElement = new SymbolElement();
      view.mountNode( symbolElement );

      const child1 = new Group();
      const child2 = new Group();
      const child3 = new Group();
      symbolElement.appendChild( child1 );
      symbolElement.appendChild( child2 );
      symbolElement.appendChild( child3 );

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
