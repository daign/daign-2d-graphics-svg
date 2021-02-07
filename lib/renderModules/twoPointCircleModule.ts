import { PresentationNode } from '@daign/2d-pipeline';
import { StyleSelectorChain } from '@daign/style-sheets';
import { TwoPointCircle } from '@daign/2d-graphics';
import { WrappedDomPool, WrappedNode } from '@daign/dom-pool';

import { RenderModule } from '../renderModule';

export const twoPointCircleModule = new RenderModule(
  TwoPointCircle,
  (
    currentNode: PresentationNode,
    selectorChain: StyleSelectorChain
  ): WrappedNode | null => {
    const circle = currentNode.sourceNode as TwoPointCircle;
    selectorChain.addSelector( circle.styleSelector );

    const center = circle.getCenterTransformed( currentNode.projectNodeToView );
    const radius = circle.getRadiusTransformed( currentNode.projectNodeToView );

    const circleNode = WrappedDomPool.getSvg( 'circle' );
    circleNode.setAttribute( 'cx', String( center.x ) );
    circleNode.setAttribute( 'cy', String( center.y ) );
    circleNode.setAttribute( 'r', String( radius ) );
    return circleNode;
  }
);
