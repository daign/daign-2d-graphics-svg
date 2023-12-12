import { Matrix3 } from '@daign/math';
import { PresentationNode } from '@daign/2d-pipeline';
import { StyleSelectorChain } from '@daign/style-sheets';
import { TwoPointPattern } from '@daign/2d-graphics';
import { WrappedDomPool, WrappedNode } from '@daign/dom-pool';

import { SvgRenderer } from '../svgRenderer';
import { RenderModule } from '../renderModule';

export const twoPointPatternModule = new RenderModule(
  TwoPointPattern,
  (
    currentNode: PresentationNode,
    projection: Matrix3,
    selectorChain: StyleSelectorChain,
    _n: WrappedNode | null,
    renderer: SvgRenderer
  ): WrappedNode | null => {
    const pattern = currentNode.sourceNode as TwoPointPattern;
    selectorChain.addSelector( pattern.styleSelector );

    const startPoint = pattern.getStartTransformed( projection );
    const size = pattern.getSizeTransformed( projection );

    const patternNode = WrappedDomPool.getSvg( 'pattern' );
    patternNode.setAttribute( 'x', String( startPoint.x ) );
    patternNode.setAttribute( 'y', String( startPoint.y ) );
    patternNode.setAttribute( 'width', String( size.x ) );
    patternNode.setAttribute( 'height', String( size.y ) );

    currentNode.children.forEach( ( child: PresentationNode ): void => {
      const selectorChainCopy = selectorChain.clone();
      const renderedNode = renderer.renderRecursive( child, selectorChainCopy );
      renderer.appendRenderedNode( patternNode, renderedNode );
    } );
    return patternNode;
  }
);
