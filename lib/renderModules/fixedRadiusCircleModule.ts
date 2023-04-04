import { Matrix3 } from '@daign/math';
import { PresentationNode } from '@daign/2d-pipeline';
import { StyleSelectorChain } from '@daign/style-sheets';
import { FixedRadiusCircle } from '@daign/2d-graphics';
import { WrappedDomPool, WrappedNode } from '@daign/dom-pool';

import { RenderModule } from '../renderModule';

export const fixedRadiusCircleModule = new RenderModule(
  FixedRadiusCircle,
  (
    currentNode: PresentationNode,
    projection: Matrix3,
    selectorChain: StyleSelectorChain
  ): WrappedNode | null => {
    const circle = currentNode.sourceNode as FixedRadiusCircle;
    selectorChain.addSelector( circle.styleSelector );

    const center = circle.getCenterTransformed( projection );
    const radius = circle.radius;

    const circleNode = WrappedDomPool.getSvg( 'circle' );
    circleNode.setAttribute( 'cx', String( center.x ) );
    circleNode.setAttribute( 'cy', String( center.y ) );
    circleNode.setAttribute( 'r', String( radius ) );
    return circleNode;
  }
);
