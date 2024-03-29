import { Matrix3 } from '@daign/math';
import { PresentationNode } from '@daign/2d-pipeline';
import { StyleSelectorChain } from '@daign/style-sheets';
import { TwoPointRectangle } from '@daign/2d-graphics';
import { WrappedDomPool, WrappedNode } from '@daign/dom-pool';

import { RenderModule } from '../renderModule';

export const twoPointRectangleModule = new RenderModule(
  TwoPointRectangle,
  (
    currentNode: PresentationNode,
    projection: Matrix3,
    selectorChain: StyleSelectorChain
  ): WrappedNode | null => {
    const rectangle = currentNode.sourceNode as TwoPointRectangle;
    selectorChain.addSelector( rectangle.styleSelector );

    const startPoint = rectangle.getStartTransformed( projection );
    const size = rectangle.getSizeTransformed( projection );

    const rectNode = WrappedDomPool.getSvg( 'rect' );
    rectNode.setAttribute( 'x', String( startPoint.x ) );
    rectNode.setAttribute( 'y', String( startPoint.y ) );
    rectNode.setAttribute( 'width', String( size.x ) );
    rectNode.setAttribute( 'height', String( size.y ) );
    return rectNode;
  }
);
