import { Matrix3 } from '@daign/math';
import { PresentationNode } from '@daign/2d-pipeline';
import { StyleSelectorChain } from '@daign/style-sheets';
import { TwoPointImage } from '@daign/2d-graphics';
import { WrappedDomPool, WrappedNode } from '@daign/dom-pool';

import { RenderModule } from '../renderModule';

export const twoPointImageModule = new RenderModule(
  TwoPointImage,
  (
    currentNode: PresentationNode,
    projection: Matrix3,
    selectorChain: StyleSelectorChain
  ): WrappedNode | null => {
    const image = currentNode.sourceNode as TwoPointImage;
    selectorChain.addSelector( image.styleSelector );

    const startPoint = image.getStartTransformed( projection );
    const size = image.getSizeTransformed( projection );

    const imageNode = WrappedDomPool.getSvg( 'image' );
    imageNode.setAttribute( 'x', String( startPoint.x ) );
    imageNode.setAttribute( 'y', String( startPoint.y ) );
    imageNode.setAttribute( 'width', String( size.x ) );
    imageNode.setAttribute( 'height', String( size.y ) );
    imageNode.setAttributeNS( WrappedDomPool.xlinkNamespace, 'href', image.href );
    return imageNode;
  }
);
