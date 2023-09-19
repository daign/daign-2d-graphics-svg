import { Matrix3, Vector2 } from '@daign/math';
import { PresentationNode } from '@daign/2d-pipeline';
import { StyleSelectorChain } from '@daign/style-sheets';
import { Polygon } from '@daign/2d-graphics';
import { WrappedDomPool, WrappedNode } from '@daign/dom-pool';

import { RenderModule } from '../renderModule';

export const polygonModule = new RenderModule(
  Polygon,
  (
    currentNode: PresentationNode,
    projection: Matrix3,
    selectorChain: StyleSelectorChain
  ): WrappedNode | null => {
    const polygon = currentNode.sourceNode as Polygon;
    selectorChain.addSelector( polygon.styleSelector );

    const points = polygon.getPointsTransformed( projection );
    const pointsString = points.map( ( p: Vector2 ): string => `${p.x},${p.y}` ).join( ' ' );

    const polygonNode = WrappedDomPool.getSvg( 'polygon' );
    polygonNode.setAttribute( 'points', pointsString );
    return polygonNode;
  }
);
