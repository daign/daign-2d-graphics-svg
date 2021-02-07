import { PresentationNode } from '@daign/2d-pipeline';
import { StyleSelectorChain } from '@daign/style-sheets';
import { Text } from '@daign/2d-graphics';
import { WrappedDomPool, WrappedNode } from '@daign/dom-pool';

import { RenderModule } from '../renderModule';

export const textModule = new RenderModule(
  Text,
  (
    currentNode: PresentationNode,
    selectorChain: StyleSelectorChain
  ): WrappedNode | null => {
    const text = currentNode.sourceNode as Text;
    selectorChain.addSelector( text.styleSelector );

    const anchor = text.getAnchorTransformed( currentNode.projectNodeToView );

    const textNode = WrappedDomPool.getSvg( 'text' );
    textNode.setAttribute( 'x', String( anchor.x ) );
    textNode.setAttribute( 'y', String( anchor.y ) );
    textNode.setAttribute( 'text-anchor', text.textAnchor );
    textNode.textContent = text.content;
    return textNode;
  }
);
