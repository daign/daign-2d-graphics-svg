import { Matrix3 } from '@daign/math';
import { PresentationNode } from '@daign/2d-pipeline';
import { StyleSelectorChain } from '@daign/style-sheets';
import { Mask } from '@daign/2d-graphics';
import { WrappedDomPool, WrappedNode } from '@daign/dom-pool';

import { SvgRenderer } from '../svgRenderer';
import { RenderModule } from '../renderModule';

export const maskModule = new RenderModule(
  Mask,
  (
    currentNode: PresentationNode,
    _p: Matrix3,
    selectorChain: StyleSelectorChain,
    _n: WrappedNode | null,
    renderer: SvgRenderer
  ): WrappedNode | null => {
    const mask = currentNode.sourceNode as Mask;
    selectorChain.addSelector( mask.styleSelector );

    const maskNode = WrappedDomPool.getSvg( 'mask' );
    maskNode.setAttribute( 'id', mask.id );
    currentNode.children.forEach( ( child: PresentationNode ): void => {
      const selectorChainCopy = selectorChain.clone();
      const renderedNode = renderer.renderRecursive( child, selectorChainCopy );
      renderer.appendRenderedNode( maskNode, renderedNode );
    } );
    return maskNode;
  }
);
