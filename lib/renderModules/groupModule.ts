import { Matrix3 } from '@daign/math';
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
    _p: Matrix3,
    selectorChain: StyleSelectorChain,
    _n: WrappedNode | null,
    renderer: SvgRenderer
  ): WrappedNode | null => {
    const group = currentNode.sourceNode as Group;
    selectorChain.addSelector( group.styleSelector );

    const groupNode = WrappedDomPool.getSvg( 'g' );
    currentNode.children.forEach( ( child: PresentationNode ): void => {
      const selectorChainCopy = selectorChain.clone();
      const renderedNode = renderer.renderRecursive( child, selectorChainCopy );
      renderer.appendRenderedNode( groupNode, renderedNode );
    } );
    return groupNode;
  }
);
