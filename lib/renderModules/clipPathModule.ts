import { Matrix3 } from '@daign/math';
import { PresentationNode } from '@daign/2d-pipeline';
import { StyleSelectorChain } from '@daign/style-sheets';
import { ClipPath } from '@daign/2d-graphics';
import { WrappedDomPool, WrappedNode } from '@daign/dom-pool';

import { SvgRenderer } from '../svgRenderer';
import { RenderModule } from '../renderModule';

export const clipPathModule = new RenderModule(
  ClipPath,
  (
    currentNode: PresentationNode,
    _p: Matrix3,
    selectorChain: StyleSelectorChain,
    _n: WrappedNode | null,
    renderer: SvgRenderer
  ): WrappedNode | null => {
    const clipPath = currentNode.sourceNode as ClipPath;
    selectorChain.addSelector( clipPath.styleSelector );

    const clipPathNode = WrappedDomPool.getSvg( 'clipPath' );
    currentNode.children.forEach( ( child: PresentationNode ): void => {
      const selectorChainCopy = selectorChain.clone();
      const renderedNode = renderer.renderRecursive( child, selectorChainCopy );
      renderer.appendRenderedNode( clipPathNode, renderedNode );
    } );
    return clipPathNode;
  }
);
