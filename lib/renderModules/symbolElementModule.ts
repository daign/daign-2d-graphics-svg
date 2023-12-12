import { Matrix3 } from '@daign/math';
import { PresentationNode } from '@daign/2d-pipeline';
import { StyleSelectorChain } from '@daign/style-sheets';
import { SymbolElement } from '@daign/2d-graphics';
import { WrappedDomPool, WrappedNode } from '@daign/dom-pool';

import { SvgRenderer } from '../svgRenderer';
import { RenderModule } from '../renderModule';

export const symbolElementModule = new RenderModule(
  SymbolElement,
  (
    currentNode: PresentationNode,
    _p: Matrix3,
    selectorChain: StyleSelectorChain,
    _n: WrappedNode | null,
    renderer: SvgRenderer
  ): WrappedNode | null => {
    const symbolElement = currentNode.sourceNode as SymbolElement;
    selectorChain.addSelector( symbolElement.styleSelector );

    const symbolElementNode = WrappedDomPool.getSvg( 'symbol' );
    currentNode.children.forEach( ( child: PresentationNode ): void => {
      const selectorChainCopy = selectorChain.clone();
      const renderedNode = renderer.renderRecursive( child, selectorChainCopy );
      renderer.appendRenderedNode( symbolElementNode, renderedNode );
    } );
    return symbolElementNode;
  }
);
