import { PresentationNode, View } from '@daign/2d-pipeline';
import { StyleSelectorChain } from '@daign/style-sheets';
import { WrappedDomPool, WrappedNode } from '@daign/dom-pool';

import { SvgRenderer } from '../svgRenderer';
import { RenderModule } from '../renderModule';

export const viewModule = new RenderModule(
  View,
  (
    currentNode: PresentationNode,
    selectorChain: StyleSelectorChain,
    _: WrappedNode | null,
    renderer: SvgRenderer
  ): WrappedNode | null => {
    const groupNode = WrappedDomPool.getSvg( 'g' );
    currentNode.children.forEach( ( child: PresentationNode ): void => {
      const selectorChainCopy = selectorChain.clone();
      const renderedNode = renderer.renderRecursive( child, selectorChainCopy );
      if ( renderedNode !== null ) {
        groupNode.appendChild( renderedNode );
      }
    } );
    return groupNode;
  }
);
