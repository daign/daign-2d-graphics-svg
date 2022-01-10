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
    _: StyleSelectorChain,
    node: WrappedNode | null
  ): WrappedNode | null => {
    if ( node !== null ) {
      const controlPoint = currentNode.sourceNode as ControlPoint;

      const handle = new Handle( { startNode: node } );
      handle.beginning = (): boolean => {
        controlPoint.snap();
        return true;
      };
      handle.continuing = (): void => {
        controlPoint.drag( handle.delta.clone() );
      };
    }

    return null;
  }
);
