import { PresentationNode } from '@daign/2d-pipeline';
import { StyleSelectorChain } from '@daign/style-sheets';
import { ScalableText } from '@daign/2d-graphics';
import { WrappedDomPool, WrappedNode } from '@daign/dom-pool';

import { RenderModule } from '../renderModule';

export const scalableTextModule = new RenderModule(
  ScalableText,
  (
    currentNode: PresentationNode,
    selectorChain: StyleSelectorChain
  ): WrappedNode | null => {
    const text = currentNode.sourceNode as ScalableText;
    selectorChain.addSelector( text.styleSelector );

    const anchor = text.getAnchorTransformed( currentNode.projectNodeToView );
    const fontSize = text.getFontSizeTransformed( currentNode.projectNodeToView );

    const textNode = WrappedDomPool.getSvg( 'text' );
    textNode.setAttribute( 'x', String( anchor.x ) );
    textNode.setAttribute( 'y', String( anchor.y ) );
    textNode.setAttribute( 'text-anchor', text.textAnchor );
    textNode.textContent = text.content;
    textNode.setAttribute( 'font-size', String( fontSize ) );
    return textNode;
  }
);
