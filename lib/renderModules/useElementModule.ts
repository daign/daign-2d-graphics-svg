import { Matrix3 } from '@daign/math';
import { PresentationNode } from '@daign/2d-pipeline';
import { StyleSelectorChain } from '@daign/style-sheets';
import { UseElement } from '@daign/2d-graphics';
import { WrappedDomPool, WrappedNode } from '@daign/dom-pool';

import { RenderModule } from '../renderModule';

export const useElementModule = new RenderModule(
  UseElement,
  (
    currentNode: PresentationNode,
    projection: Matrix3,
    selectorChain: StyleSelectorChain
  ): WrappedNode | null => {
    const useElement = currentNode.sourceNode as UseElement;
    selectorChain.addSelector( useElement.styleSelector );

    const anchorPoint = useElement.getAnchorTransformed( projection );

    const useNode = WrappedDomPool.getSvg( 'use' );
    useNode.setAttribute( 'x', String( anchorPoint.x ) );
    useNode.setAttribute( 'y', String( anchorPoint.y ) );
    useNode.setAttributeNS( WrappedDomPool.xlinkNamespace, 'href', useElement.href );
    return useNode;
  }
);
