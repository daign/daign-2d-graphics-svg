import { expect } from 'chai';

import { StyleSelectorChain, StyleSheet } from '@daign/style-sheets';
import { PresentationNode, View } from '@daign/2d-pipeline';
import { WrappedNode } from '@daign/dom-pool';
import { GraphicStyle, Group } from '@daign/2d-graphics';
import { MockDocument } from '@daign/mock-dom';

import { RendererFactory } from '../../lib';
import { viewModule } from '../../lib/renderModules';

declare var global: any;

describe( 'viewModule', (): void => {
  beforeEach( (): void => {
    global.document = new MockDocument();
  } );

  describe( 'render logic callback', (): void => {
    it( 'should return a wrapped node', (): void => {
      // Arrange
      const styleSheet = new StyleSheet<GraphicStyle>();
      const rendererFactory = new RendererFactory();
      const svgRenderer = rendererFactory.createRenderer( styleSheet );

      const module = viewModule;
      const view = new View();
      const currentNode = new PresentationNode( view, view );
      const selectorChain = new StyleSelectorChain();

      // Act
      const result = module.callback( currentNode, currentNode.projectNodeToView, selectorChain,
        null, svgRenderer );

      // Assert
      expect( result instanceof WrappedNode ).to.be.true;
    } );

    it( 'should create a group node', (): void => {
      // Arrange
      const styleSheet = new StyleSheet<GraphicStyle>();
      const rendererFactory = new RendererFactory();
      const svgRenderer = rendererFactory.createRenderer( styleSheet );

      const module = viewModule;
      const view = new View();
      const currentNode = new PresentationNode( view, view );
      const selectorChain = new StyleSelectorChain();

      // Act
      const result = module.callback( currentNode, currentNode.projectNodeToView, selectorChain,
        null, svgRenderer );

      // Assert
      expect( result!.domNode.nodeName ).to.equal( 'g' );
    } );

    it( 'should render all child nodes', (): void => {
      // Arrange
      const styleSheet = new StyleSheet<GraphicStyle>();
      const rendererFactory = new RendererFactory();
      const svgRenderer = rendererFactory.createRenderer( styleSheet );

      const module = viewModule;
      const view = new View();
      const group = new Group();
      view.mountNode( group );

      const currentNode = view.viewPresentationNode;
      const selectorChain = new StyleSelectorChain();

      // Act
      const result = module.callback( currentNode!, currentNode!.projectNodeToView, selectorChain,
        null, svgRenderer );

      // Assert
      expect( result!.children.length ).to.equal( 1 );
      expect( result!.domNode.children.length ).to.equal( 1 );
    } );
  } );
} );
