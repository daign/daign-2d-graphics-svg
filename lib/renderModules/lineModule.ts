import { Matrix3 } from '@daign/math';
import { PresentationNode } from '@daign/2d-pipeline';
import { StyleSelectorChain } from '@daign/style-sheets';
import { Line } from '@daign/2d-graphics';
import { WrappedDomPool, WrappedNode } from '@daign/dom-pool';

import { RenderModule } from '../renderModule';

export const lineModule = new RenderModule(
  Line,
  (
    currentNode: PresentationNode,
    projection: Matrix3,
    selectorChain: StyleSelectorChain
  ): WrappedNode | null => {
    const line = currentNode.sourceNode as Line;
    selectorChain.addSelector( line.styleSelector );

    const startPoint = line.getStartTransformed( projection );
    const endPoint = line.getEndTransformed( projection );

    const lineNode = WrappedDomPool.getSvg( 'line' );
    lineNode.setAttribute( 'x1', String( startPoint.x ) );
    lineNode.setAttribute( 'y1', String( startPoint.y ) );
    lineNode.setAttribute( 'x2', String( endPoint.x ) );
    lineNode.setAttribute( 'y2', String( endPoint.y ) );
    return lineNode;
  }
);
