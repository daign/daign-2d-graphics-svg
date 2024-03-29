import { Matrix3 } from '@daign/math';
import { Handle } from '@daign/handle';
import { PresentationNode } from '@daign/2d-pipeline';
import { StyleSelectorChain } from '@daign/style-sheets';
import { ButtonControl } from '@daign/2d-graphics';
import { WrappedNode } from '@daign/dom-pool';

import { RenderModule } from '../renderModule';

export const buttonControlModule = new RenderModule(
  ButtonControl,
  (
    currentNode: PresentationNode,
    _p: Matrix3,
    _s: StyleSelectorChain,
    node: WrappedNode | null
  ): WrappedNode | null => {
    if ( node !== null ) {
      const buttonControl = currentNode.sourceNode as ButtonControl;

      const handle = new Handle();
      handle.setStartNode( node );

      handle.beginning = (): boolean => {
        return true;
      };

      handle.clicked = (): void => {
        buttonControl.click();
      };
    }

    return null;
  }
);
