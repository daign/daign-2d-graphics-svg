import { Vector2 } from '@daign/math';
import { PresentationNode } from '@daign/2d-pipeline';
import { StyleSelectorChain } from '@daign/style-sheets';
import { Polyline } from '@daign/2d-graphics';
import { WrappedDomPool, WrappedNode } from '@daign/dom-pool';

import { RenderModule } from '../renderModule';

export const polylineModule = new RenderModule(
  Polyline,
  (
    currentNode: PresentationNode,
    selectorChain: StyleSelectorChain
  ): WrappedNode | null => {
    const polyline = currentNode.sourceNode as Polyline;
    selectorChain.addSelector( polyline.styleSelector );

    const points = polyline.getPointsTransformed( currentNode.projectNodeToView );
    const pointsString = points.map( ( p: Vector2 ): string => `${p.x},${p.y}` ).join( ' ' );

    const lineNode = WrappedDomPool.getSvg( 'polyline' );
    lineNode.setAttribute( 'points', pointsString );
    return lineNode;
  }
);
