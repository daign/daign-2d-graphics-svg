import { Matrix3 } from '@daign/math';
import { PresentationNode, View } from '@daign/2d-pipeline';
import { StyleSelectorChain } from '@daign/style-sheets';
import { WrappedDomPool, WrappedNode } from '@daign/dom-pool';

import { SvgRenderer } from '../svgRenderer';
import { RenderModule } from '../renderModule';

export const viewModule = new RenderModule(
  View,
  (
    currentNode: PresentationNode,
    _p: Matrix3,
    selectorChain: StyleSelectorChain,
    _n: WrappedNode | null,
    renderer: SvgRenderer
  ): WrappedNode | null => {
    const groupNode = WrappedDomPool.getSvg( 'g' );
    currentNode.children.forEach( ( child: PresentationNode ): void => {
      const selectorChainCopy = selectorChain.clone();
      const renderedNode = renderer.renderRecursive( child, selectorChainCopy );
      renderer.appendRenderedNode( groupNode, renderedNode );
    } );
    return groupNode;
  }
);
