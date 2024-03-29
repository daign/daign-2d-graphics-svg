import { Matrix3 } from '@daign/math';
import { Handle } from '@daign/handle';
import { PresentationNode } from '@daign/2d-pipeline';
import { StyleSelectorChain } from '@daign/style-sheets';
import { ControlPoint } from '@daign/2d-graphics';
import { WrappedNode } from '@daign/dom-pool';

import { RenderModule } from '../renderModule';

export const controlPointModule = new RenderModule(
  ControlPoint,
  (
    currentNode: PresentationNode,
    _p: Matrix3,
    _s: StyleSelectorChain,
    node: WrappedNode | null
  ): WrappedNode | null => {
    if ( node !== null ) {
      const controlPoint = currentNode.sourceNode as ControlPoint;

      const handle = new Handle();
      handle.setStartNode( node );

      handle.beginning = (): boolean => {
        controlPoint.snap();

        controlPoint.application.selectionManager.setSelection( controlPoint.controlObject,
          controlPoint.targetPoint );
        controlPoint.application.redraw();

        return true;
      };

      handle.continuing = (): void => {
        if ( handle.delta ) {
          controlPoint.drag( handle.delta.clone() );
        }
      };
    }

    return null;
  }
);
