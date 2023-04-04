import { expect } from 'chai';

import { StyleSelectorChain, StyleSheet } from '@daign/style-sheets';
import { PresentationNode, View } from '@daign/2d-pipeline';
import { WrappedNode } from '@daign/dom-pool';
import { GraphicStyle, Group } from '@daign/2d-graphics';
import { MockDocument } from '@daign/mock-dom';

import { RendererFactory } from '../../lib';
import { groupModule } from '../../lib/renderModules';

declare var global: any;

describe( 'groupModule', (): void => {
  beforeEach( (): void => {
    global.document = new MockDocument();
  } );

  describe( 'render logic callback', (): void => {
    it( 'should return a wrapped node', (): void => {
      // Arrange
      const styleSheet = new StyleSheet<GraphicStyle>();
      const rendererFactory = new RendererFactory();
      const svgRenderer = rendererFactory.createRenderer( styleSheet );

      const module = groupModule;
      const view = new View();
      const group = new Group();
      const currentNode = new PresentationNode( view, group );
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

      const module = groupModule;
      const view = new View();
      const group = new Group();
      const currentNode = new PresentationNode( view, group );
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

      const module = groupModule;
      const view = new View();
      const group = new Group();
      view.mountNode( group );

      const child1 = new Group();
      const child2 = new Group();
      const child3 = new Group();
      group.appendChild( child1 );
      group.appendChild( child2 );
      group.appendChild( child3 );

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
