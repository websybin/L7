import {
  AttributeType,
  gl,
  IEncodeFeature,
  IModel,
  IModelUniform,
} from '@antv/l7-core';
import { isNumber } from 'lodash';

import BaseModel from '../../core/BaseModel';
import { earthTriangulation } from '../../core/triangulation';
import atmoSphereFrag from '../shaders/atmosphere_frag.glsl';
import atmoSphereVert from '../shaders/atmosphere_vert.glsl';
interface IAtmoSphereLayerStyleOptions {
  opacity: number;
}

export default class EarthAtomSphereModel extends BaseModel {
  public getUninforms(): IModelUniform {
    const {
      opacity = 1,
    } = this.layer.getLayerConfig() as IAtmoSphereLayerStyleOptions;
    return {
      u_opacity: isNumber(opacity) ? opacity : 1.0,
    };
  }

  public initModels(callbackModel: (models: IModel[]) => void) {
    this.buildModels(callbackModel);
  }

  public clearModels() {
    return '';
  }

  public buildModels(callbackModel: (models: IModel[]) => void) {
    // TODO: 调整图层的绘制顺序 地球大气层
    this.layer.zIndex = -997;
    this.layer
      .buildLayerModel({
        moduleName: 'earthAtmoSphere',
        vertexShader: atmoSphereVert,
        fragmentShader: atmoSphereFrag,
        triangulation: earthTriangulation,
        depth: { enable: false },
        blend: this.getBlend(),
      })
      .then((model) => {
        callbackModel([model]);
      })
      .catch((err) => {
        console.warn(err);
        callbackModel([]);
      });
  }

  protected registerBuiltinAttributes() {
    // point layer size;
    this.styleAttributeService.registerStyleAttribute({
      name: 'size',
      type: AttributeType.Attribute,
      descriptor: {
        name: 'a_Size',
        buffer: {
          usage: gl.DYNAMIC_DRAW,
          data: [],
          type: gl.FLOAT,
        },
        size: 1,
        update: (
          feature: IEncodeFeature,
        ) => {
          const { size = 1 } = feature;
          return Array.isArray(size) ? [size[0]] : [size as number];
        },
      },
    });

    this.styleAttributeService.registerStyleAttribute({
      name: 'normal',
      type: AttributeType.Attribute,
      descriptor: {
        name: 'a_Normal',
        buffer: {
          usage: gl.STATIC_DRAW,
          data: [],
          type: gl.FLOAT,
        },
        size: 3,
        update: (
          feature: IEncodeFeature,
          featureIdx: number,
          vertex: number[],
          attributeIdx: number,
          normal: number[],
        ) => {
          return normal;
        },
      },
    });

    this.styleAttributeService.registerStyleAttribute({
      name: 'uv',
      type: AttributeType.Attribute,
      descriptor: {
        name: 'a_Uv',
        buffer: {
          usage: gl.DYNAMIC_DRAW,
          data: [],
          type: gl.FLOAT,
        },
        size: 2,
        update: (
          feature: IEncodeFeature,
          featureIdx: number,
          vertex: number[],
        ) => {
          return [vertex[3], vertex[4]];
        },
      },
    });
  }
}
