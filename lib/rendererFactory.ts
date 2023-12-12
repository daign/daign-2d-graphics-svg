import { StyleSheet } from '@daign/style-sheets';
import { GraphicStyle } from '@daign/2d-graphics';

import { SvgRenderer } from './svgRenderer';

import { buttonControlModule, clipPathModule, controlObjectModule, controlPointModule,
  fixedRadiusCircleModule, groupModule, lineModule, maskModule, polygonModule, polylineModule,
  quadraticCurveModule, scalableTextModule, symbolElementModule, textModule, twoPointCircleModule,
  twoPointImageModule, twoPointPatternModule, twoPointRectangleModule, useElementModule, viewModule
} from './renderModules';

export class RendererFactory {
  /**
   * Constructor.
   */
  public constructor() {}

  /**
   * Create a new SvgRenderer with default modules.
   * @param styleSheet - The style sheet to use.
   * @returns The SvgRenderer.
   */
  public createRenderer( styleSheet: StyleSheet<GraphicStyle> ): SvgRenderer {
    const renderer = new SvgRenderer( styleSheet );

    /* The order of modules is important when there are separate render instructions for subclasses
     * of object types. The subclasses can modify the node that resulted from the render module for
     * its superclass. */
    renderer.addRenderModule( lineModule );
    renderer.addRenderModule( twoPointRectangleModule );
    renderer.addRenderModule( polygonModule );
    renderer.addRenderModule( polylineModule );
    renderer.addRenderModule( twoPointCircleModule );
    renderer.addRenderModule( fixedRadiusCircleModule );
    renderer.addRenderModule( quadraticCurveModule );
    renderer.addRenderModule( textModule );
    renderer.addRenderModule( scalableTextModule );
    renderer.addRenderModule( twoPointImageModule );
    renderer.addRenderModule( twoPointPatternModule );
    renderer.addRenderModule( useElementModule );
    renderer.addRenderModule( maskModule );
    renderer.addRenderModule( clipPathModule );
    renderer.addRenderModule( symbolElementModule );
    renderer.addRenderModule( groupModule );
    renderer.addRenderModule( viewModule );
    renderer.addRenderModule( controlObjectModule );
    renderer.addRenderModule( controlPointModule );
    renderer.addRenderModule( buttonControlModule );

    return renderer;
  }
}
