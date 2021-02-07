import { PresentationNode } from '@daign/2d-pipeline';
import { StyleSelectorChain } from '@daign/style-sheets';
import { Group } from '@daign/2d-graphics';
import { WrappedDomPool, WrappedNode } from '@daign/dom-pool';

import { SvgRenderer } from '../svgRenderer';
import { RenderModule } from '../renderModule';

export const groupModule = new RenderModule(
  Group,
  (
    currentNode: PresentationNode,
    selectorChain: StyleSelectorChain,
    _: WrappedNode | null,
    renderer: SvgRenderer
  ): WrappedNode | null => {
    const group = currentNode.sourceNode as Group;
    selectorChain.addSelector( group.styleSelector );

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
