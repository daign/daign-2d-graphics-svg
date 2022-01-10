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
    _: StyleSelectorChain,
    node: WrappedNode | null
  ): WrappedNode | null => {
    if ( node !== null ) {
      const controlObject = currentNode.sourceNode as ControlObject;

      const handle = new Handle( { startNode: node } );
      handle.beginning = (): boolean => {
        return true;
      };
      handle.clicked = (): void => {
        if ( controlObject ) {
          controlObject.presentationNodes.forEach( ( pn: PresentationNode ): void => {
            if ( pn.view instanceof ApplicationView ) {
              pn.view.application.activateElement( controlObject );
            }
          } );
        }
      };
    }

    return null;
  }
);
