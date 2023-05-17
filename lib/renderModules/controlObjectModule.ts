import { Matrix3 } from '@daign/math';
import { Handle } from '@daign/handle';
import { PresentationNode } from '@daign/2d-pipeline';
import { StyleSelectorChain } from '@daign/style-sheets';
import { ApplicationView, ControlObject } from '@daign/2d-graphics';
import { WrappedNode } from '@daign/dom-pool';

import { RenderModule } from '../renderModule';

export const controlObjectModule = new RenderModule(
  ControlObject,
  (
    currentNode: PresentationNode,
    _p: Matrix3,
    _s: StyleSelectorChain,
    node: WrappedNode | null
  ): WrappedNode | null => {
    if ( node !== null ) {
      const controlObject = currentNode.sourceNode as ControlObject;

      const handle = new Handle();
      handle.setStartNode( node );

      handle.beginning = (): boolean => {
        return true;
      };

      handle.clicked = (): void => {
        if ( controlObject ) {
          /* The control object has a presentation node for every view in which it is shown.
           * Clicking on the control object will activate it in the application for each view. */
          controlObject.presentationNodes.forEach( ( pn: PresentationNode ): void => {
            if ( pn.view instanceof ApplicationView ) {
              pn.view.application.selectionManager.setSelection( controlObject, null );
              pn.view.application.updateManager.redrawSignal.emit();
            }
          } );
        }
      };
    }

    return null;
  }
);
