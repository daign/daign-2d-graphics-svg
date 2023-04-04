import { Matrix3, Vector2 } from '@daign/math';
import { PresentationNode } from '@daign/2d-pipeline';
import { StyleSelectorChain } from '@daign/style-sheets';
import { QuadraticCurve } from '@daign/2d-graphics';
import { WrappedDomPool, WrappedNode } from '@daign/dom-pool';

import { RenderModule } from '../renderModule';

export const quadraticCurveModule = new RenderModule(
  QuadraticCurve,
  (
    currentNode: PresentationNode,
    projection: Matrix3,
    selectorChain: StyleSelectorChain
  ): WrappedNode | null => {
    const curve = currentNode.sourceNode as QuadraticCurve;
    selectorChain.addSelector( curve.styleSelector );

    const points = curve.getPointsTransformed( projection );
    const pathString = points.map( ( p: Vector2, index: number ): string => {
      // Start path string with move command.
      if ( index === 0 ) {
        return `M ${p.x},${p.y} Q`;
      }

      return `${p.x},${p.y}`;
    } ).join( ' ' );

    const pathNode = WrappedDomPool.getSvg( 'path' );
    pathNode.setAttribute( 'd', pathString );
    return pathNode;
  }
);
